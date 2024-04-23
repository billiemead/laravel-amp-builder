<?php
// Inspired from https://github.com/REBELinBLUE/deployer/blob/master/app/Console/Commands/UpdateApp.php
namespace App\Console\Commands;

use Illuminate\Config\Repository as ConfigRepository;

use Illuminate\Console\Command;
use RachidLaasri\LaravelInstaller\Helpers\RequirementsChecker;
use RachidLaasri\LaravelInstaller\Helpers\PermissionsChecker;
use RachidLaasri\LaravelInstaller\Helpers\EnvironmentManager;
use RachidLaasri\LaravelInstaller\Helpers\DatabaseManager;
use RuntimeException;
use App\Console\Commands\traits\AskAndValidate;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\ProcessBuilder;
use BackupManager\ShellProcessing\ShellProcessFailed;
use Carbon\Carbon;

class UpdateApp extends Command
{
    use AskAndValidate;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update {--force} {--no-backup : Do not backup the database}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Executes any updates needed for the application.';

    
    /**
     * @var ConfigRepository
     */
    protected $config;
    
    private $bringBackUp;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->line('');
        $config = base_path('.env');
        if (!$this->checkCanInstall() || !$this->checkRequirements() ||  !$this->checkPermissions()) {
            return -1;
        }
        $force = $this->option('force');
        if (!$this->laravel->isDownForMaintenance()) {
            $this->error(
                'You must switch to maintenance mode before running this command, ' .
                'this will ensure that no new deployments are started'
            );
            if (!$force) {
                if (!$this->confirm(
                    'Switch to maintenance mode now? The app will switch ' .
                    'back to live mode once cleanup is finished'
                )) {
                    return -1;
                }
            }
            

            $this->bringBackUp = true;

            $this->call('down');
        }

        if (!$this->option('no-backup')) {
            try {
                $this->backupDatabase();
            } catch (ShellProcessFailed $error) {
                $this->warn(PHP_EOL . 'Database backup failed!' . PHP_EOL . trim($error->getMessage()));
                if (!$force) {
                    if (!$this->confirm('Are you sure you wish to continue?')) {
                        $this->bringUp();
                    }
                } else {
                    $this->bringUp();
                    //return -1;
                }
            }
        }
        try {
            $this->writeEnv([]);
            $this->clearCaches();
            $this->migrate();
            $this->optimize();
        } catch (\Exception $error) {
            $this->bringUp();
            throw $error;
        }
        
        $this->bringUp();
        return 0;
    }
    protected function writeEnv($input)
    {
        $path   = base_path('.env');
        $config = \File::get($path);
        foreach ($input as $section => $data) {
            foreach ($data as $key => $value) {
                $env = strtoupper($section . '_' . $key);
                $config = preg_replace('/' . $env . '=(.*)/', $env . '=' . $value, $config);
            }
        }
    }
    protected function checkRequirements()
    {
        $checker = new RequirementsChecker;
        $phpSupportInfo = $checker->checkPHPversion(
            config('installer.core.minPhpVersion')
        );
        if (!$phpSupportInfo['supported']) {
            $this->error($phpSupportInfo['minimum'].' or higher is required');
            return false;
        }
        $requirements = $checker->check(
            config('installer.requirements')
        );
        if (!empty($requirements['errors']) && $requirements['errors']) {
            foreach ($requirements['requirements'] as $type => $requirement) {
                $extension_missing = [];
                foreach ($requirement as $extention => $enabled) {
                    if (!$enabled) {
                        $extension_missing[] = $extention;
                    }
                }
                if (sizeof($extension_missing)) {
                    $this->error('Extension for '.$type.' required: ' . implode(', ', $extension_missing));
                }
            }
            return false;
        }
        return true;
    }
    public function checkPermissions()
    {
        $checker = new PermissionsChecker;
        $permissions = $checker->check(
            config('installer.permissions')
        );
        $missing = [];
        foreach ($permissions as $permission) {
            if (!empty($permission['isSet']) && !$permission['isSet']) {
                $missing[] = $permission['folder'];
            }
        }
        if (sizeof($missing)) {
            $this->error('Folders is not writable: '.implode(', ', $missing));
            return false;
        }
        return true;
    }
    private function checkCanInstall()
    {
        return (
            $this->verifyInstalled()
        );
    }

    protected function verifyInstalled()
    {
        if (!isInstalled()) {
            $this->error('LandingMall has not been installed', 'Please use "php artisan app:update" instead.');
            return false;
        }
        return true;
    }
    protected function migrate()
    {
        $this->info('Running database migrations');
        $this->line('');
        $this->call('migrate', ['--force' => true]);
    }

    
    protected function clearCaches()
    {
        $this->callSilent('clear-compiled');
        $this->callSilent('cache:clear');
        $this->callSilent('route:clear');
        $this->callSilent('config:clear');
        $this->callSilent('view:clear');
    }
    protected function optimize()
    {
        if (!$this->laravel->environment('local')) {
            //$this->call('config:cache');
            //$this->call('route:cache');
        }
    }
    protected function bringUp()
    {
        if ($this->bringBackUp) {
            $this->call('up');
        }
    }
    protected function backupDatabase()
    {
        $date = Carbon::now()->format('Y-m-d H.i.s');

        $this->call('db:backup', [
            '--database'        => config('database.default'),
            '--destination'     => 'local',
            '--destinationPath' => $date,
            '--compression'     => 'gzip',
        ]);
    }
}
