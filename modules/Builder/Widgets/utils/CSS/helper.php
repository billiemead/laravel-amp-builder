<?php

function convertToColor($color)
{
    $themeValue = app('app.theme')->convertToColor($color);
    if (!empty($themeValue)) {
        return $themeValue;
    }
    if (!empty($color['value'])) {
        $value = $color['value'];
        if (!empty($color['opacity'])) {
            $value = hex2rgba($value, $color['opacity'] /100);
        }
        return $value;
    } elseif (is_string($color)) {
        return $color;
    }
    return "";
}
//https://mekshq.com/how-to-convert-hexadecimal-color-code-to-rgb-or-rgba-using-php/
function hex2rgba($color, $opacity = false)
{
    $default = 'rgb(0,0,0)';
 
    //Return default if no color provided
    if (empty($color)) {
        return $default;
    }
 
    //Sanitize $color if "#" is provided
    if ($color[0] == '#') {
        $color = substr($color, 1);
    }
 
    //Check if color has 6 or 3 characters and get values
    if (strlen($color) == 6) {
        $hex = array( $color[0] . $color[1], $color[2] . $color[3], $color[4] . $color[5] );
    } elseif (strlen($color) == 3) {
        $hex = array( $color[0] . $color[0], $color[1] . $color[1], $color[2] . $color[2] );
    } else {
        return $default;
    }
 
    //Convert hexadec to rgb
    $rgb =  array_map('hexdec', $hex);
 
    //Check if opacity is set(rgba or rgb)
    if ($opacity) {
        if (abs($opacity) > 1) {
            $opacity = 1.0;
        }
        $output = 'rgba('.implode(",", $rgb).','.$opacity.')';
    } else {
        $output = 'rgb('.implode(",", $rgb).')';
    }
 
    //Return rgb(a) color string
    return $output;
}
