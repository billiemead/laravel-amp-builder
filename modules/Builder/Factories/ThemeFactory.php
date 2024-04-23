<?php
namespace Modules\Builder\Factories;

use Illuminate\Database\Eloquent\Model;
use Leafo\ScssPhp\Compiler;

class ThemeFactory
{
    protected $guarded = [];
    protected $default_config = [
        'css_preprocessor'=>'less',
        'mainStylePath'=>'style.css',
        'variablePath'=>'variables.less',
        'colorPath'=>'colors.less',
        'pageContainer'=> 'body',
       
    ];
    protected static $instance;
    protected $processor;
    public function __construct()
    {
        $this->processor = $this->getProcessor();
    }
    public static function getInstance()
    {
        if (empty(self::$instance)) {
            self::$instance = new self;
        }
        return self::$instance;
    }
    protected function getProcessor()
    {
        $preprocessor = $this->getCSSPreprocessor();
        $namespace = '\Modules\Builder\Theme\Processor';
        $class = $namespace.'\\'.ucfirst($preprocessor);
        if (class_exists($class)) {
            return new $class(config('builder.theme_path'));
        } else {
            throw new \Exception($class.' doesn\'t exist');
        }
    }
    protected function getCSSPreprocessor()
    {
        return config('builder.preprocessor');
    }
    public function __call($method, $args)
    {
        if (method_exists($this->processor, $method)) {
            return call_user_func_array([$this->processor, $method], $args);
        } else {
            throw new \Exception($method.' doesn\'t exist');
        }
    }
}
