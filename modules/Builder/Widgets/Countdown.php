<?php

namespace Modules\Builder\Widgets;

use Arrilot\Widgets\AbstractWidget;
use Carbon\Carbon;

class Countdown extends Text
{
    /**
     * The configuration array.
     *
     * @var array
     */
    protected $config = [];
    protected $view = 'widgets.countdown';
    
    public function toISODate()
    {
        $end = array_get($this->config, 'data.end');
        if (empty($end)) {
            return false;
        }
        $timeZone = array_get($end, 'offset');
        $carbon = Carbon::create(
            array_get($end, 'year'),
            array_get($end, 'month'),
            array_get($end, 'date'),
            array_get($end, 'hour'),
            array_get($end, 'minute'),
            0,
            $timeZone
        );
        if (!$carbon->isPast()) {
            return $carbon->format('Y-m-d\TH:i:sT:00');
        }
        return false;
    }
}
