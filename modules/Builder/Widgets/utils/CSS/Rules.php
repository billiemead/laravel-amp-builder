<?php

namespace Modules\Builder\Widgets\utils\CSS;

use Arrilot\Widgets\AbstractWidget;
use Carbon\Carbon;
use Illuminate\Support\Str;

class Rules
{
    private $originalRules;
    private $rules;
    public function __construct($rules)
    {
        $this->originalRules = $rules;
        $this->initRules();
    }
    protected function initRules()
    {
        $rules = $this->originalRules;
        $this->rules = [];
        foreach ($rules as $name => $value) {
            $this->rules[] = $this->initRule($name, $value);
        }
    }
    protected function initRule($name, $value)
    {
        $namespace = 'Modules\Builder\Widgets\utils\CSS\rules';
        $widgetClass = $namespace.'\\'.$this->getRuleClassName($name);
        if (class_exists($widgetClass)) {
            return new $widgetClass($name, $value);
        }
        $genericRule = new Rule($name, $value);
        return $genericRule;
    }
    protected function getRuleClassName($name)
    {
        return Str::studly($name);
    }
    public function toNativeRule()
    {
        $result = [];
        $rules = $this->rules;
        foreach ($rules as $rule) {
            $result[] = $rule->toNativeRule();
        }
        return $result;
    }
}
