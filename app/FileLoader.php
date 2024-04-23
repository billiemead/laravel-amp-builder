<?php
namespace App;

class FileLoader extends \Illuminate\Translation\FileLoader
{
    public function save($items, $environment, $group, $namespace = null)
    {
        $path = $this->loadPath($namespace);

        if (is_null($path)) {
            return;
        }

        $file = (!$environment || ($environment == 'production'))
            ? "{$path}/{$group}.php"
            : "{$path}/{$environment}/{$group}.php";

        $this->files->put($file, '<?php return ' . var_export($items, true) . ';');
    }
}
