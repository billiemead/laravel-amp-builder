var iframeScrollTop = function(iframe, value){
	
	var scrollElement = $('#edit_page').contents();
	if(value != undefined){
		scrollElement.scrollTop(value);
	}
	else{
		return scrollElement.scrollTop();
	}
}
var iframeScrollLeft = function(iframe, value){
	
	var scrollElement = $('#edit_page').contents();
	if(value != undefined){
		scrollElement.scrollLeft(value);
	}
	else{
		return scrollElement.scrollLeft();
	}
}
var updateAutoScroll = function(a)
{
	var e = $('#edit_page').contents();
	var iframe = window.edit_page;
	
	if(!(a==true && window.scrolling==false))
		if(a==true ||window.scrolling==false)
		{
			var s = iframeScrollTop(iframe);
			if(window.scrollingDirection=="up")
			{
				iframeScrollTop(iframe, s - 15);
			}
			else if(window.scrollingDirection=="down")
			{
				iframeScrollTop(iframe, s + 15);
			}
			if(!window.updatescroll)
				window.updatescroll = window.setInterval
				(
					function()
					{
						updateAutoScroll(true);
					},30
				);
		}
};
var handleScroll = function(event, ui)
{
	var edit_page_top = $("#edit_page").offset().top,
	edit_page_height = $("#edit_page").height(),
	edit_page_bottom = edit_page_top + edit_page_height,
	ui_top = $(ui.helper).offset().top,
	ui_bottom = ui_top + $(ui.helper).height();
	var edit_page_inner_height = $("#edit_page").contents().height();
	var o = (ui_top - edit_page_top), g =  edit_page_bottom - ui_bottom;
	if(o < 10)
	{
		window.scrolling = true;
		window.scrollingDirection = "up";
	}
	else if(g < 10)
	{
		window.scrolling=true;
		window.scrollingDirection = "down";
		
	}
	else
	{
		window.scrolling = false;
		window.scrollingDirection = null;
	}
	updateAutoScroll();
};
function createWidgetDraggable(element, options)
{
}
export {updateAutoScroll, handleScroll, iframeScrollTop, createWidgetDraggable, iframeScrollLeft};