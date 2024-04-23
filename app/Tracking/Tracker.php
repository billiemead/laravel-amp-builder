<?php
namespace App\Tracking;

use DeviceDetector\DeviceDetector;
use DeviceDetector\Parser\OperatingSystem;
use App\Tracking\Models\Visit;
use App\Tracking\Models\Conversion;

use App\Tracking\Models\Visitor;

use App\Tracking\Jobs\GetGeoipData;
use Cookie;

class Tracker
{
    protected static $botBrowsers = [
        'curl',
        'python-requests',
        'python-urllib',
        'wget',
        'unk',
        'perl',
        'go-http-client',
    ];
    /**
     * Records a visit/request based on the request()
     *
     * @param string $agent
     * @return Voerro\Laravel\VisitorTracker\Models\Visit
     */
    public static function recordVisit($agent = null)
    {
        if (!self::shouldTrackUser()) {
            return;
        }
        if (!self::shouldTrackAuthenticatedUser()) {
            return;
        }
        $uniqueVistorId = self::getUniqueVistor();
        $data = self::getVisitData($agent ?: request()->userAgent());
        // Determine if the request is a login attempt
        if (request()->route()
        && '/' . request()->route()->uri == config('visitortracker.login_attempt.url')
        && $data['method'] == config('visitortracker.login_attempt.method')
        && $data['is_ajax'] == config('visitortracker.login_attempt.is_ajax')) {
            $data['is_login_attempt'] = true;
        }
        if (!self::shouldRecordRequest($data)) {
            return;
        }
        if (empty($uniqueVistorId)) {
            $visitor = Visitor::create($data);
            GetGeoipData::dispatch($visitor);
            self::setUniqueVistor($visitor->id);
            $uniqueVistorId = $visitor->id;
            //return $uniqueVistorId;
        }
        $data['visitor_id'] = $uniqueVistorId;
        $visit = Visit::create($data);
        self::saveVisitToCookie($visit->id);
        return $visit;
    }
    /**
     * Records a conversion
     *
     * @param string $agent
     * @return Voerro\Laravel\VisitorTracker\Models\Visit
     */
    public static function recordConversion($goal_id, $agent = null)
    {
        if (!self::shouldTrackUser()) {
            return;
        }
        if (!self::shouldTrackAuthenticatedUser()) {
            return;
        }
        $uniqueVistorId = self::getUniqueVistor();
        $data = self::getVisitData($agent ?: request()->userAgent());
        
        if (!self::shouldRecordRequest($data)) {
            return;
        }
        if (empty($uniqueVistorId)) {
            $visitor = Visitor::create($data);
            GetGeoipData::dispatch($visitor);
            self::setUniqueVistor($visitor->id);
            $uniqueVistorId = $visitor->id;
        }
        $visit_id = self::getVisitFromCookie();
        $data = [
            'visit_id'=>$visit_id,
            'goal_id'=>$goal_id,
            'visitor_id'=>$uniqueVistorId,
        ];
        $conversion = Conversion::create($data);
        
        return $conversion;
    }
    /**
     * Determine if the user should be tracked based on whether they are
     * authenticated or not
     *
     * @return boolean
     */
    protected static function shouldTrackUser()
    {
        if (config('visitortracker.dont_track_authenticated_users') && auth()->check()) {
            return false;
        }
        if (config('visitortracker.dont_track_anonymous_users') && !auth()->check()) {
            return false;
        }
        return true;
    }
    /**
     * Determine if the authenticated user should be tracked
     *
     * @return boolean
     */
    protected static function shouldTrackAuthenticatedUser()
    {
        if (auth()->check()) {
            foreach (config('visitortracker.dont_track_users') as $fields) {
                $conditionsMet = 0;
                foreach ($fields as $field => $value) {
                    if (auth()->user()->{$field} == $value) {
                        $conditionsMet++;
                    }
                }
                if ($conditionsMet == count($fields)) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * Determine if the request/visit should be recorded
     *
     * @return boolean
     */
    protected static function shouldRecordRequest($data)
    {
        foreach (config('visitortracker.dont_record') as $fields) {
            $conditionsMet = 0;
            foreach ($fields as $field => $value) {
                if ($data[$field] == $value) {
                    $conditionsMet++;
                }
            }
            if ($conditionsMet == count($fields)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Collect and form into array data about the current visit based on the request() and UA
     *
     * @param string $agent User agent
     * @return array
     */
    protected static function getVisitData($agent)
    {
        $dd = new DeviceDetector($agent);
        $dd->parse();
        // Browser
        $browser = $dd->getClient('version')
            ? $dd->getClient('name') . ' ' . $dd->getClient('version')
            : $dd->getClient('name');
        $browserFamily = str_replace(' ', '-', strtolower($dd->getClient('name')));
        // Browser language
        preg_match_all('/([a-z]{2})-[A-Z]{2}/', request()->server('HTTP_ACCEPT_LANGUAGE'), $matches);
        $lang = count($matches) && count($matches[0]) ? $matches[0][0] : '';
        $langFamily = count($matches) && count($matches[1]) ? $matches[1][0] : '';
        // OS
        $os = $dd->getOs('version')
            ? $dd->getOs('name') . ' ' . $dd->getOs('version')
            : $dd->getOs('name');
        $osFamily = str_replace(
            ' ',
            '-',
            strtolower(OperatingSystem::getOsFamily($dd->getOs('short_name')))
        );
        $osFamily = $osFamily == 'gnu/linux' ? 'linux' : $osFamily;
        // "UNK UNK" browser and OS
        $browserFamily = ($browser == 'UNK UNK') ? 'unk' : $browserFamily;
        $osFamily = ($os == 'UNK UNK') ? 'unk' : $osFamily;
        // Whether it's a bot
        $bot = null;
        $isBot = $dd->isBot();
        if ($isBot) {
            $bot = $dd->getBot();
        } else {
            if (in_array($browserFamily, static::$botBrowsers)) {
                $isBot = true;
                $bot = ['name' => $browserFamily];
            }
        }
        return [
            'user_id' => auth()->check() ? auth()->id() : null,
            'ip' => request()->ip(),
            'method' => request()->method(),
            'url' => request()->fullUrl(),
            'referer' => request()->headers->get('referer'),
            'is_ajax' => request()->ajax(),
            'user_agent' => $agent,
            'is_mobile' => $dd->isMobile(),
            'is_desktop' => $dd->isDesktop(),
            'is_bot' => $isBot,
            'bot' => $bot ? $bot['name'] : null,
            'os' => $os,
            'os_family' => $osFamily,
            'browser_family' => $browserFamily,
            'browser' => $browser,
            'browser_language_family' => $langFamily,
            'browser_language' => $lang,
        ];
    }
    /**
     * Get visitor ID from Cookie
     *
     * @return integer
     */
    public static function getUniqueVistor()
    {
        $cookie = config('visitortracker.cookie_prefix').'viuqid';
        $value = isset($_COOKIE[$cookie]) ? $_COOKIE[$cookie] : null;
        $exists = Visitor::where('id', $value)->exists();
        if ($exists) {
            return $value;
        }
    }
    
    /**
     * Get visit ID from Cookie
     *
     * @return integer
     */
    public static function getVisitFromCookie()
    {
        $cookie = config('visitortracker.cookie_prefix').'cvid';
        $value = isset($_COOKIE[$cookie]) ? $_COOKIE[$cookie] : null;
        $exists = Visitor::where('id', $value)->exists();
        if ($exists) {
            return $value;
        }
    }
    /**
     * Set visitor ID from Cookie
     *
     * @param string $agent User agent
     * @return boolean
     */
    public static function setUniqueVistor($id)
    {
        $cookie = config('visitortracker.cookie_prefix').'viuqid';
        $cookie_timeout = config('visitortracker.cookie_timeout');
        setcookie($cookie, $id, time() + $cookie_timeout);
    }
    
    /**
     * Save current Visit ID to Cookie
     *
     * @param integer $id
     * @return boolean
     */
    public static function saveVisitToCookie($id)
    {
        $cookie = config('visitortracker.cookie_prefix').'cvid';
        $cookie_timeout = config('visitortracker.cookie_timeout');
        setcookie($cookie, $id, time() + $cookie_timeout);
    }
    /**
     * Get external conversion tracking code
     *
     * @return string
     */
    public static function getTrackingCode()
    {
        include('script.php');
    }
}
