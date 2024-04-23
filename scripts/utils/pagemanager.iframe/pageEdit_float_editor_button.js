var widgetFunction = require('../../app.builder/directives/widgetModule');

export default function($window, pageEdit, pageEdit_event, pageEdit_layout, commonUtils, pageEdit_ddManager)
{
	"ngInject";
	this.buttons = {};
	this.activeModule;
	this.modules = [];
	this.groupModule;
	this.isGrouping = function()
	{
		return this.groupModule && this.groupModule.isGrouping();
	}
	this.init = function(module){
		
		var element = module.getElement();
		this.bindDraggable(module);
		this.initMutationObserver(element);
		this.module = module;
		var that = this;
		
		element.off('click');
		element.on('click', function(event)
		{
			var ctrlKey = event.ctrlKey;
			if(event.button == 0 || event.isTrigger == 3){
				event.stopPropagation();
				
				if(that.activeModule && that.activeModule == module){
					
					return;
				}
				if(!module.canClick()){
					return;
				}
				that.unhighlightModule(module);
				that.createModuleInfo(module);
				module.select();
				
				$(window).trigger('widget_selected', [module]);
				if(event.isTrigger == 3){
					if(module.isOutOfViewport())	
						module.getElement().get(0).scrollIntoView(false);
				}
			}
			event.preventDefault()
		});
		element.off('mouseout');
		element.off('mouseover');
		element.on('mousedown', function(event){
			//event.stopPropagation();
		});
		element.on('mouseout', function(event){
			$(this).removeAttr('state', ':hover');
			that.unhighlightModule(module);
			event.stopPropagation();
		});
		element.on('mouseover', function(event){
			$(this).attr('state', ':hover');
			event.stopPropagation();
			if(window.dragging || (that.activeModule && that.activeModule == module)){
				return;
			}
			if(!module.canHover()){
				return;
			}
			that.highlightModule(module)
		});
		
	}
	this.onModuleSelected = function(module)
	{
		return;
		var iframe_document = pageEdit.iframe.getWindow();
		var $context = jQuery_iframe(iframe_document);
		var that = this;
		$context.off('click.float_widget');
		$context.on('click.float_widget', function(event){
			console.log('click.float_widget', window.dragging);
			if((event.button == 0 || event.isTrigger == 3) && !window.dragging){
				$context.off('click.float_widget');
				that.removeModuleInfo(module);
				$(window).trigger('widget_deselected', [module]);
			}
			
		});
	}
	this._createModuleInfoButton = function(module, button, holder)
	{
		var btn = jQuery_iframe('<button class="btn btn-primary ' + button.icon + '" />');
		holder.append(btn);
		
		var that = module;
		btn.attr('action', button.onclick);
		btn.on('click', function(event)
		{
			var action = $(this).attr('action');
			if(that[action] != undefined && typeof that[action] == 'function')
				that[action](event);
		});
		return btn;
	}
	this.removeModuleInfo = function(module)
	{
		var index = this.modules.indexOf(module);
		this.modules.splice(index, 1);
		if(this.alignModule == module){
			delete this.alignModule;
		}
		if(this.activeModule == module){
			delete this.activeModule;
		}
		this.needReposition();
		jQuery_iframe('#module-resize').remove();
		if(this.groupModule){
			this.groupModule.clear();
		}
		//delete this.activeModule;
		this.unbindEvent(module);
		
		module.onDeselect();
	};
	this.unbindEvent = function(module)
	{
		module.getElement().off('resize.float_button');
	}
	this.needReposition = function()
	{
		if(this.alignModule == undefined){
			return true;
		}
		return false;
	}
	this.createPlaceholder = function(id)
	{
		var div = jQuery_iframe('<div class=""/>');
		if(id != undefined)
			div.attr('id', id);
		['top', 'left', 'bottom', 'right'].forEach(function(v)
		{
			var d = jQuery_iframe('<div class="direction"></div>');
			d.addClass(v);
			div.append(d);
		})
		return div;
	}
	
	this.getTransformBox = function()
	{
		var div = jQuery_iframe('#module-resize');
		if(div.length)
			return div;
	}
	this.createTransformBox = function()
	{
		var div = jQuery_iframe('#module-resize');
		if(div.length == 0){
			div = this.createPlaceholder('module-resize');
			
			var buttons = jQuery_iframe('<div class="btn-group" id="module-editor-buttons"></div>');
			div.append(buttons);
			jQuery_iframe('body').append(div);
		}
		return div;
	}
	
	this.getHoverBox = function()
	{
		var div = jQuery_iframe('#module-hover-resize');
		if(div.length)
			return div;
	}
	this.createHoverBox = function()
	{
		var div = jQuery_iframe('#module-hover-resize');
		if(div.length == 0){
			div = this.createPlaceholder('module-hover-resize');
			div.append('<label/>');
			jQuery_iframe('body').append(div);
		}
		return div;
	}
	this.getDroppingBox = function()
	{
		var div = jQuery_iframe('#dropping-highlight');
		if(div.length)
			return div;
	}
	this.initMutationObserver = function(element)
	{
		if(!this.mutationObject){
			var win = pageEdit_event.iframe.getWindow();
			const MutationObserver = win.MutationObserver || win.WebKitMutationObserver || win.MozMutationObserver;
			var that = this;
			this.mutationObject = new MutationObserver(function(mutations) {
				that.positionBlock();
				mutations.forEach(function(mutation) {
					
				});
			});
			const config = {
				attributes: true,
				childList: true,
				characterData: true,
				subtree: true,
			};
			var main_sections = jQuery_iframe('#main_sections');
			var popup_container = jQuery_iframe('#popup-container');
			main_sections.length && this.mutationObject.observe(main_sections[0], config);
			popup_container.length && this.mutationObject.observe(popup_container[0], config);
			
		}
	}
	this.createDroppingBox = function()
	{
		var div = jQuery_iframe('#dropping-highlight');
		if(div.length == 0){
			div = this.createPlaceholder('dropping-highlight');
			jQuery_iframe('body').append(div);
		}
		return div;
	}
	this.unhighlightModule = function(module)
	{
		var div = this.getHoverBox();
		if(!div)
			return;
		div.remove();
	}
	this.removeDropHighlight = function(module)
	{
		var div = this.getDroppingBox();
		if(!div)
			return;
		div.remove();
	}
	this.dropHighlight = function(module)
	{
		var div = this.createDroppingBox();
		div.attr('class', 'module-hover-resize-' + module.getType());
		this.positionHoverBlock(module, div);
	}
	this.highlightModule = function(module)
	{
		var div = this.createHoverBox();
		div.attr('class', 'module-hover-resize-' + module.getType());
		$('label',div).html(module.getWidgetDisplayName());
		this.positionHoverBlock(module);
	}
	this.createModuleInfo = function(module)
	{
		var controlIcons = module.getControlIcons();
		if(controlIcons == false)	return;
		var unique_id = module.getElement().attr('id');
		var iframe = $("iframe#edit_page")[0];
		iframe.contentWindow.focus();
		var controlIconButtons = {};
		var that = this;
		var element = module.getElement();
		var div = this.createTransformBox();
		div.attr('class', 'module-resize-' + module.getType());
		var buttons  = jQuery_iframe('#module-editor-buttons');
		buttons.html("");
		for(var i in controlIcons)
		{
			if(!controlIcons[i])	continue;
			controlIconButtons[i] = this._createModuleInfoButton(module, controlIcons[i], buttons);
			
		}
		this.modules.push(module);
		this.buttons[unique_id] = controlIconButtons;
	
		this.setModuleInfoPosition(module);
		this.bindEvent(module);
		var oldActiveModule = this.activeModule;
		this.activeModule = module;
		if(oldActiveModule != undefined){
			this.unbindEvent(oldActiveModule);
			oldActiveModule.onDeselect();
		}
		module.onSelect();
		this.onModuleSelected(module);
	};
	
	this.bindEvent = function(module)
	{
		var that = this;
		var element = this.getTransformBox();
		if(!element.length)
			return;
		
		var iframe_document = pageEdit.iframe.getDocument();
		var $context = jQuery_iframe(iframe_document);
		
		
		function onkeydown(event, context){
			var keyCode = event.keyCode;
			// Delete key
			var isIframeTarget = jQuery_iframe('body')[0] == event.target;
			if(!isIframeTarget){
				//console.log('keydown.float_button', event.target, jQuery_iframe('body')[0] == event.target)
				return;
			}
				
			//console.log('keydown.float_button', iframe_document, isIframeTarget, event.target)
			if(keyCode == 46) {
				
				module.softDelete(that);
			}
			event.stopPropagation();
		
				
		}
		$(document).off('keydown.float_button');
		$context.off('keydown.float_button');
		$(document).on('keydown.float_button', function(e)
		{
			
			onkeydown(e, $context);
			
		});
		
		$context.on('keydown.float_button', function(e)
		{
			
			onkeydown(e, $context);
			
		});
		module.getElement().off('resize.float_button, changeVisibility.float_button');
		module.getElement().on('resize.float_button, changeVisibility.float_button', function(e)
		{
			e.stopPropagation();
			that.positionBlock();
			
		});
		var iframe_window = jQuery_iframe(pageEdit.iframe.getWindow());
		
		iframe_window.off('resize.float_button');
		iframe_window.on('resize.float_button', function(e)
		{
			if(!window.dragging)
				that.positionBlock();
			
		});
		$(window).on('changePageTab.float_button, changePageVariant.float_button', function()
		{
			that.removeModuleInfo(module);
		});
		this.bindResizable(module);
	}
	
	this.bindResizable = function(module)
	{
		var element = this.getTransformBox();
		if(element.resizable( "instance" ) != undefined){
			element.resizable( "destroy" );
		}
		
		if(module.isResizable()){
			var startPos = {};
			var startSize = {};
			var distance = {};
			var sizeChanged = {};
			
			var that = this;
			var resizeHandles = "se, sw,nw,ne,n, e, s, w";
			if(module.getResizableHandles)
				resizeHandles = module.getResizableHandles();
			element.resizable({
				handles:  resizeHandles,
				start: function(event, ui)
				{
					window.dragging = true;
					module.is_resizing = true;
					module.startResize(event, ui);
					
				},
				resize: function( event, ui ) {
					
					module.handleResizeEvent(event, ui);
					that.positionBlock();
				},
				stop: function(event, ui){
					module.handleStopResizeEvent(event, ui);
					module.is_resizing = false;
					window.dragging = false;
				}
			});
		}
	}
	this.bindDraggable = function(module, alsoDrag)
	{
		if(module.draggable){
			var dragElement = module.getElement();
			var that = this;
			if(dragElement.draggable( "instance" ) == undefined){
				var distance;
				var dragHandler;
				var helper;
				if(module.getDragHandler)
					dragHandler = module.getDragHandler();
				if(module.getDragHelper)
					helper = module.getDragHelper();
				var currentScrollTop;
				var currentScrollLeft;
				dragElement.draggable({
					iframeFix: true,
					handle: dragHandler || false,
					cancel:false,
					helper: function(event)
					{
						return '<div class="ww_widget_drag_helper">' +
								'<span class="ww_widget_drag_helper_image">'+
								//'<img class="" src="' + window.top.basePath + preview + '" alt="" />'+
								'</span>' +
								'</div>';
					},
					appendTo: "body",
					delay:300,
					cursorAt: { left: 15, top:15 },

					start: function(event, ui)
					{
						window.scrolling=false;
						window.scrollingDirection=null;
						window.dragging = true;
						module.is_dragging = true;
						module.startDrag();
						ui.module = module;
						ui.helper.module = module;
						pageEdit_ddManager.init(event, ui);
					},
					drag: function( event, ui ) 
					{
						ui.helper.module = module;
						ui.module = module;
						pageEdit_ddManager._dragDrag(event, ui);
						
					},
					stop: function(event, ui){
						window.dragging = false;
						window.scrolling=false;
						window.scrollingDirection=null;
						window.clearInterval(window.updatescroll);
						delete window.updatescroll;
						
						
						delete module.is_dragging;
						
						delete that.is_moving;
						var moduleInstance = ui.helper.module;
						pageEdit_ddManager.destroy();
						pageEdit_ddManager._drop_float_inner(event, ui).then(function(drp)
						{
							
							moduleInstance.moveTo(drp);
							
							jQuery_iframe(m).removeClass('moving');
							moduleInstance.unhover();
							pageEdit_ddManager.destroy();
							
						});
						return;
						
					}
				});
			}
		}
	}
	this.setModuleInfoPosition = function(module)
	{
		
		this.alignModule = module;
		this.positionBlock();
	};
	this._positionBlock = function(block, module)
	{
		var offset = module.getRealOffset();
		
		block.show();
		block[0].style.top = offset.top + "px";
		block[0].style.left= offset.left + "px";
		block[0].style.width = offset.width + "px";
		block[0].style.height = offset.height + "px";
	}
	this.positionHoverBlock = function(module, element){
		var block = element;
		if(!block)
			block = this.getHoverBox();
		if(!block)
			return;
		block.show();
		this._positionBlock(block, module);
		
	}
	this.positionBlock = function(){
		var block = this.getTransformBox();
		if(!block)
			return;
		
		if(this.alignModule){
			if(!this.alignModule.getCurrentVisibility()){
				block.hide();
			}
			else if(this.alignModule.getType()== 'group'){
				block.show();
				var bounding = this.alignModule.getBoundingByChildren();
				if(bounding.top && bounding.left && bounding.right && bounding.bottom){
					block[0].style.top = bounding.top + "px";
					block[0].style.left = bounding.left + "px";
					block[0].style.width = (bounding.right - bounding.left) + "px";
					block[0].style.height = (bounding.bottom - bounding.top) + "px";
				}
			}
			else{
				var module = this.alignModule;
				this._positionBlock(block, module);
			}
		}
	}
}