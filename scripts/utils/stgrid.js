var phpDateParser = require('../app.common/filters/phpDate').parser;
export default angular.module('stgrid',['datatables'])

.controller('stGridController', function stGridCtrl($scope,DTOptionsBuilder, DTColumnBuilder,$compile,dateFilter, safeApply, API)
{
	$scope.columns= [];
	$scope.stGrid = $scope.stGrid || {};
	$scope.stFilters = $scope.stFilters || {};
	$scope.stGridRowButton = $scope.stGridRowButton || {};
	$scope.buttons = [];
	$scope.primaryField = $scope.primaryField || 'id';
	$scope.column_button ={field:'Button',displayName:'',enableFiltering:false,enableSorting :false,enableColumnMenu: false};
	$scope.columns.push($scope.column_button);
	var titleHtml = '<input ng-model="selectAll" ng-change="toggleAll()" type="checkbox"/>';
	$scope.selected = {};
	
	$scope.selectAll = false;
    $scope.dtColumns = [
		
    ];
	$scope.dtColumns.push(
		DTColumnBuilder.newColumn('Button').withTitle('&nbsp').notSortable().withOption('searchable', false)
            .renderWith(function(data, type, full, meta) {
				var s = '';
                for(var i in $scope.buttons){
					var cellTemplate = $scope.buttons[i].cellTemplate;
					
					s += cellTemplate;
				}
				return s;
				
            })
    );
	$scope.showDate = function(datestring)
	{
		try
		{
			var date =  $.datepicker.parseDate( 'yy-mm-dd', datestring ) ;
			return  $.datepicker.formatDate( t('mm/dd/yy'), date);
		}
		catch(e)
		{
			return '';
		}
	}
	$scope.toggleAll = function() {
		
		var selectedItems = $scope.selected;
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                selectedItems[id] = $scope.selectAll;
            }
        }
		setSelected();
    }
    $scope.toggleOne = function() {
		setSelected();
		var selectedItems = $scope.selected;
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                if(!selectedItems[id]) {
                    $scope.selectAll = false;
                    return;
                }
            }
        }
        $scope.selectAll = true;
    }
	function getSelected()
	{
		var rs = [];
		var selectedItems = $scope.selected;
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                if(selectedItems[id]) {
                    rs.push(id);
                    
                }
            }
        }
		return rs;
	}
	function setSelected()
	{
		$scope.stGrid = $scope.stGrid || {};
		$scope.stGrid.selections = getSelected();
	}
	this.addButton = function(button)
	{
		$scope.buttons.push(button);
	}
	this.addColumn = function(column)
	{
		var index = $scope.dtColumns.length - 1;
		$scope.dtColumns.splice(index, 0, column)
	}
	this.addLinkColumn = function(column)
	{
		var index = $scope.dtColumns.length - 1;
		var c = DTColumnBuilder.newColumn(column.field).withTitle(column.displayName).renderWith(function(data, type, full) {
            return '<a href="javascript:void(0);" ng-click="stGridRowButton.' + column.ngClick + '(' + full[$scope.primaryField] + ')">'+data + '</a>';
		})
		$scope.dtColumns.splice(index, 0, c)
	}
	
	
	$scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('simple')
		.withOption('order', [[0, 'desc']])
		.withOption('headerCallback', function(header) {
            if (!$scope.headerCompiled) {
                $scope.headerCompiled = true;
                $compile(angular.element(header).contents())($scope);
            }
        })
		.withOption('createdRow', function(row, data, dataIndex) {
			
			var newscope = $scope.$new();
			newscope.row = data;
			
            $compile(angular.element(row).contents())(newscope);
			safeApply(newscope);
       })
	   .withOption('responsive', {
			details: {
				renderer: function ( api, rowIdx, columns ) {
						
						
						var data = $.map( columns, function ( col ) {
							return col.hidden ?
								'<li data-dtr-index="'+col.columnIndex+'" data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
									'<span class="dtr-title">'+
										col.title+
									'</span> '+
									'<span class="dtr-data">'+
										col.data+
									'</span>'+
								'</li>' :
								'';
						} ).join('');
						var newscope = $scope.$new();
						var rowData = api.data();
						newscope.row = rowData[rowIdx];
						data && (data = $compile(data)(newscope));
						return data ?
							$('<ul data-dtr-index="'+rowIdx+'" class="dtr-details"/>').append( data ) :
							false;
					}
			}
	   })
	  .withDOM("<'row'<'col-sm-6'><'col-sm-6'f>>" +
"<'row'<'col-sm-12'tr>>" +
"<'row'<'col-sm-5'l><'col-sm-7'ip>>",)
	var url;
	if(angular.isDefined($scope.stGridUrl) && $scope.stGridUrl.length > 0){
		url = $scope.stGridUrl;
	}
	else if(angular.isDefined($scope.stGridName) && $scope.stGridName.length > 0)
	{
		url = communication.getPagedListUrl($scope.stGridName,{},$scope.path);
	}
	
	if(url != undefined && url.length > 0)
	{
		$scope.dtOptions
		.withOption('ajax', function(instance, callback, data, oSettings){
			if($scope.stFilters){
				for(var i in $scope.stFilters) {
					if(!$scope.stFilters[i]) continue;
					instance.filters = instance.filters || {};
					if(typeof $scope.stFilters[i].getMonth === 'function') {
						instance.filters[i] = dateFilter($scope.stFilters[i], 'yyyy-MM-dd');
					}
					else
						instance.filters[i] = $scope.stFilters[i];
				}
			}
			
			return API.service('pagedList/' + $scope.stGridName).post(instance).then(function(json){
				callback(json);
			});
		})
		.withDataProp('data')
		.withOption('processing', true)
		.withOption('serverSide', true);
	}
	

	$scope.button_click = function(cl, row)
	{
		if(angular.isDefined($scope.stGridRowButton[cl]))
			$scope.stGridRowButton[cl](row);
	}
	$scope.dtInstanceCallback = dtInstanceCallback;
    function dtInstanceCallback(dtInstance) {
        $scope.stGrid = $scope.stGrid || {};
		$scope.stGrid.instance = dtInstance;
    }
	

})
.directive('stGrid', [function()
{
	return {
		template:'<div class="st_grid"><div ng-transclude></div><table datatable  dt-options="dtOptions" dt-columns="dtColumns" dt-instance="dtInstanceCallback" class="row-border hover"></table></div>',
		
		scope: {
		  stGrid:'=',
		 // stOptions:'=',
        //  stPanigation:'=',
		  stGridName:'@',
		  stGridUrl:'@',
		//  stGridRowButton:'=',
		  stFilters:'=?',
		  path:'@',
		  primaryField:'@'
        },
		transclude:true,
		replace:true,
		controller:'stGridController',
		
	}
}])
.directive('stGridColumn', ['DTColumnBuilder', function(DTColumnBuilder)
{
	return {
		//template:'<span></span>',
		require:'^stGrid',
		restrict: 'E',
		//replace: true,
		scope:{
			field:'@',
			type:'@',
			displayName:'@',
			listType:'@',
			cellTemplateFunc :'=',
			cellTemplateVar :'@',
			cellTemplate :'@',
			displayField:'@',
			listPath:'@',
			valueField:'@',
			displayField2:'@',
			valueField2:'@',
			listType2:'@',
			listPath2:'@',
			cellClass :'@',
			enableFiltering:'@',
			enableSorting:'@',
			list:'@'
		},
		compile: function(element, attrs)
		{
			
			var html = angular.element(element).html();
			html = $.trim(html);
			return {
				pre: function(scope, element, attributess, stGridCtrl){						
					var c = DTColumnBuilder.newColumn(scope.field).withTitle(scope.displayName);
					if(attributess.notSortable != undefined) {
						c.notSortable();
					}
					if(attributess.notSearchable != undefined) {
						c.withOption('searchable', false);
					}
					
					
					if(html.length > 0)
						c.renderWith(function(data, type, full) {
							return html;
						});
					else if(scope.cellTemplateVar != undefined)
					{
						c.renderWith(function(data, type, full) {
							return scope.cellTemplateVar.replace(/{\'{/g, "{{").replace(/}\'}/g, "}}") ;
						});
					}
					
					else
					{
						switch(scope.type)
						{
							case 'manuallist':
								scope.manuallist = $.parseJSON(scope.list);
								c.renderWith(function(data, type, full) {
									return scope.manuallist[data || 0];
								});
								break;
							case 'datetime':
								c.renderWith(function(data, type, full) {
									var format = (attrs.format != undefined ? (attrs.format) :"human" );
									return phpDateParser(data, format);
								});
								break;
							case 'currency':
								c.renderWith(function(data, type, full) {
									try
									{
										return  scope.$root.currencyService.format(data, 0, 0) ;
									}
									catch(e)
									{
										return data;
									}
								});
								break;
							case 'array':
								c.renderWith(function(data, type, full) {
									var rs = [];
									for(var i in data)
									{
										if(!data.hasOwnProperty(i)) continue;
										rs.push(data[i][scope.displayField]);
									}
									return rs.join();
								});
								break;
						}
					}
					stGridCtrl.addColumn(c);
				},
				post: function(scope, element, attributes, controller, transcludeFn){
					var el = angular.element(element);
					el.hide();
				}
			}
		}
	}
}])
.directive('stGridColumnButton', ['commonUtils', function(commonUtils)
{
	return {
		require:'^stGrid',
		restrict: 'E',
		//replace: true,
		scope:{
			
		},
	
		compile: function(element, attrs)
		{
			return {
				pre: function(scope, element, attributess, stGridCtrl){
					var column = {};
					column.cellTemplate = "<md-button";
					var el = angular.element(element);
					for(var i in attrs){
						var j = commonUtils.toDashCase(i);
						if(el.attr(j) != undefined)
							column.cellTemplate += " " + j + "='" + attrs[i] + "'"
					}
				
					column.cellTemplate += ">" + el.html() + "</md-button>";
					stGridCtrl.addButton(column);
				},
				post: function(scope, element, attributes, controller, transcludeFn){
					var el = angular.element(element);
					el.hide();
				}
			}
		}
	}
}])
.directive('stGridColumnLink', ['DTColumnBuilder',function(DTColumnBuilder)
{
	return {
		template:'<span class=""></span>',
		require:'^stGrid',
		restrict: 'E',
		replace: true,
		scope:{
			field:'@',
			type:'@',
			displayName:'@',
			emptyText:'@',
			listType:'@',
			cellTemplateFunc :'=',
			cellTemplateVar :'@',
			displayField:'@',
			listPath:'@',
			valueField:'@',
			displayField2:'@',
			valueField2:'@',
			listType2:'@',
			listPath2:'@',
			cellClass :'@',
			enableFiltering:'@',
			enableSorting:'@',
			list:'@',
			buttonName:'@',
			ngClick:'@',
			ngClass:'@',
			stClass:'@',
			displayName:'@',
			primaryField:'@'
		},
	
		compile: function(element, attributes)
		{
			return function postLink(scope, element, attrs, stGridCtrl)
			{
				scope.primaryField = scope.primaryField || 'id';
				var c = DTColumnBuilder.newColumn(scope.field).withTitle(scope.displayName);
				if(attrs.notSortable != undefined) {
					c.notSortable();
				}
				
				if(scope.cellTemplateVar != undefined)
				{
					c.renderWith(function(data, type, full) {
						return '<a href="javascript:void(0);" ng-click="stGridRowButton.' + scope.ngClick + '(' + full[scope.primaryField] + ')">'+scope.cellTemplateVar.replace(/{\'{/g, "{{").replace(/}\'}/g, "}}") + '</a>';
					});
				}
				else if(scope.type!=undefined)
				{
					switch(scope.type)
					{
						case 'manuallist':
							scope.manuallist = $.parseJSON(scope.list);
							c.renderWith(function(data, type, full) {
								
									
								return '<a href="javascript:void(0);" ng-click="stGridRowButton.' + scope.ngClick + '(' + full[scope.primaryField] + ')">'+scope.manuallist[data]+ '</a>';
							});
							break;
						case 'datetime':
							c.renderWith(function(data, type, full) {
								var format = (attrs.format != undefined ? (attrs.format) :"human" );
								try
								{
									var date =  phpDateParser(data, format);
									return  '<a href="javascript:void(0);" ng-click="stGridRowButton.' + scope.ngClick + '(' + full[scope.primaryField] + ')">'+ date + '</a>';
								}
								catch(e)
								{
									return '<a href="javascript:void(0);" ng-click="stGridRowButton.' + scope.ngClick + '(' + full[scope.primaryField] + ')">'+data+ '</a>';
								}
							});
							break;
						case 'currency':
							c.renderWith(function(data, type, full) {
								try
								{
									return  '<a href="javascript:void(0);" ng-click="stGridRowButton.' + scope.ngClick + '(' + full[scope.primaryField] + ')">'+scope.$root.currencyService.format(data, 0, 0)+ '</a>' ;
								}
								catch(e)
								{
									return '<a href="javascript:void(0);" ng-click="stGridRowButton.' + scope.ngClick + '(' + full[scope.primaryField] + ')">'+data+ '</a>';
								}
							});
							break;
						case 'array':
							c.renderWith(function(data, type, full) {
								var rs = [];
								for(var i in data)
								{
									if(!data.hasOwnProperty(i)) continue;
									rs.push(data[i][scope.displayField]);
								}
								return '<a href="javascript:void(0);" ng-click="stGridRowButton.' + scope.ngClick + '(' + full[scope.primaryField] + ')">'+rs.join()+ '</a>';
							});
							break;
					}
				}
				else
					c.renderWith(function(data, type, full) {
						var value = data;
						if(data != undefined && data.length==0)
							value = scope.emptyText;
						return '<a href="javascript:void(0);" ng-click="stGridRowButton.' + scope.ngClick + '(' + full[scope.primaryField] + ')">'+value + '</a>';
					});
				stGridCtrl.addColumn(c);
			}
		}
	}
}])
.directive('stGridButton', [function()
{
	return {
		template:'<button class="{{class}}" ng-hide="hide" ng-click="">{{displayName}}</button>',
		require:'^stGridColumnButton',
		restrict: 'E',
		replace: true,
		scope:{
			class:'@',
			displayName: '@',
			onClick:'&click',
			hide:'=?'
		},
		controller: function($scope)
		{
			$scope.hide = $scope.hide||false;
			$scope.click=function()
			{
				$scope.onClick();
			}
		},
		compile: function(scope, element, attrs, uiGridCtrl)
		{
		}
	}
}]).name;