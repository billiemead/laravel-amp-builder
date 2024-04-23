var cssjson = require('./cssjson');

export default function(communication,ajax,pageEdit_highlighter,pageEdit_highlighter_manager,$location,pageEdit_event,$rootScope,$q, pageEdit_layout,$dialog,pageEdit_iframe,lazyLoadWidget,pageEdit_modules,$injector,pageEdit_function)
{
	"ngInject";
	this.getLess = function()
	{
		if(pageEdit_event.iframe) {
			
			return pageEdit_event.iframe.getWindow().less;
		}
	}
	this.initVariant = function()
	{
		communication.getVariantFile(window.siteInfo.variant).then(function(json) {
			this.putLessCache('/themes/' + window.siteInfo.theme + '/variants/' + window.siteInfo.variant || 'default' + '.less', json.data );
			var less = this.getLess();
			if(!less)	return;
			var parser = new less.Parser({}, {contents:{}}, {});
				parser.parse(json.data, function (error, root) {
					var varsDef = root.variables();
					var newscheme = {};
					var display = [];
					for (var k in varsDef) {
						
						var name = varsDef[k].name;
						var value = varsDef[k].value.toCSS();
						if(display.length < 5)
							if(name.startsWith("@color"))
								display.push(value);
						newscheme[name] = value;
					}
					
					
					less.modifyVars(newscheme);
				});
		});
	}
	this.compileSchemes = function(loadSchemes) {
		var that = this;
		var colorSchemes = {};
		for(var i in loadSchemes) {
			if(loadSchemes[i] == undefined) continue;
			var json = loadSchemes[i];
			var lessObj = that.getLess();
			if(!lessObj){
				console.log("Less hasn't been loaded");
				//$state.go('content');
				return [];
			}	
			var parser = new lessObj.Parser({}, {contents:{}}, {});
			parser.parse(json, function (error, root) {
				var varsDef = root.variables();
				var newscheme = {};
				var display = [];
				for (var k in varsDef) {
					
					var name = varsDef[k].name;
					var value = varsDef[k].value.toCSS();
					if(display.length < 5)
						if(name.indexOf("@color"))
							display.push(value);
					newscheme[name] = value;
				}
				colorSchemes[i] = ({value:newscheme, display:display});
			});

		}
		return colorSchemes;
	}
	this.applyScheme = function(name, scheme)
	{
		var lessObj = this.getLess();
		if(!lessObj){
			console.log("Less hasn't been loaded");
			//$state.go('content');
			return [];
		}	
		return lessObj.modifyVars(scheme.value);
		return true;
	}
	this.getStyleContent = function()
	{
		return jQuery_iframe('style[id="less:theme_style_id"]').html()
	}
	this.destroyLessCache = function(pathToCss) {
		if(!pageEdit_event.iframe)	return;
		var w = pageEdit_event.iframe.getWindow();
		if(!w)	return;
		if (!w.localStorage) {
			return;
		}
		var host = w.location.host;
		var protocol = w.location.protocol;
		var keyPrefix = protocol + '//' + host + pathToCss;

		for (var key in w.localStorage) {
			if (key.indexOf(keyPrefix) === 0) {
				delete w.localStorage[key];
			}
		}
	}
	this.renderLessContent = function(content, promise)
	{
		var less = this.getLess();
		if (!less) {
			return;
		}
		var that = this;
		return less.render(content,{}, function (error, output) {
			if(error != null){
				that.displayError(error);
			}
				
			else
				promise(output.css);
		});
	}
	this.parseLessVariables = function(css)
	{
		var result = [];
		var op = css.indexOf('{');
		var cp = css.indexOf('}');
		var notBlock = css
		.substring(op+1, cp)
		.trim()
		.split('\n');

		for (var i=0; i<notBlock.length; i+=1){
			var s = notBlock[i].split(':');
			if(s.length < 2){
				continue;
			}
			var k = s[0].trim();
			var v = s[1].split(';')[0].trim();
			result.push({name:'@' + k, value:v});
		}
		return result;
	}
	this.parseLessContent = function(content, promise)
	{
		var less = this.getLess();
		if (!less) {
			return;
		}
		var parser = new less.Parser({}, {contents:{}}, {});
		var that = this;
		return parser.parse(content, function (error, root) {
			if(error != null)
				that.displayError(error);
			else
				promise(error, root);
		});
	}
	this.literalLessVars = function(varNames) {
		var generatedLess = '.vals{\n';
		for (var i=0; i < varNames.length; i+= 1) {
			var v = varNames[i];
			if(v[0] != '@')
				v = '@' + v;
			generatedLess += v.slice(1) + ': ' + v + ';\n';
		}
		generatedLess += '}';
		return generatedLess;
	}
	this.getLessCache = function(pathToCss)
	{
		var less = this.getLess();
		if (!less) {
			return;
		}
		if(less.environment.fileManagers.length){
			
			var fileManager = less.environment.fileManagers[0];
			return fileManager.getSingleFileCache(pathToCss);
		}
	}
	this.putLessCache = function(pathToCss, content)
	{
		var less = this.getLess();
		if (!less) {
			return;
		}
		if(less.environment.fileManagers.length){
			
			var fileManager = less.environment.fileManagers[0];
			return fileManager.putSingleFileCache(pathToCss, content);
		}
	}
	this.writeFile = function(pathToCss, content)
	{
		return this.putLessCache(pathToCss, content);
	}
	this.readFile = function(pathToCss)
	{
		return this.getLessCache(pathToCss);
	}
	this.init = function()
	{
		if(this.inited)	return;
		this.inited = true;
		if(pageEdit_event.iframe && window.top.siteInfo && window.top.siteInfo.theme) {
			var l = jQuery_iframe('link[title="theme_style_id"]');
			
			var url = window.top.getThemeStylePath(window.top.siteInfo.theme);
			l.attr('href', url);
			var less = this.getLess();
			if(!less)	{
				('less doesn\'t inited');
				return;
			}
			less.logger.addListener({
				debug: function(msg) {
				},
				info: function(msg) {
				},
				warn: function(msg) {
				},
				error: function(msg) {
					$dialog.message({
						title:'LESS Compiling Error',
						message:msg,
					});
				}
			});
			
			$('#less_loadingSpinner').show();
			var that = this;
			return less.refresh(true, {}, false).then(function() {
				$('#less_loadingSpinner').hide();
				$rootScope.$emit('less_loaded');
				var w = pageEdit_event.iframe.getWindow();
				jQuery_iframe(w).trigger('less_loaded');
				StyleSheet.initInlineLess();
			},function(error){
				$('#less_loadingSpinner').hide();
				$rootScope.$emit('less_loaded');
				var w = pageEdit_event.iframe.getWindow();
				jQuery_iframe(w).trigger('less_loaded');
				if(error != null){
					//that.displayError(error);
				}
					
			});
		}
	}
	this.destroyLessCache = function(pathToCss) {
		var less = this.getLess();
		if (!less) {
			return;
		}
		var host = window.location.host;
		var protocol = window.location.protocol;
		var keyPrefix = protocol + '//' + host + pathToCss;

		for (var key in window.localStorage) {
			if (key.indexOf(keyPrefix) === 0) {
				delete window.localStorage[key];
			}
		}
		if(less.environment.fileManagers.length){
			
			var fileManager = less.environment.fileManagers[0];
			fileManager.clearSingleFileCache(pathToCss);
		}
	}
	this.refreshStylesheets = function(fileToRemoves)
	{
		var less = this.getLess();
		if (!less) {
			return;
		}
		if(window.top.siteInfo && window.top.siteInfo.theme) {
			
			var less = pageEdit_event.iframe.getWindow().less;
			$('#less_loadingSpinner').show();
			if(fileToRemoves != undefined && fileToRemoves.length != undefined){
				
				for(var i in fileToRemoves){
					this.destroyLessCache(fileToRemoves[i]);
				}
			}
			var that = this;
			var defer = $q.defer();
			return less.refresh().then(function() {
				
				$('#less_loadingSpinner').hide();
				defer.resolve(1);
			},
			function(error){
				$('#less_loadingSpinner').hide();
				defer.reject(error);
			});
			return defer.promise;
		}
	}
	this.displayError = function(e)
	{
		var template = '{line} {content}';
		var filename = e.filename || '';
		var errors = [];
		var content = (e.type || "Syntax") + "Error: " + (e.message || 'There is an error in your .less file') +
			" in " + filename + " . Your theme " + window.siteInfo.theme + ". Variant :" + window.siteInfo.variant;

		var errorline = function (e, i, classname) {
			if (e.extract[i] !== undefined) {
				errors.push(template.replace(/\{line\}/, (parseInt(e.line, 10) || 0) + (i - 1))
					.replace(/\{class\}/, classname)
					.replace(/\{content\}/, e.extract[i]));
			}
		};

		if (e.extract) {
			errorline(e, 0, '');
			errorline(e, 1, 'line');
			errorline(e, 2, '');
			content += 'on line ' + e.line + ', column ' + (e.column + 1) + ':\n' +
				errors.join('<br/>');
		}
		if (e.stack && (e.extract)) {
			content += '<br/>Stack Trace<br/>' + e.stack;
		}
		$dialog.message({message:content, title:'Error'});
	}
	this.refreshInlineLess = function(code) {
		var less = this.getLess();
		if (!less) {
			return;
		}
		less.render(code, {  }).then(function(output) {
			var style = jQuery_iframe('style#less_inline_style');
			if(style[0]){
			   style = style[0];
			   if (style.styleSheet) {
					style.styleSheet.cssText = output.css;
				} else {
					style.innerHTML = output.css;
				}
			}
			jQuery_iframe('script#less_inline_style_cached').html(code);
		},
		function(e) {
			
		});
	}
	this.refreshCustomCode = function(code) {
		return this.refreshInlineLess(code);
	}
	this.generateColorPaletteCSS = function()
	{
		
		if(window.siteInfo.colorPaletteCSS == undefined)
		{
			return window.siteInfo.colorPaletteCSS;
		}
		if(window.siteInfo.colors == undefined && window.top.siteInfo.colors == undefined )
		{
			return;
		}
		var colors = (window.siteInfo || window.top.siteInfo).colors;
		var css = "";
		for(var i in colors){
			var name = "@" + colors[i];
			for(var j in StyleSheet.colorPalettePrefixes){
				css += "." + StyleSheet.colorPalettePrefixes[j] + "-" + colors[i] +"{" + j + ":" + name + " !important}";
			}
		}
		return css;
	}
	this.getColorPalette = function(theme, variant)
	{
		if(window.siteInfo.colors == undefined && window.top.siteInfo.colors == undefined )
		{
			return;
		}

		var colors = (window.siteInfo || window.top.siteInfo).colors;
		this.colorPalettes = this.colorPalettes || {};
		if(this.colorPalettes[variant] != undefined)
			return this.colorPalettes[variant];
		var sassContent = this.getStyleContent();
		var json = cssjson.toJSON(sassContent);
		var rs = this.getPalleteFromJSON(json);
		this.colorPalettes[variant] = rs;
		return rs;
		var less_color_paths = [
			'/themes/' + theme + '/variants/' + variant + '.less',
			'/themes/' + theme + '/colors.less',
			'/themes/' + theme + '/variables.less',
		];
		var content = '';
		for(var i in less_color_paths){
			content += this.getLessCache(less_color_paths[i]);
		}
		var colorCompiled;
		var colorAvailable = [];
		this.parseLessContent(content, function(e, tree){
			for(var i in colors){
				var name = "@" + colors[i];
				var variable  = tree.variable(name);
				if(variable != undefined){
					colorAvailable.push(name);
				
				}
				
			}
		});
		content += this.literalLessVars(colorAvailable);
		var that = this;
		this.renderLessContent(content, function(css){
			colorCompiled = that.parseLessVariables(css);
		});
		this.colorPalettes[variant] = colorCompiled;
		return colorCompiled;
	}
	this.getPalleteFromJSON = function(json)
	{
		var rs = [];
		var colors = (window.siteInfo || window.top.siteInfo).colors;
		for(var j in StyleSheet.colorPalettePrefixes){
			
			for(var i in colors){
				var name = "." + StyleSheet.colorPalettePrefixes[j] + "-" + colors[i];
				for(var k in json.children){
					if(k == name){
						var value = json.children[k].attributes[j].replace("!important", "");
						value = $.trim(value);;
						if(value != undefined){
							rs.push({name:'@' + colors[i], value:value});
						}
					}
				}
			}
			break;
		}
		return rs;
	}
	this.changeCustomVariableContent = function(data, themeConfig){
		var less = this.getLess();
		if (!less) {
			return;
		}
		var cache = this.readFile('/themes/' + window.siteInfo.theme + '/' + themeConfig.variablePath);
		less.putSingleFileCache('/themes/' + window.siteInfo.theme + '/' + themeConfig.variablePath, data);
		var rs = this.refreshStylesheets();
		if(rs != undefined){
			rs.then(function(result) {
				defer.resolve(result);
			},
			function(error){
				less.putSingleFileCache('/themes/' + window.siteInfo.theme + '/' + themeConfig.variablePath, cache);
				defer.reject(error);
			});
		}
		else{
			defer.reject({message:'Something wrong'});
		}
		return defer.promise;
	}
	this.changeSectionContent = function(data, themeConfig){
		var less = this.getLess();
		if (!less) {
			return;
		}
		var cache = this.readFile('/themes/' + window.siteInfo.theme + '/' + themeConfig.sectionStylePath);
		less.putSingleFileCache('/themes/' + window.siteInfo.theme + '/' + themeConfig.sectionStylePath, data);
		var rs = this.refreshStylesheets();
		if(rs != undefined){
			rs.then(function(result) {
				defer.resolve(result);
			},
			function(error){
				less.putSingleFileCache('/themes/' + window.siteInfo.theme + '/' + themeConfig.sectionStylePath, cache);
				defer.reject(error);
			});
		}
		else{
			defer.reject({message:'Something wrong'});
		}
		return defer.promise;
	}
	this.changeThemeContent = function(data, themeConfig){
		var less = this.getLess();
		if (!less) {
			return;
		}
		var cache = this.readFile('/themes/' + window.siteInfo.theme + '/' + themeConfig.themePath);
		less.putSingleFileCache('/themes/' + window.siteInfo.theme + '/' + themeConfig.themePath, data);
		var rs = this.refreshStylesheets();
		if(rs != undefined){
			rs.then(function(result) {
				defer.resolve(result);
			},
			function(error){
				less.putSingleFileCache('/themes/' + window.siteInfo.theme + '/' + themeConfig.themePath, cache);
				defer.reject(error);
			});
		}
		else{
			defer.reject({message:'Something wrong'});
		}
		return defer.promise;
	}
}