var base = require('./base').default;
var button = require('./base_button').default;
var _ = require('lodash');

export default createModuleDefinition([base, button], function($file_manager,$dialog, API) 
{
	"ngInject";
	this.resizable = true;
	this.tab_editor = ['advance', 'offset', 'margin', 'svg', 'click_action', 'text', 'border', 'background', 'button_hover'];
	this.loadElement = function(el)
	{
		this._loadElement(el);
		var request_source = this.is_new_inserted_element && !this.frontend_module.is_clone_element;
		if(request_source){
			this.setDefaultSource();
		}
		jQuery_iframe(el).on('click', function(event)
		{
			event.preventDefault();
		})
	}
	this.bindEvent =  function()
	{
		var that = this;
		this.getElement().on('dblclick', function(){
			that.setDefaultSource();
		});
		return this.__call('bindEvent');
	};
	this.setDefaultSource = function()
	{
		var that = this;
		return $file_manager.open({onlySVG: true, tabs:['myfiles', 'libraries_icon']}).result.then(function(images)
		{
			if(images.length == 0){
				return;
			}
			var image = images[0];
			
			that.parseSVGFile(image.full_url)
		});
	}
	this.parseSVGFile = function(src)
	{
		var rs = this.frontend_module.parseSVGFile(src, true);
		$.when(rs).then(function(content){
		}, function(e){
			$dialog.message({
				title:'Parse SVG Failed',
				message:'Invalid SVG'
			});
		});
		return;
	
	}
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		var that = this;
		$scope.selectFile = function()
		{
			$file_manager.open({onlySVG: true,  tabs:['myfiles', 'libraries_icon']}).result.then(function(images)
			{
				if(images.length == 0)
					return;
				var image = images[0];
				$moduleInstance.parseSVGFile(image.full_url);
				$scope.data = $moduleInstance.getData();
			});
		}
	};
	this.needCacheSVGCode = function()
	{
		var url = this.getData().src;
		return window.cachedSVGCode == undefined || !window.cachedSVGCode[url];
	}
	this.getCodeFromElement = function()
	{
		var svg;
		if(this.getElement().is('svg'))
			svg = this.getElement();
		else 
			svg = this.getElement().children('svg');
		if(svg.length)
		{
			if(svg.hasClass('tempHide'))
				svg.removeClass('tempHide');
			if(svg.css('display') == 'none')
				svg.css('display', '');
			return svg[0].outerHTML;
		}
			
	}
	this.getStructure = function()
	{
		var s = this._getStructure();
		delete s.data.attributes;
		if(!this.needCacheSVGCode())
			delete s.data.code;
		else{
			s.data.code == undefined && (s.data.code = this.getCodeFromElement());
			window.cachedSVGCode = window.cachedSVGCode || {};
			var url = s.data.src;
			
			window.cachedSVGCode[url] = s.data.code;
			this.bindclearWindowCacheEvent();
		}
		return s;
	};
	this.bindclearWindowCacheEvent = function()
	{
		$(window).off('update_content.svg_block');
		$(window).on('update_content.svg_block', function(){
			delete window.cachedSVGCode;
		});
	}
	this.setData = function(data, updateView)
	{
		return this.frontend_module.setData(data, false);
	};
});