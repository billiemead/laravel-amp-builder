<?php
namespace App\Shortcodes;

class ShortcodeBase
{
    public function register($shortcode, $content, $compiler, $name)
    {
        return view("shortcodes/".$name, array('shortcode'=>$shortcode,'content'=>$content, 'name'=>$name))->render();
    }
}
