<?php

namespace App\Http\Controllers\rest;

use App\Http\Controllers\Controller;
use File;
use DB;
use Validator;
use Zipper;
use Plupload;
use Illuminate\Support\Facades\Storage;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\Cache;

class FileController extends Controller
{


    /**
     * Display content of a file system storage
     * @param $name
     * @return mixed
     */
    public function showDisk($name)
    {
        return $this->getStorageFolderContent($name);
    }
    /**
     * List user's uploaded files and folders
     * @return mixed
     */
    public function show()
    {
        $response = $this->getStorageFolderContent('uploads', auth()->user()->id);
        return $response;
    }


    /**
     * Delete uploaded files
     * @return mixed
     */
    public function delete()
    {
        $files = request()->input('files');
        $storage = Storage::disk('uploads');

        if (!empty($files)) {
            for ($i = 0; $i < sizeof($files); $i++) {
                $files[$i] = auth()->user()->id.'/'.$files[$i];
            }
            $storage->delete($files);
        }
        return response()->success(1);
    }
    /**
     * Delete user's folders
     * @return mixed
     */
    public function deleteFolder()
    {
        $folders = request()->input('folders');
        $storage = Storage::disk('uploads');
        if (!empty($folders)) {
            for ($i = 0; $i < sizeof($folders); $i++) {
                $folders[$i] = auth()->user()->id.'/'.$folders[$i];
            }
            foreach ($folders as $folder) {
                $storage->deleteDirectory($folder);
            }
        }
        return response()->success(1);
    }

    /**
     * Create new folder
     */
    public function newFolder()
    {
        $name = request()->input('name');
        $storage = Storage::disk('uploads');
        $name = preg_replace('/[^a-z0-9\.\-_]/i', '', $name);
        $newdir = $name;
        if ($storage->exists(auth()->user()->id.'/'.$newdir)) {
            return response()->error("Folder already exists");
        }
        try {
            $storage->makeDirectory(auth()->user()->id.'/'.$newdir);
            return response()->success(array('name'=>$name));
        } catch (Exception $e) {
            return response()->error($e->getMessage());
        }
        return response()->success(1);
    }

    /**
     * Get system max upload size in byte
     * @return mixed
     */
    public function getMaxUploadSize()
    {
        $max = ini_get('max_upload_size');
        return response()->success($max);
    }
    
    //Download and fetch content of URL
    protected function getUrlContent($url)
    {
        $content = '';
        // Get content from a unsecured url
        if (starts_with($url, 'http://')) {
            $content = file_get_contents($url);
        }
        // Get content from a secured url
        if (starts_with($url, 'https://')) {
            $content = file_get_contents_curl($url);
        }
        $path = base_path($url);
        // Get content from a local url
        if (File::exists($path)) {
            $content = File::get($path);
        }
        return $content;
    }
    /**
     * Fetch remote svg file
     * @return mixed
     */
    public function getIcon()
    {
        $type = request()->input('type', 'json');
        $url = request()->input('url');
        
        $content = \Modules\Builder\Widgets\Svg::getSVGContent($url, false);
        // Cached SVG Content for better perfomance
        $cacheKey = 'svg.'.$url;
        if ($content != false) {
            $cacheTimeout = config('cache.svg_cacheTimeout', 2* 60 * 60);
            Cache::add($cacheKey, $content, $cacheTimeout);
            return response()->success($content);
        }
        return response()->error($content);
    }
    
    // Fetch font-face value from remote CSS File
    public function getFontFromUrl()
    {
        $url = request()->input('url');
        $content = $this->getUrlContent($url);
        $font = $this->extractFontfaceInfo($content);
        return response()->success($font);
    }
    protected function extractFontfaceInfo($content)
    {
        $fontregex = '~@font-face[^}]*?font-family:\s*[\'"]([^\'"]+)[\'"];~';
        preg_match_all($fontregex, $content, $matches, PREG_SET_ORDER);
        if (!sizeof($matches)) {
            return false;
        }
        $response = array();
        foreach ($matches as $match) {
            if (!in_array($match[1], $response)) {
                $response[] = $match[1];
            }
        }
        return $response;
    }
    
