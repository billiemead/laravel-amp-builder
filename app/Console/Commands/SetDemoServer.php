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
use Validator;

class SetDemoServer extends Command
{
    use AskAndValidate;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'server:demo {--force} {status=on : Whether to turn debugging on or off}';

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
        $enable = ($this->argument('status') === 'on');
        $admin_email = config('app.demo_auth.email');//env("DEMO_EMAIL");
        $user_email = env("DEMO_USER_EMAIL");
        $password = config('app.demo_auth.password');//env("DEMO_PASSWORD");

        $force = $this->option('force');
        if ($enable && !$force) {
            $admin_email = $this->ask('Admin Email address');
            $user_email = $this->ask('User Email address');
            $password = $this->ask('Password');
        }
      
        $env = base_path('.env');
        $content = \File::get($env);
        $content = $this->replaceConfigValues($content, $enable, $admin_email, $user_email, $password);
        \File::put($env, $content);
        if (!is_null($admin_email) && !is_null($password)) {
            $this->createUser('Administrator', $admin_email, $password, true);
        }
        if (!is_null($user_email) && !is_null($password)) {
            $this->createUser('User', $user_email, $password, false);
        }
        return 0;
    }
    
  
    private function createUser($name, $email, $password, $is_admin = false)
    {
        $user_database = User::where('email', $email)->first();
        if (empty($user_database)) {
            $user_database = new User;
        }
        $user_database->name = $name;
        $user_database->email = $email;
        $user_database->password = bcrypt($password);
        $user_database->is_active = 1;
        $user_database->email_verified_at = \Carbon\Carbon::now();
        $user_database->save();
        if ($is_admin) {
            $user_database->assignRole('super_admin');
        }
    }
    private function replaceConfigValues($content, $enable, $admin_email, $user_email, $password)
    {
        $debug = $enable ? 'true' : 'false';
        return preg_replace([
            '/DEMO_MODE=(.*)[\n]/',
            '/DEMO_EMAIL=(.*)[\n]/',
            '/DEMO_PASSWORD=(.*)[\n]/',
            '/DEMO_USER_EMAIL=(.*)[\n]/',
        ], [
            'DEMO_MODE=' . $debug . PHP_EOL,
            'DEMO_EMAIL=' . $admin_email . PHP_EOL,
            'DEMO_PASSWORD=' . $password . PHP_EOL,
            'DEMO_USER_EMAIL=' . $user_email . PHP_EOL,
        ], $content);
    }
}
