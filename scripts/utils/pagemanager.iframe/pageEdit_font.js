export default function()
{
	"ngInject";
	this.tags = {};
	this.init = function()
	{
		if(window.siteInfo.font_icons)
		{
			var font_icons = window.siteInfo.font_icons;
			for(var i in font_icons){
				this.addFontTag(font_icons[i]);
			}
		}
	}
	this.addFontTag = function(font)
	{
		if(this.tags[font.name] != undefined)
			return;
		var href = window.basePath + '/themes/' + window.siteInfo.theme + '/fonts/' + font.name + '/' + font.file;
		var tag = jQuery_iframe('<link rel="stylesheet" type="text/css" href="' + href + '"/>');
		jQuery_iframe('head').append(tag);
		this.tags[font.name] = tag;
	}
	this.removeFontTag = function(name)
	{
		if(this.tags[name] != undefined)
		{
			this.tags[name].remove();
			var ref = this.tags[name].attr('href');
			//jQuery_iframe('link[href="' + ref + '"]').remove();
			console.log(this.tags[name]);
			delete this.tags[name];
		}
	}
}