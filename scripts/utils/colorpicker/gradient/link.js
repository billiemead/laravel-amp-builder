export default function(scope, element, attrs, ngModel)
{
	var onChangeCallback = $parse(attrs.ngChange) || null;
	scope.$watch('data', function(n,o){
		if(n != undefined){
			ngModel.$setViewValue(n, true);
			if (onChangeCallback ){
				scope.$apply(function () {
					onChangeCallback(scope, {});
				});
			}
		}
			
	})
}

