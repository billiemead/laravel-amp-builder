var widgetFunction = require('./widgetModule');
function createWidgetDraggable(element, options)
{
	if(!angular.element(element).draggable)
		return;
	angular.element(element).draggable(
	{
		appendTo: "body",
		scroll:false,
		iframeFix: true,
		helper: function(event)
		{
			return '<div class="ww_widget_drag_helper ">' +
					'</div>';
		},
		start : function(event,ui)
		{
			window.scrolling = false;
			window.scrollingDirection=null;
			$('body').css('overflow', 'hidden');
			
			window.dragging = true;
			if(options.start){
				options.start(event, ui);
			}
		},
		drag : function(event,ui)
		{
			widgetFunction.handleScroll(event, ui);
			var dx = 0;//event.pageX - ui.position.left;
			var dy = 0//event.pageY - ui.position.top;
			var edit_page = $('#edit_page').contents();
			var x = $('#edit_page').offset().left;
			var f = event.pageX - x;
			var b = $('#control-panel-holder').outerHeight() ;
			var a = event.pageY - b;
			event.pageX = f + edit_page.scrollLeft();
			event.pageY = a + + edit_page.scrollTop();
			if(options.drag){
				options.drag(event, ui);
			}
		},
		stop : function(event,ui)
		{
			$('body').css('overflow', '');
			window.dragging = false;
			window.scrolling = false;
			window.scrollingDirection = null;
			window.clearInterval(window.updatescroll);
			delete window.updatescroll;
			if(options.stop){
				options.stop(event, ui);
			}
			
		}
	});
}
export default function($window, pageEdit_ddManager, pageEdit_layout)
{
	"ngInject";
	return {
		link: function(scope, element, attrs)
		{
			var type = attrs.widgetType;
			var emptyModule = pageEdit_layout.createEmptyModule(type);
			
			createWidgetDraggable(element, {
				start: function(event, ui){
					ui.helper.module = emptyModule;
					
					pageEdit_ddManager.init(event, ui);
				},
				drag: function(event, ui){
					ui.helper.module = emptyModule;
					pageEdit_ddManager._dragDrag(event, ui);
				},
				stop: function(event, ui){
					pageEdit_ddManager._drop_float_inner(event, ui).then(function(drp)
					{
						var element = drp.element;
						var pos = drp.direction;
						var dropInfo = drp.dropInfo;
						dropInfo.drag_drop = true;
						try{
							pageEdit_layout._insertFloatModule(element, type, dropInfo);
						}
						catch(e){
							console.log(e);
						}
						pageEdit_ddManager.destroy();
					});
				},
			});
		}
	}
}

function templateWidget(pageEdit_ddManager, API, pageEdit_layout)
{
	"ngInject";
	return {
		link: function(scope,element, attrs)
		{
			var type = attrs.widgetType + '_global';
			var systemId = attrs.systemId;
			var emptyModule = pageEdit_layout.createEmptyModule(type);
			createWidgetDraggable(element, {
				start: function(event, ui){
					ui.helper.module = emptyModule;
					pageEdit_ddManager.init(event, ui);
				},
				drag: function(event, ui){
					ui.helper.module = emptyModule;
					pageEdit_ddManager._dragDrag(event, ui);
				},
				stop: function(event, ui){
					
					pageEdit_ddManager._drop_float_inner(event, ui).then(function(drp)
					{
						
						var element = drp.element;
						var pos = drp.direction;
						var dropInfo = drp.dropInfo;
						var similarBlocks = emptyModule.findGlobalBlocks(systemId);
						if(similarBlocks && similarBlocks.length){
							var module = similarBlocks[0].cloneGlobal();
							
							module.move(dropInfo);
						}
						else{
							dropInfo.data = {system_id:systemId};
							API.service('template/structure/').get(systemId).then(function(structure){
								if(structure.pageContent != undefined){
									dropInfo.content = structure.pageContent;
									pageEdit_layout._insertFloatModule(element, type, dropInfo);
								}
							});
						}
						pageEdit_ddManager.destroy();
					});
				},
			});
		}
	}
}
export {templateWidget};