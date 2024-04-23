<?php

namespace Modules\Builder\Integrations;

use App\Models\Connection;
use Validator;
use Auth;
use Hash;
use App\Models\Page;
use Illuminate\Http\Request;
use DB;

class IntegrationController extends Controller
{
    public function __construct()
    {
        //$this->middleware('recaptcha', ['except' => []]);
    }

    public function integrationProvider($provider)
    {
    }
    public function handleintegrationCallback($provider)
    {
        $method = 'handleCallback';
        return $this->callProviderMethod($provider, $method);
    }
    
    public function getIntegrationAccount($provider)
    {
        $user_id = auth()->user()->id;
        $connections = Connection::where('name', $provider)->where('user_id', $user_id)->get();
        return response()->success($connections);
    }
    public function getIntegrationProviders()
    {
        $page = resolve(Page::class);
        $integrations = config('integrations');
        $result = [];
        foreach ($integrations as $name => $value) {
            if (isset($value['enable']) && $value['enable'] == true) {
                $rs[$name] = [];
                $rs[$name]['display_name'] = array_get($value, 'display_name');
                $rs[$name]['logo'] = array_get($value, 'logo', false);
                $rs[$name]['authorizeDialogUrl'] = route('integrationRoute', ['provider'=>$name]);
                $rs[$name]['authorizeAccountUrl'] = route('integrationAuthorizeRoute', ['account'=>$page->id, 'provider'=>$name]);
                $rs[$name]['callbackUrl'] = route('integrationCallbackUrl', ['provider'=>$name]);
            }
        }
        return response()->success($rs);
    }
    
    // Collect validation rules from input
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
                $rules[$id] = "";
                $separator = "";
                foreach ($validators as $rule => $value) {
                    $rules[$id].= $separator.$rule;
                    $separator = "|";
                }
            }
        }
        return $rules;
    }
    
    protected function isMultiplePostValue($field_name, $form)
    {
        return $form->isMultiplePostValue($field_name);
    }
    protected function translateValidatorMessage($message, $field_name)
	{
		return str_replace($field_name, $message);
	}
	
    public function subscribe($variant_uuid, $form_id, Request $request)
    {
        $page = Page::whereUuid($variant_uuid)->firstOrFail();
        $structure = $page->getPageStructure();
        // Find module from page structure by ID
        $module = $page->findModule($structure, $form_id);
        if (empty($module)) {
            return response()->error('Form doesn\'t exist anymore. Try to refresh page');
        }
        $validateErrors = $module->validate();
        // Return 400 errors when validation error
        if (!empty($validateErrors)) {
            $response = ['verifyErrors'=>[]];
            foreach ($validateErrors as $field_name => $errors) {
                // Check for multiple checkbox or multiple dropdown post value
                $name = ($this->isMultiplePostValue($field_name, $module)) ? $field_name.'[]' : $field_name;
				//$name = $field_name;
				$message = implode(' ', $errors);
                $response['verifyErrors'][] = ['name'=>$name, 'message'=>$message];
            }
            return response($response, 400);
        } elseif (request()->has('__amp_form_verify')) { // If request is amp validate request only, return success response
            return response()->success(1);
        }
        // Google Recaptcha validation
        $account_recaptcha = $this->recaptchaRequired($module);
        if (false !== $account_recaptcha) {
            $token = request()->input('recaptcha_token');
            $verified = $this->checkRecaptchaToken($token, $account_recaptcha);
            if (true !== $verified) {
                return response()->error('Recaptcha token mismatch. Details: '. $verified['url'].' '.implode(', ', $verified['error-codes']));
            }
        }
        
        $integrations = $module->getIntegrations();// Get form integrated Marketing provider data
		
        $rs = [];
        // Send form data for every Marketing providers integrated with this form
        if (!empty($integrations) && is_array($integrations)) {
            foreach ($integrations as $integration_key => $integration) {
                $fields = array_get($integration, 'fields');
                $posts = request()->all();
				$types = ['url', 'mail', 'zapier'];
				$key = array_search($integration_key, $types);
                if ($key >= 0) {
                    $post_data = $this->mapUrlFields($fields, $posts);
					
                } else {
                    $post_data = $this->mapFields($fields, $posts);
                }
                $handlerClass = '\Modules\Builder\Integrations\\'.$integration_key.'\Handler';
                try {
                    $handler = new $handlerClass;
                    $response = $handler->subscribe($post_data, $integration);
                    $rs[$integration_key] = $response;
                } catch (\Exception $e) {
                    $rs[$integration_key] = $e->getMessage();
                }
            }
        }
        $actionType = $module->getActionType();
        // If user chosen to redirect after submission
        if ($actionType == 'url') {
            $href = $module->getHref();
            return response($rs)
            ->header('AMP-Redirect-To', $href)
            ->header('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin, AMP-Redirect-To');
        }
        return response()->success($rs);
    }
    protected function checkRecaptchaToken($token, $connection)
    {
        return $form->checkRecaptchaToken($token, $connection);
    }
    protected function recaptchaRequired($form)
    {
        return $form->recaptchaRequired();
    }
    protected function mapUrlFields($fields, $post_data)
    {
        if (empty($post_data)) {
            return [];
        }
        $rs = [];
        $array_keys = recursive_array_keys($fields);
        foreach ($array_keys as $key) {
            $field_name = array_get($fields, $key);
            $value = $this->getFieldValue($key, $post_data);
            if (!empty($value)) {
                $rs[$field_name] = $value;
            }
        }
        
        return $rs;
    }
    protected function mapFields($fields, $post_data)
    {
        if (empty($post_data)) {
            return [];
        }
        $rs = [];
        $array_keys = recursive_array_keys($fields);
        foreach ($array_keys as $key) {
            $field_name = array_get($fields, $key);
            $value = $this->getFieldValue($field_name, $post_data);
            if (!empty($value)) {
                data_fill($rs, $key, $value);
            }
        }
        
        return $rs;
    }
    protected function getFieldValue($name, $post_data)
    {
        $unmasked_key = $name.'-unmasked';
        $unmasked_value = array_get($post_data, $unmasked_key);
        if (!empty($unmasked_value)) {
            return $unmasked_value;
        }
            
        $value = array_get($post_data, $name);
        return $value;
    }
}
