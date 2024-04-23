<?php

namespace Modules\Builder\Integrations\url;

use GuzzleHttp\Client;

class Handler
{
    // POST form data to a specific URL
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
