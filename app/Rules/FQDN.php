<?php
namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class FQDN implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    protected $subdomain = false;
    protected $errorType;
    public function __construct($subdomain = false)
    {
        $this->subdomain = $subdomain;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        if ($this->subdomain) {
            $value.= '.'.config('app.main_domain');
        }
        $isValidUrl = preg_match('/^(?!:\/\/)(?=.{1,255}$)((.{1,63}\.){1,127}(?![0-9]*$)[a-z0-9-]+\.?)$/i', $value);
        
        return $isValidUrl;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Invalid FQDN.';
    }
}
