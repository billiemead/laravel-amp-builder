var button = require('./base').default;
var startsWith = require('../../../node_modules/lodash/startsWith');
var templateSiteUrl = 'https://landingtemplate.stsengine.com';
var caches = {};
var waiters = {};
var queues = {};
class svg extends button{
	waiterHandler()
	{
		var src = this.data.src;
		var content = caches[src];
		this.loadSVG(content);
	}
	loadSVG(rs, sync)
	{
		var content = rs;
		var div = $('<div></div>');
		div.html(content);
		var svg = div.find('svg');
		if(svg.length)
		{
			this.setDataByKey('code', content, true, sync);
			if(!caches[this.data.src]){
				caches[this.data.src] = rs;
				
			}
			return content;
			
		}
		else{
			console.log({
				title:'Parse SVG Failed',
				message:'Invalid1 SVG'
			});
		}
	}
	parseSVGFile(src, sync = false)
	{
		var that = this;
		var defered = $.Deferred();
		var isUrl = startsWith(src, 'http://') || startsWith(src, 'https://');
		var content;
		this.data.src = src;
		if(queues[src] != undefined){
			if(caches[src] != undefined){
				content = this.loadSVG(caches[src], sync);
				defered.resolve(content);
			}
			
		}
		
		if(!content)
		{
			$.get(window.basePath + '/file/icon',{url:src}, function(rs){
				try{
					var json = $.parseJSON(rs);
					var content = (json.data != undefined ? json.data : json);
					content = that.loadSVG(content, sync);
					if(content != undefined)
						defered.resolve(content);
					else
						defered.reject(1);
				}
				catch(e){
					defered.reject(e);
					
				}
			}, 'html').fail(function() {
				defered.reject('error');
			});
		}
		queues[src] = true;
		return defered.promise();
	}
	
	lazyLoad()
	{
		if(!this.lazyLoaded && this.data.src != undefined){
			this.parseSVGFile(this.data.src)
			this.lazyLoaded = true;
		}
	}
	
}
module.exports = {
	
	default: svg
}