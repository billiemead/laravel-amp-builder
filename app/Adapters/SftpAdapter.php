<?php

namespace App\Adapters;

use League\Flysystem\Sftp\SftpAdapter as parentAdapter;

class SftpAdapter extends parentAdapter
{
    protected $url;
    public function __construct(array $config)
    {
        parent::__construct($config);
        if (!empty($config['url'])) {
            $this->url = $config['url'];
        }
    }
    public function getUrl($path)
    {
        if (!empty($this->url)) {
            return $this->url.'/'.$path;
        }
        return $path;
    }
}
