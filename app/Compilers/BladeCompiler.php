<?php
namespace App\Compilers;

class BladeCompiler extends \Illuminate\View\Compilers\BladeCompiler
{
    public function compileWiths($value, array $args = array())
    {
        $generated = parent::compileString($value);

        ob_start() and extract($args, EXTR_SKIP);

        // We'll include the view contents for parsing within a catcher
        // so we can avoid any WSOD errors. If an exception occurs we
        // will throw it out to the exception handler.
        try {
            eval('?>'.$generated);
        } catch (\Exception $e) {
            ob_get_clean();
            throw $e;
        }

        $content = ob_get_clean();

        return $content;
    }
}
