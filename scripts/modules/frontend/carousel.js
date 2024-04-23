var base = require('./slider').default;
class line extends base{
	
	_initModules(trigger)
	{
		var slides = this.getCurrentSlides();
		for(var i in slides){
			$(slides[i]).children('.' + this.getDefaultClass()).each(function(i)
			{
				var moduleInstance = pageEdit.createModule(this, false, trigger);
			});
		}
	}
	getContainer()
	{
		if(this.getCurrentActiveSlide())
			return $(this.getCurrentActiveSlide());
	}
	getChildModules()
	{
		var s = [];
		if(!this.isLoadCompleted())
			return s;
		var that = this;
		var slides = this.getCurrentSlides();
		for(var i in slides){
			$(slides[i]).children('.' + this.getDefaultClass()).each(function(i)
			{
				var module = pageEdit.getModule(this);
				if(module != undefined){
					s.push(module);
				}
			});
		}
		return s;
		
	}
	updateSlideImage(index, source)
	{
		var slides = this.getCurrentSlides();
		var slide = slides[index];
		var ampImage = $(slide).children('amp-img');
		ampImage.attr('src', source);
		ampImage.children('img').attr('src', source);
		//ampImage.after('<amp-img src="' + source + '" width="1" height="1" layout="fill" alt=""></amp-img>');
		//ampImage.remove();
	}
	addSlide(source)
	{
		var slides = this.getCurrentSlides();
		var newSlide = $('<div class=""><amp-img src="' + source + '" width="1" height="1" layout="fill" alt=""></amp-img></div>');
		slides.push(newSlide[0]);
		//console.log(this.getCurrentSlides());
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
				var s = $(slides[i]);
				if(s.hasClass('i-amphtml-slide-item'))
					s = s.children('.amp-carousel-slide')
				newElement.append(s);
			}
			newElement.unwrap();
			that.getElement().html(newElement);
			//console.log(that.getCurrentSlides());
		});
		
	}
}
module.exports = {
	
	default: line
}