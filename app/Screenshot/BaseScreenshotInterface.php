<?php
namespace App\Screenshot;

use Illuminate\Contracts\View\View;

interface BaseScreenshotInterface
{
    public function getScreenshot($url, $storage);
    public function getTemplateScreenshot($template);
}
