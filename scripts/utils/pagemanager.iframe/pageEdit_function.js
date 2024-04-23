export default function($injector,pageEdit_event,pageEdit_modules,pageEdit_widgets, lazyLoadWidget)
{
	"ngInject";
	this.getUniqueId = function(a)
	{
		var timestamp = $.now();
		var id = a+ timestamp;
		while( jQuery_iframe('#' + id).length > 0)
		{
			id = a + timestamp+Math.floor(Math.random()*101);
		}
		return id;
	};
	this.getModules = function()
	{
		
		return pageEdit_modules.modules;
	};
	this.generateModuleId = function(element)
	{
		var h = '';
		
		h = pageEdit_event.iframe.iframe.page_file_name;
		var p =  h +'-module';
		return this.getUniqueId(p);
	};
	this.createModuleInstance = function(moduleDefinition, type)
	{
		if(!moduleDefinition)
			return false;
		var moduleInstance = function(){};
		var bases = moduleDefinition.bases;
		if(moduleDefinition.originalPrototype == undefined)
		{
			var originalPrototype = $injector.instantiate(moduleDefinition);
			moduleInstance.originalPrototype = originalPrototype;
		}
		var moduleDef = moduleDefinition;
		
		var parents =  [];
		var m = {};
		
		if(bases != undefined)
		{
			for(var i in bases)
			{
				if(!bases.hasOwnProperty(i))	continue;
				var  b = $injector.instantiate(bases[i]);
				m = $.extend(m,b);
				parents.push(b);
			}
			var moduleDef_prototype = (typeof(moduleDef) == 'function' ? moduleDef : moduleDef[moduleDef.length - 1]);
			moduleDef_prototype.prototype = $.extend({}, m, moduleInstance.originalPrototype);
			
			moduleDef_prototype.prototype.bases = parents;
			moduleDef_prototype.prototype.type = type;
			moduleDef_prototype.prototype.display_name = type;
			if(window.sts_module_list != undefined && window.sts_module_list[type] != undefined) {
				moduleDef_prototype.prototype.display_name = window.sts_module_list[type][0];
				moduleDef_prototype.prototype.icon_path = window.sts_module_list[type][1];
			}
			//moduleDef.$inject =  $injector.annotate(moduleDef);
		}
		return $injector.invoke(function($injector)
		{
			return $injector.instantiate(moduleDef)
		});
	};
	this.saveDefinition = function(prot, type)
	{
		this.module_definitions = this.module_definitions || {};
		if(this.module_definitions[type] == undefined)
			this.module_definitions[type] = prot;
	}
	this.getDefinition = function(type)
	{
		if(this.module_definitions != undefined && this.module_definitions[type] != undefined)
			return this.module_definitions[type];
	}
	this.createParent = function(parent)
	{
		var b = $injector.instantiate(parent);
		return b;
	}
	this.createZoneInstance = function(moduleDefinition, type)
	{
		if(!moduleDefinition)
			return false;
		var savedPrototype = this.getDefinition();
		var moduleDef;
		if(savedPrototype != undefined){
			moduleDef = savedPrototype;
		}
		else{
			var bases = moduleDefinition.bases;
			var moduleInstance = function(){};
			
			if(moduleDefinition.originalPrototype == undefined)
			{
				var originalPrototype = $injector.instantiate(moduleDefinition);
				moduleInstance.originalPrototype = originalPrototype;
			}
			moduleDef = moduleDefinition;
			
			var parents =  [];
			var m = {};
			
			if(bases != undefined)
			{
				for(var i in bases)
				{
					if(!bases[i])	continue;
					var b = $injector.instantiate(bases[i]);
					m = $.extend(true, m, b);
					parents.push(b);
				}
				var moduleDef_prototype = (typeof(moduleDef) == 'function' ? moduleDef : moduleDef[moduleDef.length - 1]);
				moduleDef_prototype.prototype = $.extend({}, m, moduleInstance.originalPrototype);
				
				moduleDef_prototype.prototype.bases = parents;
				moduleDef_prototype.prototype.type = type;
			}
			this.saveDefinition(moduleDef, type)
		}
		return $injector.invoke(function($injector)
		{
			var m = $injector.instantiate(moduleDef);
			return m;
		});
	};
}