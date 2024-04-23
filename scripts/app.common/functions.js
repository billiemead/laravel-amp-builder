import '../utils/polyfill';

//return builder  url
var getRelativeUrl = function(url)
{
	url= url|| '';
	return decodeURIComponent(window.baseUrl).format2({url:url});
	
};
window.getRelativeUrl = getRelativeUrl;
var getViewPath = function(path)
{
	return decodeURIComponent(window.viewPath).format2({viewPath: encodeURI(path.replaceAll('/', '.'))});
}
window.getViewPath = getViewPath;
var getSectionViewPath = function(name)
{
	return decodeURIComponent(window.sectionviewPath).format2({name: name, theme: window.siteInfo.theme});
}
window.getSectionViewPath = getSectionViewPath;
var getListPath = function(path)
{
	return decodeURIComponent(window.listPath).format2({name: path});
}
window.getListPath = getListPath;
var getAjaxPath = function(action, parameters)
{
	return decodeURIComponent(window.ajaxPath).format2({parameters: parameters, action:action});
}
window.getAjaxPath = getAjaxPath;
var getApiPath = function(action, parameters)
{
	return decodeURIComponent(window.apiPath).format2({parameters: parameters, action:action});
}
window.getApiPath = getApiPath;
var getThemePath = function(name)
{
	return decodeURIComponent(window.themePath).format2({name:name});
}
window.getThemePath = getThemePath;
var getThemeStylePath = function(name)
{
	return decodeURIComponent(window.themeCssUrl).format2({name:name});
}
window.getThemeStylePath = getThemeStylePath;


function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}
function getMinValue(arr)
{
	if(arr.length > 0)
	{
		var m = arr[0];
		for(var i = 1; i < arr.length; i++)
		{
			if( m < arr[i] )
				m = arr[i];
		}
		return m;
	}
	return 0;
}
function object_toArray(object)
{
	var result = [];
	for(var i in object)
	{
		if(!object.hasOwnProperty(i)) continue;
		result.push(object[i]);
	}
	return result;
}