$(window).on('load', onready);
$(document).on('domupdated', onready);
import './utils/polyfill';
var pageEdit = require('./utils/pagemanager.iframe/pageEdit_front');
function onready(event, updatedFragment) {
	$('#site-preloader').hide();
	var t = $('body');
	if(updatedFragment != undefined)
		t = $(updatedFragment);
	pageEdit.init(t);
}