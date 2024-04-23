<?php

return [
	'default_branch'=>'0',
	'default_version'=>'1',
	'base_script'=>'<script async src="https://cdn.ampproject.org/v0.js"></script>',
	'template'=>[
		'default'=>'<script async custom-element=":tag" src="https://cdn.ampproject.org/v:branch/:tag-:branch.:version.js"></script>',
		'amp-mustache'=>'<script async custom-template=":tag" src="https://cdn.ampproject.org/v:branch/:tag-:branch.:version.js"></script>'
	],
	'preloads'=>[
		['amp-mustache', 2],
		'amp-iframe',
		'amp-date-countdown',
		'amp-addthis',
		'amp-facebook-comments',
		'amp-facebook-page',
		'amp-instagram',
		'amp-facebook',
		'amp-carousel',
		'amp-youtube',
		'amp-vimeo',
		'amp-dailymotion',
		'amp-iframe',
		'amp-list'
	]
];
