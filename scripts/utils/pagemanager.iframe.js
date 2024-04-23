var pagemanager_iframe_app = angular.module('pagemanager.iframe',['pageEdit.widgets','pagemanager.file_manager','pagemanger.controls','ui.popup'])
.value('pageEdit_constanst', 
{
	columns :
	[
		5.80111,14.3646, 22.9282, 31.4917, 40.0552, 48.6188, 57.1823, 65.7459, 74.3094, 82.8729, 91.4365,100
	],
	margin_columns :
	[
		0, 2.12766, 2.12766, 2.12766, 2.12766, 2.12766, 2.12766, 2.12766, 2.12766, 2.12766, 2.12766,2.12766
	],
	margin_left : 2.12766,
	row_helper_class : 'ww_row_helper',
	pagezone_gridline_class:'pagezone_gridline',
	highlight_element_class:'highlighter',
	pagezone_class : 'page_zone',
	zone_class : 'zone',
	row_class : 'row',
	row_locked_class : 'row-locked',
	column_class : 'col',
	container_class : 'container',
	module_class : 'module',
	module_locked_class : 'module-locked',
	module_split_class : 'module-text',
	module_split_droppable_selector : "p,h1,h2,h3,h4,h5,h6,ul,ol",
	column_float_class : "column-float-none",
	column_float_left_class : "column-float-left",
	column_float_right_class : "column-float-right",
	module_row_class : "module_row",
	insertion_point_class : "page_insertion_button"
})


.service('pageEdit_modules', function()
{
	this.modules = {};
	this.deleted_modules=[];
})
.service('pageEdit_function', require('./pagemanager.iframe/pageEdit_function').default)
.factory('pageEdit_iframe', require('./pagemanager.iframe/pageEdit_iframe').default)
.service('pageEdit_event', require('./pagemanager.iframe/pageEdit_event').default)

.service('pageEdit', require('./pagemanager.iframe/pageEdit').default)
.factory('pageEdit_highlighter', require('./pagemanager.iframe/pageEdit_highlighter').default)
.service('pageEdit_highlighter_manager', require('./pagemanager.iframe/pageEdit_highlighter_manager').default)

.service('pageEdit_scrollSpy', require('./pagemanager.iframe/pageEdit_scrollSpy').default)
.service('pageEdit_sass', require('./pagemanager.iframe/pageEdit_sass').default)
.service('pageEdit_sass_variable', require('./pagemanager.iframe/pageEdit_sass_variable').default)

.service('pageEdit_less',  require('./pagemanager.iframe/pageEdit_less').default)
.service('pageEdit_font',  require('./pagemanager.iframe/pageEdit_font').default)

.service('pageEdit_float_editor_button',  require('./pagemanager.iframe/pageEdit_float_editor_button').default)

.service('pageEdit_layout', require('./pagemanager.iframe/pageEdit_layout').default)
.service('pageEdit_ddManager', require('./pagemanager.iframe/pageEdit_ddManager').default)
.service('pageEdit_undoManager', require('./pagemanager.iframe/pageEdit_undoManager').default)
.service('pageEdit_clipboard', require('./pagemanager.iframe/pageEdit_clipboard').default)

