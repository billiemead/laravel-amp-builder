<?php

namespace App\Console\Commands;

use Illuminate\Console\GeneratorCommand;
use Illuminate\Support\Str;
use RuntimeException;
use Symfony\Component\Console\Input\InputOption;

class AsignRole extends GeneratorCommand
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'role:asign';
    protected $signature = 'role:asign {email} {role_name}';
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Asign Role to an User';

    /**
     * The type of class being generated.
     *
     * @var string
     */
    protected $type = 'Auth';

    /**
     * Execute the console command for Laravel >= 5.5.
     *
     * @return void
     */
    public function handle()
    {
        $email = $this->argument('email');
        $role_name = $this->argument('role_name');
        $user = \App\Models\User::where('email', $email)->first();
        $user->assignRole($role_name);
    }

    /**
     * Execute the console command for Laravel < 5.5.
     *
     * @return void
     */
    public function fire()
    {
        parent::fire();
        
        $this->handle();
    }

    /**
     * Build the class with the given name.
     *
     * @param string $name
     *
     * @return string
     */
    protected function buildClass($name)
    {
        $this->info($name);
        $stub = $this->files->get($this->getStub());

        $stub = $this->replaceNamespace($stub, $name)->replaceClass($stub, $name);

        if (!$this->option('plain')) {
            $stub = $this->replaceView($stub, $name);
        }

        return $stub;
    }

    /**
     * Get the stub file for the generator.
     *
     * @return string
     */
    protected function getStub()
    {
        $stubName = $this->option('plain') ? 'widget_plain' : 'widget';
        $stubPath = null;//$this->laravel->make('config')->get('laravel-widgets.'.$stubName.'_stub');
        // for BC
        if (is_null($stubPath)) {
            return __DIR__.'/stubs/'.$stubName.'.stub';
        }
    
        return $this->laravel->basePath().'/'.$stubPath;
    }

    /**
     * Replace the namespace for the given stub.
     *
     * @param string $stub
     * @param string $name
     *
     * @return $this
     */
    protected function replaceNamespace(&$stub, $name)
    {
        $stub = str_replace(
            '{{namespace}}',
            $this->getNamespace($name),
            $stub
        );

        $stub = str_replace(
            '{{rootNamespace}}',
            $this->laravel->getNamespace(),
            $stub
        );

        return $this;
    }

    /**
     * Replace the class name for the given stub.
     *
     * @param string $stub
     * @param string $name
     *
     * @return string
     */
    protected function replaceClass($stub, $name)
    {
        $class = str_replace($this->getNamespace($name).'\\', '', $name);

        return str_replace('{{class}}', $class, $stub);
    }

    /**
     * Replace the view name for the given stub.
     *
     * @param string $stub
     *
     * @return string
     */
    protected function replaceView($stub, $name)
    {
        $view = 'widgets.'.str_replace('/', '.', $this->makeViewName($name));

        return str_replace('{{view}}', $view, $stub);
    }

    /**
     * Get the default namespace for the class.
     *
     * @param string $rootNamespace
     *
     * @return string
     */
    protected function getDefaultNamespace($rootNamespace)
    {
        $namespace = config('laravel-widgets.default_namespace', $rootNamespace.'\Widgets');

        if (!Str::startsWith($namespace, $rootNamespace)) {
            throw new RuntimeException("You can not use the generator if the default namespace ($namespace) does not start with application namespace ($rootNamespace)");
        }

        return $namespace;
    }

    /**
     * Get the console command options.
     *
     * @return array
     */
    protected function getOptions()
    {
        return [
            ['plain', null, InputOption::VALUE_NONE, 'Use plain stub. No view is being created too.'],
        ];
    }
    protected function createClass()
    {
        $tools = base_path('tools.json');
        $tools = file_get_contents($tools);
        $tools = json_decode($tools, true);
        $tools = $tools['tools'];
        foreach ($tools as $name => $tool) {
            $this->_buildClass($name, $tool);
        }
        //$this->info(print_r($tools, true));
    }
    protected function getPath($name)
    {
        return $this->laravel['path'].'/Widgets/'.str_replace('\\', '/', $name).'.php';
    }
    protected function _buildClass($name, $tool)
    {
        $name = studly_case($name);


        $path = $this->getPath($name);
        $this->info($path);
        if ($this->alreadyExists($name)) {
            $this->error($this->type.' already exists!');

            // return false;
        }

        $this->makeDirectory($path);

        $this->files->put($path, $this->buildClass($name));

        $this->info($this->type.' created successfully.');
    }
    protected function createView()
    {
        $tools = base_path('tools.json');
        $tools = file_get_contents($tools);
        $tools = json_decode($tools, true);
        $tools = $tools['tools'];
        foreach ($tools as $name => $tool) {
            $this->_createView($name, $tool);
        }
        //$this->info(print_r($tools, true));
    }
    /**
     * Create a new view file for the widget.
     *
     * return void
     */
    protected function _createView($name, $tool)
    {
        if ($this->files->exists($path = $this->getViewPath($name))) {
            $this->error('View already exists!');

            // return;
        }

        $this->makeDirectory($path);
        $html = "";
        if (!empty($tool['html_blade'])) {
            $html = $tool['html_blade'];
        } elseif (!empty($tool['html'])) {
            $html = $tool['html'];
        }
        $this->files->put($path, $html);

        $this->info('View created successfully.');
    }

    /**
     * Get the destination view path.
     *
     * @return string
     */
    protected function getViewPath($name)
    {
        return base_path('resources/views').'/widgets/'.$this->makeViewName($name).'.blade.php';
    }

    /**
     * Get the destination view name without extensions.
     *
     * @return string
     */
    protected function makeViewName($name)
    {
        $name = str_replace($this->laravel->getNamespace(), '', $name);
        $name = str_replace('\\', '/', $name);

        // convert to snake_case part by part to avoid unexpected underscores.
        $nameArray = explode('/', $name);
        array_walk($nameArray, function (&$part) {
            $part = snake_case($part);
        });

        return implode('/', $nameArray);
    }
}
