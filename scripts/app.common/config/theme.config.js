function configThemes(themes, $mdThemingProvider)
{
	for(var i in themes){
		var theme = themes[i];
		var mdTheme = $mdThemingProvider.theme(i);
		for(var color in theme){
			var value = theme[color];
			
			if(typeof mdTheme[color + 'Palette'] == 'function'){
				var params = value;
				if(typeof value == 'string')
					params = [value];
				try{
					mdTheme[color + 'Palette'].apply(mdTheme, params);
				}
				catch(e){
					
				}
			}
		
		}
		if(theme.dark)
			mdTheme.dark();
	}
}
export default function($mdThemingProvider, AclServiceProvider, $locationProvider, $qProvider) {
	"ngInject";
	
	if(window.themes != undefined){
		configThemes(window.themes, $mdThemingProvider)
	}
	if(window.currentTheme != undefined && window.currentTheme != 'default'){
		$mdThemingProvider.setDefaultTheme(window.currentTheme);
	}
	var customStyleTags = $('head > script[type="text/style"]');
	if(customStyleTags.length){
		customStyleTags.each(function(){
			var style = $(this).html();
			$mdThemingProvider.registerStyles(style);
			$(this).remove();
		});
	}
	var myConfig = {
		storage: false,
		storageKey: 'AppAcl'
	  };
	  AclServiceProvider.config(myConfig);
	$locationProvider.hashPrefix('');
	$qProvider.errorOnUnhandledRejections(false);
}
