<?php

namespace Modules\Builder\Widgets\traits;

use App\Models\Page;

trait Button
{
    protected function getPageUrl($page)
    {
        $href = '';
        $currentRouteName =  \Route::currentRouteName();
        switch ($currentRouteName) {
            case 'customDomainNonePathRoute':
                $href = route($currentRouteName, ['custom_domain'=>request()->getHost(), 'name'=>$page->name]);
                break;
            case 'customDomainWithPathRoute':
                $href = route($currentRouteName, ['custom_domain'=>request()->getHost(), 'path'=>request()->route('path'),'name'=>$page->name]);
                break;
            case 'subdomainRoute':
                $href = route($currentRouteName, ['account'=>request()->route('account'), 'name'=>$page->name]);
                break;
            case 'exportProjectRoute':
                $href = $page->name.'.html';
                break;
            default:
                $href = route('viewVariantRoute_full', ['page_id'=>$page->uuid]);
                break;
        }
        
        return $href;
    }
    protected function beginTag()
    {
        $id = array_get($this->config, 'id');
        $class = $this->getElementClass();
        $actionType = array_get($this->config, 'data.actionType', 'url');
        
        
        $content = "";
        switch ($actionType) {
            case 'none':
                $content = "<a id=\"$id\" class=\"$class\" href=\"#/\">";
                break;
            case 'popup':
                $popup = array_get($this->config, 'data.popup', '');
                $content = "<a id=\"$id\" class=\"$class\" href=\"#/\" on=\"tap:wrapper_$popup\">";
                break;
            case 'page':
                $page = array_get($this->config, 'data.page', '');
                $model = Page::find($page);
                $href = '';
                if (!empty($model)) {
                    $href = $this->getPageUrl($model);
                }
                $content = "<a id=\"$id\" class=\"$class\" href=\"$href\">";
                break;
            case 'sidebar':
                $sidebar = array_get($this->config, 'data.sidebar', '');
                $content = "<a id=\"$id\" class=\"$class\" href=\"#/\" on=\"tap:wrapper_$sidebar\">";
                break;
            case 'phone':
                $phone = array_get($this->config, 'data.phone', '');
                $content = "<a id=\"$id\" href=\"#\" class=\"$class\" href=\"tel:$phone\">";
                break;
            case 'email':
                $email = array_get($this->config, 'data.email', '');
                $content = "<a id=\"$id\" class=\"$class\" href=\"mailto:$email\">";
                break;
            default:
                $href = array_get($this->config, 'data.href', '');
                $newWindow = array_get($this->config, 'data.newWindow', 'same');
                $content = "<a id=\"$id\" class=\"$class\" href=\"$href\"".($newWindow == 'new' ? ' target="_blank"' : ''). ">";
                break;
        }
        return $content;
    }
}
