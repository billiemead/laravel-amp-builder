<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Foundation\Inspiring;
use App\Models\Template;
use Chumper\Zipper\Zipper;
use Carbon\Carbon;

class ExtractTemplates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'template:extract {name=all}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Extract templates';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    
    public function handle()
    {
        //var_dump($this->screenshot);
        $templates = Template::where('is_global', 1)->get();
        $name = $this->argument('name');
        $path = storage_path('template_packages'). DIRECTORY_SEPARATOR . strtolower($name).'.json';
        if (file_exists($path)) {
            $file_content = file_get_contents($path);
            $json = json_decode($file_content, true);
            if (is_array($json)) {
                $templates = \App\Models\Template::whereIn('id', $json)->where('is_active', 1)->orderBy('updated_at', 'desc')->get();
                if (empty($templates)) {
                    $this->info('Empty templates');
                    return;
                }
                $zipper = new Zipper;
                $zipper->make(storage_path('template_packages').DIRECTORY_SEPARATOR.'downloads'.DIRECTORY_SEPARATOR.$name.'.zip');
                for ($i = 0; $i < sizeof($templates); $i++) {
                    $zipper->addString($templates[$i]->id.'.json', json_encode($templates[$i]->getTemplateStructure()));
                }
            }
        } else {
            $this->info('None template name exists');
        }
    }
}
