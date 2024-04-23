export default function()
{
	"ngInject";
	this.BLOCK_DROPPED = 'block_dropped';
	this.BLOCK_MOVED='block_moved';
	this.DRAGGING = 'dragging';
	this.BLOCK_REMOVED = 'block_removed';
	this.BLOCK_ADDED = 'block_added';
	this.BLOCK_CLONED = 'block_cloned';
	this.COLUMN_ADDED = 'column_added';
	this.COLUMN_REMOVED = 'column_removed';
	this.ROW_ADDED = 'row_added';
	this.ROW_REMOVED = 'row_removed';
	this.ZONE_ADDED = 'zone_added';
	this.ZONE_REMOVED = 'zone_removed';
	this.MODULE_CREATING_COMPLETED = 'block_creating_completed';
	this.MODULE_CLONE_COMPLETED = 'block_clone_completed';
	this.MODULE_COPIED = 'module_copied';
	this.iframe;
	this.fire = function(event_name, params)
	{
		jQuery_iframe(this.iframe.getDocument()).trigger(event_name, params);
	};
	this.on = function(event_name,data, fn)
	{
		jQuery_iframe(this.iframe.getDocument()).on(event_name, data, fn);
	};
	this.off = function(event_name, fn)
	{
		jQuery_iframe(this.iframe.getDocument()).off(event_name, fn);
	};
	this.getChilrenIframe = function()
	{
		return this.iframe.getWindow().pageEdit;
	}
}