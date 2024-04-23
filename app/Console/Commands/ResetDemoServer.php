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
use App\Models\User;
use File;

class ResetDemoServer extends Command
{
    use AskAndValidate;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'server:reset';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset demo server';

    
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
        $this->callSilent('down');
        
        //$this->clearLogs();
        $this->resetDatabase();
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
        //$this->callSilent('migrate', ['--force' => true]);
        //$this->callSilent('app:update', ['--force' => true, '--no-backup' => true]);
        $this->call('migrate:refresh', ['--seed' => true, '--force' => true]);
        $this->call('server:demo', [ '--force' => true]);
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
    private function createAdminUser($name, $email, $password)
    {
        $user_database = new User;
        $user_database->name = $name;
        $user_database->email = $email;
        $user_database->username = $email;
        $user_database->password = bcrypt($password);
        $user_database->is_active = 1;
        $user_database->is_admin = 1;
        $user_database->activated = 1;
        $user_database->save();
        $user_database->assignRole('super_admin');
    }
}
