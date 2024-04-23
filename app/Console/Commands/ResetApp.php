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

class ResetApp extends Command
{
    use AskAndValidate;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:reset {--no-backup : Do not backup the database}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Used during development to clear the database and logs';

    
    /**
     * @var ConfigRepository
     */
    protected $config;
    
    

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
        if (!$this->verifyNotProduction()) {
            return -1;
        }
        $this->callSilent('down');
        $this->resetDatabase();
        $this->clearLogs();
        $this->callSilent('up');
        
        
        
        return 0;
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
            $this->call('config:cache');
            $this->call('route:cache');
        }
    }
    protected function resetDatabase()
    {
        $this->callSilent('migrate', ['--force' => true]);
        $this->callSilent('app:update', ['--no-backup' => true]);
        $this->call('migrate:refresh', ['--seed' => true, '--force' => true]);
    }

    protected function bringUp()
    {
        if ($this->bringBackUp) {
            $this->call('up');
        }
    }
    protected function clearLogs()
    {
        $this->info('Removing log files');
        $this->line('');
        $logs = File::glob(storage_path('logs') . '/*.log');
        File::delete($logs);
    }
    private function verifyNotProduction()
    {
        if (!$this->laravel->environment('local')) {
            $this->error(
                'Deployer is not in development mode!',
                'This command does not run in production as its purpose is to wipe your database'
            );
            return false;
        }
        return true;
    }
}
