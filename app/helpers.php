<?php

use Illuminate\Support\Facades\Storage;

function generate_id($suffix = 'module-')
{
    $page_id = uniqid($suffix);
    $page_id .= rand(10, 99);

    return $page_id;
}
function getMainDomain()
{
    return config('app.main_domain');
}
function getAppDomain()
{
    return config('app.main_domain');
}
function getCurrentDomain()
{
    $domain = $_SERVER['HTTP_HOST'];
    if (strpos($domain, "www.") === 0) {
        $domain = substr($domain, 4);
    }
    return $domain;
}
function isInstalled()
{
    return !empty(config('app.main_domain')) && Storage::disk('local')->exists('installed.chk');
}
function isDemoMode()
{
    return config('app.demo_mode');
}
function sts_getBiDirection()
{
    $isRTL = isRTLLanguage();
    return ($isRTL ? 'rtl' : 'ltr');
}
function isRTLLanguage()
{
    $rtlConfig = config('app.rtl');
    if (isset($rtlConfig) && $rtlConfig) {
        return true;
    }
    $rtlLanguages = [
        'ae',   /* Avestan */
        'ar',   /* 'العربية', Arabic */
        'arc',  /* Aramaic */
        'bcc',  /* 'بلوچی مکرانی', Southern Balochi */
        'bqi',  /* 'بختياري', Bakthiari */
        'ckb',  /* 'Soranî / کوردی', Sorani */
        'dv',   /* Dhivehi */
        'fa',   /* 'فارسی', Persian */
        'glk',  /* 'گیلکی', Gilaki */
        'he',   /* 'עברית', Hebrew */
        'ku',   /* 'Kurdî / كوردی', Kurdish */
        'mzn',  /* 'مازِرونی', Mazanderani */
        'nqo',  /* N'Ko */
        'pnb',  /* 'پنجابی', Western Punjabi */
        'ps',   /* 'پښتو', Pashto, */
        'sd',   /* 'سنڌي', Sindhi */
        'ug',   /* 'Uyghurche / ئۇيغۇرچە', Uyghur */
        'ur',   /* 'اردو', Urdu */
        'yi'    /* 'ייִדיש', Yiddish */
    ];
    $key = array_search(App::getLocale(), $rtlLanguages);
    return ($key !== false);
}
function getMimeByExtension($file)
{
    $index = strrpos($file, '.');
    if (false !== $index) {
        $ext = substr($file, $index + 1);
        switch (strtolower($ext)) {
            case 'jpg':
            case 'jpeg':
                return IMAGETYPE_JPEG;
            case 'bmp':
                return IMAGETYPE_BMP;
            case 'gif':
                return IMAGETYPE_GIF;
            case 'png':
                return IMAGETYPE_PNG;
        }
    }
}
function getImageMimeType($file)
{
    if (function_exists('exif_imagetype')) {
        return exif_imagetype($file);
    }
    if (function_exists('getimagesize')) {
        $a = getimagesize($file);
        $image_type = $a[2];
        return $image_type;
    }
    return getMimeByExtension($file);
}
function convertPNG2JPG($filePath, $destination)
{
    $image = imagecreatefrompng($filePath);
    $bg = imagecreatetruecolor(imagesx($image), imagesy($image));
    imagefill($bg, 0, 0, imagecolorallocate($bg, 255, 255, 255));
    imagealphablending($bg, true);
    imagecopy($bg, $image, 0, 0, 0, 0, imagesx($image), imagesy($image));
    imagedestroy($image);
    $quality = 50; // 0 = worst / smaller file, 100 = better / bigger file
    imagejpeg($bg, $destination, $quality);
    imagedestroy($bg);
}
function convertGIF2JPG($filePath, $destination)
{
    $image = imagecreatefromgif($filePath);
    
    $quality = 50; // 0 = worst / smaller file, 100 = better / bigger file
    imagejpeg($image, $destination);
    imagedestroy($image);
}
function base64_to_jpeg($base64_string, $output_file)
{
    // open the output file for writing
    $ifp = fopen($output_file, 'wb');

    // split the string on commas
    // $data[ 0 ] == "data:image/png;base64"
    // $data[ 1 ] == <actual base64 string>
    $data = explode(',', $base64_string);

    // we could add validation here with ensuring count( $data ) > 1
    fwrite($ifp, base64_decode($data[ 1 ]));

    // clean up the file resource
    fclose($ifp);

    return $output_file;
}
//https://stackoverflow.com/questions/8392619/php-function-to-get-recursive-path-keys-with-path
function recursive_array_keys(array $array, array $path = array())
{
    $result = array();
    foreach ($array as $key => $val) {
        $currentPath = array_merge($path, array($key));
        if (is_array($val)) {
            $result = array_merge($result, recursive_array_keys($val, $currentPath));
        } else {
            $result[] = join('.', $currentPath);
        }
    }
    return $result;
}
//https://github.com/appcia/webwork/blob/master/lib/Appcia/Webwork/Storage/Config.php#L64
function recursive_array_merge(array $arr1, array $arr2)
{
    if (empty($arr1)) {
        return $arr2;
    } elseif (empty($arr2)) {
        return $arr1;
    }
    foreach ($arr2 as $key => $value) {
        if (is_int($key)) {
            $arr1[] = $value;
        } elseif (is_array($arr2[$key])) {
            if (!isset($arr1[$key])) {
                $arr1[$key] = array();
            }
            if (is_int($key)) {
                $arr1[] = recursive_array_merge($arr1[$key], $value);
            } else {
                $arr1[$key] = recursive_array_merge($arr1[$key], $value);
            }
        } else {
            $arr1[$key] = $value;
        }
    }
    return $arr1;
}

//https://stackoverflow.com/questions/26148701/file-get-contents-ssl-operation-failed-with-code-1-and-more
function file_get_contents_curl($url)
{
    try {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_AUTOREFERER, true);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        $data = curl_exec($ch);
        curl_close($ch);
        return $data;
    } catch (\Exception $e) {
        var_dump($e);
    }
    return "";
}
function isMobile()
{
    return preg_match("/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]);
}
function public_url($path = '')
{
    return url('public'.$path);
}
function isNativeArray($arr)
{
    if (array_keys($arr) !== range(0, count($arr) - 1)) {
        return false;
    }
    return true;
}
function startsWith($string, $needle)
{
    return Str::startsWith($string, $needle);
}
