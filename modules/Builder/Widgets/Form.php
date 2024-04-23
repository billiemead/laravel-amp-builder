<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;
use Validator;

class Form extends Box
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.form';
	protected $allowValidators = ['required', 'integer', 'min', 'max'];
    public function begin()
    {
        $data = array_get($this->config, 'data');
        
        //Check if Google Recaptcha configuration is valid
        $enable_recaptcha = array_get($data, 'enable_recaptcha');
        if ($enable_recaptcha) {
            $g_recaptcha = array_get($data, 'g_recaptcha.account');
            
            $account_recaptcha = \App\Models\Connection::where('id', $g_recaptcha)->first();
            if (!empty($account_recaptcha)) {
                $siteKey = $account_recaptcha->token;
                $data['recaptcha_sitekey'] = $siteKey;
                $this->config['data'] = $data;
            } else {
                $this->config['data']['enable_recaptcha'] = false;
            }
        }
        return parent::begin();
    }
    protected function getSubmitUrl()
    {
        $variant = app('app.widget')->getVariant();
        $formId = $this->getPage_id(); // Form Unique ID
        if (!empty($variant)) {
            $submitUrl = '/ajax/integration/sendForm/'.$variant->uuid.'/'.$formId;
        } else {
            $submitUrl = '/ajax/integration/sendForm';
        }
        $currentUrl = url('/');
        if (!starts_with($currentUrl, 'https://')) {
            $currentUrl = 'https://'.getMainDomain();
        }
        $submitUrl = $currentUrl.$submitUrl;
        return $submitUrl ;
    }
    protected function afterBeginTag()
    {
        $variant = app('app.widget')->getVariant();
       
        $submitUrl = $this->getSubmitUrl();
        $validateFormUrl = $submitUrl;
        $actionType = array_get($this->config, 'data.actionType', 'url');
        $formId = $this->getPage_id();
        $content = "<form action-xhr=\"$submitUrl\" method=\"POST\"";
        $content.= " verify-xhr=\"$validateFormUrl\" ";
        $eventHandler = 'submit-error:'.$formId.'-error-modal;';
        
        switch ($actionType) {
            case 'popup':
                $popup = array_get($this->config, 'data.popup', '');
                $eventHandler.= 'submit-success:'.'wrapper_'.$popup;
                break;
            case 'message':
                $eventHandler.= 'submit-success:'.$formId.'-success-modal;';
                break;
            default:
                $eventHandler.= 'submit-success:'.$formId.'-success-modal;';
                break;
        }
        $content.= 'on="'.$eventHandler.'"';
        $content.= ">";
        return $content;
    }
    protected function beforeEndTag()
    {
        return "</form>";
    }
    
    public function checkRecaptchaToken($token, $connection)
    {
        $url = "https://www.google.com/recaptcha/api/siteverify?response=$token&secret=$connection->account_id";
        $client = new \GuzzleHttp\Client();
        $res = $client->request('POST', $url);
        $body = $res->getBody();
        $response = json_decode($body, true);
        if (!empty($response) && !empty($response['success']) && $response['success']) {
            return true;
        }
        $response['url'] = $url;
        return $response;
    }
    public function recaptchaRequired()
    {
        $enable_recaptcha = array_get($this->config, 'data.enable_recaptcha');
        if ($enable_recaptcha) {
            $g_recaptcha = array_get($this->config, 'data.g_recaptcha.account');
            
            $account_recaptcha = \App\Models\Connection::where('id', $g_recaptcha)->first();
            if (!empty($account_recaptcha)) {
                return $account_recaptcha;
            }
        }
        return false;
    }
    protected function _getValidateRules($modules)
    {
        if (empty($modules)) {
            return;
        }
        $rules = [];
        foreach ($modules as $module) {
            $type = array_get($module, 'type');
            if ($type == 'form_group') {
                $child_modules = array_get($module, 'modules', []);
                $child_rules = $this->_getValidateRules($child_modules);
                if (!empty($child_rules)) {
                    $rules = array_merge($rules, $child_rules);
                }
                continue;
            }
            $validators = array_get($module, 'data.validators');
            if (isset($validators) && is_array($validators)) {
				
                $id = array_get($module, 'id');
                $rules[$id] = [];
                foreach ($validators as $rule => $value) {
					if(array_search($rule, $this->allowValidators) === FALSE)	continue;
					if(!$value)		continue;
					$ruleString = $rule;
					if($rule == 'min') {
						$min_value = array_get($module, 'data.validators.min_value');
						if(empty($min_value))	continue;
						$ruleString = $rule.':'.$min_value;
					}
					if($rule == 'max') {
						$max_value = array_get($module, 'data.validators.max_value');
						if(empty($max_value))	continue;
						$ruleString = $rule.':'.$max_value;
					}
					
                    $rules[$id][] = $ruleString;
					if($rule == 'min' || $rule == 'max')
						$rules[$id][] = 'numeric';
                }
            }
			if($type != 'number') {
				$maxlength = array_get($module, 'data.maxlength');
				$minlength = array_get($module, 'data.minlength');
				if(!empty($minlength)) {
					if(empty($rules[$id]))
						$rules[$id] = [];
					$rules[$id][] = 'min:'.$minlength;
				}
				if(!empty($maxlength)) {
					if(empty($rules[$id]))
						$rules[$id] = [];
					$rules[$id][] = 'max:'.$maxlength;
				}
			}
			
        }
        return $rules;
    }
	public function isValidProtocol()
	{
		$url = url('/');
		return starts_with($url, 'https://');
		
	}
    public function isMultiplePostValue($page_id)
    {
        $module = $this->findModule($page_id);
        if (!empty($module)) {
            $type = $module->getModuleType();
            if ($type == 'checkbox' || $type == 'radio') {
                $values = $module->getValues();
                if (is_array($values) && sizeof($values) > 1) {
                    return true;
                }
            }
        }
        return false;
    }
    
    public function validate()
    {
        return $this->_validateForm();
    }
    public function getIntegrations()
    {
        return array_get($this->config, 'data.integrations');
    }
    public function getActionType()
    {
        return array_get($this->config, 'data.actionType');
    }
    public function getHref()
    {
        return array_get($this->config, 'data.href');
    }
    
    protected function _validateForm()
    {
        $modules = array_get($this->config, 'modules', []);
        $rules = $this->_getValidateRules($modules);
        $messages = trans('validation.custom');
        if (!empty($rules)) {
            $validator = Validator::make(request()->all(), $rules, $messages);
            if ($validator->fails()) {
                $validateErrors = $validator->errors()->toArray();
                return $validateErrors;
            }
        }
    }
    public function getParameterizeSubmitData()
    {
    }
}
