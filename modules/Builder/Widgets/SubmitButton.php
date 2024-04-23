<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;

class SubmitButton extends Button
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $tag = "button";
    protected $view = 'widgets.submit_button';
    protected function beginTag()
    {
        $id = $this->getPage_id();
        $class = $this->getElementClass();
        $string =  "<button id=\"$id\" class=\"$class\" type=\"submit\" value=\"submit\"";
		if(!$this->isValidProtocol()) {
			//$string.= "disabled=\"disabled\"";
		}
		$string.= ">";
		return $string;
    }
	public function isValidProtocol()
	{
		$url = url('/');
		return starts_with($url, 'https://');
		
	}
}