    /**
     * Upload an asset(image, video)
     * @return mixed
     */
    public function upload()
    {
        $destinationFolder = auth()->user()->id;
        // Check folder to put uploaded file
        $folder = request()->get('f');
        if (!empty($folder)) {
            $destinationFolder .= DIRECTORY_SEPARATOR. $folder;
        }
        $overwrite = true;
        $storage = Storage::disk('uploads');
        $handler = function ($file) use ($destinationFolder, $storage) {
            $originalName = $file->getClientOriginalName();
            $extension = $this->getFileExtension($originalName);
            $filename = substr($originalName, 0, strlen($originalName) - strlen($extension) - 1);
            $slug_name = str_slug($filename);
            
            $new_file_name = $slug_name;
            $file->move(storage_path('/temp/'), $filename);
            $destinationFile = $destinationFolder.'/'.$new_file_name.'.'.$extension;
            if ($storage->exists($destinationFile)) {
                return 1;
            }
            $i = 1;
            // Check folder to find unique file name
            while ($storage->exists($destinationFile)) {
                $new_file_name = $slug_name.'_'.$i;
                $destinationFile = $destinationFolder.'/'.$new_file_name.'.'.$extension;
                $i++;
            }
            $storage->put($destinationFile, fopen(storage_path('/temp/' . $filename), 'r'));
            return 1;
        };
        Plupload::receive('file', $handler);
        $ret['result'] = 1;
        return $ret;
    }
    
    protected function getFileExtension($file_name)
    {
        $extensions = explode('.', $file_name);
        $extension = $extensions[sizeof($extensions) - 1];
        return $extension;
    }
    /**
     * Helper function to get storage files and folders
     * @param string $disk
     * @param string $subfolder
     * @return mixed
     */
    protected function getStorageFolderContent($disk = 'local', $subfolder = '')
    {
        // Check in cache
        $cacheKey = "filesystems.disks.".$disk;
        $cacheable = config($cacheKey.'.cacheable'); // If this storage is cacheable
        $cacheTimeout = config($cacheKey.'.cacheTimeout');
        $storage = Storage::disk($disk);
        $in_folder = request()->input('folder');
        $folder = $subfolder;
        if (!empty($in_folder)) {
            $folder .= '/'.$in_folder;
            $cacheKey.= $folder;
        }
        // Get content from cache if available
        if ($cacheable && Cache::has($cacheKey)) {
            return response()->success(Cache::get($cacheKey));
        }
        
        $shouldIncludeFolderInResponse = (request()->input('gfld', 0) == 1);// Should include folder list in response
        $files = $storage->files($folder);
        $folders = [];
        if ($shouldIncludeFolderInResponse) {
            $folders = $storage->directories($folder);
        }
        $response = ['files' => []];

        foreach ($files as $file) {
            $response['files'][] = $this->getStorageFileInfo($file, $storage, $subfolder);
        }
        if ($shouldIncludeFolderInResponse) {
            $response['folders'] = [];
            foreach ($folders as $folder) {
                $info = $this->getStorageFolderInfo($folder, $storage, $subfolder);
                $response['folders'][] = $info;
            }
        }
        $mimeTypes = request()->get('mimeTypes');
        if (!empty($mimeTypes)) {
            $response['files'] = array_values(array_filter($response['files'], function ($item) use ($mimeTypes) {
                foreach ($mimeTypes as $mimeType) {
                    if (strpos($item['mimeType'], $mimeType) == 1) {
                        return true;
                    }
                }
                return false;
            }));
        }
        $mimeType = request()->get('mimeType');
        // Filter response by mime type
        if (!empty($mimeType)) {
            $response['files'] = array_values(array_filter($response['files'], function ($item) use ($mimeType) {
                $pos = strpos($item['mimeType'], $mimeType);
                if ($pos !== false && $pos == 0) {
                    return true;
                }
                return false;
            }));
        }
        // Save content to cache
        if ($cacheable) {
            Cache::add($cacheKey, $response, $cacheTimeout);
        }
        return response()->success($response);
    }

    /**
     * Render a number to human-readable string
     * @param $filesize
     * @return string
     */
    protected function displayFilesize($filesize)
    {
        if (is_numeric($filesize)) {
            $decr = 1024;
            $step = 0;
            $prefix = ['Byte','KB','MB','GB','TB','PB'];

            while (($filesize / $decr) > 0.9) {
                $filesize = $filesize / $decr;
                ++$step;
            }

            return round($filesize, 0).' '.$prefix[$step];
        } else {
            return 'NaN';
        }
    }

