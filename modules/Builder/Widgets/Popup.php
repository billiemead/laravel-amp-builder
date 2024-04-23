<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;

class Popup extends BaseWidget
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.popup';
    protected $type = 'popup';
    protected $available_offsets = ['width', 'height'];
    
    
    protected function beginTag()
    {
        $id = $this->uniqueId();
        $type = $this->getType();
        $class = $this->getElementClass();
        $content = "";
        $popupTag = $this->getPopupTag();
        if ($this->isViewMode()) {
            $content.= "<$popupTag
					layout=\"nodisplay\" class=\"popup-section-wrapper\"
					id=\"wrapper_$id\"";
            if ($popupTag == 'amp-user-notification' && array_get($this->config, 'data.persist_dismissal') == 1) {
                $content.= ' data-persist-dismissal="no"';
            }
            if ($popupTag == 'amp-sidebar' && array_get($this->config, 'data.right_sidebar') == 1) {
                $content.= ' side="right"';
            }
            $content.= '>';
        }
        $content.= "<div id=\"$id\" class=\"popup-section\" data-type=\"$type\">";
        $content.= '<div class="container">';
        return $content;
    }
    public function end()
    {
        $content= "</div></div>";
        if ($this->isViewMode()) {
            $content.= '</'.$this->getPopupTag().'>';
        }
        $content.= $this->scriptDataTag();
        return $content;
    }
    public function getPopupType()
    {
        return array_get($this->config, 'data.popup_type', 'notification');
    }
    public function getPopupTag()
    {
        $type = $this->getPopupType();
        switch ($type) {
            case 'user_notification':
            case 'notification':
                return 'amp-user-notification';
            break;
            case 'sidebar':
                return 'amp-sidebar';
            break;
            default:
                return 'amp-lightbox';
            break;
        }
    }
}
