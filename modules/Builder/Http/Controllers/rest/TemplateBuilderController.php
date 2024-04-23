<?php

namespace Modules\Builder\Http\Controllers\rest;

use Carbon\Carbon;
use File;
use DB;
use Validator;
use Zipper;
use Illuminate\Http\Request;
use Plupload;
use Illuminate\Support\Facades\Storage;
use App\Screenshot\BaseScreenshotInterface;
use App\Models\Template;

class TemplateBuilderController extends WebsiteBuilderController
{
    protected $screenshot;
    public $ids = [];

    public function __construct(BaseScreenshotInterface $screenshot)
    {
        $this->screenshot = $screenshot;
    }
    
    /**
     * Compile template structure to viewable HTML
     * @param \App\Models\Template $template
     * @return String
     */
    protected function compileContent($template)
    {
        $content = "";
        // Get structure file
        $structure = $template->getTemplateStructure();
        
        if (empty($structure)) {
            return $content;
        }
        
        switch ($template->type) {
            case 'page':
                $content = $this->compilePageContentFromStructure($structure);
                break;
            case 'section':
                $content = $this->compileSectionContentFromStructure($structure);
                break;
            case 'row':
                $content = $this->compileRowContentFromStructure($structure);
                break;
           
            case 'popup':
                $content = $this->compilePopupContentFromStructure($structure);
                break;
            default:
                break;
        }
        return $content;
    }
    
    protected function compileContentWithPage($template)
    {
        $content = "";
        // Get structure file
        $structure = $template->getTemplateStructure();
        
        if (empty($structure)) {
            return $content;
        }
        $pageStructure = [];
        
        switch ($template->type) {
            case 'page':
                $pageStructure = $structure;
                break;
            
            case 'section':
                $pageStructure['sections'] = [];
                $pageStructure['sections'][] = $structure;
                break;
                break;
           
            case 'popup':
                $pageStructure['popups'] = [];
                $pageStructure['popups'][] = $structure;
                break;
            default:
                break;
        }
        $content = $content = $this->compilePageContentFromStructure($pageStructure);
        return $content;
    }
    public function getStructureInMainBuilder()
    {
        $template = resolve(Template::class);
        $structure = [];
        $content = $this->compileContent($template);
        if (is_null($content)) {
            $content = "";
        }
        $structure['pageContent'] = $content;
        return response()->success($structure);
    }

    /**
     * @param $account
     * @param bool $relative_path
     * @return mixed
     */
    public function getStructure($relative_path = false)
    {
        $template = resolve(Template::class);
        $structure = [];
        $structure['pages'] = [];
        $structure['theme'] = $template->theme;
        $structure['type'] = $template->type;
        $structure['screenshot'] = $template->screenshot_url;
       
        $structure['structure'] = $template->getTemplateStructure();
        
        $theme = $this->checkThemeExists($template->theme);
        // Get color palette
        //$preprocessor = $this->getCSSPreprocessor($theme);
        $structure['themeConfig'] = $theme->getAllConfig();
        // $structure['themes'] = array('preprocessor'=>$preprocessor);
        //$structure['preprocessor'] = $preprocessor;
    
        return response()->success($structure);
    }

    /**
     * @param $theme
     * @return mixed
     */
    protected function getCSSPreprocessor($theme)
    {
        return $theme->getCSSPreprocessor();
    }
    

