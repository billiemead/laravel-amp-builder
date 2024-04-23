export default angular.module('app.filters', [])

.filter('lang', function($sanitize) {
	"ngInject";
	return function(term) {
		var v = window.Language.get(term);
		if(v != undefined){
			try{
				v = $sanitize(v);
				return v;
			}
			catch(e){
				//console.log(e);
			}
		}
	  
		return window.Language.get(term);
	};
})
.name;