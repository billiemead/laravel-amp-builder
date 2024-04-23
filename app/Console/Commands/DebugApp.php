<?php
// Inspired from https://github.com/REBELinBLUE/deployer/blob/master/app/Console/Commands/DebugApp.php
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

class DebugApp extends Command
{
    use AskAndValidate;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:debug {status=on : Whether to turn debugging on or off}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Allows debugging to easily be switched on or off';
    
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
        $env = base_path('.env');
        $content = \File::get($env);
        $enable = ($this->argument('status') === 'on');
        $content = $this->replaceConfigValues($content, $enable);
        \File::put($env, $content);
        $this->call('config:clear');
        $this->call('queue:restart');
    }
    /**
     * @param string $content The content of the config file
     * @param bool   $enable  Whether to enable debugging
     *
     * @return string
     */
    private function replaceConfigValues($content, $enable = true)
    {
        $debug = $enable ? 'true' : 'false';
        $level = $enable ? 'debug' : 'error';
        return preg_replace([
            '/APP_DEBUG=(.*)[\n]/',
            '/APP_LOG_LEVEL=(.*)[\n]/',
        ], [
            'APP_DEBUG=' . $debug . PHP_EOL,
            'APP_LOG_LEVEL=' . $level . PHP_EOL,
        ], $content);
    }
}
