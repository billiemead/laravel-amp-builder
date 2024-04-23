import Inline from '../../../../node_modules/quill/blots/inline';
class Link extends Inline {
	static create(value) {
		let node = super.create(value);
		this._format(node, value);
		return node;
	}

	static formats(domNode) {
		return domNode.getAttribute('href');
	}
	static full_formats(domNode) {
		return {
			href:domNode.getAttribute('href'),
			new_tab: (domNode.getAttribute('target') == '_blank'),
			text:domNode.getAttribute('text'),
		};
	}
	static sanitize(url) {
		return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL;
	}
	static _format(domNode, value)
	{
		var link = value;
		if(typeof value.link == 'string')
			link = value.link;
		
		link = this.sanitize(link);	
		domNode.setAttribute('href', link);
		domNode.setAttribute('target', '');
		if(value.new_tab)
			domNode.setAttribute('target', '_blank');
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
Link.blotName = 'link';
Link.tagName = 'A';
Link.SANITIZED_URL = 'about:blank';
Link.PROTOCOL_WHITELIST = ['http', 'https', 'mailto', 'tel'];


function sanitize(url, protocols) {
	let anchor = document.createElement('a');
	anchor.href = url;
	let protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
	return protocols.indexOf(protocol) > -1;
}


export { Link as default, sanitize };
