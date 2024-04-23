import Inline from '../../../../node_modules/quill/blots/inline';


class Dynamic extends Inline {
	static create(value) {
		let node = super.create(value);
		this._format(node, value);
		return node;
	}

	static formats(domNode) {
		return domNode.getAttribute('target');
	}
	static full_formats(domNode) {
		return {
			target: domNode.getAttribute('target'),
			text:domNode.getAttribute('text'),
		};
	}
	static _format(domNode, value)
	{
		var target = value;
		if(value.target)
			target = value.target;
		domNode.setAttribute('target', target);
	}
	format(name, value) {
		if (name !== this.statics.blotName || !value) return super.format(name, value);
		this.constructor._format(this.domNode, value);
		if(value.text){
			var length = this.length();
			this.deleteAt(0, length - 1);
			this.insertAt(0, value.text);
		}
	}
}
Dynamic.blotName = 'dynamic';
Dynamic.tagName = 'DYNAMIC';
export { Dynamic as default };
