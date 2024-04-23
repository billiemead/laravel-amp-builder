var base = require('./base').default;
var texteditor = require('./mixins/text').default;
var mx = require('mixwith');


class text extends mx.mix(base).with(texteditor){

	getToolbarButtons()
	{
		return ['bold', 'italic', 'anchor', 'removeFormat'];
	}
	getEditorOptions()
	{
		return {
			
		}
	}
	getEditorElement()
	{
		if(this.getElement().children('div').not('[shadow]').length == 1 && this.getElement().children().length == 1)
			return this.getElement().children('div');
		return this.getElement();
	}
	
	
	
}

module.exports = {
	
	default: text,
	
}