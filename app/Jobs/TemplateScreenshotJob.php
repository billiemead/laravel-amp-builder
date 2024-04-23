<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use App\Screenshot\BaseScreenshotInterface;

class TemplateScreenshotJob extends Job
{
    /*
    |--------------------------------------------------------------------------
    | Queueable Jobs
    |--------------------------------------------------------------------------
    |
    | This job base class provides a central location to place any logic that
    | is shared across all of your jobs. The trait included with the class
    | provides access to the "onQueue" and "delay" queue helper methods.
    |
    */

    use Queueable;
    protected $screenshot;
    protected $template;
    public function __construct(\App\Models\Template $template)
    {
        $this->template = $template;
    }
    public function handle(BaseScreenshotInterface $screenshot)
    {
        return $screenshot->getTemplateScreenshot($this->template);
    }
}
