<?php

namespace Modules\Builder\Widgets\utils\CSS;

class Parser
{
    public function parse($rules)
    {
        $rules = new Rules($rules);
        return $rules->toNativeRule();
    }
}
