<?php

namespace Modules\Admin\Http\Controllers;

use Validator;
use Auth;
use DB;
use Hash;
use Illuminate\Http\Request;
use RachidLaasri\LaravelInstaller\Helpers\DatabaseManager;
use File;
use Illuminate\Support\Facades\Artisan;
use Symfony\Component\Console\Output\BufferedOutput;

class UpdateController extends AdminController
{
    use \RachidLaasri\LaravelInstaller\Helpers\MigrationsHelper;
    
    public function __construct()
    {
        \Assets::addScripts(['installer_app']);
        \Assets::addStyles(['admin']);
    }

    /**
     * Render the update page, admin/update
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        return view("installer/update/index");
    }
    public function wait()
    {
        return 1;
    }
    public function step($step, Request $request)
    {
        $method = 'step_'.$step;
        if (method_exists($this, $method)) {
            return $this->$method($request);
        }
        return 1;
    }
    public function overview()
    {
        $migrations = $this->getMigrations();
        $dbMigrations = $this->getExecutedMigrations();
        $numberOfUpdatesPending = count($migrations) - count($dbMigrations);
        return ['migrations'=> $migrations, 'dbMigrations'=> $dbMigrations, 'numberOfUpdatesPending' => ($numberOfUpdatesPending > 0 ? $numberOfUpdatesPending : 0)];
    }
    
    public function finalize(Request $request)
    {
        $outputLog = new BufferedOutput;
        Artisan::call('app:update', ['--force' => true], $outputLog);
        $outputLog = $outputLog->fetch();
        if ($outputLog && !empty($outputLog['status']) && $outputLog['status'] == 'error') {
            throw new \Exception($outputLog['message']);
        }
        return 1;
    }
}
