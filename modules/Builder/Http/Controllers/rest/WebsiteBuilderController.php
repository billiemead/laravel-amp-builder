<?php

namespace Modules\Builder\Http\Controllers\rest;

use Modules\Builder\Http\Controllers\Controller;
use File;
use DB;
use Validator;
use Illuminate\Http\Request;
use Zipper;
use Illuminate\Support\Facades\Storage;
use App\Models\Site;
use App\Models\Page;
use App\Models\Template;

/**
 * Class WebsiteBuilderController
 * Handle major requests for website builder
 * @package App\Http\Controllers\rest
 */
class WebsiteBuilderController extends Controller
{
    protected $variant;
    public function __construct(Page $page)
    {
        $this->page = $page;
    }
    /**
     * Handle POST request from the browser and return variant structure
     * @param $page_id
     * @return mixed
     */
    public function getStructure()
    {
        return $this->_getVariantStructure();
    }
    
    /**
     * Get all symbols(global blocks) of an user
     * @param $page_id
     * @return mixed
     */
    public function getSymbols()
    {
        $page = resolve(Page::class);
        $templates = Template::where('site_id', $page->site_id)->get();
        return response()->success($templates);
    }
    /**
     * Get variant structure
     * @param $page_id
     * @param bool $relative_path
     * @return mixed
     */
    protected function _getVariantStructure($relative_path = false)
    {
        $page = resolve(Page::class);
        if ($page == false) {
            return response()->error("Site doesn't exitst.");
        }
        $site = $page->parent_site;
        $structure = [];
		$variants = $site->variants;
		
        $structure['pages'] = [];
		$i = 0;
		foreach($variants as $variant) {
			$structure['pages'][$i] = $variant;
			unset($structure['pages'][$i]['structure']);
			$i++;
		}
        $structure['theme'] = $site->theme;
        $structure['pageContent'] = '';
        $structure['structure'] = $page->getPageStructure();
        $theme = $this->checkThemeExists($site->theme);
       
        $structure['use_css_variable'] = config('builder.use_css_variable');
        $structure['themeConfig'] = $theme->getAllConfig();
        
            
        
        return response()->success($structure);
    }
    
    protected function getCSSPreprocessor($theme)
    {
        return $theme->getCSSPreprocessor();
    }
    protected function getThemeColorList($theme)
    {
        return $theme->getColorList();
    }


    /**
     * Handle POST request from the browser and return variant content in HTML format
     * @return mixed
     */
    public function fetchPageContent()
    {
        $data = request()->json()->all();
        $structure = array_get($data, 'structure');
        $content = $this->compilePageContentFromStructure($structure);
    
        return response()->success([
            'content'=>$content
        ]);
    }

    /**
     * Update variant when user click Save button
     * @param Request $request
     * @return mixed
     */
    public function updateInBuilder(Request $request)
    {
        $page = resolve(Page::class);
        if ($page == false) {
            return response()->error("Site doesn't exitst.");
        }
        $site = $page->parent_site;

        $data = $request->json()->all();
        $pageInfo = array_get($data, 'pageInfo');
        $theme = array_get($pageInfo, 'theme', '');
        $variant = array_get($pageInfo, 'variant', '');
        
        $site->update([
            'theme'=>$theme,
            'variant'=>$variant,
            'updated_at' => \Carbon\Carbon::now()
        ]);
        $pages = [];

        $structure = array_get($pageInfo, 'structure', []);
        
        $storage = Storage::disk('sites');
        $storage->delete($site->id.DIRECTORY_SEPARATOR.$page->id.'.json');
		$backup = new \App\Models\PageHistory;
		$backup->site_id = $site->id;
		$backup->page_id = $page->id;
		$backup->variant = $variant;
		$backup->structure = $page->structure;
		$backup->created_at = $page->updated_at;
		$backup->save();
        $page->fill([
            'variant'=>$variant,
            'structure'=>serialize($structure)
        ])->save();

        //Cache theme css
        $cssPath = $site->id.'/css';

        $themeContent = false;
        if (!empty($pageInfo['theme_styleSheet'])) {
            $themeContent = $pageInfo['theme_styleSheet'];
        }
        if ($themeContent !== false) {
            $storage->put($cssPath.DIRECTORY_SEPARATOR.'themes.css', $themeContent);
        }
        if (!empty($pageInfo['custom_styleSheet'])) {
            $custom_styleSheet = $pageInfo['custom_styleSheet'];
            $storage->put($cssPath.DIRECTORY_SEPARATOR.'style.css', $custom_styleSheet);
        }
		
        return response()->success($pages);
    }

    /**
     * Return all wariants for a AMP Project
     * @param $account
     * @return mixed
     */
    public function getAllVariants()
    {
        $page = resolve(Page::class);
        if ($page == false) {
            return response()->error("Site doesn't exitst.");
        }
        $site = $page->parent_site;
        $pages = $site->variants;

        return response()->success($pages);
    }

    /**
     * Remove a AMP Project of current logged user
     * @param Request $request
     * @return int
     */
    public function deleteMySite(Request $request)
    {
        $id = $request->input('id');
        $site = Site::where('id', $id)->where('owner_id', auth()->user()->id)->firstOrFail();
        $site->delete();
        return 1;
    }

    /**
     * Get landing page details of current logged user
     * @param Request $request
     * @return false|string
     */
    public function getSite(Request $request)
    {
        $id = $request->input('id');
        $sites = Site::where('id', $id)->where('owner_id', auth()->user()->id)->first();
        
        return json_encode($sites);
    }
    
    /**
     * Load color schemes
     */
    public function getColors()
    {
        $json = app('app.theme')->getColors();
        return response()->success($json);
    }
    
    //Export project to a zip file contains json structure of all pages
    public function exportProject($site_uuid)
    {
        $site = Site::whereUuid($site_uuid)->firstOrFail();
        $pages = $site->variants;
        $filePath = storage_path('temp'.DIRECTORY_SEPARATOR.$site->id.'.zip');
        if (File::exists($filePath)) {
            File::delete($filePath);
        }
        $zipper = Zipper::make($filePath);
        foreach ($pages as $page) {
            $structure = $page->getExportedData();
            $zipper->addString('json/'.$page->name.'.json', json_encode($structure));
        }
        $zipper->close();
        return response()->download($filePath)->deleteFileAfterSend(true);
    }
}
