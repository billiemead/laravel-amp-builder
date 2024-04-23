export default function()
{
	this.highlighters = [];
	this.deregister = function(highlighter)
	{
		for(var i = 0;i < this.highlighters.length;i++)
		{
			if(this.highlighters[i] == highlighter)
			{
				this.highlighters.splice(i,1);
			}
		}
	};
	
	this.unhighlight= function(element)
	{
		for(var i = 0;i < this.highlighters.length;i++)
		{
			if(this.highlighters[i].getalignElement().is( element))
			{
				this.highlighters[i].remove();
			}
		}
	};
	this.unhighlightAll= function()
	{
		for(var i = this.highlighters.length-1;i >=0;i--)
		{
			if(this.highlighters[i] != 'undefined')
				this.highlighters[i].remove();
		}
	};
	this.register = function(h)
	{
		this.highlighters = this.highlighters || [];
		this.highlighters.push(h);
	};
	this.align = function()
	{
		for(var i = 0;i < this.highlighters.length;i++)
		{
			this.highlighters[i].align();
		}
	}
}