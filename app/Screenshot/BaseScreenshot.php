<?php
namespace App\Screenshot;

use Illuminate\Contracts\View\View;

class BaseScreenshot implements BaseScreenshotInterface
{
    protected $shouldQueue = true;
    public function getScreenshot($url, $storage)
    {
    }
    public function getTemplateScreenshot($template)
    {
        return $this->getScreenshot($template->view_url, $template->getScreenshotStorage());
    }
    public function getShouldQueue()
    {
        return $this->shouldQueue;
    }
}
