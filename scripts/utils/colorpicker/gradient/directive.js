export default function($parse)
{
	"ngInject";
	
	return {
		require: 'ngModel',
		template:require('./template.tmpl'),
		scope: { ngModelData:'=ngModel' },
		link: function(scope, element, attrs, ngModel)
		{
			
			scope.$watch('model_data', function(n,o){
				if(n != undefined){
					console.log('model_data', ngModel, n);
					ngModel.$setViewValue(n);
				}
					
			})
		},
		controller: require('./controller').default
	};
}