<?php
// Inspired from https://github.com/REBELinBLUE/deployer/blob/master/app/Console/Commands/InstallApp.php
namespace App\Console\Commands;

use Illuminate\Config\Repository as ConfigRepository;

use Illuminate\Console\Command;
use RachidLaasri\LaravelInstaller\Helpers\RequirementsChecker;
use RachidLaasri\LaravelInstaller\Helpers\PermissionsChecker;
use RachidLaasri\LaravelInstaller\Helpers\EnvironmentManager;
use RachidLaasri\LaravelInstaller\Helpers\DatabaseManager;
use RuntimeException;
use App\Models\User;

use App\Console\Commands\traits\AskAndValidate;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\ProcessBuilder;

class InstallApp extends Command
{
    use AskAndValidate;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Installs the application and configures the settings';
    
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
        $config = base_path('.env');
        if (!$this->verifyNotInstalled() || !$this->checkRequirements() ||  !$this->checkPermissions()) {
            return -1;
        }
        $this->clearCaches();
        $config = $this->restructureConfig([
            'db'      => $this->getDatabaseInformation(),
            'app'     => $this->getInstallInformation(),
            'jwt'     => [],
        ]);
        $this->writeEnv($config);
        $this->generateKey();
        $this->migrate();
        
        $admin = $this->getAdminInformation();
        $this->createAdminUser($admin['name'], $admin['email'], $admin['password']);

        $this->clearCaches();
        $this->optimize();
    }
    protected function writeEnv($data)
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
    protected function verifyNotInstalled()
    {
        if (isInstalled()) {
            $this->error('LandingMall has been installed', 'Please use "php artisan app:update" instead.');
            return false;
        }
        return true;
    }
    private function getInstallInformation()
    {
        $this->info('Installation details');
        $url_callback = function ($answer) {
            return $this->validateUrl($answer);
        };

        $url    = $this->askAndValidate('Application URL ("http://landingmall.com" for example)', [], $url_callback);
    }
    private function getAdminInformation()
    {
        $this->info('Admin details');

        $name = $this->ask('Name', 'Admin');

        $email_address = $this->askAndValidate('Email address', [], function ($answer) {
            $validator = $this->validator->make(['email_address' => $answer], [
                'email_address' => 'email',
            ]);

            if (!$validator->passes()) {
                throw new RuntimeException($validator->errors()->first('email_address'));
            }

            return $answer;
        });

        $password = $this->askSecretAndValidate('Password', [], function ($answer) {
            $validator = $this->validator->make(['password' => $answer], [
                'password' => 'min:6',
            ]);

            if (!$validator->passes()) {
                throw new RuntimeException($validator->errors()->first('password'));
            }

            return $answer;
        });

        return [
            'name'     => $name,
            'email'    => $email_address,
            'password' => $password,
        ];
    }
    protected function migrate()
    {
        $this->info('Running database migrations');
        $this->line('');

        $process = $this->artisanProcess('migrate', ['--force']);

        $process->run(function ($type, $buffer) {
            $buffer = trim($buffer);
            if (empty($buffer)) {
                return;
            }

            if ($type === Process::OUT) {
                $this->line($buffer);
            } else {
                $this->error($buffer);
            }
        });

        if (!$process->isSuccessful()) {
            throw new RuntimeException($process->getErrorOutput());
        }

        $this->line('');
    }

    /**
     * Validates the answer is a URL.
     *
     * @param string $answer
     *
     * @return mixed
     */
    protected function validateUrl($answer)
    {
        $validator = $this->validator->make(['url' => $answer], [
            'url' => 'url',
        ]);

        if (!$validator->passes()) {
            throw new RuntimeException($validator->errors()->first('url'));
        }

        return preg_replace('#/$#', '', $answer);
    }
    private function generateKey($outputLog)
    {
        $this->callSilent('key:generate', ['--force' => true]);
        $this->callSilent('jwt:secret', ['--force' => true]);
        return $outputLog;
    }
    private function getDatabaseInformation()
    {
        $this->info('Database details');

        $connectionVerified = false;

        $database = [];
        while (!$connectionVerified) {
            // Should we just skip this step if only one driver is available?
            $type = 'mysql';

            $database['connection'] = $type;

            if ($type !== 'sqlite') {
                $defaultPort = $type === 'mysql' ? 3306 : 5432;

                $host = $this->anticipate('Host', ['localhost'], 'localhost');
                $port = $this->anticipate('Port', [$defaultPort], $defaultPort);
                $name = $this->anticipate('Name', ['landingmall'], 'database name');
                $user = $this->ask('Username', 'deployer');
                $pass = $this->secret('Password');

                $database['host']     = $host;
                $database['port']     = $port;
                $database['database'] = $name;
                $database['username'] = $user;
                $database['password'] = $pass;
            }

            $connectionVerified = true;

            //$connectionVerified = $this->verifyDatabaseDetails($database);
        }

        return $database;
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
