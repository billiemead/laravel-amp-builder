/*
Global language object
*/
var Language = new function()
{
	this.terms = {};
	
	this.get = function(key, returnAll = false)
	{
		key = $.trim(key);
		var arr = key.split('.');
		if(arr.length == 1)
		{
			
			if(this.terms[key] && (returnAll || typeof this.terms[key] === 'string' || this.terms[key] instanceof String))
				return this.terms[key];
			
		}
			
		else if(arr.length > 1){
			var value = this.terms;
			for(var i in arr){
				var key = arr[i];
				if(value[key])
					value = value[key];
			}
			if (returnAll || typeof value === 'string' || value instanceof String)
				return value;
		}
		
		return key;
	};
	this.set = function(key, value)
	{
		key = $.trim(key);
		this.terms[key] = value;
	};
	this.import = function(value){
		for(var i in value){
			this.terms[i] = value[i];
		}
	}
};
//Translates a message to the current language
var t = function(key, returnAll =false)
{
	return Language.get(key, returnAll);
};
//set a key pair language
t.set = function(key, value)
{
	Language.set(key, value);
};
module.exports = Language;
module.exports = t;
window.t = t;
window.Language = Language;
window.t = t;
t.set('LBL_DRAG_SECTION_TEMPLATE_MESSAGE', 'Drag element here to add');
t.set('LBL_CHANGE_PAGE_CONFIRM_MESSAGE', 'Do you want to change page?');
t.set('LBL_CHANGE_PAGE_CONFIRM_TITLE', 'Change page?');
t.set('LBL_CLOSE', 'Close');
t.set('LBL_OK', 'OK');
t.set('LBL_CANCEL', 'Cancel');
t.set('LBL_NAME', 'Name');
t.set('LBL_CONTENT', 'Content');
t.set('LBL_DELETE_WIDGET_TITLE', 'Delete Element?');
t.set('LBL_DELETE_WIDGET_MESSAGE', 'Do you want to delete this element?');
t.set('LBL_DELETE_SECTION_TITLE', 'Delete Section?');
t.set('LBL_DELETE_SECTION_MESSAGE', 'Are you sure to delete this section?');
t.set('LBL_DELETE_WIDGET', 'Delete?');
t.set('LBL_DISCARD', 'Discard');
t.set('LBL_REMOVE_MODULE', 'Remove');
t.set('LBL_PREVIOUS_SLIDE', 'Previous slide');
t.set('LBL_NEXT_SLIDE', 'Next slide');
t.set('LBL_CONFIGURATE_SLIDER', 'Configurate slider');
t.set('LBL_CLONE_FIRST_ITEM', 'Clone first item');
t.set('LBL_CLONE_CURRENT_SLIDER', 'Clone current slide');
t.set('LBL_REMOVE_FIRST_ITEM', 'Remove first item');
t.set('LBL_REMOVE_LAST_ITEM', 'Remove last item');
t.set('LBL_ADD_SLIDE', 'Add Slide')
t.set('LBL_REMOVE_CURRENT_SLIDER', 'Remove current slide');
t.set('LBL_EDIT_CURRENT_SLIDE', 'Edit current slide');
t.set('LBL_EDIT_TEXT_LIST', 'Edit text list');
t.set('LBL_CONFIGURATE_TEXTTYPER', 'Configurate slider');
t.set('LBL_CONFIGURATE_TEXTSLIDER', 'Configurate slider');
t.set('LBL_EDIT_IMAGE', 'Edit image');
t.set('LBL_FILTER_TAG', 'Filter');
t.set('LBL_CLONE_MODULE', 'Clone');
t.set('LBL_CLONE_SECTION', 'Clone Section');
t.set('LBL_CHANGE_BACKGROUND', 'Change background');
t.set('LBL_EDIT_HTML', 'Edit HTML');
t.set('LBL_CONFIGURATE_SECTION', 'Configurate section');
t.set('LBL_REMOVE_SECTION', 'Remove section');
t.set('LBL_EDIT_GALLERY', 'Edit gallery');

t.set('LBL_SAVE_SUCCESSFUL_TITLE', 'Save sucessfull');
t.set('LBL_SAVE_SUCCESSFUL_MESSAGE', 'Your site has been saved, publish to see the changes');
t.set('LBL_PUBLISH_SUCCESSFUL_TITLE', 'Publish sucessfull');
t.set('LBL_PUBLISH_SUCCESSFUL_MESSAGE', 'Your site has been published');

t.set('LBL_DELETE_SITE_TITLE', 'Delete Site?');
t.set('LBL_DELETE_SITE_MESSAGE', 'Do you want to delete this site?');

t.set('LBL_DELETE_DOMAIN_TITLE', 'Delete Domain?');
t.set('LBL_DELETE_DOMAIN_MESSAGE', 'Do you want to delete this domain?');
t.set('LBL_DELETE_THEME_TITLE', 'Delete Theme?');
t.set('LBL_DELETE_THEME_MESSAGE', 'Do you want to delete this theme?');
t.set('LBL_DELETE_PLAN_TITLE', 'Delete Plan?');
t.set('LBL_DELETE_PLAN_MESSAGE', 'Do you want to delete this plan?');
t.set('LBL_DELETE_POST_TITLE', 'Delete Post?');
t.set('LBL_DELETE_POST_MESSAGE', 'Do you want to delete this post?');

t.set('LBL_DELETE_POST_CATEGORIES_TITLE', 'Delete Category?');
t.set('LBL_DELETE_POST_CATEGORIES_MESSAGE', 'Do you want to delete this category?');
