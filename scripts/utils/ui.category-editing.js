angular.module('ui.category_edit',[])
.service('category_edit_helperService', function()
{
	this.moveArrayElement = function(oldArrayElement, oldIndex, newArrayElement, newIndex)
	{
		var value;
		if($.isArray(oldArrayElement))
		{
			value = angular.copy(oldArrayElement[oldIndex]);
			//delete value.$$hashkey;
			oldArrayElement.splice(oldIndex ,1); 
		}
		else
		{
			value = angular.copy(oldArrayElement.items[oldIndex]);
			//delete value.$$hashkey;
			oldArrayElement.items.splice(oldIndex,1); 
		}
		if($.isArray(newArrayElement))
		{
			//newArrayElement.splice(newIndex + 1,0, value); 
		}
		else
		{
			if(!newArrayElement.items)
				newArrayElement.items = [];
			//newArrayElement.items.splice(newIndex + 1,0, value); 
		}
	};
	this.getElementData = function(element)
	{
		return angular.element(element).scope().item;
	};
	this.getParentData = function(element)
	{
		var parent = angular.element(element).parent();
		if(parent.is('ul'))
		{
			if(parent.parent().is('li'))
			{
				return angular.element(parent.parent()).scope().item;
			}
		}
		else if(parent.is('li'))
		{
			return angular.element(parent).scope().item;
		}
		else if(angular.element(element).is('ul'))
			return angular.element(element).scope().list;	
		return angular.element(parent).scope().list;	
	};
	this.intersect = function(draggable, droppable, toleranceMode) 
	{
		if (!droppable.offset) return false;
	
		var x1 = (draggable.positionAbs || draggable.offset()|| draggable.position.absolute).left, x2 = x1 + draggable.outerWidth(),
			y1 = (draggable.positionAbs || draggable.offset() || draggable.position.absolute).top, y2 = y1 + draggable.outerHeight();
		var l = droppable.offset().left, r = l + droppable.outerWidth() + 4,
			t = droppable.offset().top, b = t + droppable.outerHeight() + 4;
	
		switch (toleranceMode) {
			case 'fit':
				return (l <= x1 && x2 <= r
					&& t <= y1 && y2 <= b);
				break;
			case 'intersect':
				return (l < x1 + (draggable.outerWidth() / 2) // Right Half
					&& x2 - (draggable.outerWidth() / 2) < r // Left Half
					&& t < y1 + (draggable.outerHeight() / 2) // Bottom Half
					&& y2 - (draggable.outerHeight() / 2) < b ); // Top Half
				break;
			case 'pointer':
				var draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left),
					draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top),
					isOver = $.ui.isOver(draggableTop, draggableLeft, t, l, droppable.proportions.height, droppable.proportions.width);
				return isOver;
				break;
			case 'touch':
				return (
						(y1 >= t && y1 <= b) ||	// Top edge touching
						(y2 >= t && y2 <= b) ||	// Bottom edge touching
						(y1 < t && y2 > b)		// Surrounded vertically
					) && (
						(x1 >= l && x1 <= r) ||	// Left edge touching
						(x2 >= l && x2 <= r) ||	// Right edge touching
						(x1 < l && x2 > r)		// Surrounded horizontally
					);
				break;
			default:
				return false;
				break;
			}
	};
	this.moveIn = function(ui)
	{
		var t = ui;
		var d = $(t).parents().filter('li:first');
		var id = $('a.name:first',d).attr('data-id');
		p = d.prev();
		var old_parent = category_edit_helperService.getParentData(d);
		var oldIndex = d.index();
		if(p.length > 0)
		{
			var parent_id = $('a.name:first',p).attr('data-id');
			
			
			var ul = p.children('ul');
			var oids = [];
			if(ul.length == 0)
			{
				ul = $('<ul></ul>');
				p.append(ul);
			}
			ul.append(d);
			var newIndex = d.index();
			var new_parent = category_edit_helperService.getParentData(d);
			category_edit_helperService.moveArrayElement(old_parent, oldIndex, new_parent, newIndex);
			ul.children('li').each(function()
			{
				var id = $('a.name:first',this).attr('data-id');
				oids.push(id);
			});
			
			
		}
	};
	this.moveOut = function(ui)
	{
		var th = ui;
		var d = $(th).parents('li:first');
		var id = $('a.name:first',d).attr('data-id');
		var old_parent = category_edit_helperService.getParentData(d);
		var oldIndex = d.index();
		var p = d.parent('ul');
		if(p.length > 0)
		{
			var t = p.parent('li');
			if(t.length > 0)
			{
				if(d.next().length == 0)
				{
					var ul = t.parent('ul');
					var li  = ul.parent('li');
					var parent_id = $('a.name:first',li).attr('data-id') || 0;
					t.after(d);
					var newIndex = d.index();
					var new_parent = category_edit_helperService.getParentData(d);
					category_edit_helperService.moveArrayElement(old_parent, oldIndex, new_parent, newIndex);
				}
			}
		}
	}
})
.directive('uiCategoryEdit', ['$compile','$parse','$dialog','communication','category_edit_helperService','$templateCache','$controller', function($compile,$parse,$dialog,communication,category_edit_helperService,$templateCache,$controller)
{
	function link(scope, element, attrs, ngModel) {
		
		var modelGetter = $parse(attrs.ngModel);
    	var list = modelGetter(scope);
		
		var child_scope = scope.$new();
		child_scope.list = list;
		scope.$watch(attrs.ngModel, function(n,o)
		{
			child_scope.list = n;
		});
		child_scope.depth = 0;
		if(angular.isDefined(attrs.addButton))
		{
			$(addButton).click(function()
			{
				
			});
		}
		scope.toJSON = function(data)
		{
			return $.toJSON(data);
		}
		scope.add = function($event, $index)
		{
			var add_template_url = attrs.addTemplateUrl;
			var parentData = {};
			if(typeof $index != 'undefined')
			{
				var li  = $($event.currentTarget).parents('li:first');
				parentData = category_edit_helperService.getParentData(li);
				
			}
			var modalInstance = $dialog.open(
			{
				templateUrl:add_template_url,
				controller: function($scope,$modalInstance)
				{
					$scope.data = {};
					$scope.parentData = parentData;
					$scope.ok = function()
					{
						$modalInstance.close($scope.data);
					}
					$scope.cancel = function()
					{
						$modalInstance.dismiss('cancel');
					}
					if(angular.isDefined(attrs.addController))
					{
						var controller = attrs.addController;
						if(window[attrs.addController])
							controller = window[attrs.addController];
							
						$controller(controller, {$scope:$scope,$modalInstance:$modalInstance});
					}
				}
			});
			modalInstance.result.then(function(data)
			{
				
				if(typeof $index != 'undefined')
				{
					var li  = $($event.currentTarget).parents('li:first');
					var parentData = category_edit_helperService.getParentData(li);
					if($.isArray(parentData))
					{
						
						parentData.splice($index + 1,0, data); 
					}
					else
					{
						if(!parentData.items)
							parentData.items = [];
						if(typeof $index == 'undefined')
							$index = parentData.items.length - 1;
						parentData.items.splice($index + 1,0, data); 
					}
				}
				else
					child_scope.list.push(data);
			})
		}
		
		scope.edit = function($event,item,$index)
		{
			var add_template_url = attrs.addTemplateUrl;
			var parentData = {};
			if(typeof $index != 'undefined')
			{
				var li  = $($event.currentTarget).parents('li:first');
				parentData = category_edit_helperService.getParentData(li);
			}
			var edit_template_url = attrs.editTemplateUrl;
			var modalInstance = $dialog.open(
			{
				templateUrl:edit_template_url,
				controller: function($scope,$modalInstance)
				{
				//	var oldData = angular.copy(item);
					$scope.data = angular.copy(item);;
					$scope.parentData = {};
					$scope.ok = function()
					{
						item = angular.copy($scope.data);
						$modalInstance.close($scope.data);
					}
					$scope.cancel = function()
					{
						
						$modalInstance.dismiss('cancel');
					}
					if(angular.isDefined(attrs.editController))
					{
						var controller = attrs.editController;
						if(window[attrs.editController])
							controller = window[attrs.editController];
							
						$controller(controller, {$scope:$scope,$modalInstance:$modalInstance});
					}
				}
			});
			modalInstance.result.then(function(data)
			{
				if(typeof $index != 'undefined')
				{
					var li  = $($event.currentTarget).parents('li:first');
					var parentData = category_edit_helperService.getParentData(li);
					if($.isArray(parentData))
					{
						
						parentData.splice($index,1, data); 
					}
					else
					{
						if(!parentData.items)
							parentData.items = [];
						if(typeof $index == 'undefined')
							$index = parentData.items.length - 1;
						parentData.items.splice($index,1, data); 
					}
				}
			})
		}
		scope.$on('deleteDrag', function(event,locals )
		{
			var parentData = category_edit_helperService.getParentData(locals.old_parent);
			if($.isArray(parentData))
			{
				
				parentData.splice(locals.oldIndex ,1);
				if(!scope.$$phase)
					scope.$digest();
			}
			else
			{
				if(!parentData.items)
					parentData.items = [];
			
				parentData.items.splice(locals.oldIndex ,1);
				if(!scope.$$phase)
					scope.$digest();
			}
		});
		scope.$on('addDrag', function(event,locals )
		{
			var value;
			var oldArrayElement = category_edit_helperService.getParentData(locals.old_parent);
			var newArrayElement = category_edit_helperService.getParentData(locals.new_parent);
			if($.isArray(oldArrayElement))
			{
				value = angular.copy(oldArrayElement[locals.oldIndex]);
				oldArrayElement.splice(locals.oldIndex ,1);
				delete value.$$hashkey;
			}
			else
			{
				value = angular.copy(oldArrayElement.items[locals.oldIndex]);
				oldArrayElement.items.splice(locals.oldIndex ,1);
				delete value.$$hashkey;
			}
			if($.isArray(newArrayElement))
			{
				newArrayElement.splice(locals.newIndex,0, value);
				var params = {item:value,old_parent:oldArrayElement, oldIndex:locals.oldIndex,new_parent:newArrayElement, newIndex:locals.newIndex};
				if(angular.isDefined(attrs.onChangeOrder))
				{
					
					scope.$eval(attrs.onChangeOrder,params);
				}
				if(!scope.$$phase)
				scope.$digest();
			}
			else
			{
				if(!newArrayElement.items)
					newArrayElement.items = [];
				newArrayElement.items.splice(locals.newIndex,0, value);
				var params = {item:value,old_parent:oldArrayElement, oldIndex:locals.oldIndex,new_parent:newArrayElement, newIndex:locals.newIndex};
				if(angular.isDefined(attrs.onChangeOrder))
				{
					
					scope.$eval(attrs.onChangeOrder,params);
				}
				if(!scope.$$phase)
				scope.$digest();
			}			
		});
		scope.delete = function($event, $index)
		{
			var target = ($event.currentTarget);
			var li = $(target).parents('li:first');
			var parentData = category_edit_helperService.getParentData(li);
			var index = li.index();
			var deleteMessage = attrs.deleteMessage;
			var value = {};
			if($.isArray(parentData))
			{
				value = parentData[index];	
			}
			else
			{
				if(!parentData.items)
					parentData.items = [];
				value = parentData.items[index];
				
			}
			var modalInstance = $dialog.confirm(
			{
				title:'',
				message:deleteMessage,
				controller: function($scope,$modalInstance)
				{
					$scope.data = value;
					if(angular.isDefined(attrs.deleteController))
					{
						var controller = attrs.deleteController;
						if(window[attrs.deleteController])
							controller = window[attrs.deleteController];
							
						$controller(controller, {$scope:$scope,$modalInstance:$modalInstance});
					}
				}
			});
			modalInstance.result.then(function()
			{
				if($.isArray(parentData))
				{
					var value = parentData[index];
					
					parentData.splice(index ,1); 
					if(value.items != undefined)
					{
						for(var i in value.items)
						{
							//if(!value.items.hasOwnProperty(i))	continue;
							//parentData.splice(index ,0,value.items[i]); 
						}
					}
					scope.onChange();
				}
				else
				{
					if(!parentData.items)
						parentData.items = [];
					var value = parentData.items[index];
					parentData.items.splice(index ,1); 
					if(value.items != undefined)
					{
						for(var i in value.items)
						{
							//if(!value.items.hasOwnProperty(i))	continue;
							//parentData.items.splice(index ,0,value.items[i]); 
						}
					}
					scope.onChange();
				}
			})
		}
		scope.mouseOut = function($event)
		{
			var target = ($event.currentTarget);
			category_edit_helperService.moveOut(target);
			scope.onChange();
		}
		scope.mouseIn = function($event)
		{
			var target = ($event.currentTarget);
			category_edit_helperService.mouseIn(target);
			scope.onChange();
		}
		scope.onChange = function(item,old_paren, oldIndex,new_parent, newIndex)
		{
			if(ngModel)
				scope.$apply(ngModel.$setViewValue(scope.list));
			if(angular.isDefined(attrs.onChange))
			{
				scope.$eval(attrs.onChange,{item:scope,old_parent:scope.old_parent, oldIndex:scope.oldIndex,new_parent:scope.new_parent, newIndex:scope.newIndex});
			}
		}
		scope.ngClass = function(item)
		{
			if(angular.isDefined(attrs.ngClassItem))
				return scope.$eval(attrs.ngClassItem,{item: item})() || '';
			else
				return '';
		}
		child_scope.level = -1;
		var template = '<ul class="ui_category_edit_list" ng-model="list">'+
		'<li on-change="onChange()" ng-class="{{ngClass(item)}}" ng-init="level= level+1" ng-repeat="item in list" ng-include="\'uiCategoryEdit_recursiveTpl.html\'" category-draggable ng-model="item">' +
		'</li>'+
		'</ul>';
		var uiCategoryEdit_recursiveTpl = '<div class="ui_category_edit_draggable wrap" ng-init="item.level=$parent.level">' +
		'<table class="table">' +
		'<tr>'+
		
		
		'<td class="name">'+
		'<span style="padding:{{item.level*10}}px">'+
		'</span>'+
		'<span ng-if="item.level > 0"'+
		'<i class="font-arrow-right">'+
		'</i>'+
		'</span>'+
		'<span class="text">'+
		'{{item.name}}'+
		'</span>'+
		'</td>'+
		'<td class="buttons">'+
		
		 '<a href="javascript:void(0);" ng-click="add($event,$index)">' +
		'<i class="fa fa-plus"></i>'+
		'</a>'+
		
		'<a href="javascript:void(0);" ng-click="edit($event,item,$index)">' +
		'<i class="fa fa-pencil"></i>'+
		'</a>'+
		
		'<a href="javascript:void(0);" ng-click="delete($event,$index)">' +
		'<i class="fa fa-trash"></i>'+
		'</a>'+
		
		'</td>'+
		
		'</tr>'+
		'</table>' +
		
		'</div>' + 
		'<ul >' +
		'<li ng-repeat="item in item.items" ng-init="level= level+1" on-change="onChange()" ng-include="\'uiCategoryEdit_recursiveTpl.html\'" category-draggable ng-model="item">' +
		'</li>'+
		'</ul>';
		if(angular.isDefined(attrs.itemTemplate))
		{
			var item_template = scope.$eval(attrs.itemTemplate);
			uiCategoryEdit_recursiveTpl = item_template;
		}
		$templateCache.put('uiCategoryEdit_recursiveTpl.html', uiCategoryEdit_recursiveTpl);
		var colorpickerTemplate = angular.element(template);
		$compile(colorpickerTemplate)(child_scope);
		$(element).append(colorpickerTemplate);
	}
	return {
		required:'?ngModel',
		link:link
	}
}])
.directive('categoryDraggable', ['$dialog','communication','category_edit_helperService', function($dialog,communication,category_edit_helperService)
{
	function link(scope, element, attrs) {
		scope.itemHeight = parseFloat($('.wrap', element).outerHeight());
		var pul = $(element).parent('ul:first');
		scope.padding = parseFloat(pul.css('padding-left')) + parseFloat(pul.css('margin-left'));
		function handleDrag(event, ui)
		{
			f=ui.helper.offset().left ;
			b = 10;
			var itemHeight = scope.itemHeight;
			a=ui.helper.offset().top;
			var arr = [];
			var that = this;
			
			$('li.'+ drop_class +' .wrap').not('.no_droppable').not('.ui-helper').each(function()
			{
				var wrap_element = ui.helper.children('.wrap');
				var intersects = category_edit_helperService.intersect(wrap_element, $(this), 'intersect');
				var c = !intersects && this.isover == 1 ? 'isout' : (intersects  ? 'isover' : null);
				if(c =='isover')
				{
					arr.push(this);
				}
				else if(c =='isout')
					handleOut(this);
			});
			
			var e=arr[0];
			if(e)
			{
				var r=$(e).offset().top;
				a=a + itemHeight;//ui.helper.height();;
				f=a < ( r+ $(e).outerHeight()/2) ? "top":"bottom";
				handleOver(e,f,ui,event);
			}
			else
			{
				var l = ui.helper.originalLeft;
				var uleft = ui.helper.offset().left;
				var aleft = l;
				
				var pul = $(element).parent('ul:first');
				var padding = scope.padding;
				var itemHeight = scope.itemHeight;
				var l = (uleft - aleft >= padding - 5) ? 'left': ( (uleft - aleft < 5 -padding) ? 'right' : false );
				if(l !== false)
				{
					handleAddChildren(l,ui,event);
				}
			}
		};
		function handleAddChildren(l,ui,event)
		{
			var d = $(event.target);
			if(l == 'left')
			{
				var p = d.prev();
				
				if(p.length > 0)
				{
					var ul = p.children('ul');
					if(ul.length == 0)
					{
						ul = $('<ul></ul>');
						p.append(ul);
					}
					
					ul.append(d);
					scope.newIndex = ul.children().length;
					scope.new_parent =  ul;
					ui.helper.originalLeft = d.offset().left;
				}
			}
			else if(l == 'right')
			{
				var p = d.parent('ul');
				if(p.length > 0)
				{
					var t = p.parent('li');
					if(t.length > 0)
					{
						if(d.next().not(ui.helper).length == 0)
						{
							t.after(d);
							ui.helper.originalLeft = d.offset().left;
							scope.newIndex = d.index();
							scope.new_parent =  $(t).parent();
						}
					}
				}
			}
			else
				ui.helper.css('width','')
		};
		function handleOver(a,f,ui,event)
		{
			if(a.isover == 1 && a.direction == f )
				return;
			a.isover = 1;
			
			a.direction = f;
			var d = $(event.target);
			if(f == 'top')
			{
				if(!$(a).parent().prev().hasClass('dragging'))
				{
					$(a).parent().before(d);
					scope.newIndex = d.index();
					scope.new_parent =  $(a).parent().parent();
				}
			}
			else
			{
				if(!$(a).parent().next().hasClass('dragging'))
				{
					var ul = $(a).parent().children('ul');
					if(ul.length > 0 && ul.children().length > 0)
					{
						ul.prepend(d);
						scope.newIndex = 0;
						scope.new_parent =  ul;
					}
					else
					{
						$(a).parent().after(d);
						scope.newIndex = d.index();
						scope.new_parent =  $(a).parent().parent();
					}
					
					
				}
			}
			
		};
		function handleOut(a)
		{
			if(a.isover == 0)
				return;
			a.isover = 0;
			delete a.direction;
			$('.dump_element').remove();
		};
		function handleDrop(ui,event)
		{
			if(typeof scope.oldIndex != 'undefined'
			&& typeof scope.old_parent != 'undefined'
			&& typeof scope.newIndex != 'undefined'
			&& typeof scope.new_parent != 'undefined'
			)
			{
				scope.$emit('addDrag',{old_parent:scope.old_parent, oldIndex:scope.oldIndex,new_parent:scope.new_parent, newIndex:scope.newIndex});
				
				var d = $(event.target);
				d.remove();

				if(angular.isDefined(attrs.onChange))
				{
					scope.$eval(attrs.onChange,{old_parent:scope.old_parent, oldIndex:scope.oldIndex,new_parent:scope.new_parent, newIndex:scope.newIndex});
				}
			}
			
		};
		var drop_class = 'ui-category-edit-droppable';
		$(element).addClass(drop_class);
		$(element).draggable({
				helper:'clone',
				cancel:'td.buttons .dropdown',
				scroll: true,
				handle: '.wrap:first',
				start:function(event, ui)
				{
					var width = $(element).width();
					scope.old_parent = $(element).parent();
					scope.oldIndex = $(element).index();
					ui.helper.originalLeft = $(this).offset().left;
					ui.helper.scrolParent = element;
					ui.helper.css('z-index', 1000);
					ui.helper.css('position', 'absolute');
					$('.wrap:first',ui.helper).addClass('ui-helper');
					$(this).css('opacity', '0.5');
					$('.wrap:first',this).addClass('dragging');
					ui.dragging = $('.wrap:first',this);
					$('.wrap',this).addClass('no_droppable');
					$(ui.helper).width(width);
					$('#category_list .wrap').each(function()
					{
						this.isover = 0;
					});
				},
				drag: function(event, ui)
				{
					handleDrag(event, ui);
				},
				stop:function(event, ui)
				{
					$(this).css('z-index', '');
					$(this).css('opacity', '');
					ui.helper.remove();
					$('.dragging',this).removeClass('dragging');
					$('.no_droppable',this).removeClass('no_droppable');
					$('.wrap', element).each(function()
					{
						this.isover = 0;
					});
					handleDrop(this,event);
				}
			});
	
	}
	return {
		required:'?ngModel',
		link:link
	}
}]);