    /**
     * Update template when user click Save button in the Template Builder
     * @param $account
     * @param Request $request
     * @return mixed
     */
    public function updateInBuilder(Request $request)
    {
        $template = resolve(Template::class);
        $data = $request->json()->all();
        $pageInfo = array_get($data, 'pageInfo');
        $variant = array_get($pageInfo, 'variant', '');
        $backup = new \App\Models\TemplateHistory;
		$backup->template_id = $template->id;
		$backup->structure = $template->structure;
		$backup->created_at = $template->updated_at;
		$backup->variant = $variant;
		$backup->save();
        $template->update([
            'variant'=>$variant,
            'updated_at' => \Carbon\Carbon::now()
        ]);
        $pages = [];
        $structure = array_get($pageInfo, 'structure', []);
        $type = $template->type;
        $saveJson = [];
        $fonts = array_get($structure, 'pageProperties.fonts');
        if ($type == 'popup') {
            $popups = array_get($structure, 'popups', []);
            if (sizeof($popups)) {
                $saveJson = $popups[0];
            }
        } elseif ($type == 'section') {
            $sections = array_get($structure, 'sections', []);
            if (sizeof($sections)) {
                $saveJson = $sections[0];
            }
        } elseif ($type == 'page') {
            $saveJson = $structure;
            if (!empty($variant)) {
                $saveJson['variant'] = $variant;
            }
        }
        if ($type == 'section' || $type == 'popup') {
            if (!empty($fonts)) {
                $saveJson['fonts'] = $fonts;
            }
            $variant = array_get($pageInfo, 'variant');
            if (!empty($variant)) {
                $saveJson['variant'] = $variant;
            }
        }
        
        $storage = Storage::disk('templates');
        $templatePath = $template->id;
        $storage->delete($templatePath.DIRECTORY_SEPARATOR.'structure.json');
        $template->fill([
            'structure'=>serialize($saveJson)
        ])->save();

        return response()->success($pages);
    }
    /**
     * Upload screenshot of a template
     *
     * @return Boolean
     */
    public function uploadScreenshot()
    {
        $template = resolve(Template::class);
        
        $storage = Storage::disk('screenshot');

        $handler = function ($file) use ($storage, $template) {
            $filename = $file->getClientOriginalName();


            $file->move(storage_path('temp'), $filename);
            $src = storage_path('temp'). DIRECTORY_SEPARATOR. $filename;
            $dest = $template->getScreenshotStorage();
            $mime_type = getImageMimeType($src);

            if ($mime_type == IMAGETYPE_GIF) {
                convertGIF2JPG($src, $dest);
                unlink($src);
            } elseif ($mime_type == IMAGETYPE_PNG) {
                convertPNG2JPG($src, $dest);
                unlink($src);
            } elseif ($mime_type == IMAGETYPE_JPEG) {
                rename($src, $dest);
            }
            $template->fill([
                'updated_at'=>Carbon::now()
            ])->save();
            return 1;
        };
        $result = Plupload::receive('file', $handler);

        return response()->success($template->getScreenshotUrlAttribute());
    }
    /**
     * Upload screenshot of a template
     *
     * @return Boolean
     */
    public function postScreenshot()
    {
        $template = resolve(Template::class);
        $this->_writeScreenshot($template);
        $template->fill([
            'updated_at'=>Carbon::now()
        ])->save();
        return response()->success($template->getScreenshotUrlAttribute());
    }
    
    protected function _writeScreenshot($template)
    {
        return $this->screenshot->getTemplateScreenshot($template);
    }
    protected function compileRowContentFromStructure($row, $index = 'data')
    {
        if (!empty($row['id'])) {
            $row['id'] = 'row-'.$this->generateUniqueId();
        }
        $type = "row";
        $content = app('app.widget')->begin($type, $row);
       
        $content .= app('app.widget')->end($type, $row);
        return $content;
    }
    protected function compileSectionContentFromStructure($section, $index = 'data')
    {
        if (!empty($section['id'])) {
            $section['id'] = 'section-'.$this->generateUniqueId();
        }
        return parent::compileSectionContentFromStructure($section, $index);
    }
    
    protected function compilePopupContentFromStructure($popup, $index = 'modules')
    {
        if (!empty($popup['id'])) {
            $popup['id'] = 'popup-'.$this->generateUniqueId();
        }
        return parent::compilePopupContentFromStructure($popup, $index);
    }
    protected function compileModuleContentFromStructure($module)
    {
        if (!empty($module['id'])) {
            $module['id'] = 'float-module-'.$this->generateUniqueId();
        }
        return parent::compileModuleContentFromStructure($module);
    }
    protected function generateUniqueId()
    {
        $id = uniqid();
        while (!empty($this->ids[$id])) {
            $id = uniqid();
        }
        $this->ids[$id] = true;
        
        return $id;
    }
}
