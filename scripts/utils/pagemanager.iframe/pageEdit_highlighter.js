export default function(pageEdit_modules,lazyLoadWidget,pageEdit_function,pageEdit_constanst,pageEdit_highlighter_manager, $dialog)
{
	"ngInject";
	return function(element)
	{
		this.alignElement = element;
		this._create = function()
		{
			var sides = ['top', 'left', 'right', 'bottom'];
			for (var i=0;i < sides.length;i++) 
			{
				var side = sides[i];
				var sideCap = side.substring(0,1).toUpperCase() + side.substring(1);
				var highlight = this['highlight' + sideCap] = $('<div class></div>');
				highlight.addClass(pageEdit_constanst.highlight_element_class);
				jQuery_iframe('body').prepend(highlight);
			}
			pageEdit_highlighter_manager.register(this);
			
			this.id = jQuery_iframe(this.alignElement).attr('id');
			this.align();
			this.bindEvent();
		};
		this.getalignElement = function()
		{
			return this.alignElement;
		};
		this.show = function()
		{
			this._align();
		};
		this.hide = function()
		{
		};
		this._align = function()
		{
			var t = jQuery_iframe(this.alignElement);
			var offset = t.offset();
			 
			var top = Math.round(offset.top);
			var left = Math.round(offset.left);
			 
			var height = t.outerHeight();
			var width = t.outerWidth();
			if (height == 0 && width == 0) 
			{
				return;
			}
			var nleft = left + (width) /2;
			var ntop = 0;
			if(top > 20)		ntop = 0;
			else		ntop =  top + t.outerHeight();
			//divname.css({top: ntop, left: 0});
			this.highlightTop.css({top: top, left: left, width:width});
			this.highlightLeft.css({left: left, top: top, height: height});
			this.highlightBottom.css({top: (top+height), left: left, width: width});
			this.highlightRight.css({left: left+width, top: top, height: height});
			
		};
		this.align = function()
		{
			this._align();
		};
		this.create = function()
		{
			this._create();
			this._align();
			this.bindEvent();
		};
		this.remove = function()
		{
			pageEdit_highlighter_manager.deregister(this);
			this.highlightTop.remove();
			this.highlightLeft.remove();
			this.highlightBottom.remove();
			this.highlightRight.remove();
			jQuery_iframe(this.alignElement).off('resize');
		};
		this.bindEvent = function(point)
		{
			var that = this;
			jQuery_iframe(this.alignElement).on('resize', function()
			{
				pageEdit_highlighter_manager.align();
			});
		}
		this.create();
	};
	
}