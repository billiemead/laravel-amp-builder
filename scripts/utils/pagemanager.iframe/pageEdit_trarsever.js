export default function()
{
	"ngInject";
	return function(page_zone_function, zone_function, row_function, column_function, module_function, before_trarseve_function)
	{
		this.page_zone_function = page_zone_function;
		this.zone_function = zone_function;
		this.row_function = row_function;
		this.column_function = column_function;
		this.module_function = module_function;
		this.before_trarseve_function = before_trarseve_function;
		this.trarseve_body = function()
		{
			var that = this;
			jQuery_iframe('body').children('.page_zone').each(function(i)
			{
				that.trarseve_part(this);		
			});
		};
		this.trarseve_module = function(module)
		{
			var box = jQuery_iframe(module).children('.box');
			var tab = jQuery_iframe(module).children('.tabs').children('.navigation').children('li').children('a');
			var tab_contents = jQuery_iframe(module).children('.tabs').children('.tab-contents');
			var accordion = jQuery_iframe(module).children('.accordions').children('.accordion-header');
			this.module_function(module);
			var that = this;
			box.each(function(i)
			{
				that.trarseve_innerzone(this);
			});
			tab.each(function(i)
			{
				var href = jQuery_iframe(this).attr('href');
				href = href.substring(1);
				href = '.' + href;
				var content = tab_contents.children(href);
				that.trarseve_innerzone(content);
			});
			accordion.each(function(i)
			{
				var content = jQuery_iframe(this).next();
				that.trarseve_innerzone(content);
			});
		};
		this.trarseve_column = function(column)
		{
			var that = this;
			var modules = jQuery_iframe(column).children('.block').children('.module');
			this.column_function(column);
			if(modules.length > 0)
			{
				modules.each(function(i)
				{
					that.trarseve_module(this);
				});
			}
		};
		this.trarseve_row = function(row)
		{
			var columns = jQuery_iframe(row).children('.column');
			this.row_function(row);
			
			var that = this;
			columns.each(function(i)
			{
				that.trarseve_column(this);
			});
		};
		this.trarseve_zone = function(zone)
		{
			var rows = jQuery_iframe(zone).children('.container').children('.row');
			this.zone_function(zone);
			var that = this;
			rows.each(function(i)
			{
				that.trarseve_row(this);
			});
		};
		this.trarseve_innerzone = function(zone)
		{
			var that = this;
			var rows = jQuery_iframe(zone).children('.row');
			this.zone_function(zone);
			rows.each(function(i)
			{
				that.trarseve_row(this);
			});
		};
		this.trarseve_part = function(part)
		{
			var that = this;
			var zones = jQuery_iframe(part).children('.zone');
			
			this.page_zone_function(part);
			zones.each(function(i)
			{
				that.trarseve_zone(this);
			});
		};
		this.trarseve = function(element)
		{
			if(!element)
				this.trarseve_body();
			else
			{
				var e = jQuery_iframe(element);
				if(e.hasClass('page_zone') )
					this.trarseve_part(element);
				else if(e.hasClass('zone') )
					this.trarseve_zone(element);
				else if(e.hasClass('row') )
					this.trarseve_row(element);	
				else if(e.hasClass('column') )
					this.trarseve_column(element);
				else if(e.hasClass('module') )
					this.trarseve_module(element);
			}
		};
	
	}
}