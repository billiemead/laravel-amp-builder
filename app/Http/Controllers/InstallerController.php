<?php

namespace App\Http\Controllers;

use App\Models\User;
use Validator;
use Auth;
use Illuminate\Http\Request;
use RachidLaasri\LaravelInstaller\Helpers\RequirementsChecker;
use RachidLaasri\LaravelInstaller\Helpers\PermissionsChecker;
use RachidLaasri\LaravelInstaller\Helpers\EnvironmentManager;
use RachidLaasri\LaravelInstaller\Helpers\DatabaseManager;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Console\Output\BufferedOutput;
use RachidLaasri\LaravelInstaller\Helpers\FinalInstallManager;

/**
 * Class InstallerController
 * @package App\Http\Controllers
 */
class InstallerController extends Controller
{
    public function __construct()
    {
        \Assets::addScripts(['installer_app']);
        \Assets::addStyles(['admin']);
    }
    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        return view("installer/index");
    }

    /**
     * @param $step
     * @param Request $request
     * @return int
     */
    public function step($step, Request $request)
    {
        $method = camel_case('step_'.$step);
        if (method_exists($this, $method)) {
            return $this->$method($request);
        }
        return 1;
    }

    /**
     * @param Request $request
     * @return array
     */
    public function stepRequirement(Request $request)
    {
        $checker = new RequirementsChecker;
        $phpSupportInfo = $checker->checkPHPversion(
            config('installer.core.minPhpVersion')
        );
        $requirements = $checker->check(
            config('installer.requirements')
        );
        return array_merge(['phpSupportInfo'=>$phpSupportInfo], $requirements);
    }

    /**
     * @param Request $request
     * @return array
     */
    public function stepEnvironment(Request $request)
    {
        $manager = new EnvironmentManager;
        $envConfig = $manager->getEnvContent();
        return compact('envConfig');
    }

    /**
     * @param Request $request
     * @return int
     * @throws \Exception
     */
    public function stepDatabase(Request $request)
    {
        $servername = $request->database_hostname;
        $username = $request->database_username;
        $password = $request->database_password;
        $database_name = $request->database_name;
        try {
            $pdo = new \PDO("mysql:host=$servername;dbname=$database_name", $username, $password);
        } catch (\Exception $e) {
            throw $e;
        }
        $envPath = base_path('.env');
        $url = $request->input('app_url', url(''));
        $main_domain = $url;
        $parse = parse_url($url);
        if (false != $parse && !empty($parse['host'])) {
            $main_domain = $parse['host'];
        }
        
        $envFileData =
        'APP_NAME="' . $request->input('app_name', 'LandingPage') . '"'."\n" .
        'APP_ENV=' . $request->input('environment', 'stage') . "\n" .
        'SETTING_DRIVER=' . 'json' . "\n" .
        'APP_KEY=' . 'base64:bODi8VtmENqnjklBmNJzQcTTSC8jNjBysfnjQN59btE=' . "\n" .
        'APP_DEBUG=' . $request->input('app_debug', 'true') . "\n" .
        'APP_URL="' . $request->input('app_url', url('')) . '"'. "\n" .
        'MAIN_DOMAIN="' . $main_domain . '"'. "\n" .
        'DB_HOST="' . $request->database_hostname . '"'. "\n" .
        'DB_PORT="' . $request->database_port . '"'. "\n" .
        'DB_DATABASE="' . $request->database_name . '"'. "\n" .
        'DB_USERNAME="' . $request->database_username . '"'. "\n" .
        'DB_PASSWORD="' . $request->database_password . '"'. "\n".
        "JWT_SECRET=Zd7h0qz3LThRKIcmuZCqGpZOpEVdQxJD". "\n";
        file_put_contents($envPath, $envFileData);
        return 1;
    }

    /**
     * @param Request $request
     * @return array
     */
    public function stepPermissions(Request $request)
    {
        $checker = new PermissionsChecker;
        $permissions = $checker->check(
            config('installer.permissions')
        );
        return $permissions;
    }

    /**
     * @param Request $request
     * @return int
     * @throws \Exception
     */
    public function stepAdmin(Request $request)
    {
        $outputLog = new BufferedOutput;
        Artisan::call('migrate:fresh', ["--force"=> true], $outputLog);
        if ($outputLog && is_array($outputLog) && !empty($outputLog['status']) && $outputLog['status'] == 'error') {
            throw new \Exception($outputLog['message']);
        }
        
        $email = $request->email;
        $password = $request->password;
        $this->createAdminUser($email, $password);
        
        return 1;
    }

    /**
     * @param Request $request
     * @return int
     */
    public function stepFinal(Request $request)
    {
        $manager = new FinalInstallManager;
        $outputLog = $manager->runFinal();
        $this->generateKey($outputLog);
        $this->createStorageLink($outputLog);
        Storage::put('installed.chk', "1");
        return 1;
    }

    /**
     * @param $outputLog
     * @return mixed
     */
    private static function generateKey($outputLog)
    {
        Artisan::call('key:generate', ["--force"=> true], $outputLog);
        Artisan::call('jwt:secret', ["--force"=> true], $outputLog);
        Artisan::call('config:clear', [], $outputLog);
        Artisan::call('app:debug', ["status"=> "off"], $outputLog);
        return $outputLog;
    }
    
    /**
    * @param $outputLog
    * @return mixed
    */
    private static function createStorageLink($outputLog)
    {
		try{
			if(file_exists(base_path('/public/storage'))){
				unlink(base_path('/public/storage'));
			}
			Artisan::call('storage:link', [], $outputLog);
		}
		catch(\Exception $e) {
			
		}
		
       
        return $outputLog;
    }

    /**
     * @param String $email
     * @param String $password
     */
    protected function createAdminUser($email, $password)
    {
        $user_database = new User;
        $user_database->name = "Administrator";
        $user_database->email = $email;
        //$user_database->username = $email;
        $user_database->password = bcrypt($password);
        $user_database->is_active = 1;
        //$user_database->is_admin = 1;
        //$user_database->activated = 1;
        $user_database->email_verified_at = \Carbon\Carbon::now();
        $user_database->save();
        $user_database->assignRole('super_admin');
    }
}
