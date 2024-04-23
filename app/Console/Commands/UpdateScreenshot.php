<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Foundation\Inspiring;
use App\Models\Template;
use App\Screenshot\BaseScreenshotInterface;
use Carbon\Carbon;

class UpdateScreenshot extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'screenshot:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update template screenshot';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
     
    protected $screenshot;
    public function __construct(BaseScreenshotInterface $screenshot)
    {
        parent::__construct();
        $this->screenshot = $screenshot;
    }
    public function handle()
    {
        $templates = Template::where('is_global', 1)->get();
        foreach ($templates as $template) {
            $rs = $this->screenshot->getTemplateScreenshot($template);
            $template->fill([
                'updated_at'=>Carbon::now()
            ])->save();
            $this->info('Screenshot save for template:'. $template->id);
            $this->info('Result:'. var_dump($rs, true));
        }
    }
}
