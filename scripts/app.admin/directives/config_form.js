var _ = require('lodash');
export default function(safeApply, $dialog, API)
{
	"ngInject";
	return {
		scope:true,
		controller: function configEditCtrl($scope)
		{
			"ngInject";
			
		},
		compile: function() {
			return {
				post: function(scope, formElement, attr, controller) {
					var keys = [];
					
					API.service('config/' + attr.configForm).get('').then(function(json) {
						scope.data = angular.copy(json);
						safeApply(scope);
					});
				  
				},
				pre: function(scope, formElement, attr, controller) {
					if (!attr.action) {
				
						var preventDefaultListener = function(event) {
							event.preventDefault
							? event.preventDefault()
							: event.returnValue = false; // IE
						};
	
						$(formElement).bind( 'submit.saveConfig', function(event)
						{
							var rs = {data: {}};
							$('[ng-model]',this).each(function(){
								var key = $(this).attr('ng-model');
								var value = _.get(scope, key);
								if(value != undefined)
									_.set(rs, key, value);
							});
							API.service('config').post({type:attr.configForm, data:rs.data}).then(function(json)
							{
								if(json == 1) {
									$dialog.message({title:'Successfull', message:'Save Successfull'});
								}
								else {
									$scope.errors = json;
								}
								
							});
							
						});
					}
				}
			};
		}
	};
}