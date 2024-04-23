var resolution = window.resolutions || window.top.resolutions;//require('../../resolutions.json');

function getCurrentBreakpoint()
{
	var mode = $('html').attr('mode');
	if(mode != undefined)
		return mode;
	var width = $(window).width();
	var flag;
	for(var i in resolution){
		var breakPoint = resolution[i].breakpoint;
		if(breakPoint == undefined || width <= breakPoint){
			flag = i;
		}
	}
	if(flag == undefined)
		flag = getDefaultBreakpoint();
	return flag;
}
function getDefaultBreakpoint()
{
	for(var i in resolution){
		if(resolution[i].default){
			return i;
		}
	}
}
function isDefaultBreakpoint(a){
	a == undefined && (a = getCurrentBreakpoint());
	return a == getDefaultBreakpoint();
}
function getBreakpointList(info )
{
	if(info){
		return resolution;
	}
	return _.keys(resolution);
}
function getBreakpointInfo(a){
	return resolution[a];
}
function getCurrentResolution()
{
	var breakPoint = getCurrentBreakpoint();
	return breakPoint;
}
function initStyle()
{
	var style = $('style#responsive_screens');
	if(!style.length){
		style = $( "<style id=\"responsive_screens\"></style>" ).appendTo( "head" );
	}
	style.html('');
	var content = "";
	for(var i in resolution){
		content+= 'html[mode="' + i + '"] body{';
		content += 'width:' + resolution[i].breakpoint + 'px;';
		content += '}';
		content+= 'html[mode="' + i + '"] section > .container{';
		content += 'width:' + resolution[i].container_size + 'px;';
		content += '}';
		content+= 'html[mode="' + i + '"] div.popup-section{';
		content += 'width:' + resolution[i].popup_size + 'px;';
		content += '}';
	}
}
module.exports = {
	getBreakpointList: getBreakpointList,
	getCurrentResolution: getCurrentResolution,
	getBreakpointInfo: getBreakpointInfo,
	getDefaultBreakpoint: getDefaultBreakpoint,
	isDefaultBreakpoint: isDefaultBreakpoint,
	initStyle:initStyle
}