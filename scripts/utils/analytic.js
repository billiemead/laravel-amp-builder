var cross_storage = require('cross-storage');

class Tracker{
	constructor(trackingUrl)
	{
		this.trackingUrl = trackingUrl;
	}
	execute(params, callback, callBackPointer)
	{
		this.loadScript(this.getTrackingUrl(params));
	}
	getTrackingUrl(params)
	{
		
		var trackingUrl = ('https:' == document.location.protocol ? 'https://' : 'http://') + document.location.host +"/tracking";
		if(this.trackingUrl)
			trackingUrl = this.trackingUrl;
		else if(window.trackingUrl)
			trackingUrl = window.trackingUrl;
		trackingUrl = this.appendParams(trackingUrl, params);
		return trackingUrl;
	}
	appendParams(url, params)
	{
		if(!url || !url.length)
			return;
		var hasParam = url.charAt(url.length-1) == "?";
		if(!hasParam)
			url += '?';
		var separator = '';
		
		if(params != undefined){
			for(var i in params){
				url += separator;
				url += i + '=' + params[i];
				separator = '&';
			}
		}
			
		return url;
	}
	loadScript(src, callback, callBackPointer)
	{
		var s,
		  r,
		  t;
		r = false;
		s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = src;
		s.async  = true;
		s.defer  = true;
		var that = this;
		s.onload = s.onreadystatechange = function() {
		
		if ( !r && (!this.readyState || this.readyState == 'complete') )
		{
			r = true;
			if(callback){
				if(callBackPointer)
					callback.call(callBackPointer);
				else{
					callback.call(that);
				}
			}
			
				
		}
		};
		t = document.getElementsByTagName('script')[0];
		t.parentNode.insertBefore(s, t);
	}
}
class Analytic{
	constructor(options)
	{
		this.cookie_prefix = options.cookie_prefix || '';
		this.storageUrl = options.storageUrl || '';
		this.tracker = new Tracker(options.trackingUrl);
		this.params = options.params;
	}
	addParam(name, value)
	{
		this.params = this.params || {};
		this.params[name] = value;
	}
	addParams(params)
	{
		if(!params)
			return;
		for(var i in params)
		{
			this.addParam(i, params[i]);
		}
	}
	getStorageUrl()
	{
		var trackingUrl = this.storageUrl;
		return trackingUrl;
	}
	external_track(params)
	{
		var that = this;
		this.addParam('type', 'conversion');
		var storage = new window.CrossStorageClient(this.getStorageUrl());
		storage.onConnect()
		.then(function() {
			return storage.get('site_id', 'page_id');
		}).then(function(res) {
			that.addParam('site_id', res[0]);
			that.addParam('page_id', res[1]);
			that.trackGoal(res[1], 'external_link');
			console.log(res); 
		})['catch'](function(err) {
			console.log(err);
			that.addParam('page_id', this.getPageIdFromCookie());
			that.trackGoal(this.getPageIdFromCookie(), 'external_link');
		});
	}
	send(value)
	{
		this.track({
			type: value
		});
	}
	trackPageView(page_id)
	{
		this.addParam('page_id', page_id);
		this.tracker.execute(this.params);
	}
	trackGoal(page_id, goal)
	{
		this.addParam('type', 'conversion');
		this.addParam('page_id', page_id);
		this.addParam('goal', goal);
		this.tracker.execute(this.params);
	}
	
	getVisitorIdFromCookie()
	{
		var cookieName = 'viuqid';
		return this.getCookieValue(cookieName);
	}
	getPageIdFromCookie()
	{
		var cookieName = 'pqid';
		return this.getCookieValue(cookieName);
	}
	getCookieValue(cookieName) {
		cookieName = this.cookie_prefix + cookieName;
		var cookies = document.cookie;
		var cookieValue = null;
		var pos = cookies.indexOf(cookieName + '=');
		if (pos > -1) {
			var start = pos + cookieName.length + 1;
			var end = cookies.indexOf(';', start);
			end = end > -1 ? end : cookies.length;
			cookieValue = cookies.substring(start, end);
		}
		return cookieValue;
	}
};
global.SldAnalytic = Analytic;
global.CrossStorageHub  = cross_storage.CrossStorageHub;
global.CrossStorageClient  = cross_storage.CrossStorageClient

if(window._sldua){
	var analytic = new Analytic(window._sldua);
	var ready = false;

	document.onreadystatechange = function() {

		if (ready) {
			analytic.external_track();
			return;
		}
		
		if (document.readyState == 'complete') {
			analytic.external_track();
			ready = true;
			
		}
	};
}

var exports = cross_storage;
exports.Analytic = Analytic;
exports.Tracker = Tracker;
module.exports = exports;
