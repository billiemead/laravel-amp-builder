$(window).on('load', onready);
$(document).on('domupdated', onready);

function onready(event, updatedFragment) {
	var t = $('body');
	if(updatedFragment != undefined)
		t = $(updatedFragment);
	
}