<?php

namespace Modules\Builder\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use App\Models\Page;
use Asm89\Stack\CorsService;
use Illuminate\Http\Request;
use Illuminate\Http\Response as LaravelResponse;

class HandleAMPCors
{
    public function handle($request, Closure $next, $variant_route_param_name)
    {
        $variant_uuid = $request->route($variant_route_param_name);
        $page = Page::whereUuid($variant_uuid)->first();
        if (empty($page)) {
            return new LaravelResponse('Not Found', 404);
        }
		$validOrigins = $this->getValidOrigins($page);
		$cors = new CorsService(['allowedOrigins'=>$validOrigins, 'supportsCredentials'=>true]);
		if (!$request->headers->has('AMP-Same-Origin')) {
			
			$url = $request->url();
			if ($request->headers->has('Origin')) {
				$isOrigin = $cors->isActualRequestAllowed($request);
				if (!$isOrigin) {
					$origin = $request->headers->get('Origin');
					return new LaravelResponse($origin.' is an unrecognised origin', 403);
				}
			} else if($request->has('__amp_source_origin')){
				$__amp_source_origin = $request->get('__amp_source_origin');
				if (!($__amp_source_origin === $request->getSchemeAndHttpHost())) {
					return new LaravelResponse($__amp_source_origin.' is an unrecognised origin', 403);
				}
			}
			else if(!$this->checkRequestDomain($request, $validOrigins)) {
				return new LaravelResponse($url.' is an unrecognised origin'. json_encode($_SERVER), 403);
			}
			
		}
		
        $response = $next($request);

        return $this->addHeaders($request, $response, $cors);
    }
	protected function getDomainUrl($url)
	{
		if(empty($url))
			return $url;
		$requestHost = parse_url($url,  PHP_URL_HOST);
		$requestScheme = parse_url($url,  PHP_URL_SCHEME);
		$url = $requestScheme.'://'.$requestHost;
		return $url;
	}
	protected function getRequestOrigin($request)
	{
		$url = $request->url();
		$referer_url = $request->headers->get('referer');
		$url = $this->getDomainUrl($url);
		$referer_url = $this->getDomainUrl($referer_url);
		$method = $request->method();
		$method = strtolower($method);
		if($method == 'post' || $method == 'put' || $method == 'delete'){
			if($url != $referer_url)
				$url = $referer_url;
		}
		return $url;
	}
	protected function checkRequestDomain($request, $validOrigins)
	{
		$origin = $this->getRequestOrigin($request);
		if (in_array($origin, $validOrigins)) {
            return true;
        }
	}
    protected function getValidOrigins($page)
    {
        $mainDomain = getMainDomain();
        $googleAMPCacheSubdomain = str_replace(".", "-", str_replace("-", "--", $mainDomain));
        $validOrigins = ['https://'.$googleAMPCacheSubdomain.'.cdn.ampproject.org','https://cdn.ampproject.org', 'https://amp.cloudflare.com','https://bing-amp.com', 'https://'.$mainDomain, 'http://'.$mainDomain];
        $site = $page->parent_site;
        $domains = $site->domains;
        foreach ($domains as $domain) {
            $validOrigins[] = 'https://'.$domain->getUrl();
			$validOrigins[] = 'http://'.$domain->getUrl();
			$googleAMPCacheSubdomain = str_replace(".", "-", str_replace("-", "--", $domain->getUrl()));
			$validOrigins[] = 'https://'.$googleAMPCacheSubdomain.'.cdn.ampproject.org';
        }
        return $validOrigins;
    }
    protected function isAMPCorRequest()
    {
        return $request->headers->has('Origin') && !$this->isSameHost($request);
    }
    protected function addHeaders(Request $request, $response, $cors)
    {
        // Prevent double checking
        if (! $response->headers->has('Access-Control-Allow-Origin')) {
            $response = $cors->addActualRequestHeaders($response, $request);
        }

        return $response;
    }
}
