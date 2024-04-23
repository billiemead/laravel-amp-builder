export default function(childService)
{
	"ngInject";
	this._attachHandler  = function()
	{};
	this.init=function()
	{
	};
	
	this.loadCompleted = function()
	{
		$('#edit_page').show();
		childService.load();
	};
	this._detachHandler = function()
	{
	}
}