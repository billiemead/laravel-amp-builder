<?php

namespace Modules\Builder\Widgets;

use App\MediaEmbed\MediaEmbed;

class Video extends BaseWidget
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.video';
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
            $amp_code = $object->getAMPEmbedCode($this->getWidth(), $this->getHeight());
            $code = $object->getEmbedCode();
            $id = $object->name();
        }
        return ['id'=>strtolower($id), 'url'=>$url, 'code'=>$code, 'amp_code'=>$amp_code];
    }
    public function getAMPElement($amp_code)
    {
        $regex = '<\/amp-([a-z]+)>';
        if (preg_match('~'.$regex.'~imu', $amp_code, $match)) {
            return $match[1];
        }
    }
}
