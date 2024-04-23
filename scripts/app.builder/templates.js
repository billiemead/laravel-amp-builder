var templates = require.context('../templates/', true, /^\.\/.*\.tmpl$/);
function getTemplate(type){
	var templatekeys = templates.keys();
	var template = "";
	for(var i in templatekeys){
		var n  = templatekeys[i];
		
		if(n == './' + type + '.tmpl'){
			template = templates(n);
		}
	}
	return template;
}
window.getTemplate = getTemplate;