    /**
     * @param $file
     * @param null $storage
     * @param null $relative_path
     * @return array
     */
    protected function getStorageFileInfo($file, $storage = null, $relative_path = null)
    {
        $full_path = $storage->path($file);
        $rpath = $file;
        if (!empty(($relative_path))) {
            $search = $relative_path.'/';
            $pos = strpos($file, $search);
            if ($pos !== false && $pos == 0) {
                $rpath = substr($file, strlen($search));
            }
        }

        $name = File::name($full_path);
        $file_ext = File::extension($full_path);
        $full_url = $storage->url($file);
        $size = $storage->size($file);
        $time = $storage->lastModified($file);
        $thumbnail = $this->getStorageFileIconThumbnail($file, $storage);
        $mimeType = $this->getStorageMimeType($file, $storage);

        return [
            'file' => $rpath,
            'name' => $name,
            'mimeType'=>$mimeType,
            'file_extension' => $file_ext,
            'size' => $size,
            'size_s' => $this->displayFilesize($size),
            "type"=> "file",
            "rights"=> "drwxr-xr-x",
            "date"=>date("Y-m-d H:i:s.", $time),
            'full_url' => ($full_url),
            'url' => urlencode($full_url),
            'thumbnail' => $thumbnail,
            'base_path'=>base_path()
        ];
    }

    /**
     * Get folder information
     * @param $path
     * @param null $storage
     * @param $relative_path
     * @return array
     */
    protected function getStorageFolderInfo($path, $storage = null, $relative_path = '')
    {
        $full_path = $storage->path($path);
        $name = basename($full_path);
        $rpath = ltrim($path, $relative_path.'/');
        return ['full_path' => $path,'name' => $name, 'rpath'=>$rpath,'path' => $rpath];
    }


    /**
     * Get extension from a mime type
     * @param $mime
     * @return mixed
     */
    protected function extractExtensionFromMime($mime)
    {
        $extension = explode('/', $mime);
		if(sizeof($extension) >= 2)
			$extension = $extension[1];
		else
			$extension = $extension[0];
        return $extension;
    }

    /**
     * Get file mime type
     * @param $file
     * @param $storage
     * @return string
     */
    protected function getStorageMimeType($file, $storage)
    {
		$full_path = $storage->path($file);
		try{
			$mimeType = $storage->mimeType($file);
		}
		catch(\Throwable $e) {
			$mimeType = getImageMimeType($full_path);
		}
        
        $file_ext = File::extension($full_path);
        if ($file_ext == 'svg' && $mimeType == "text/plain") {
            return 'image/svg+xml';
        }
        return $mimeType;
    }

    /**
     * Get file thumbnail
     * @param $file
     * @param $storage
     * @return string
     */
    protected function getStorageFileIconThumbnail($file, $storage)
    {
        $mimeType = $this->getStorageMimeType($file, $storage);
        $file_ext = $this->extractExtensionFromMime($mimeType);
        $imageTypes = ['image/png','image/jpg','image/jpeg', 'image/gif', 'image/svg+xml', 'image/svg'];
        $audioTypes = ['audio/mp3', 'audio/oga', 'audio/wav', 'audio/mid', 'audio/midi'];
        $videoTypes = ['video/mp4', 'video/m4v', 'video/ogg', 'video/ogv', 'video/webm', 'video/flv', 'video/mpeg', 'video/mov'];
        $isImage = in_array($mimeType, $imageTypes);
        if ($isImage != false) {
            return $storage->url($file);
        }
        $filePath = public_path('assets/images/fileicon'). DIRECTORY_SEPARATOR . $file_ext.'.png';
        if (file_exists($filePath)) {
            return url('/public').'/assets/images/fileicon/'.$file_ext.'.png';
        }
        $isAudio = in_array($mimeType, $audioTypes);
        if ($isAudio != false) {
            return url('/public').'/assets/images/fileicon/audio.png';
        }
        $isVideo = in_array($mimeType, $videoTypes);
        if ($isVideo != false) {
            return url('/public').'/assets/images/fileicon/video.png';
        }
        return url('/public').'/assets/images/fileicon/file.png';
    }



    protected function convertPNG2JPG($filePath, $destination)
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
    protected function convertGIF2JPG($filePath, $destination)
    {
        $image = imagecreatefromgif($filePath);
        
        imagejpeg($image, $destination);
        imagedestroy($image);
    }
}
