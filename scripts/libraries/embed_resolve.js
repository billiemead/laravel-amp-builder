// ==========================================================================
//
// Media
// Adds additional media type support
//
// ==========================================================================

	'use strict';

	// Formats matching url to final form
	var stubs = [

		{
			'name' : 'YouTube',
			'website' : 'http://www.youtube.com',
			'url-match' : [
				'youtu\.be\/([0-9a-z-_]{11})',
				//'(?:video\.google\.(?:com|com\.au|co\.uk|de|es|fr|it|nl|pl|ca|cn)\/(?:[^"]*?))?(?:(?:m|www|au|br|ca|es|fr|de|hk|ie|in|il|it|jp|kr|mx|nl|nz|pl|ru|tw|uk)\.)?youtube\.com(?:[^"]*?)?(?:video_id=|v(?:\/|=|\%3D|\%2F)|embed(?:\/|=|\%3D|\%2F))([0-9a-z-_]{11})', ],

				/(?:video\.google\.(?:com|com\.au|co\.uk|de|es|fr|it|nl|pl|ca|cn)\/(?:[^"]*?))?(?:(?:m|www|au|br|ca|es|fr|de|hk|ie|in|il|it|jp|kr|mx|nl|nz|pl|ru|tw|uk)\.)?youtube\.com(?:[^"]*?)?(?:&|&amp;|\/|\?|;|\%3F|\%2F)(?:video_id=|v(?:\/|=|\%3D|\%2F)|embed(?:\/|=|\%3D|\%2F))([0-9a-z-_]{11})/g
			],
			'embed-src' : 'https://www.youtube.com/v/$2&rel=0&fs=1',
			'embed-width' : '480',
			'embed-height' : '295',
			'image-src' : 'https://img.youtube.com/vi/$2/0.jpg',
			'iframe-player' : 'https://www.youtube.com/embed/$2',
			'amp-code':'<amp-youtube  data-videoid="$2" layout="responsive" width="480" height="295"></amp-youtube>',
		},
		{
			'name' : 'Instagram',
			'website' : 'http://www.instagram.com',
			'url-match' : [
				'https://www.instagram.com/p/([0-9a-z-_.]+)/',
			],
			'amp-code':'<amp-instagram data-shortcode="$2" layout="responsive" width="1" height="1"></amp-instagram>',
		},
	
		{
			'name' : 'Facebook post',
			'website' : 'http://www.facebook.com',
			'url-match' : [
				'https://www.facebook.com/[0-9a-z-_.]+/posts/([0-9]+)',
			],
			'amp-code':'<amp-facebook data-href="$1" layout="responsive" width="1" height="1"></amp-facebook>',
		},
		{
			'name' : 'Facebook page',
			'website' : 'http://www.facebook.com',
			'url-match' : [
				'https://www.facebook.com/[0-9a-z-_.]+/',
			],
			'amp-code':'<amp-facebook-page data-href="$1" layout="responsive" width="1" height="1"></amp-facebook-page>',
		},
		{
			'name' : 'Addthis',
			'website' : 'http://www.addthis.com',
			'url-match' : [
				'https://www.addthis.com/dashboard#tool-config/pub/([0-9a-z-_.]+)/widgetId/([a-z]+)/',
			],
			'amp-code':'<amp-addthis data-pub-id="$2" data-widget-id="$3" data-widget-type="inline"width="320" height="92"></amp-addthis>',
		},
		{
			'name' : 'Facebook Video',
			'website' : 'https://www.facebook.com',
			'url-match' : [
				'https://www.facebook.com/[0-9a-z-_.]+/videos/([0-9]+)/',
				'https://www.facebook.com/[0-9a-zA-Z-_.]+/videos/(?:vb.\d+)/(\d+)/',
				'https://www.facebook.com/[0-9a-zA-Z-_.]+/videos/(?:vl.\d+)/(\d+)/'
			],
			'embed-src' : '//www.facebook.com/video/embed?video_id=$2',
			'embed-width' : '480',
			'embed-height' : '295',
			'iframe-player' : 'https://www.facebook.com/plugins/video.php?href=$1&show_text=0',
			'amp-code':'<amp-facebook data-href="$1" layout="responsive" width="1" height="1"></amp-facebook>',
		},
		{
			'name' : 'Dailymotion',
			'website' : 'http://www.dailymotion.com',
			'url-match' : [
				'https://dai\.ly/([a-z0-9]{1,})',
				'https://(?:www\.)?dailymotion\.(?:com|alice\.it)/(?:(?:[^"]*?)?video|swf)/([a-z0-9]{1,18})',
			],
			'embed-src' : 'http://www.dailymotion.com/swf/$2&related=0',
			'embed-width' : '420',
			'embed-height' : '339',
			'image-src' : 'http://www.dailymotion.com/thumbnail/160x120/video/$2',
			'iframe-player' : '//www.dailymotion.com/embed/video/$2',
			'amp-code':'<amp-dailymotion  data-videoid="$2" layout="responsive" width="1" height="1"></amp-dailymotion>',
		},
		{
			'name' : 'Gmap Place',
			'website' : 'https://www.google.com/maps',
			'url-match' : /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/g,
			'embed-src' : function (rez) {
				return '//maps.google.' + rez[2] + '/?ll=' + ( rez[9] ? rez[9] + '&z=' + Math.floor(  rez[10]  ) + ( rez[12] ? rez[12].replace(/^\//, "&") : '' )  : rez[12] ) + '&output=' + ( rez[12] && rez[12].indexOf('layer=c') > 0 ? 'svembed' : 'embed' );
			},
			'embed-width' : '420',
			'embed-height' : '339',
			'iframe-player' : function (rez) {
				return '//maps.google.' + rez[2] + '/?ll=' + ( rez[9] ? rez[9] + '&z=' + Math.floor(  rez[10]  ) + ( rez[12] ? rez[12].replace(/^\//, "&") : '' )  : rez[12] ) + '&output=' + ( rez[12] && rez[12].indexOf('layer=c') > 0 ? 'svembed' : 'embed' );
			}
		},
		{
			'name' : 'Gmap Search',
			'website' : 'https://www.google.com/maps',
			'url-match' : '(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)',
			'embed-src' : function (rez) {
				return '//maps.google.' + rez[2] + '/maps?q=' + rez[5].replace('query=', 'q=').replace('api=1', '') + '&output=embed';
			},
			'embed-width' : '420',
			'embed-height' : '339',
			'iframe-player' : function (rez) {
				return '//maps.google.' + rez[2] + '/maps?q=' + rez[5].replace('query=', 'q=').replace('api=1', '') + '&output=embed';
			}
		},
		{
			'name' : 'MetaCafe',
			'website' : 'http://www.metacafe.com',
			'url-match' : 'http://(?:www\.)?metacafe\.com/(?:watch|fplayer)/(\w{1,10})/',
			'embed-src' : 'http://www.metacafe.com/fplayer/$2/metacafe.swf',
			'embed-width' : '400',
			'embed-height' : '345',
		},
		{
			'name' : 'Vimeo',
			'website' : 'http://www.vimeo.com',
			'url-match' : '^https?://(?:www\.)?vimeo\.com/(?:[0-9a-z_-]+/)?(?:[0-9a-z_-]+/)?([0-9]{1,})$',
			'embed-src' : 'http://vimeo.com/moogaloop.swf?clip_id=$2&server=vimeo.com&fullscreen=1&show_title=1&show_byline=1&show_portrait=0&color=01AAEA',
			'embed-width' : '400',
			'embed-height' : '302',
			'iframe-player' : 'http://player.vimeo.com/video/$2',
			'image-src': window.location.protocol+ '//' + window.location.host + '/getVimeoThumb/$2',
			'amp-code':'<amp-vimeo data-videoid="$2" layout="responsive" width="500" height="281"></amp-vimeo>'
		},
		{
			'name' : '123video',
			'website' : 'http://www.123video.nl',
			'url-match' : 'http://(?:www\.)?123video\.nl/(?:playvideos\.asp\?(?:[^"]*?)?MovieID=|123video_share\.swf\?mediaSrc=)([0-9]{1,8})',
			'embed-src' : 'http://www.123video.nl/123video_share.swf?mediaSrc=$2',
			'embed-width' : '420',
			'embed-height' : '339',
		},
		{
			'name' : '5min Life Videopedia',
			'website' : 'http://www.5min.com',
			'url-match' : 'http://(?:www\.)?5min\.com/(?:Embeded/|Video/(?:[0-9a-z_-]*?)?-)([0-9]{8})',
			'embed-src' : 'http://www.5min.com/Embeded/$2/',
			'embed-width' : '425',
			'embed-height' : '355',
		},
		{
			'name' : 'AdultSwim',
			'website' : 'http://video.adultswim.com',
			'url-match' : 'http://video\.adultswim\.com/([0-9a-z-_]+)/',
			'embed-src' : 'http://i.adultswim.com/adultswim/video2/tools/swf/viralplayer.swf',
			'flashvars' : 'id=8a250ba12ed8cc2d012eed9639bc0134',
			'embed-width' : '425',
			'embed-height' : '350',
		},
		{
			'name' : 'AniBoom',
			'website' : 'http://www.aniboom.com',
			'url-match' : 'http://(?:www\.|api\.)?aniboom\.com/animation-video/([0-9]{1,10})',
			'embed-src' : 'http://api.aniboom.com/shapeshifterEmbed.swf?videoar=$2',
			'embed-width' : '594',
			'embed-height' : '334',
		},{
			'name' : 'AOL Video (Old)',
			'website' : 'http://video.aol.com',
			'url-match' : 'http://video\.aol\.com/video/([a-z0-9-_]+)/([a-z0-9:\.]+)',
			'embed-src' : 'http://media.mtvnservices.com/$4',
			'embed-width' : '415',
			'embed-height' : '347',
		},{
			'name' : 'Aparat',
			'website' : 'http://www.aparat.com',
			'url-match' : 'http://www.aparat.com/v/([A-z0-9-_]+)(?:/.*)?',
			'embed-src' : '',
			'embed-width' : '425',
			'embed-height' : '354',
			'iframe-player' : 'http://www.aparat.com/video/video/embed/videohash/$2/vt/frame/',
		},{
			'name' : 'Archive.org',
			'website' : 'http://www.archive.org',
			'url-match' : 'http://(?:www\.)?archive\.org/download/((?:[0-9a-z_-]*?)/(?:[0-9a-z_-]*?)\.flv)',
			'embed-src' : 'http://www.archive.org/flow/FlowPlayerLight.swf?config=%7Bembedded%3Atrue%2CshowFullScreenButton%3Atrue%2CshowMuteVolumeButton%3Atrue%2CshowMenu%3Atrue%2CautoBuffering%3Afalse%2CautoPlay%3Afalse%2CinitialScale%3A%27fit%27%2CmenuItems%3A%5Bfalse%2Cfalse%2Cfalse%2Cfalse%2Ctrue%2Ctrue%2Cfalse%5D%2CusePlayOverlay%3Afalse%2CshowPlayListButtons%3Atrue%2CplayList%3A%5B%7Burl%3A%27$2%27%7D%5D%2CcontrolBarGloss%3A%27high%27%2CshowVolumeSlider%3Atrue%2CbaseURL%3A%27http%3A%2F%2Fwww%2Earchive%2Eorg%2Fdownload%2F%27%2Cloop%3Afalse%2CcontrolBarBackgroundColor%3A%270x000000%27%7D',
			'embed-width' : '480',
			'embed-height' : '360',
		},{
			'name' : 'Atom',
			'website' : 'http://www.atom.com',
			'url-match' : 'http://(?:www\.)?atom\.com/funny_videos/([A-z0-9-_]*)/',
			'fetch-match' : '<embed src="([A-z:/\.0-9-_=]*)"',
			'embed-src' : '$2',
			'embed-width' : '425',
			'embed-height' : '354',
		},{
			'name' : 'Blastro',
			'website' : 'http://www.blastro.com',
			'url-match' : 'http://(?:www\.)?blastro\.com/player/([a-z0-9-_]*)\.html',
			'embed-src' : 'http://images.blastro.com/images/flashplayer/flvPlayer.swf?site=www.blastro.com&amp;filename=$2',
			'embed-width' : '512',
			'embed-height' : '408',
		},
		{
			'name' : 'BNQT',
			'website' : 'http://www.bnqt.com',
			'url-match' : 'http://(?:www\.)?bnqt\.com/videos/detail/([0-9A-Za-z-]+)/([0-9]{12})',
			'embed-src' : 'http://www.bnqt.com/bnqtPlayer/vid_$3',
			//'embed-src' : 'http://www.bnqt.com/public/shared/swf/bnqtPlayer.swf?pid=$3',
			'embed-width' : '480',
			'embed-height' : '294',
			'id' : '$3',
			'name' : '$2',
		},{
			'name' : 'BoFunk',
			'website' : 'http://www.bofunk.com',
			'url-match' : 'http://(?:www\.)?bofunk\.com/video/[0-9]{2,7}/',
			'fetch-match' : '<embed src="/[a-z]/([a-z:/\.0-9-_=?%]*)"',
			'embed-src' : 'http://www.bofunk.com/e/$2',
			'embed-width' : '446',
			'embed-height' : '370',
		},{
			'name' : 'Break',
			'website' : 'http://www.break.com/',
			'url-match' : 'http://(?:www\.)?break\.com/(?:index|usercontent)/',
			'fetch-match' : 'http://embed\.break\.com/([0-9a-z]{1,8})',
			'embed-src' : '$1',
			'embed-width' : '464',
			'embed-height' : '383',
		},{
			'name' : 'Brightcove.com',
			'website' : 'http://link.brightcove.com',
			'url-match' : 'http://link\.brightcove\.com/services/link/bcpid([0-9]+)/bctid([0-9]+)',
			'embed-src' : 'http://services.brightcove.com/services/viewer/federated_f8/$2?videoId=$3&playerId=$2&viewerSecureGatewayURL=https://console.brightcove.com/services/amfgateway&servicesURL=http://services.brightcove.com/services&cdnURL=http://admin.brightcove.com&domain=embed&autoStart=false&',
			'embed-width' : '486',
			'embed-height' : '412',
		},{
			'name' : 'Blip',
			'website' : 'http://www.blip.tv',
			'url-match' : 'http://blip\.tv/[a-z0-9-]+/[a-z0-9-]+-',
			'fetch-match' : 'http://blip\.tv/(play|file)/([a-z0-9]+)',
			'embed-src' : '',
			'embed-width' : '500',
			'embed-height' : '315',
			'iframe-player' : 'http://blip.tv/play/$3.x?p=1',
		},{
			'name' : 'CBS News',
			'website' : 'http://www.cbsnews.com/video',
			'url-match' : 'http://(?:www\.)?cbsnews\.com/video/watch/',
			'fetch-match' : 'CBSVideo\.setVideoId\(.([a-z0-9-_]{1,32}).\)',
			'embed-src' : 'http://cnettv.cnet.com/av/video/cbsnews/atlantis2/player-dest.swf',
			'embed-width' : '425',
			'embed-height' : '324',
			'flashvars' : 'tag=contentBody;housing&releaseURL=http://cnettv.cnet.com/av/video/cbsnews/atlantis2/player-dest.swf&videoId=$2&partner=news&vert=News&autoPlayVid=false&name=cbsPlayer&allowScriptAccess=always&wmode=transparent&embedded=y&scale=noscale&rv=n&salign=tl',
		},{
			'name' : 'Cellfish',
			'website' : 'http://www.cellfish.com',
			'url-match' : 'http://(cellfish\.|www\.)?cellfish\.com/(?:video|ringtone|multimedia)/([0-9]{1,10})/',
			'embed-src' : 'http://$2cellfish.com/static/swf/player8.swf?Id=$3',
			'embed-width' : '420',
			'embed-height' : '315',
		},{
			'name' : 'Clarin',
			'website' : 'http://www.videos.clarin.com',
			'url-match' : 'http://(?:www\.)videos\.clarin\.com/index\.html\?id=([0-9]{1,12})',
			'embed-src' : 'http://www.clarin.com/shared/v9/swf/clarinvideos/player.swf',
			'embed-width' : '533',
			'embed-height' : '438',
			'flashvars' : 'autoplay=false&amp;SEARCH=http://www.videos.clarin.com/decoder/buscador_getMtmYRelacionados/$2|CLARIN_VIDEOS|VIDEO|EMBEDDED|10|1|10|null.xml&amp;RUTAS=http://www.clarin.com/shared/v9/swf/clarinvideos/rutas.xml',
		},{
			'name' : 'Clip.vn',
			'website' : 'http://www.clip.vn',
			'url-match' : /clip\.vn\/w(?:atch\/(?:[a-z0-9-_]*?))?\/([a-z0-9_-]{1,5})vn/g,
			'embed-src' : 'http://www.clip.vn/w/$2,vn,0,,hq',
			'embed-width' : '448',
			'embed-height' : '361',
		},{
			'slug' : 'clipfish-old',
			'name' : 'ClipFish (Old)',
			'website' : 'http://www.clipfish.de',
			'url-match' : 'http://(?:www\.)?clipfish\.de/(?:(?:player\.php|videoplayer\.swf)\?(?:[^"]*?)?vid=|video/)([0-9]{1,20})',
			'embed-src' : 'http://www.clipfish.de/videoplayer.swf?as=0&vid=$2&r=1',
			'embed-width' : '464',
			'embed-height' : '380',
			'iframe-player' : 'http://www.clipfish.de/embed_video/?vid=$2',
		},{
			'slug' : 'clipfish-special',
			'name' : 'ClipFish (Special)',
			'website' : 'http://www.clipfish.de',
			'url-match' : 'http://(?:www\.)?clipfish\.de/(?:[^"]*?)/video/((?:[a-z0-9]{18})(?:==)?|(?:[a-z0-9]{6,7})(?:==)?)',
			'embed-src' : 'http://www.clipfish.de/videoplayer.swf?as=0&videoid=$2%3D%3D&r=1',
			'embed-width' : '464',
			'embed-height' : '380',
			'iframe-player' : 'http://www.clipfish.de/embed_video/?vid=$2',
		},{
			'slug' : 'clipfish',
			'name' : 'ClipFish (New)',
			'website' : 'http://www.clipfish.de',
			'url-match' : 'http://(?:www\.)?clipfish\.de/(?:video)?player\.(?:swf|php)(?:[^"]*?)videoid=((?:[a-z0-9]{18})(?:==)?|(?:[a-z0-9]{6})(?:==)?)',
			'embed-src' : 'http://www.clipfish.de/videoplayer.swf?as=0&videoid=$2%3D%3D&r=1',
			'embed-width' : '464',
			'embed-height' : '380',
			'iframe-player' : 'http://www.clipfish.de/embed_video/?vid=$2',
		},{
			'name' : 'ClipJunkie',
			'website' : 'http://www.clipjunkie.com',
			'url-match' : 'http://(?:www\.)?clipjunkie\.com/((?:[^"]*?)-vid(?:[0-9]{1,10}))\.html',
			'embed-src' : 'http://www.clipjunkie.com/flvplayer/flvplayer.swf?flv=http://videos.clipjunkie.com/videos/$2.flv&themes=http://www.clipjunkie.com/flvplayer/themes.xml&playList=http://www.clipjunkie.com/playlist.php&config=http://www.clipjunkie.com/skin/config.xml',
			'embed-width' : '460',
			'embed-height' : '357',
		},{
			'name' : 'ClipMoon',
			'website' : 'http://www.clipmoon.com',
			'url-match' : 'http://(?:www\.)?clipmoon\.com/(?:videos/|(?:[^"]*?)viewkey=)([0-9a-z]{1,10})',
			'embed-src' : 'http://www.clipmoon.com/flvplayer.swf?config=http://www.clipmoon.com/flvplayer.php?viewkey=$2&external=yes',
			'embed-width' : '460',
			'embed-height' : '357',
			//'flashVars' : 'autostart=false',
		},{
			'name' : 'ClipShack',
			'website' : 'http://www.clipshack.com',
			'url-match' : 'http://(?:www\.)?clipshack\.com/Clip\.aspx\?key=([0-9a-f]{16})',
			'embed-src' : 'http://www.clipshack.com/player.swf?key=$2',
			'embed-width' : '430',
			'embed-height' : '370',
		},{
			'name' : 'CNetTV',
			'website' : 'http://cnettv.cnet.com',
			'url-match' : 'http://cnettv\.cnet\.com/[a-z0-9\-]*\/[0-9]{4}-[0-9]_[0-9]{2}-([0-9]{5,9})\.html',
			'embed-src' : 'http://www.cnet.com/av/video/flv/universalPlayer/universalSmall.swf',
			'embed-width' : '364',
			'embed-height' : '280',
			'flashvars' : 'playerType=embedded&type=id&value=$2',
		},{
			'name' : 'CollegeHumor',
			'website' : 'http://www.collegehumour.com',
			'name' : 'CollegeHumor',
			'url-match' : 'http://(?:www\.)?collegehumor\.com/video:([0-9]{1,12})',
			'embed-src' : 'http://www.collegehumor.com/moogaloop/moogaloop.swf?clip_id=$2',
			'embed-width' : '480',
			'embed-height' : '360',
		},{
			'name' : 'TheDailyShow',
			'website' : 'http://www.thedailyshow.com',
			'url-match' : 'http://(?:www\.)?thedailyshow\.com/(?:watch|full\-episodes)',
			'fetch-match' : 'swfo.embedSWF\(.*(http://media.mtvnservices.com/mgid:cms:(video|fullepisode):comedycentral\.com:[0-9]{1,10})',
			'embed-src' : '$2',
			'embed-width' : '360',
			'embed-height' : '301',
		},{
			'name' : 'ColbertNation',
			'website' : 'http://www.colbertnation.com',
			'url-match' : 'http:\/\/(?:www\.)?colbertnation\.com\/the-colbert-report-videos\/([0-9]*)\/',
			'embed-src' : 'http://media.mtvnservices.com/mgid:cms:item:comedycentral.com:$2',
			'embed-width' : '360',
			'embed-height' : '301',
		},{
			'name' : 'Crackle',
			'website' : 'http://www.crackle.com',
			'url-match' : 'http://(?:www\.)?crackle\.com/c/([a-z0-9_-]*?)/([a-z0-9_-]*?)/([0-9]{1,10})',
			'embed-src' : 'http://www.crackle.com/p/$2/$3.swf?id=$4',
			'embed-width' : '400',
			'embed-height' : '328',
		},{
			'name' : 'CrunchyRoll',
			'website' : 'http://www.crunchyroll.com',
			'url-match' : '^http://(?:www\.)?crunchyroll\.com/[a-z0-9\-_]+/[a-z0-9\-_]+-([0-9]{1,12})$',
			'embed-src' : ' http://www.crunchyroll.com/flash/20080910153703.043ec803b06cc356a1e15c1184831a24/oldplayer2.swf?file=http%3A%2F%2Fwww.crunchyroll.com%2Fgetitem%3Fih%3D$2%26videoid%3D$3%26mediaid%3D$4%26hash%3D$5&autostart=false',
			'embed-width' : '576',
			'embed-height' : '325',
		},{
			'name' : 'Current',
			'website' : 'http://www.current.com',
			'url-match' : 'http://(?:www\.)?current\.com/items/([0-9]{8})',
			'embed-src' : 'http://current.com/e/$2/en_US',
			'embed-width' : '400',
			'embed-height' : '400',
		},{
			'name' : 'Dailyhaha',
			'website' : 'http://www.dailyhaha.com',
			'url-match' : 'http://(?:www\.)?dailyhaha\.com/_vids/(?:Whohah\.swf\?Vid=)?([a-z0-9_-]*?)\.(?:htm|flv)',
			'embed-src' : 'http://www.dailyhaha.com/_vids/Whohah.swf?Vid=$2.flv',
			'embed-width' : '425',
			'embed-height' : '350',
		},{
			'name' : 'Dave.tv',
			'website' : 'http://www.dave.tv',
			'url-match' : 'http://(?:www\.)?dave\.tv/MediaPlayer.aspx\?(?:[^"]*?)?contentItemId=([0-9]{1,10})',
			'embed-src' : 'http://dave.tv/dbox/dbox_small.swf?configURI=http://dave.tv/dbox/config.ashx&volume=50&channelContentId=$2',
			'embed-width' : '300',
			'embed-height' : '260',
		},{
			'name' : 'DotSub (w/o Captions)',
			'website' : 'http://www.dotsub.com',
			'url-match' : 'http://(?:www\.)?dotsub\.com/(?:media/|view/)((?:[0-9a-z]{8})(?:(?:-(?:[0-9a-z]{4})){3})-(?:[0-9a-z]{12}))',
			'embed-src' : 'http://dotsub.com/static/players/embed8l.swf?mediauri=http://dotsub.com/media/$2/em/flv/en',
			'embed-width' : '480',
			'embed-height' : '392',
		},{
			'name' : 'DoubleViking',
			'website' : 'http://www.doubleviking.com',
			'url-match' : 'http://(?:www\.)?doubleviking\.com/videos/page[0-9]\.html/[a-z\-]*[0-9]{1,8}\.html',
			'embed-src' : 'http://www.doubleviking.com/mediaplayer.swf?file=$2',
			'embed-width' : '400',
			'embed-height' : '340',
		},{
			'name' : 'Dropshots',
			'website' : 'http://www.dropshots.com',
			'name' : 'dropshots.com',
			'url-match' : '(http://media(?:[0-9]{0,2})\.dropshots\.com/photos(?:(?:/(?:[0-9]{1,10})){1,3})\.flv)',
			'embed-src' : 'http://www.dropshots.com/dropshotsplayer.swf?url=$2',
			'embed-width' : '480',
			'embed-height' : '385',
		},{
			'name' : 'Dv.ouou',
			'website' : 'http://dv.ouou.com',
			'url-match' : 'http://dv\.ouou\.com/(?:play/v_|v/)([a-f0-9]{14})',
			'embed-src' : 'http://dv.ouou.com/v/$2',
			'embed-width' : '480',
			'embed-height' : '385',
		},{
			'name' : 'Divshare',
			'website' : 'http://www.divshare.com',
			'url-match' : 'http://www\.divshare\.com/download/([^"]*)',
			'embed-src' : 'http://www.divshare.com/flash/playlist?myId=$2',
			'embed-width' : '335',
			'embed-height' : '28',
		},{
			'name' : 'EASportsWorld',
			'website' : 'http://www.easportsworld.com',
			'url-match' : '(http://videocdn\.easw\.easports\.com/easportsworld/media/(?:[0-9]{1,12})/(?:[0-9a-z-_]*?)\.flv)',
			'embed-src' : 'http://ll-999.ea.com/sonet-easw/2.2.4.0/flash/sw/videos/mediaplayer.swf?file=$2&image=http://ll-999.ea.com/sonet-easw/2.2.4.0/images/sw/videos/preview.jpg&backcolor=0x000000&frontcolor=0x006BCC&lightcolor=0x006BCC',
			'embed-width' : '566',
			'embed-height' : '355',
		},{
			'name' : 'EbaumsWorld',
			'website' : 'http://www.ebaumsworld.com',
			'url-match' : 'http://www\.ebaumsworld\.com/(?:video|audio)/(?:watch|play)/([0-9]*)',
			//'fetch-match' : 'id="embed".*flashvars=&quot;(.*)&quot;\ wmode',
			'embed-src' : 'http://www.ebaumsworld.com/player.swf',
			'embed-width' : '567',
			'embed-height' : '345',
			'flashvars' : 'id1=$2',
		},{
			'name' : 'ESPN',
			'website' : 'http://www.espn.com',
			'url-match' : 'http:\/\/espn\.go\.com\/video\/clip\?id=([0-9a-z]*)',
			'embed-src' : 'http://espn.go.com/videohub/player/embed.swf',
			'embed-width' : '384',
			'embed-height' : '216',
			'flashvars' : 'id=$2',
		},{
			'name' : 'Fandome',
			'website' : 'http://www.fandome.com',
			'url-match' : 'http://[a-z]*\.fandome\.com/video/([0-9]{3,6})/[a-z0-9\-_]*/',
			'embed-src' : 'http://www.kaltura.com/index.php/kwidget/wid/_35168/uiconf_id/1070752',
			'embed-width' : '480',
			'embed-height' : '380',
			'flashvars' : 'entryId=http://s3.amazonaws.com/lazyjock/$2.flv&amp;autoplay=false',
		},{
			'name' : 'Flickr',
			'website' : 'http://www.flickr.com',
			'url-match' : 'http://(?:www\.|www2\.)?flickr\.com/photos/[A-Za-z0-9-_@]*/([0-9]{8,12})',
			'fetch-match' : 'id="stewart_swf([0-9]{8,12})_div"',
			'embed-src' : 'http://www.flickr.com/apps/video/stewart.swf',
			'embed-width' : '400',
			'embed-height' : '300',
			'flashvars' : 'intl_lang=en-us&amp;photo_id=$2',
		},{
			'name' : 'Foxhead',
			'website' : 'http://www.foxhead.com',
			'url-match' : 'http://(?:www\.)?foxhead\.com/(?:[^"]*?)/videos/id/([0-9]{4,8})',
			'embed-src' : 'http://www.foxhead.com/videos/player.swf',
			'embed-width' : '425',
			'embed-height' : '285',
			'flashvars' : 'id=$2',
			'id' : '$2',
		},{
			'name' : 'FunnyOrDie',
			'website' : 'http://www.funnyordie.com',
			'url-match' : 'http://(?:www\.|www2\.)?funnyordie\.com/(?:videos/|public/flash/fodplayer\.swf\?key=)([0-9a-z]{8,12})',
			'embed-src' : 'http://player.ordienetworks.com/flash/fodplayer.swf',
			'embed-width' : '464',
			'embed-height' : '388',
			'flashvars' : 'key=$2',
		},{
			'name' : 'FunMansion',
			'website' : 'http://www.funmansion.com',
			'url-match' : 'http://www\.funmansion\.com/videos/[a-z0-9-_]*\.html',
			'fetch-match' : '<iframe src="http://media\.funmansion\.com/funmansion/player/player\.php\?url=([a-z0-9:/\.-_]*\.flv)',
			'embed-src' : 'http://media.funmansion.com/funmansion/player/flvplayer.swf?flv=$2',
			'embed-width' : '446',
			'embed-height' : '350',
		},{
			'name' : 'G4TV',
			'website' : 'http://www.g4tv.com',
			'url-match' : 'http://(?:www\.)?g4tv\.com/(?:xplay/videos/|lv3/|sv3/)([0-9]{1,10})',
			'embed-src' : 'http://www.g4tv.com/lv3/$2',
			'embed-width' : '480',
			'embed-height' : '418',
		},{
			'name' : 'GameKyo',
			'website' : 'http://www.gamekyo.com',
			'url-match' : 'http://(?:www\.)?gamekyo\.com/(?:video|flash/flvplayer\.swf\?videoid=)[a-z]{2}([0-9]{1,7})',
			'embed-src' : 'http://www.gamekyo.com/flash/flvplayer.swf?videoid=$2',
			'embed-width' : '512',
			'embed-height' : '307',
		},{
			'name' : 'GameSpot',
			'website' : 'http://www.gamespot.com',
			'url-match' : 'http://(?:(?:[a-z]*?)\.)?gamespot\.com/(?:[^"]*?)video/(?:(?:[0-9]{1,12})/)?([0-9]{1,12})',
			'embed-src' : 'http://image.com.com/gamespot/images/cne_flash/production/media_player/proteus/one/proteus2.swf',
			'embed-width' : '432',
			'embed-height' : '362',
			'flashvars' : 'skin=http://image.com.com/gamespot/images/cne_flash/production/media_player/proteus/one/skins/gamespot.png&paramsURI=http%3A%2F%2Fwww.gamespot.com%2Fpages%2Fvideo_player%2Fxml.php%3Fid%3D$2%26mode%3Dembedded%26width%3D432%26height%3D362%2F',
		},{
			'name' : 'GameTrailers (Inc. User Movies)',
			'website' : 'http://www.gametrailers.com',
			'url-match' : 'http://(?:www\.)?gametrailers\.com/(?:player/(u)?(?:sermovies/)?|remote_wrap\.php\?(u)?mid=)([0-9]{1,10})',
			'embed-src' : 'http://www.gametrailers.com/remote_wrap.php?$2$3mid=$4', //Either $2 or $3 will be empty
			'embed-width' : '480',
			'embed-height' : '392',
		},{
			'name' : 'GameTube',
			'website' : 'http://www.gametube.org',
			'name' : 'Gametube.org',
			'url-match' : 'http://(?:www\.)?gametube\.org/(?:\///video/|htmlVideo\.jsp\?id=|miniPlayer\.swf\?vidId=)([A-z0-9=_-]{28})',
			'embed-src' : 'http://www.gametube.org/miniPlayer.swf?vidId=$2',
			'embed-width' : '425',
			'embed-height' : '335',
		},{
			'name' : 'GameVideos.1up',
			'website' : 'http://www.gamevideos.1up.com',
			'url-match' : 'http://(?:www\.)?gamevideos(?:\.1up)?\.com/(?:video/id/|video/embed\?(?:[^"]*?)?video=)([0-9]{1,8})',
			'embed-src' : 'http://gamevideos.1up.com/swf/gamevideos11.swf?embedded=1&fullscreen=1&autoplay=0&src=http://gamevideos.1up.com/video/videoListXML%3Fid%3D$2%26adPlay%3Dfalse',
			'embed-width' : '500',
			'embed-height' : '319',
		},{
			'name' : 'GarageTv',
			'website' : 'http://www.garagetv.be',
			'url-match' : '(http://www\.garagetv\.be/v/(?:[0-9a-z-\!_]*?)/v\.aspx)',
			'embed-src' : '$2',
			'embed-width' : '430',
			'embed-height' : '369',
		},{
			'name' : 'Gloria',
			'website' : 'http://www.gloria.tv',
			'url-match' : 'http://(?:www\.)?gloria\.tv/\?video=([a-z0-9]{20})',
			'embed-src' : 'http://www.gloria.tv/flvplayer.swf?file=http%3A%2F%2Fwww.gloria.tv%2F%3Fembed%26video%3D$2%26width%3D512%26height%3D288&type=flv&image=http%3A%2F%2Fwww.gloria.tv%2F%3Fembed%26image%3D$2%26width%3D512%26height%3D288&autostart=false&showdigits=true&usefullscreen=false&logo=http%3A%2F%2Fwww.gloria.tv%2Fimage%2Flogo_embed.png&link=http%3A%2F%2Fwww.gloria.tv%2F%3Fvideo%3Dddexrl6eelym3gaabxmz%26amp%3Bview%3Dflash&linktarget=_blank&volume=100&backcolor=0xe0e0e0&frontcolor=0x000000&lightcolor=0xf00000',
			'embed-width' : '512',
			'embed-height' : '404',
		},{
			'name' : 'GoEar',
			'website' : 'http://www.goear.com',
			'url-match' : 'http://(?:www\.)?goear\.com/listen\.php\?v=([a-z0-9]{7})',
			'embed-src' : 'http://www.goear.com/files/external.swf?file=$2',
			'embed-width' : '353',
			'embed-height' : '132',
		},{
			'name' : 'Good.IS',
			'website' : 'http://www.good.is',
			'url-match' : 'http://www\.good\.is/\?p=([0-9]{3,7})',
			'fetch-match' : '(http:\/\/s3\.amazonaws\.com\/.*Url=http:\/\/www\.good\.is\/\?p=[0-9]{3,7})&quot;\/&gt;&lt;embed src=&',
			'embed-src' : '$2',
			'embed-width' : '416',
			'embed-height' : '264',
			'flashvars' : '$2',
		},{
			'name' : 'Glumbert',
			'website' : 'http://www.glumbert.com',
			'url-match' : 'http://(?:www\.)?glumbert\.com/(?:embed|media)/([a-z0-9_-]{1,30})',
			'embed-src' : 'http://www.glumbert.com/embed/$2',
			'embed-width' : '425',
			'embed-height' : '335',
		},{
			'name' : 'GodTube',
			'website' : 'http://www.godtube.com',
			'url-match' : 'http://(?:www\.)?godtube\.com/view_video\.php\?(?:[^"]*?)?viewkey=([0-9a-f]{20})',
			'embed-src' : 'http://godtube.com/flvplayer.swf?viewkey=$2',
			'embed-width' : '330',
			'embed-height' : '270',
		},{
			'name' : 'GrindTv',
			'website' : 'http://www.grindtv.com',
			'url-match' : '(http://(?:www\.)?grindtv\.com/video/(.*)/(?:[^"]*?)i=(?:[0-9]{1,12}))',
			'embed-src' : 'http://images.grindtv.com/1.0.2/swf/video.swf?sa=1&si=1&i=$3&sct=$2',
			'embed-width' : '640',
			'embed-height' : '480',
		},{
			'name' : 'Guzer',
			'website' : 'http://www.guzer.com',
			'url-match' : 'http://(?:www\.)?guzer\.com/videos/(.*).php',
			'embed-src' : 'http://www.guzer.com/player/mediaplayer.swf',
			'embed-width' : '486',
			'embed-height' : '382',
			'flashvars' : 'height=382&amp;width=486&amp;file=http://media.guzer.com/videos/$2.flv&amp;image=http://www.guzer.com/videos/s$2.jpg',
		},{
			'name' : 'TheHub',
			'website' : 'http://hub.witness.org',
			'url-match' : 'http://hub\.witness\.org/(?:en|fr|es)/node/([0-9]{1,10})',
			'embed-src' : 'http://hub.witness.org/sites/hub.witness.org/modules/contrib-5/flvmediaplayer/mediaplayer.swf?file=http://hub.witness.org/xspf/node/$2&overstretch=fit&repeat=false&logo=http://hub.witness.org/sites/hub.witness.org/themes/witness/images/hub_wm.png',
			'embed-width' : '320',
			'embed-height' : '260',
		},{
			'name' : 'Howcast',
			'website' : 'http://www.howcast.com',
			'url-match' : 'http://(?:www\.)?howcast\.com/videos/([0-9]{1,8})',
			'embed-src' : 'http://www.howcast.com/flash/howcast_player.swf?file=$2&theme=black',
			'embed-width' : '432',
			'embed-height' : '276',
		},{
			'name' : 'Hulu (Usa Only)',
			'website' : 'http://www.hulu.com',
			'url-match' : 'http://(?:www\.)?hulu\.com/watch/(?:[0-9]{1,8})/',
			'fetch-match' : '<link rel="video_src" href="([A-z:/\.0-9-_=?]*)',
			'embed-src' : '$2',
			'embed-width' : '512',
			'embed-height' : '296',
		},{
			'name' : 'Humour',
			'website' : 'http://www.humour.com',
			'url-match' : 'http://(?:video|www)\.humour\.com/videos-comiques/videos.asp\?[A-z]*\=([1-9]{1,8})',
			'embed-src' : '/videos-comiques/player/mediaplayer.swf',
			'embed-width' : '425',
			'embed-height' : '355',
		},{
			'name' : 'Video.i.ua',
			'website' : 'http://video.i.ua',
			'url-match' : '(http://i1\.i\.ua/video/vp3\.swf\?9&(?:amp;)?userID=(?:[0-9]{1,20})&(?:amp;)?videoID=(?:[0-9]{1,20})&(?:amp;)?playTime=(?:[0-9]{1,20})&(?:amp;)?repeat=0&(?:amp;)?autostart=0&(?:amp;)?videoSize=(?:[0-9]{1,20})&(?:amp;)?userStatus=(?:[0-9]{1,2})&(?:amp;)?notPreview=(?:[0-9]{1,2})&(?:amp;)?mID=m?(?:[0-9]{1,2}))',
			'embed-src' : '$2',
			'embed-width' : '450',
			'embed-height' : '349',
		},{
			'name' : 'IGN',
			'website' : 'http://www.ign.com',
			'url-match' : 'http://(?:(?:(?:[a-z0-9]*?)\.){0,3})ign\.com/(?:[a-z0-9-_]*?)?/objects/([0-9]{1,10})/(?:(?:[a-z0-9-_]*?)/)?videos/',
			'embed-src' : 'http://videomedia.ign.com/ev/ev.swf?object_ID=$2',
			'embed-width' : '433',
			'embed-height' : '360',
		},{
			'name' : 'iJigg',
			'website' : 'http://www.ijigg.com',
			'url-match' : 'http://(?:www\.)?ijigg\.com/(?:jiggPlayer\.swf\?songID=|songs/|trackback/)([0-9A-Z]{9,12})',
			'embed-src' : 'http://www.ijigg.com/jiggPlayer.swf?songID=$2&Autoplay=0',
			'embed-width' : '315',
			'embed-height' : '80',
		},{
			'name' : 'IMDB',
			'website' : 'http://www.imdb.com',
			'url-match' : 'http://(?:www\.)?totaleclips\.com/Player/Bounce\.aspx\?eclipid=([0-9a-z]{1,12})&(?:amp;)?bitrateid=([0-9]{1,10})&(?:amp;)?vendorid=([0-9]{1,10})&(?:amp;)?type=\.flv',
			'embed-src' : 'http://www.imdb.com/images/js/app/video/mediaplayer.swf?file=http%3A%2F%2Fwww.totaleclips.com%2FPlayer%2FBounce.aspx%3Feclipid%3D$2%26bitrateid%3D$3%26vendorid%3D$4%26type%3D.flv&backcolor=0x000000&frontcolor=0xCCCCCC&lightcolor=0xFFFFCC&shuffle=false&autostart=false',
			'embed-width' : '480',
			'embed-height' : '380',
		},{
			'name' : 'ImageShack',
			'website' : 'http://www.imageshack.us',
			'url-match' : 'http://img([0-9]{1,5})\.imageshack\.us/img[0-9]{1,5}/[0-9]{1,7}/([a-z0-9-_]{1,28})\.(?:flv|swf)',
			'embed-src' : 'http://img$2.imageshack.us/flvplayer.swf?f=T$3&autostart=false',
			'embed-width' : '424',
			'embed-height' : '338',
		},{
			'name' : 'IndyaRocks',
			'website' : 'http://www.indyarocks.com',
			'url-match' : 'http://(?:www\.)?indyarocks\.com/videos/(?:(?:(?:(?:[^-"]*?)-){1,10})|embed-)([0-9]{1,8})',
			'embed-src' : 'http://www.indyarocks.com/videos/embed-$2',
			'embed-width' : '425',
			'embed-height' : '350',
		},{
			'name' : 'iReport',
			'website' : 'http://www.ireport.com',
			'url-match' : 'http://www\.ireport\.com/docs/DOC-([0-9]{4,8})',
			'embed-src' : 'http://www.ireport.com/themes/custom/resources/cvplayer/ireport_embed.swf?player=embed&configPath=http://www.ireport.com&playlistId=$2&contentId=$2/0&',
			'embed-width' : '400',
			'embed-height' : '300',
		},{
			'name' : 'Izlesene',
			'website' : 'http://www.izlesene.com',
			'url-match' : 'http://(?:www\.)?izlesene\.com/(?:player2\.swf\?video=|video/(?:[a-z0-9-_]*?)/)([0-9]{1,10})',
			'embed-src' : 'http://www.izlesene.com/player2.swf?video=$2',
			'embed-width' : '425',
			'embed-height' : '355',
		},{
			'name' : 'Jamendo',
			'website' : 'http://www.jamendo.com',
			'url-match' : /(?:www\.|widgets\.)?jamendo\.com\/(?:[a-z0-9]*?)\/album\/(?:\?album_id=)?([0-9]{1,10})/g,
			'embed-src' : 'http://widgets.jamendo.com/en/album/?album_id=$2&playertype=2008',
			'embed-width' : '200',
			'embed-height' : '300',
		},{
			'name' : 'Jokeroo',
			'website' : 'http://www.jokeroo.com',
			'url-match' : 'http://(?:www\.)?jokeroo\.com/(auto|educational|financial|health|howto|lawyers|politics|travel|extremesports|funnyvideos)/((?:(?:[0-9a-z]*?)/){0,3})?([0-9a-z_]*?)\.htm',
			'embed-src' : 'http://www.jokeroo.com/promotional_player2.swf?channel&vid=http://uploads.filecabin.com/flash/$4.flv&vid_url=http://www.jokeroo.com/$2/$3$4.html&adv_url',
			'embed-width' : '490',
			'embed-height' : '425',
		},{
			'name' : 'JujuNation Video',
			'website' : 'http://www.jujunation.com',
			'url-match' : 'http://(?:www\.)?jujunation.com/viewVideo\.php\?video_id=([0-9]{1,10})',
			'embed-src' : 'http://www.jujunation.com/flvplayer.swf?config=http://www.jujunation.com/videoConfigXmlCode.php?pg=video_$2_no_0',
			'embed-width' : '450',
			'embed-height' : '370',
		},{
			'name' : 'JujuNation Audio',
			'website' : 'http://www.jujunation.com',
			'url-match' : 'http://(?:www\.)?jujunation.com/music\.php\?music_id=([0-9]{1,10})',
			'embed-src' : 'http://www.jujunation.com/player.swf?configXmlPath=http://www.jujunation.com/musicConfigXmlCode.php?pg=music_$2&playListXmlPath=http://www.jujunation.com/musicPlaylistXmlCode.php?pg=music_$2',
			'embed-width' : '220',
			'embed-height' : '66',
		},{
			'name' : 'JustinTV',
			'website' : 'http://www.justin.tv',
			'url-match' : 'http://(?:\w{0,3}\.)?justin\.tv/(\w*)',
			'embed-src' : 'http://www.justin.tv/widgets/jtv_player.swf?channel=$2&auto_play=false',
			'embed-width' : '353',
			'embed-height' : '295',
		},{
			'name' : 'Kewego',
			'website' : 'http://www.kewego.co.uk',
			'url-match' : 'http://(?:www\.)?kewego(?:\.co\.uk|\.com)/video/([0-9a-z]*)\.html',
			'embed-src' : 'http://www.kewego.com/swf/p3/epix.swf',
			'embed-width' : '400',
			'embed-height' : '300',
			'flashvars' : 'language_code=en&playerKey=$2&skinKey=71703ed5cea1&sig=iLyROoaftv7I&autostart=false',
		},{
			'name' : 'Koreus',
			'website' : 'http://www.koreus.com',
			'url-match' : 'http://(?:www\.)?koreus\.com/video/([0-9a-z-]{1,50})(?:\.html)?',
			'embed-src' : 'http://www.koreus.com/video/$2',
			'embed-width' : '400',
			'embed-height' : '320',
		},{
			'name' : 'Last.fm (Audio)',
			'website' : 'http://www.last.fm',
			'url-match' : 'http://(?:www\.)?last\.fm/music/([0-9a-z%\+_-]*?)/_/([0-9\+a-z_-]*)',
			'embed-src' : 'http://cdn.last.fm/webclient/s12n/s/53/lfmPlayer.swf',
			'embed-width' : '300',
			'embed-height' : '221',
			'flashvars' : 'lang=en&amp;lfmMode=playlist&amp;FOD=true&amp;resname=$3&amp;restype=track&amp;artist=$2',
		},{
			'name' : 'Last.fm (Video)',
			'website' : 'http://www.last.fm',
			'url-match' : 'http://(?:www\.)?last\.fm/music/([0-9a-zA-Z%\+_-]*?)/\+videos/([0-9\+a-z_-]{2,20})',
			'embed-src' : 'http://cdn.last.fm/videoplayer/l/17/VideoPlayer.swf',
			'embed-width' : '340',
			'embed-height' : '289',
			'flashvars' : 'uniqueName=$3&amp;FSSupport=true&amp;',
		},{
			'name' : 'Libero',
			'website' : 'http://www.libero.it',
			'url-match' : 'http://video\.libero\.it/app/play(?:/index.html)?\?(?:[^"]*?)?id=([a-f0-9]{32})',
			'embed-src' : 'http://video.libero.it/static/swf/eltvplayer.swf?id=$2.flv&ap=0',
			'embed-width' : '400',
			'embed-height' : '333',
		},{
			'name' : 'LiveLeak',
			'website' : 'http://www.liveleak.com',
			'url-match' : 'http://(?:www\.)?liveleak\.com/(?:player.swf?autostart=false&(?:amp;)?token=|view\?(?:[^"]*?)?i=|e/)((?:[0-9a-z]{3})_(?:[a-z0-9]{10}))',
			'embed-src' : 'http://www.liveleak.com/e/$2',
			'embed-width' : '450',
			'embed-height' : '370',
		},{
			'name' : 'LiveVideo',
			'website' : 'http://www.livevideo.com',
			'url-match' : 'http://(?:www\.)?livevideo\.com/(?:flvplayer/embed/|video/(?:view/)?(?:(?:[^"]*?)?/)?)([0-9a-f]{32})',
			'embed-src' : 'http://www.livevideo.com/flvplayer/embed/$2',
			'embed-width' : '445',
			'embed-height' : '369',
		},
		/*
		// no videos
		[
			'name' : 'Machinima (Old)',
			'website' : 'http://www.machinima.com',
			'url-match' : 'http://(?:www\.)?machinima\.com/(?:film/view&(?:amp;)?id=|//details_)([0-9]{1,8})(?:_contents)?',
			'embed-src' : 'http://www.machinima.com/_flash_media_player/mediaplayer.swf?file=http://machinima.com/p/$2',
			'embed-width' : '400',
			'embed-height' : '300',
		},{
			'name' : 'Machinima (New)',
			'website' : 'http://www.machinima.com',
			'url-match' : 'http://(?:www\.)?machinima\.com:80/f/([0-9a-f]{32})',
			'embed-src' : 'http://machinima.com:80/_flash_media_player/mediaplayer.swf?file=http://machinima.com:80/f/$2',
			'embed-width' : '400',
			'embed-height' : '300',
		},
		*/
		{
			'name' : 'MSNBC',
			'website' : 'http://www.msnbc.msn.com/',
			'url-match' : 'http://www\.msnbc\.msn\.com/id/(?:[0-9]{1,9})/vp/([0-9]{1,9})',
			'embed-src' : 'http://msnbcmedia.msn.com/i/MSNBC/Components/Video/_Player/swfs/embedPlayer/EmbeddedPlayer_I4.swf?domain=www.msnbc.msn.com&amp;settings=22425448&amp;useProxy=true&amp;wbDomain=www.msnbc.msn.com&amp;launch=$2&amp;sw=1920&amp;sh=1200&amp;EID=oVPEFC&amp;playerid=22425001',
			'embed-width' : '425',
			'embed-height' : '339',
		},{
			'name' : 'Video.mail.ru',
			'website' : 'http://video.mail.ru',
			'url-match' : 'http://video\.mail\.ru/mail/([0-9a-z_-]*?)/([0-9]{1,4})/([0-9]{1,4})\.html',
			'embed-src' : 'http://img.mail.ru/r/video2/player_v2.swf?par=http://content.video.mail.ru/mail/$2/$3/\$$4&page=1&username=$2&albumid=$3&id=$4',
			'embed-width' : '452',
			'embed-height' : '385',
		},{
			'name' : 'MadnessVideo',
			'website' : 'http://www.madnessvideo.net',
			'url-match' : 'http://(?:www\.)?madnessvideo\.net/(.*)',
			'embed-src' : 'http://www.madnessvideo.net/emb.aspx/$2',
			'embed-width' : '400',
			'embed-height' : '320',
		},{
			'name' : 'Metatube',
			'website' : 'http://www.metatube.com',
			'url-match' : 'http://www\.metatube\.com/([a-z]+)/videos/([a-z0-9-/]+)/',
			'embed-src' : '',
			'embed-width' : '420',
			'embed-height' : '315',
			'iframe-player' : 'http://www.metatube.com/$2/videos/$3/embed/',
		},{
			'name' : 'MotionBox',
			'website' : 'http://www.motionbox.com',
			'url-match' : 'http://(?:www\.)?motionbox\.com/videos/([0-9a-f]{14})',
			'embed-src' : 'http://www.motionbox.com/external/hd_player/type%3Dsd%2Cvideo_uid%3D$2',
			'embed-width' : '416',
			'embed-height' : '312',
		},{
			'name' : 'Mpora',
			'website' : 'http://video.mpora.com',
			'url-match' : 'http://video\.mpora\.com/watch/(\w{9})',
			'embed-src' : 'http://video.mpora.com/ep/$2/',
			'embed-width' : '425',
			'embed-height' : '350',
		},{
			'name' : 'Mp3tube',
			'website' : 'http://www.mp3tube.net',
			'url-match' : '(http://(?:www\.)?mp3tube\.net\/play\.swf\?id=(?:[0-9a-f]{32}))',
			'embed-src' : '$2',
			'embed-width' : '260',
			'embed-height' : '60',
		},{
			'name' : 'MtvU (Usa Only)',
			'website' : 'http://www.mtvu.com',
			'url-match' : 'http://(?:www\.)?mtvu\.com/video/\?id=([0-9]{1,9})(?:[^"]*?)vid=([0-9]{1,9})',
			'embed-src' : 'http://media.mtvu.com/player/embed/AS3/site/',
			'embed-width' : '423',
			'embed-height' : '318',
			'flashvars' : 'CONFIG_URL=http://media.mtvu.com/player/embed/AS3/site/configuration.jhtml%3fid%3D$2%26vid%3D$3%26autoPlay%3Dfalse&amp;allowFullScreen=true',
		},{
			'name' : 'MP3 Audio',
			'website' : '',
			'url-match' : '(http://[^"\'\`\<\>\@\*\$]*?\.mp3)$',
			'embed-src' : 'http://www.google.com/reader/ui/3523697345-audio-player.swf',
			'embed-width' : '400',
			'embed-height' : '27',
			'flashvars' : 'audioUrl=$2',
		},{
			'name' : 'MyNet',
			'website' : 'http://video.eksenim.mynet.com/',
			'url-match' : 'http://video\.eksenim\.mynet\.com/(?:[0-9a-z_-]*?)/(?:[0-9a-z_-]*?)/([0-9]{1,12})/',
			'embed-src' : 'http://video.eksenim.mynet.com/flvplayers/vplayer9.swf?videolist=http://video.eksenim.mynet.com/batch/video_xml_embed.php?video_id=$2',
			'embed-width' : '400',
			'embed-height' : '334',
		},{
			'name' : 'MyShows.cn/SeeHaha.com',
			'website' : 'http://www.myshows.cn',
			'url-match' : '(http://www\.seehaha\.com/flash/player\.swf\?vidFileName=(?:[0-9]*?)\.flv)',
			'embed-src' : '$2',
			'embed-width' : '425',
			'embed-height' : '350',
		},{
			'name' : 'MySpaceTv',
			'website' : 'http://www.myspacetv.com',
			'url-match' : 'http://(?:vids\.myspace|myspacetv)\.com/index\.cfm\?(?:[^"]*?)?VideoID=([0-9]{1,10})',
			'embed-src' : 'http://mediaservices.myspace.com/services/media/embed.aspx/m=$2',
			'embed-width' : '425',
			'embed-height' : '360',
		},{
			'name' : 'MyVideo',
			'website' : 'http://www.myvideo.de',
			'url-match' : 'http://(?:www\.)?myvideo\.(at|be|ch|de|nl)/(?:watch|movie)/([0-9]{1,8})',
			'embed-src' : 'http://www.myvideo.$2/movie/$3',
			'embed-width' : '470',
			'embed-height' : '406',
			'id' : '$3',
			'replace' : {'$2' : 'de'},
		},{
			'name' : 'MyVi',
			'website' : 'http://myvi.ru',
			'url-match' : '(http://(?:www\.)?myvi\.ru/ru/flash/player/(?:[0-9a-z_-]{45}))',
			'embed-src' : '$2',
			'embed-width' : '450',
			'embed-height' : '418',
		},{
			'name' : 'M Thai',
			'website' : 'http://video.mthai.com',
			'url-match' : 'http://video\.mthai\.com/player\.php\?(?:[^"]*?)?id=([0-9a-z]{14,20})',
			'embed-src' : 'http://video.mthai.com/Flash_player/player.swf?idMovie=$2',
			'embed-width' : '407',
			'embed-height' : '342',
		},{
			'name' : 'NewGrounds',
			'website' : 'http://www.newgrounds.com',
			'url-match' : '(http://uploads\.ungrounded\.net/(?:[0-9]{1,12})/(?:[0-9]{1,12})_(?:[0-9a-z_-]*?)\.swf)',
			'embed-src' : '$2?autostart=false&autoplay=false',
			'embed-width' : '480',
			'embed-height' : '400',
		},{
			'name' : 'NhacCuaTui',
			'website' : 'http://www.nhaccuatui.com',
			'url-match' : 'http://(?:www\.)?nhaccuatui\.com/(?:nghe\?M=|m/)([a-z0-9-_]{10})',
			'embed-src' : 'http://www.nhaccuatui.com/m/$2',
			'embed-width' : '300',
			'embed-height' : '270',
		},{
			'name' : 'OnSmash',
			'website' : 'http://www.onsmash.com',
			'url-match' : 'http://(?:www\.|videos\.)?onsmash\.com/(?:v|e)/([0-9a-z]{16})',
			'embed-src' : 'http://videos.onsmash.com/e/$2',
			'embed-width' : '448',
			'embed-height' : '374',
		},{
			'name' : 'Orb',
			'website' : 'http://www.orb.com',
			'url-match' : 'http://mycast\.orb\.com/orb/html/qs\?mediumId=([0-9a-z]{8})&(?:amp;)?l=([0-9a-z_-]{1,20})',
			'embed-src' : 'http://mycast.orb.com/orb/resources/common/videoplayer.swf?file=http%3A%2F%2Fmycast.orb.com%2Forb%2Fxml%2Fstream%3FstreamFormat%3Dswf%26mediumId%3D$2%26l%3D$3&showdigits=true&autostart=false&shuffle=false&showeq=true&showfsbutton=true',
			'embed-width' : '439',
			'embed-height' : '350',
		},{
			'name' : 'Photobucket',
			'website' : 'http://www.photobucket.com',
			'url-match' : 'http://media\.photobucket\.com\/video\/.*\/videos',
			'fetch-match' : '(http://vid[0-9]{1,3}\.photobucket\.com/albums/[a-z0-9]{2,5}/[a-z0-9\-_]*/videos/[a-z0-9\-_]*\.flv)',
			'embed-src' : 'http://media.photobucket.com/flash/player.swf?file=$2',
			'embed-width' : '448',
			'embed-height' : '361',
		},{
			'name' : 'PikNikTube',
			'website' : 'http://www.pikniktube.com',
			'url-match' : 'http://(?:www\.)?pikniktube\.com/(?:v/|(?:(?:[^"]*?)\?q=))([0-9a-f]{32})',
			'embed-src' : 'http://www.pikniktube.com/player/videoplayer2.swf?linktarget=_blank&embedded=1&xmlsrc=http://www.pikniktube.com/getxmle.asp?q=$2&a=1&c=0',
			'embed-width' : '340',
			'embed-height' : '320',
		},{
			'name' : 'Project Playlist',
			'website' : 'http://www.playlist.com',
			'url-match' : 'http://(?:www\.)?playlist\.com/(?:standalone|node)/([0-9]{1,10})',
			'embed-src' : 'http://www.playlist.com/media/mp3player-standalone.swf?playlist_url=http://www.playlist.com/node/$2/playlist/xspf&config=http://www.musiclist.us/mc/config/config_black.xml&mywidth=435',
			'embed-width' : '435',
			'embed-height' : '270',
		},{
			'name' : 'Putfile',
			'website' : 'http://www.putfile.com',
			'url-match' : /(?:www\.|media\.|feat\.)?putfile\.com\/(?:flow\/putfile\.swf\?videoFile=|)?([a-z0-9-_]*)(?:\?)?/g,
			'embed-src' : 'http://feat.putfile.com/flow/putfile.swf?videoFile=$2',
			'embed-width' : '425',
			'embed-height' : '345',
		},{
			'name' : 'Rambler',
			'website' : 'http://vision.rambler.ru',
			'url-match' : 'http://vision\.rambler\.ru/(?:i/e\.swf\?id=|users/)((?:[0-9a-z_-]*?)/(?:[0-9]*?)/(?:[0-9]*))',
			'embed-src' : 'http://vision.rambler.ru/i/e.swf?id=$2&logo=1',
			'embed-width' : '390',
			'embed-height' : '370',
		},{
			'name' : 'RawVegas',
			'website' : 'http://www.rawvegas.tv',
			'url-match' : 'http://(?:www\.)?rawvegas\.tv/watch/[a-z\-0-9]*/([0-9a-f]{30})',
			'embed-src' : 'http://www.rawvegas.tv/ext.php?uniqueVidID=$2',
			'embed-width' : '427',
			'embed-height' : '300',
		},{
			'name' : 'RuTube',
			'website' : 'http://www.rutube.ru',
			'url-match' : 'http://(?:www\.|video\.)?rutube\.ru/(?:tracks/\d+?\.html\?(?:(?:pos|related)=1&(?:amp;)?)?v=)?([0-9a-f]{32})',
			'embed-src' : 'http://video.rutube.ru/$2',
			'embed-width' : '470',
			'embed-height' : '353',
		},{
			'name' : 'Screencast',
			'website' : 'http://www.screencast.com',
			'url-match' : 'http://(?:www\.)?screencast\.com/t/([0-9a-zA-Z]+)',
			'fetch-match' : 'http://www\.screencast\.com/users/CamtasiaTraining/folders/Camtasia/media/([a-z0-9-]+)/embed',
			'embed-src' : 'http://content.screencast.com/users/CamtasiaTraining/folders/Camtasia/media/1d44810a-01f4-4c60-a862-6d114bed50c7/tscplayer.swf',
			'embed-width' : '425',
			'embed-height' : '344',
			'iframe-player' : 'http://www.screencast.com/users/CamtasiaTraining/folders/Camtasia/media/$2/embed',
		},{
			'name' : 'ScreenToaster',
			'website' : 'http://www.screentoaster.com',
			'url-match' : 'http://(?:www\.)?screentoaster\.com/watch/([0-9a-zA-Z]+)',
			'embed-src' : 'http://www.screentoaster.com/swf/STPlayer.swf?video=$2',
			'embed-width' : '425',
			'embed-height' : '344',
			'flashvars' : 'video=$2',
		},{
			'name' : 'SevenLoad',
			'website' : 'http://www.sevenload.com',
			'url-match' : 'http://((?:en|tr|de|www)\.)?sevenload\.com/(?:videos|videolar)/([0-9a-z]{1,8})',
			'embed-src' : 'http://$2sevenload.com/pl/$3/425x350/swf',
			'embed-width' : '425',
			'embed-height' : '350',
		},{
			'name' : 'ShareView',
			'website' : 'http://www.shareview.us',
			'url-match' : 'http://(?:www\.)?shareview\.us/video/([0-9]{1,10})/',
			'embed-src' : 'http://www.shareview.us/nvembed.swf?key=$2',
			'embed-width' : '540',
			'embed-height' : '380',
		},{
			'name' : 'Sharkle',
			'website' : 'http://www.sharkle.com',
			'url-match' : '(http://(?:www\.)?sharkle\.com/externalPlayer/(?:(?:(?:[0-9a-z]{1,25})/){3}))',
			'embed-src' : '$2',
			'embed-width' : '340',
			'embed-height' : '310',
		},{
			'name' : 'Smotri',
			'website' : 'http://www.smotri.com',
			'url-match' : 'http://(?:www\.)?smotri\.com/video/view/\?id=v([0-9a-f]{10})',
			'embed-src' : 'http://pics.smotri.com/scrubber_custom8.swf?file=$2&bufferTime=3&autoStart=false&str_lang=eng&xmlsource=http%3A%2F%2Fpics.smotri.com%2Fcskins%2Fblue%2Fskin_color_lightaqua.xml&xmldatasource=http%3A%2F%2Fpics.smotri.com%2Fskin_ng.xml',
			'embed-width' : '400',
			'embed-height' : '330',
		},{
			'name' : 'Snotr',
			'website' : 'http://www.snotr.com',
			'url-match' : 'http://(?:www\.|videos\.)?snotr\.com/(?:player\.swf\?video=|)?(?:video|embed)/([0-9]{1,8})',
			'embed-src' : 'http://videos.snotr.com/player.swf?video=$2&amp;embedded=true&amp;autoplay=false',
			'embed-width' : '400',
			'embed-height' : '330',
		},{
			'name' : 'SouthPark Studios',
			'website' : 'http://www.southparkstudios.com',
			'url-match' : 'http://(?:www\.)?southparkstudios\.com/clips/([0-9]{1,10})',
			'embed-src' : 'http://media.mtvnservices.com/mgid:cms:item:southparkstudios.com:$2:',
			'embed-width' : '480',
			'embed-height' : '360',
		},{
			'name' : 'Space.tv.cctv.com',
			'website' : 'http://space.tv.cctv.com',
			'url-match' : 'http://((?:(?:[a-z0-9]{1,10})\.){0,2})?cctv\.com/act/video\.jsp\?videoId=VIDE([0-9]{16})',
			'embed-src' : 'http://$2cctv.com/playcfg/player_new.swf?id=VIDE$3&site=http://$2cctv.com&method=http',
			'embed-width' : '500',
			'embed-height' : '400',
		},{
			'name' : 'Spike',
			'website' : 'http://www.spike.com',
			'url-match' : 'http://(?:www\.)?spike\.com/video-clips/([a-z0-9]{4,12})/',
			'embed-src' : 'http://www.spike.com/efp?flvbaseclip=$2&',
			//new: 'embed-scr' : 'http://media.mtvnservices.com/mgid:arc:video:spike.com:$2',
			'embed-width' : '448',
			'embed-height' : '365',
		},{
			'name' : 'Songza',
			'website' : 'http://www.songza.com',
			'url-match' : '(http://(?:www\.)?songza\.com/e/listen\?(?:zName=(?:[0-9a-z_\%-]*?)&(?:amp;)?)?zId=(?:[0-9a-z_-]{16}))',
			'embed-src' : '$2&zAutostart=false&zType=flv',
			'embed-width' : '425',
			'embed-height' : '114',
		},{
			'name' : 'Streetfire',
			'website' : 'http://www.streetfire.net',
			'url-match' : 'http://(?:www\.|videos\.)?streetfire\.net/video/(?:[0-9a-z\-_]*)\.htm',
			'fetch-match' : '<link rel="video_src" href="([A-z:\/\.0-9-_=?]*)',
			'embed-src' : '$2',
			'embed-width' : '428',
			'embed-height' : '352',
		},{
			'name' : 'StupidVideos',
			'website' : 'http://www.stupidvideos.com',
			'url-match' : 'http://(?:www\.|images\.)?stupidvideos\.com/(?:video/(?:[^"\//]*?)\//|images/player/player\.swf\?sa=1&(?:amp;)?sk=7&(?:amp;)?si=2&(?:amp;)?i=)([0-9]{1,10})',
			'embed-src' : 'http://images.stupidvideos.com/2.0.2/swf/video.swf?sa=1&sk=7&si=2&i=$2',
			'embed-width' : '451',
			'embed-height' : '433',
		},{
			'name' : 'TagTélé',
			'website' : 'http://www.tagtele.com',
			'url-match' : 'http://www\.tagtele\.com/(?:v/|videos/voir/)([0-9]{1,12})',
			'embed-src' : 'http://www.tagtele.com/v/$2',
			'embed-width' : '425',
			'embed-height' : '350',
		},{
			'name' : 'Ted.com',
			'website' : 'http://www.ted.com',
			'url-match' : 'http://(?:www\.)?ted\.com/(index.php/)?talks/[a-z0-9\-_]*.html',
			'fetch-match' : 'hs:"talks\/dynamic\/([a-z0-9-_]*)-high\.flv',
			'embed-src' : 'http://video.ted.com/assets/player/swf/EmbedPlayer.swf',
			'embed-width' : '446',
			'embed-height' : '326',
			'flashvars' : 'vu=http://video.ted.com/talks/dynamic/$2-medium.flv&su=http://images.ted.com/images/ted/tedindex/embed-posters/$2.embed_thumbnail.jpg&vw=432&vh=240',
		},{
			'name' : 'The Onion',
			'website' : 'http://www.theonion.com',
			'url-match' : 'http://(?:www\.)?theonion\.com/video/.*',
			'fetch-match' : 'videoid\s?=\s?"([0-9]{2,7})";.*var image_url\s?=\s?escape\("([^"]*)"',
			'embed-src' : 'http://www.theonion.com/content/themes/common/assets/onn_embed/embedded_player.swf?image=$3&amp;videoid=$2',
			'embed-width' : '480',
			'embed-height' : '430',
		},{
			'name' : 'TinyPic',
			'website' : 'http://www.tinypic.com',
			'url-match' : 'http://(?:www\.)?tinypic\.com/player\.php\?v=([0-9a-z-&=]{1,12})',
			'embed-src' : 'http://v5.tinypic.com/player.swf?file=$2',
			'embed-width' : '440',
			'embed-height' : '420',
		},{
			'name' : 'Todays Big Thing',
			'website' : 'http://www.todaysbigthing.com',
			'url-match' : 'http://(?:www|entertainment|sports|technology|music|funnyvideos)\.todaysbigthing\.com/[0-9]{4}(?:/[0-9]{2}){2}',
			'fetch-match' : 'http://(?:www|entertainment|sports|technology|music|funnyvideos)\.todaysbigthing\.com/betamax/betamax\.internal\.swf\?item_id=([0-9]{1,6})',
			'embed-src' : 'http://www.todaysbigthing.com/betamax/betamax.swf?item_id=$2&fullscreen=1',
			'embed-width' : '480',
			'embed-height' : '360',
		},{
			'name' : 'TrailerAddict',
			'website' : 'http://www.traileraddict.com',
			'url-match' : 'http://(?:www\.)?traileraddict\.com/trailer/',
			'fetch-match' : '(http://(?:www\.)?traileraddict\.com/em(?:d|b)/(?:[0-9]{1,10}))',
			'embed-src' : '$2',
			'embed-width' : '450',
			'embed-height' : '279',
		},{
			'name' : 'TrTube',
			'website' : 'http://www.trtube.com',
			'url-match' : 'http://(?:www\.)?trtube\.com/izle\.php\?v=([a-z]{1,12})',
			'embed-src' : 'http://www.trtube.com/mediaplayer_3_15.swf?file=http://www.trtube.com/vid2/89457.flv&image=http://www.trimg.com/vi/89457.gif&autostart=false',
			'embed-width' : '425',
			'embed-height' : '350',
		},{
			'name' : 'Trilulilu',
			'website' : 'http://www.trilulilu.ro',
			'url-match' : 'http://(?:www\.)?trilulilu\.ro/([0-9a-z_-]*?)/([0-9a-f]{14})',
			'fetch-match' : '<link rel="video_src" href="([A-z:\/\.0-9-_=?]*)\?autoplay',
			'embed-src' : '$2',
			'embed-width' : '440',
			'embed-height' : '362',
		},{
			'name' : 'Tu',
			'website' : 'http://www.tu.tv',
			'name' : 'Tu.tv',
			'url-match' : '(http://tu\.tv/tutvweb\.swf\?xtp=(?:[0-9]{1,10}))',
			'embed-src' : '$2',
			'embed-width' : '425',
			'embed-height' : '350',
		},{
			'name' : 'Tudou',
			'website' : 'http://www.tudou.com',
			'url-match' : 'http://(?:www\.)?tudou\.com/(?:programs/view/|v/)([a-z0-9-]{1,12})',
			'embed-src' : 'http://www.tudou.com/v/$2',
			'embed-width' : '400',
			'embed-height' : '300',
		},{
			'name' : 'Tumblr (Music)',
			'website' : 'http://www.tumblr.com',
			'url-match' : 'http://[a-z0-9-_]{2,30}\.tumblr\.com/post/[0-9]{3,10}/',
			'fetch-match' : '<embed type="application/x-shockwave-flash" src="(http://[a-z0-9-_./]*\?audio_file=http://www\.tumblr\.com/audio_file/[0-9]{5,8}/[a-z0-9]{24})',
			'embed-src' : '$2&amp;color=e4e4e4',
			'embed-width' : '207',
			'embed-height' : '27',
		},{
			'name' : 'Twitvid',
			'website' : 'http://www.twitvid.com/',
			'url-match' : 'http://(?:www\.)?twitvid\.com/([0-9a-z]{1,10})',
			'embed-src' : 'http://www.twitvid.com/player/$2',
			'embed-width' : '425',
			'embed-height' : '344',
		},{
			'name' : 'UOL VideoLog',
			'website' : 'http://videolog.uol.com.br',
			'url-match' : /videolog\.uol\.com\.br\/video(?:\?|\.php\?id=)([0-9]{1,9})/g,
			'embed-src' : 'http://www.videolog.tv/swfs/externo_api.swf?v=$2&amp;id_video=$2',
			'embed-width' : '512',
			'embed-height' : '384',
		},{
			'name' : 'u-Tube',
			'website' : 'http://www.u-tube.ru',
			'url-match' : 'http://(?:www\.)?u-tube\.ru/(?:playlist\.php\?id=|pages/video/)([0-9]{1,12})',
			'embed-src' : 'http://www.u-tube.ru/upload/others/flvplayer.swf?file=http://www.u-tube.ru/playlist.php?id=$2&width=400&height=300',
			'embed-width' : '400',
			'embed-height' : '300',
		},{
			'name' : 'Ustream',
			'website' : 'http://www.ustream.tv',
			'url-match' : '^https?://www\.ustream\.tv/channel/[0-9a-z-]+$',
			'fetch-match' : 'https?://www\.ustream\.tv/embed/([0-9]+)',
			'embed-src' : 'http://www.ustream.tv/flash/viewer.swf',
			'embed-width' : '480',
			'embed-height' : '299',
			'iframe-player' : 'https://www.ustream.tv/embed/$2?mode=direct',
			'flashvars' : 'cid=$2&amp;autoplay=false&amp;locale=de_DE',
		},{
			'name' : 'VideoJug',
			'website' : 'http://www.videojug.com',
			'url-match' : 'http://(?:www\.)videojug\.com/film/',
			'fetch-match' : 'data-videoid="((?:[0-9a-f]{1,12}-?){5})"',
			'embed-src' : 'http://www.videojug.com/views/player/Player.swf', //http://www.videojug.com/player?id=
			'embed-width' : '400',
			'embed-height' : '345',
			'flashvars' : 'embedded=true&amp;ClientType=0&amp;id=$2&amp;type=film&amp;host=http%3a%2f%2fwww.videojug.com&amp;ar=16_9',
			'iframe-player' : 'http://www.videojug.com/embed/$2',
		},{
			'name' : 'videos.sapo',
			'website' : 'http://videos.sapo.pt',
			'url-match' : 'http://(www\.|(?:(?:(?:[0-9a-z]{3,12})\.){1,2}))?sapo\.pt/([0-9a-z]{20})',
			'embed-src' : 'http://$2sapo.pt/play?file=http://$2sapo.pt/$3/mov/1',
			'embed-width' : '400',
			'embed-height' : '322',
		},{
			'name' : 'Vidiac',
			'website' : 'http://www.vidiac.com',
			'url-match' : 'http://(?:www\.)?vidiac\.com/video/((?:[0-9a-z]{8})(?:(?:-(?:[0-9a-z]{4})){3})-(?:[0-9a-z]{12}))\.htm',
			'embed-src' : 'http://www.vidiac.com/vidiac.swf?video=$2',
			'embed-width' : '428',
			'embed-height' : '352',
		},{
			'name' : 'Viddler',
			'website' : 'http://www.viddler.com',
			//'url-match' : '(http://www\.viddler\.com/(?:player|simple)/(?:[0-9a-f]{8})/)',
			'url-match' : 'http://www\.viddler\.com/explore/[a-z0-9\-_]*/videos/([0-9]*)/',
			'embed-src' : 'http://cdn.static.viddler.com/flash/simple_publisher.swf?key=$2',
			'embed-width' : '437',
			'embed-height' : '370',
		},{
			'name' : 'Videa',
			'website' : 'http://www.videa.hu',
			'url-match' : 'http://(?:www\.)?videa\.hu/(?:(?:[^"]*)-|flvplayer\.swf\?v=)([0-9a-z]{16})',
			'embed-src' : 'http://videa.hu/flvplayer.swf?v=$2',
			'embed-width' : '434',
			'embed-height' : '357',
		},{
			'name' : 'VidiLife',
			'website' : 'http://www.vidilife.com',
			'url-match' : '(http://(?:www\.)?vidilife\.com/flash/flvplayer\.swf\?xml=http://(?:www\.)?vidilife\.com/media/play_flash_xml\.cfm\?id=(?:[0-9a-f]{8})-(?:[0-9a-f]{4})-(?:[0-9a-f]{4})-(?:[0-9a-f]{4})-(?:[0-9a-f]{1}))',
			'embed-src' : '$2',
			'embed-width' : '445',
			'embed-height' : '363',
		},{
			'name' : 'VidMax',
			'website' : 'http://www.vidmax.com',
			'url-match' : 'http://(www\.)?vidmax\.com/(?:index\.php/)?videos?/(?:view/)?([0-9]{1,10})',
			'embed-src' : 'http://www.vidmax.com/player.swf',
			'embed-width' : '400',
			'embed-height' : '300',
			'flashvars' : 'file=http://www.vidmax.com/media/video/$3.flv&amp;streamer=lighttpd&amp;autostart=false&amp;stretching=fill',
		},{
			'name' : 'Vidivodo',
			'website' : 'http://www.vidivodo.com',
			'url-match' : 'http://(www|en)\.vidivodo\.com/([0-9]*?)/[a-z0-9\-_]*',
			'embed-src' : 'http://www.vidivodo.com/VideoPlayerShare.swf?lang=$2&vidID=$3&vCode=v$4&dura=$5&File=$6',
			'embed-width' : '480',
			'embed-height' : '300',
		},{
			'name' : 'VoiceThread',
			'website' : 'http://www.voicethread.com',
			'url-match' : 'http://(?:www\.)?voicethread\.com/(?:share/|book\.swf\?b=|//q\.b)([0-9]{1,10})',
			'embed-src' : 'http://www.voicethread.com/book.swf?b=$2',
			'embed-width' : '480',
			'embed-height' : '360',
		},{
			'name' : 'WeGame',
			'website' : 'http://www.wegame.com',
			'url-match' : 'http://(?:www\.)?wegame\.com/watch/([0-9a-z_-]*?)/',
			//'embed-src' : 'http://wegame.com/static/flash/player2.swf?tag=$2',
			'embed-src' : 'http://www.wegame.com/static/flash/player.swf?xmlrequest=http://www.wegame.com/player/video/$2',
			'embed-width' : '480',
			'embed-height' : '387',
		},{
			'name' : 'Webshots (Slideshows)',
			'website' : 'http://www.webshots.com',
			'url-match' : 'http://[a-z0-9\-_]*\.webshots\.com/slideshow/([a-z0-9]*)',
			'embed-src' : 'http://p.webshots.com/flash/smallslideshow.swf',
			'embed-width' : '425',
			'embed-height' : '384',
			'flashvars' : 'playList=http%3A%2F%2Fcommunity.webshots.com%2Fslideshow%2Fmeta%2F$2%3Finline%3Dtrue&inlineUrl=http%3A%2F%2Fcommunity.webshots.com%2FinlinePhoto%26src%3Ds%26referPage%3Dhttp%3A%2F%2Fgood-times.webshots.com%2Fslideshow%2F$2&postRollContent=http%3A%2F%2Fp.webshots.com%2Fflash%2Fws_postroll.swf&shareUrl=http%3A%2F%2Fgood-times.webshots.com%2Fslideshow%2F$2&audio=on&audioVolume=33&autoPlay=false&transitionSpeed=5&startIndex=0&panzoom=on&deployed=true',
		},{
			'name' : 'Wistia',
			'website' : 'http://www.wistia.com',
			'url-match' : 'https?://[a-z0-9\-_]*\.wistia\.com/medias/([a-z0-9]*)',
			'embed-src' : 'http://fast.wistia.net/embed/iframe/$1',
			'embed-width' : '480',
			'embed-height' : '270',
		},{
			'name' : 'Yahoo Video HK',
			'website' : 'http://hk.video.yahoo.com',
			'url-match' : 'http://(?:w\.video\.)?hk\.video\.yahoo\.(?:com|net)/video/(?:dplayer\.html\?vid=|video\.html\?id=)([0-9]{1,10})',
			'embed-src' : 'http://w.video.hk.yahoo.net/video/dplayer.html?vid=$2',
			'embed-width' : '420',
			'embed-height' : '370',
		},{
			'name' : 'Yahoo Video',
			'website' : 'http://video.yahoo.com',
			//'url-match' : 'http://(?:(?:www|uk|fr|it|es|br|au|mx|de|ca)\.)?video\.yahoo\.com/watch/([0-9]{1,12})/([0-9]{1,12})',
			'url-match' : 'http://(?:(?:www|uk|fr|it|es|br|au|mx|de|ca)\.)?video\.yahoo\.com/(?:[^"]*?)/(?:[^"]*?)/([a-z0-9_]+)-([0-9]{1,12})',
			'embed-src' : 'http://d.yimg.com/nl/vyc/site/player.swf',
			'embed-width' : '630',
			'embed-height' : '354',
			'flashvars' : 'id=$3&vid=$2&lang=en-us&intl=us&embed=1',
		},{
			'name' : 'Yahoo Music Videos',
			'website' : 'http://music.yahoo.com',
			'url-match' : 'http://(?:new\.)?(?:(?:uk|fr|it|es|br|au|mx|de|ca)\.)?music\.yahoo\.com/[^0-9]*([0-9]{1,12})$',
			'embed-src' : 'http://d.yimg.com/cosmos.bcst.yahoo.com/up/fop/embedflv/swf/fop.swf?id=v$2&eID=0000000&lang=us&enableFullScreen=0&shareEnable=1',
			'embed-width' : '400',
			'embed-height' : '255',
		},{
			'name' : 'YouKu',
			'website' : 'http://www.youku.com',
			'url-match' : 'http://(?:v\.youku\.com/v_show/id_|player\.youku\.com/player\.php/sid/)([0-9a-z]{6,14})',
			'embed-src' : 'http://player.youku.com/player.php/sid/$2=/v.swf',
			'embed-width' : '450',
			'embed-height' : '372',
		},{
			'name' : 'sina video',
			'website' : 'http://video.sina.com.cn',
			'url-match' : 'http://(?:vhead\.blog|you\.video)\.sina\.com\.cn/(?:player/(?:[^"]*?)vid=|b/)([0-9]{5,12})(?:-|&(?:amp;)?uid=)([0-9]{5,12})',
			'embed-src' : 'http://vhead.blog.sina.com.cn/player/outer_player.swf?auto=0&vid=$2&uid=$3',
			'embed-width' : '480',
			'embed-height' : '370',
		},{
			'name' : 'XVideos',
			'website' : 'http://www.xvideos.com',
			'url-match' : 'http://(?:www\.)?xvideos.com/video([0-9]{6,8})/(?:[^"]*?)',
			'embed-src' : 'http://static.xvideos.com/swf/flv_player_site_v4.swf',
			'embed-width' : '510',
			'embed-height' : '400',
			'flashvars' : 'id_video=$2',
		},{
			'name' : 'Local Content',
			'website' : 'localhost',
			'url-match' : '__local__(.*)',
			'embed-src' : '$2',
			'embed-width' : '425',
			'embed-height' : '344',
		},
	];

	var mediaObject = function(stub)
	{
		this.objectAttributes = {};

		this.objectParams = {};

		this.iframeAttributes = {};

		this.iframeParams = {};
		this.config = {'prefer':'iframe'}
		
		
		this.getId = function()
		{
			var res = this.match;
			if(this.stub.id == undefined || this.stub.id.length == 0){
				if(!res[res.length - 1] || res[res.length - 1].length == 0)
					return '';
				this.stub['id'] = res[res.length - 1];
			}
			var id  = this.stub['id'];
			for (var i = 1; i <= res.length; ++i) {
				id = id.replace(new RegExp('$' + i, 'gi'), res[i - 1]);
			}
			return id;
		}
		this.getEmbedCode = function()
		{
			if (this.stub['iframe-player'] != undefined && this.config['prefer'] === 'iframe') {
				return this.buildIframe();
			}
		}
		this.getAMPCode = function()
		{
			if(this.stub['amp-code'] != undefined){
				return this.buildAMPCode();
			}
			else if (this.stub['iframe-player'] != undefined && this.config['prefer'] === 'iframe') {
				return this.buildIframe(true);
			}
			 
		}
		this.getImageThumbnail = function()
		{
			return this.buildImage();
		}
		this.buildImage = function()
		{
			if(!this.stub['image-src'])
				return;
			var source = this.stub['image-src'];
			source = source.replace(new RegExp('\\$2'), this.stub['id']);
			return source;
		}
		this.buildAMPCode = function()
		{
			var amp = this.stub['amp-code'];
			
			for (var i = 1; i <= this.match.length; ++i) {
				amp = amp.replace(new RegExp('\\$' + i), this.match[i - 1]);
			}
			return amp;
		}
		this.buildIframe = function(amp = false)
		{
			var source = this.stub['iframe-player'];
			for (var i = 1; i <= this.match.length; ++i) {
				source = source.replace(new RegExp('\\$' + i), this.match[i - 1]);
			}
	
			var attributes = 'layout="responsive" width="' + (this.stub['embed-width'] ? this.stub['embed-width'] : "600") + '" height="' + (this.stub['embed-height'] ? this.stub['embed-height'] : '450') + '"';
			var placeholder = '<amp-img layout="fill" src="' + window.basePath + '/public/assets/images/video-placeholder.jpg" placeholder></amp-img>';
			return '<amp-iframe src="' + source +  '" ' + attributes + '>' + placeholder + '</amp-iframe>';
		}
		this.getObjectSrc = function(type)
		{
			if (this.stub['id'].length == 0 || this.stub['slug'].length == 0) {
				return;
			}
			var src = '';
			if(typeof this.stub[type] == 'function'){
				src = this.stub[type](this.match);
			}
			else
				src = this.stub[type].replace(new RegExp('\\$2'), this.stub['id']);
			if (this.stub['replace'] != undefined && this.stub['replace'].length) {
				for (var i in this.stub['replace']) {
					src = src.replace(new RegExp(i), this.stub['replace'][i]);
				}
			}
			if (this.stub['replace_match'] != undefined && this.stub['replace_match'].length) {
				for (var i in this.stub['replace_match']) {
					if(this.match[i] != undefined)
					src = src.replace(new RegExp( '\\$' + i), this.match[i]);
				}
			}
			return src;
		}
		this.stub = $.extend(true, {
			'id' : '',
            'name' : '',
            'website' : '',
            'slug' : '',
            'match' : [],
		}, stub);
		this.match = this.stub['match'];
		this.stub['id'] = this.getId();
		var type = 'embed-src';
		if (this.stub['iframe-player'] != undefined) {
            if (this.config['prefer'] === 'iframe') {
                type = 'iframe-player';
            }
        }
		if (type == 'iframe-player') {
			
            var src = this.getObjectSrc(type);
            this.stub['iframe-player'] = src;

            this.objectParams['movie'] = src;
            this.objectAttributes['data'] = src;
        }
	}
	var parseURL = function(url)
	{
		for(var i in stubs){
			var match;
			var matcher = stubs[i]['url-match'];
			if(!$.isArray(stubs[i]['url-match']))
				matcher = [stubs[i]['url-match']];
			match = matchURL(url, matcher);
			if (!match) {
				continue;
			}
			stubs[i]['match'] = match;
			if (stubs[i]['slug'] == undefined && stubs[i]['name'] != undefined) {
				stubs[i]['slug'] = slugify(stubs[i]['name']);
			}
			return new mediaObject(stubs[i]);
		}
	}
	function slugify(string) {
	  return string
		.toString()
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^\w\-]+/g, "")
		.replace(/\-\-+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
	}
	var matchURL = function(url, rules)
	{
		for (var i in rules) {
			//console.log(rules[i] );
			try{
				//console.log(rules[i] );
				var regex = new RegExp(rules[i],'gi')
				//console.log(regex)
				var rez;
				rez = regex.exec(url);
				//console.log(rez, rules[i] );
				if(rez != null)
				{
					return rez;
				}
					
			}
			catch(e){
				console.log(rules[i],e);
			}
			
		}
	}
	global.parseEmbedURL = parseURL;
	module.exports = {
		parseEmbedURL:parseURL
	}

