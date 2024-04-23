export default function($q, pageEdit_layout,$dialog)
{
	"ngInject";
	return function(iframe)
	{
		window.jQuery_iframe = iframe.$;
		this.iframe = iframe;
		this.getDocument = function()
		{
			return this.iframe.document;
		};
		this.getWindow = function()
		{
			return this.iframe.window;
		};
		this.setVariable = function(name,value)
		{
			this.iframe[name] = value;
			return this.iframe[name];
		};
		this.getVariable = function(name)
		{
			return this.iframe[name];
		}
		this.getLess = function()
		{
			return this.iframe.window.less;
		}
		this.scrollTo = function(element)
		{
			var offset = jQuery_iframe(element).offset().top;
			jQuery_iframe(this.iframe.window).scrollTop(offset);
		}
	}
}