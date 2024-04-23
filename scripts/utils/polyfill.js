if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function(search, rawPos) {
            var pos = rawPos > 0 ? rawPos|0 : 0;
            return this.substring(pos, pos + search.length) === search;
        }
    });
}

if (!String.prototype.stripPrefixes) {
    Object.defineProperty(String.prototype, 'stripPrefixes', {
        value: function(prefixes) {
            for(var i in prefixes) {
				if(this.startsWith(prefixes[i])){
					return this.substring(prefixes[i].length)
				}
			}
			return this;
        }
    });
}
if (!Function.prototype.clone)
Function.prototype.clone = function() {
    var that = this;
    var temp = function(args) { return that.apply(this, args); };
    for(var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
};
if (!String.prototype.replaceAll)

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
if (!Number.prototype.format)


Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};
if (!String.prototype.format)

String.prototype.format = function (args) {
	var str = this;
	return str.replace(String.prototype.format.regex, function(item) {
		var intVal = parseInt(item.substring(1, item.length - 1));
		var replace;
		if (intVal >= 0) {
			replace = args[intVal];
		} else if (intVal === -1) {
			replace = "{";
		} else if (intVal === -2) {
			replace = "}";
		} else {
			replace = "";
		}
		return replace;
	});
};
if (!String.prototype.format.regex)

String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");
if (!String.prototype.format2) {
    String.prototype.format2 = function() {
        var str = this.toString();
        if (!arguments.length)
            return str;
        var args = typeof arguments[0],
            args = (("string" == args || "number" == args) ? arguments : arguments[0]);
        for (var arg in args)
            str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
        return str;
    }
}
window.isNumber = function(value)
{
	if(typeof value == 'number')
		return true;
	return !isNaN(value)
}
window.getColorFromConfig = function()
{
	var colors;
	var siteInfo = window.siteInfo || window.top.siteInfo;
	if(siteInfo){
		colors = siteInfo.colors;
	}
	if(!colors && siteInfo.structure){
		colors = siteInfo.structure.colors;
	}
	if(!colors && siteInfo.themeConfig){
		colors = siteInfo.themeConfig.colors;
	}
	return colors;
}