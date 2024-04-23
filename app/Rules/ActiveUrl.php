<?php
namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ActiveUrl implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    protected $subdomain = false;
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
        $isPointed = gethostbyname($value) == $_SERVER['SERVER_ADDR'];
		if(!$isPointed) {
			$isPointed = gethostbyname($value) == gethostbyname(config('app.main_domain'));
		}
        return $isPointed;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Missing a A record';
    }
}
