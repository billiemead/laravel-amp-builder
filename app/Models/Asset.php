<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    public function displayFilesize($filesize)
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
    public function getFileInfo()
    {
        $file_name = $this->full_name;
        $name = $this->name;
        $file_ext = $this->extension;
        $full_path = base_path('/uploads/'.$this->owner_id.'/'.$file_name);
        $relative_url = url('/uploads/'.$this->owner_id.'/'.$file_name);
        $full_url = $relative_url;
        $filesize = $this->size;
        $thumbnail = $full_url;

        return ['id'=>$this->id, 'full_path' => $full_path,'file_name' => $file_name, 'filesize' => $filesize,'size' => $this->displayFilesize($filesize),'name' => $name, 'extension' => $file_ext, 'full_url' => ($full_url), 'url' => urlencode($full_url), 'thumbnail' => $thumbnail];
    }
    public function delete(array $options = [])
    {
        $file_name = $this->full_name;
        $full_path = base_path('/uploads/'.$this->owner_id.'/'.$file_name);
        if (file_exists($full_path)) {
            unlink($full_path);
        }
        parent::delete();
    }
}
