<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;

class TextnodeSvg extends Svg
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.svg';
   
    protected function beginTag()
    {
        return "";
    }
    
    protected function endTag()
    {
        return '';
    }
    public function getCode()
    {
        $code = parent::getCode();
        $dom = new \DOMDocument;
        @$dom->loadHtml($code, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        $tags = $dom->getElementsByTagName('svg');
        if (!sizeof($tags)) {
            return;
        }
        $tag = $tags[0];
        $id = $this->uniqueId();
        if (!empty($id)) {
            $tag->setAttribute('id', $id);
        }
        $code = $dom->saveHtml();
        return $code;
    }
    public function view()
    {
        return $this->getCode();
    }
}
