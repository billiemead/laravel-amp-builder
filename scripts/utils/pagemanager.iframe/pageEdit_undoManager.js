var undoManager = require('../undomanager');
var manager = new undoManager();
export default function(pageEdit_function,pageEdit_modules,pageEdit_layout,$window,$q)
{
	"ngInject";
	this.manager = manager;
	this.isUndoing = function()
	{
		var state = this.manager._state;
		return (state == this.manager.STATE_UNDOING)
	}
	this.isRedoing = function()
	{
		var state = this.manager._state;
		return (state == this.manager.STATE_REDOING)
	}
	this.isDoing = function()
	{
		var state = this.manager._state;
		return (state == this.manager.STATE_UNDOING || state == this.manager.STATE_REDOING);
	}
	this.endGrouping = function()
	{
		this.manager.endGrouping();
	}
	this.beginGrouping = function()
	{
		this.manager.beginGrouping();
	}
	this.registerUndoAction = function(target, func, arg, data){
		this.manager.registerUndoAction(target, func, arg, data);
	}
	
	this.clear = function()
	{
		this.manager.clearUndo();
		this.manager.clearRedo();
	}
}