<?php

namespace Modules\Builder\Integrations\zapier;

use GuzzleHttp\Client;

class Handler
{
    public function subscribe($post_data, $integration)
    {
        $url = array_get($integration, 'url');
        $client = new Client;
        $response = $client->request('POST', $url, [
            'form_params' => $post_data
        ]);
        return $response;
    }
}
