<?php

namespace Modules\Builder\Widgets\traits;

use Arrilot\Widgets\AbstractWidget;
use App\Models\Template;

trait Text
{
    public function view()
    {
        $contents = array_get($this->config, 'contents');
        if (!empty($contents)) {
            $rs = "";
            foreach ($contents as $content) {
                if (is_string($content)) {
					
                    $rs .= $content;
                } elseif (is_array($content)) {
                    $type = array_get($content, 'type');
                    
                    $rs .= app('app.widget')->begin($type, $content);
                   
                    $rs .= app('app.widget')->end($type, $content);
                }
            }
            return $rs;
        }
        return parent::view();
    }
}
