<?php
namespace App\Screenshot;

use Illuminate\Contracts\View\View;

class Javascript extends BaseScreenshot
{
    protected $shouldQueue = false;
    public function getTemplateScreenshot($template)
    {
        if (request()->has('image')) {
            $image = request()->post('image');
        } elseif (request()->has('screenshot')) {
            $image = request()->post('screenshot');
        }
        if (isset($image)) {
            base64_to_jpeg($image, $template->getScreenshotStorage());
        }
    }
}
