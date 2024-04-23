export default function(communication)
{
	"ngInject";
	this.moveArray = function (array, old_index, new_index) {
		while (old_index < 0) {
			old_index += array.length;
		}
		while (new_index < 0) {
			new_index += array.length;
		}
		if (new_index >= array.length) {
			var k = new_index - array.length;
			while ((k--) + 1) {
				this.push(undefined);
			}
		}
		array.splice(new_index, 0, array.splice(old_index, 1)[0]);
		return array; 
	};
	this.toCamelCase = function(name) {
	  return name.replace(/-(\w)/g, function(match) {
		return match[1].toUpperCase();
	  });
	};
	this.toDashCase = function(name) {
	  return name.replace(/([A-Z])/g, function(match) {
		return '-' + match[0].toLowerCase();
	  });
	};
	this.makeSafeForCSS = function(name) {
		return name.replace(/[^a-z0-9]/g, function(s) {
			var c = s.charCodeAt(0);
			if (c == 32) return '-';
			if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
			return '__' + ('000' + c.toString(16)).slice(-4);
		});
	};
	this.getElementOffset = function(el, pageEdit)
	{
		var element = jQuery_iframe(el);
		var offset = element.offset();
		var iframe_document = window.edit_page; //pageEdit.iframe.getDocument();
		var scrollTop = jQuery_iframe(iframe_document).scrollTop();
		var scrollLeft = jQuery_iframe(iframe_document).scrollLeft();
		var iframe_offset = $('#edit_page').offset();
		return {left: offset.left + iframe_offset.left - scrollLeft, top:offset.top + iframe_offset.top - scrollTop}
	}
	this.getLess = function() {
		return pageEdit_less.getLess();
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
						if(name.startsWith("@color"))
							display.push(value);
					newscheme[name] = value;
				}
				colorSchemes[i] = ({value:newscheme, display:display});
			});

		}
		return colorSchemes;
	}
	this.array_move = function(arr, pos1, pos2) {
		// local variables
		var i, tmp;
		// cast input parameters to integers
		pos1 = parseInt(pos1, 10);
		pos2 = parseInt(pos2, 10);
		// if positions are different and inside array
		if (pos1 !== pos2 && 0 <= pos1 && pos1 < arr.length && 0 <= pos2 && pos2 < arr.length) {
			// save element from position 1
			tmp = arr[pos1];
			// move element down and shift other elements up
			if (pos1 < pos2) {
				for (i = pos1; i < pos2; i++) {
					arr[i] = arr[i + 1];
				}
			}
			// move element up and shift other elements down
			else {
				for (i = pos1; i > pos2; i--) {
					arr[i] = arr[i - 1];
				}
			}
			// put element from position 1 to destination
			arr[pos2] = tmp;
		}
	}
}