<?php

namespace Modules\Builder\Widgets;

use App\MediaEmbed\MediaEmbed;

class Embed extends Video
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.embed';
    public function getEmbedObject()
    {
        $url = array_get($this->config, 'data.url');
        $code = '';
        $amp_code = '';
        $id = "";
        if (!empty($url)) {
            $embed = new MediaEmbed();
            $object = $embed->parseUrl($url);
            $object->setWidth($this->getWidth());
            $object->setHeight($this->getHeight());
            $id = $object->name();
            $amp_code = $object->getAMPEmbedCode($this->getWidth(), $this->getHeight());
            $amp_code = $this->intepretAMPLayout($amp_code, $id);
            $code = $object->getEmbedCode();
        }
        return ['id'=>strtolower($id), 'url'=>$url, 'code'=>$code, 'amp_code'=>$amp_code];
    }
    protected function intepretAMPLayout($ampCode, $id)
    {
        $amp_layout = array_get($this->config, 'amp_layout');
        $dom = new \DOMDocument;
        @$dom->loadHtml($ampCode, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        $tags = $dom->getElementsByTagName('amp-'.strtolower($id));
        if (!sizeof($tags)) {
            return;
        }
        $tag = $tags[0];
        $amp_layout = $this->availableAMPTags($amp_layout);
        $tag->removeAttribute('width');
        $tag->removeAttribute('height');
        foreach ($amp_layout as $i => $k) {
            $tag->setAttribute($i, $k);
        }
        $code = $dom->saveHtml();
        return $code;
    }
}
