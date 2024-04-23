import Embed from '../../../../node_modules/quill/blots/embed';


class Dynamic_Headline extends Embed {
	static create(value) {
		let node = super.create(value);
		this._format(node, value);
		return node;
	}

	static formats(domNode) {
		return {
			type: domNode.getAttribute('type'),
			text:domNode.getAttribute('text'),
		};
		return domNode.getAttribute('type');
	}
	static full_formats(domNode) {
		return {
			type: domNode.getAttribute('type'),
			text:domNode.getAttribute('text'),
		};
	}
	static _format(domNode, value)
	{
		var type = value;
		if(value.type)
			type = value.type;
		domNode.setAttribute('type', type);
		if(value.text){
			domNode.setAttribute('text', value.text);
		}
		
	}
	format(name, value) {
		if (name !== this.statics.blotName || !value) return super.format(name, value);
		this.constructor._format(this.domNode, value);
		if(value.text){
			this.domNode.setAttribute('text', value.text);
		}
	}
}
Dynamic_Headline.blotName = 'dynamicheadline';
Dynamic_Headline.tagName = 'HEADLINE';
export { Dynamic_Headline as default };
