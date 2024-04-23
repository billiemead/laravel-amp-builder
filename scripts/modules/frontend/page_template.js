var base = require('./page').default;
class page_template extends base{
	initModules(t){
		var template_type = $('body').attr('template-type');
		if(template_type == 'page')
			return super.initModules(t);
		if(template_type == 'section')
		{
			var section_elements = $('body').children("section.section");
			section_elements.each(function()
			{
				pageEdit.createModule(this, 'section');
			});
		}
		if(template_type == 'popup')
		{
			var section_elements = $('body').children(".popup-section");
			section_elements.each(function()
			{
				pageEdit.createModule(this);
			});
		}
		
		
		
	}
}
module.exports = {
	
	default: page_template
}