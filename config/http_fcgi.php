<?php

return [
	'enable'=>env('BYPASS_FASTCGI_SECURITY'),
	'tokenName'=>env('BYPASS_FASTCGI_SECURITY_TOKEN', 'CGIAuthorization'),
];
