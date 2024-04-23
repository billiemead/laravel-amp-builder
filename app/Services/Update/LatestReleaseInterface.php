<?php
namespace App\Services\Update;

use GuzzleHttp\Client;
use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Version\Version;

/**
 * A class to get the latest release tag for Github.
 */
interface LatestReleaseInterface
{
    public function latest();
}
