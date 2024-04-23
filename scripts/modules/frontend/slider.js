var base = require('./box').default;
var pageEdit = require('../../utils/pagemanager.iframe/pageEdit_front');

class line extends base{
	loadElement(element){
		super.loadElement(element);
		this.initMutationObserver();

		
	}
	getContainer()
	{
		if(this.getCurrentActiveSlide())
			return $(this.getCurrentActiveSlide()).children('.inner_slide');
	}
	getAMPElement()
	{
		return this.getElement().children('amp-carousel')
	}
	
	isLoadCompleted()
	{
		var amp = this.getAMPElement()[0];
		
		return amp.readyState == 'complete'
	}
	initModules(trigger)
	{
		if(this.isLoadCompleted())
			this._initModules(trigger);
		else{
			var that = this;
			setTimeout(function(){
				that.timeout_initModules();
			}, 500)
		}
	}
	timeout_initModules()
	{
		if(!this.isLoadCompleted()){
			var that = this;
			setTimeout(function(){
				that.initModules(true);
			}, 500)
			return;
		}
		this._initModules(true);
	}
	_initModules(trigger)
	{
		var slides = this.getCurrentSlides();
		for(var i in slides){
			$(slides[i]).children('.inner_slide').children('.' + this.getDefaultClass()).each(function(i)
			{
				var moduleInstance = pageEdit.createModule(this, false, trigger);
			});
		}
	}
	getChildModules()
	{
		var s = [];
		if(!this.isLoadCompleted())
			return s;
		var that = this;
		var slides = this.getCurrentSlides();
		for(var i in slides){
			$(slides[i]).children('.inner_slide').children('.' + this.getDefaultClass()).each(function(i)
			{
				var module = pageEdit.getModule(this);
				if(module != undefined){
					s.push(module);
				}
			});
		}
		return s;
		
	}
	getInnerSliderWidth()
	{
		var slide = this.getCurrentActiveSlide();
		if(slide)
			return $(slide).children('.inner_slide').width();
		return 0;
	}
	
	getCurrentActiveSlide()
	{
		var amp = this.getAMPElement()[0];
		//console.log(amp,amp.implementation_)
		var implementation = this.getAmpImplement();
		var currentSlide = implementation.h || 0;
		var slides = this.getCurrentSlides();
		if(slides && slides[currentSlide] != undefined)
			return slides[currentSlide];
		return;
	}
	getCurrentSlides()
	{
		var amp = this.getAMPElement()[0];
		//console.log(amp,amp.implementation_)
		var slides = []
		var keys = ['L', ];
		var implementation = this.getAmpImplement();
		for(var i in implementation){
			var value = implementation[i]
			if($.isArray(value)){
				if(value.length > 0) {
					var s = $(value[0]);
					if(s.hasClass('i-amphtml-slide-item')){
						slides = value;
						break;
					}
				}
			}
			
			
		}
		//slides = amp.implementation_.L;
		var result = [];
		for(var i = 0;i < slides.length;i++)
		{
			var s = $(slides[i]);
			if(s.hasClass('i-amphtml-slide-item'))
				s = s.children('.amp-carousel-slide')
			result.push(s[0]);
		}
		return result;
	}
	updateView()
	{
		var that = this;
		this.getModuleTemplate().then(function(template)
		{
			var slides = that.getCurrentSlides();
			var newElement = that.compileTemplate(template);
			newElement = newElement.children('amp-carousel');
			newElement.html('');
			for(var i in slides){
				newElement.append(slides[i]);
			}
			newElement.unwrap();
			that.getElement().html(newElement);
		});
		
	}
	removeSlide(index)
	{
		var slides = this.getCurrentSlides();
		slides.splice(index, 1);
		this.updateSlide(slides);
	}
	initMutationObserver()
	{
		if(!this.mutationObject){
			const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
			
			var that = this;
			this.mutationObject = new MutationObserver(function(mutations) {
				var amp = that.getAMPElement()[0];
				
				mutations.forEach(function(mutation) {
					var needRelayout = false;
					if(mutation.type == 'childList'){
						var addedNodes = mutation.addedNodes;
						
						for(var i in addedNodes){
							
							if(addedNodes[i].nodeType && addedNodes[i].nodeType > 0 && addedNodes[i].nodeName.startsWith('AMP-'))
							{
								needRelayout = true;
								break;
							}
						}
						if(needRelayout){
							setTimeout(function(){
								var implementation = this.getAmpImplement();
								implementation != undefined && implementation.scheduleLayout != undefined && implementation.scheduleLayout(that.getCurrentActiveSlide());
							}, 500);
						}
					}
				});
				
			});
			const config = {
				//attributes: true,
				childList: true,
				characterData: true,
				subtree: true,
			};
			this.mutationObject.observe(this.element[0] || this.element, config);
			
		}
	}
	addSlide()
	{
		var slides = this.getCurrentSlides();
		var newSlide = $('<div class="slides"><div class="inner_slide"></div></div>');
		slides.push(newSlide[0]);
		this.updateSlide(slides);
	}
	updateSlide(slides)
	{
		var that = this;
		this.getModuleTemplate().then(function(template)
		{
			var newElement = that.compileTemplate(template);
			newElement = newElement.children('amp-carousel');
			newElement.html('');
			for(var i in slides){
				newElement.append(slides[i]);
			}
			newElement.unwrap();
			that.getElement().html(newElement);
		});
	}
}
module.exports = {
	
	default: line
}