var createModuleDefinition = function(bases, moduleDefinition)
{
	var m = {};
	var parents = [];
	for(var i in bases)
	{
		if(!bases.hasOwnProperty(i))	continue;
		parents.push(bases[i]);
	}
	
	moduleDefinition.bases = parents;
	
	return moduleDefinition;
}

var createCustomModuleDefinition = function(moduleDefinition)
{
	var m = {};
	var parents = [];
	for(var i in bases)
	{
		if(!bases.hasOwnProperty(i))	continue;
		parents.push(bases[i]);
	}
	
	moduleDefinition.bases = parents;
	
	return moduleDefinition;
}
window.createModuleDefinition = createModuleDefinition;

function g_loadModule( name, require_contexts ){
	var predefined = require_contexts;
	var redkeys = predefined.keys();
	
	for(var i in redkeys){
		var n  = redkeys[i];
		if(n == './' + name + '.js'){
			var c = predefined(n);
			if(c.default)
				return (c.default);
			else 
				return c();
		}
	}
	if(redkeys['./base.js']){
		var base = predefined('./base.js').default;
		return base;
	}
	
}
function findDefinitionType( definition, require_contexts ){
	var predefined = require_contexts;
	var base = predefined.keys();
	var redkeys = predefined.keys();
	for(var i in redkeys){
		var n  = redkeys[i];
		if(n == './' + name + '.js'){
			var c = predefined(n);
			if(c.default && c.default == definition)
				return name;
			
		}
	}
}
function checkExists( name, require_contexts ){
	var redkeys = require_contexts.keys();
	return (redkeys.indexOf( './' + name + '.js') >=0);
	
}
module.exports ={
	createModuleDefinition: createModuleDefinition,
	g_loadModule: g_loadModule,
	checkExists:checkExists,
	findDefinitionType:findDefinitionType
}