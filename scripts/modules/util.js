var Selection = require('./selection');

var Util = {

	// http://stackoverflow.com/questions/17907445/how-to-detect-ie11#comment30165888_17907562
	// by rg89
	isIE: ((navigator.appName === 'Microsoft Internet Explorer') || ((navigator.appName === 'Netscape') && (new RegExp('Trident/.*rv:([0-9]{1,}[.0-9]{0,})').exec(navigator.userAgent) !== null))),

	isEdge: (/Edge\/\d+/).exec(navigator.userAgent) !== null,

	// if firefox
	isFF: (navigator.userAgent.toLowerCase().indexOf('firefox') > -1),

	// http://stackoverflow.com/a/11752084/569101
	isMac: (window.navigator.platform.toUpperCase().indexOf('MAC') >= 0),

	// https://github.com/jashkenas/underscore
	// Lonely letter MUST USE the uppercase code
	keyCode: {
		BACKSPACE: 8,
		TAB: 9,
		ENTER: 13,
		ESCAPE: 27,
		SPACE: 32,
		DELETE: 46,
		K: 75, // K keycode, and not k
		M: 77,
		V: 86
	},
	isEditorElement: function(element)
	{
		return element && element.getAttribute && !!element.getAttribute('contenteditable');
	},
	/**
	 * Returns true if it's metaKey on Mac, or ctrlKey on non-Mac.
	 * See #591
	 */
	isMetaCtrlKey: function (event) {
		if ((Util.isMac && event.metaKey) || (!Util.isMac && event.ctrlKey)) {
			return true;
		}

		return false;
	},

	/**
	 * Returns true if the key associated to the event is inside keys array
	 *
	 * @see : https://github.com/jquery/jquery/blob/0705be475092aede1eddae01319ec931fb9c65fc/src/event.js#L473-L484
	 * @see : http://stackoverflow.com/q/4471582/569101
	 */
	isKey: function (event, keys) {
		var keyCode = Util.getKeyCode(event);

		// it's not an array let's just compare strings!
		if (false === Array.isArray(keys)) {
			return keyCode === keys;
		}

		if (-1 === keys.indexOf(keyCode)) {
			return false;
		}

		return true;
	},

	getKeyCode: function (event) {
		var keyCode = event.which;

		// getting the key code from event
		if (null === keyCode) {
			keyCode = event.charCode !== null ? event.charCode : event.keyCode;
		}

		
		return keyCode;
	},
	blockContainerElementNames: [
		// elements our editor generates
		'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'ul', 'li', 'ol',
		// all other known block elements
		'address', 'article', 'aside', 'audio', 'canvas', 'dd', 'dl', 'dt', 'fieldset',
		'figcaption', 'figure', 'footer', 'form', 'header', 'hgroup', 'main', 'nav',
		'noscript', 'output', 'section', 'video',
		'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td'
	],
	isBlockContainer: function (element) {
		return element && element.nodeType !== 3 && Util.blockContainerElementNames.indexOf(element.nodeName.toLowerCase()) !== -1;
	},
	/* Finds highest level ancestor element which is a block container element
	 * If element is within editor element but not within any other block element,
	 * the editor element is returned
	 */
	getTopBlockContainer: function (element) {
		var topBlock = Util.isBlockContainer(element) ? element : false;
		Util.traverseUp(element, function (el) {
			if (Util.isBlockContainer(el)) {
				topBlock = el;
			}
			if (!topBlock && Util.isEditorElement(el)) {
				topBlock = el;
				return true;
			}
			return false;
		});
		return topBlock;
	},
	traverseUp: function (current, testElementFunction) {
		if (!current) {
			return false;
		}

		do {
			if (current.nodeType === 1) {
				if (testElementFunction(current)) {
					return current;
				}
				// do not traverse upwards past the nearest containing editor
				if (Util.isEditorElement(current)) {
					return false;
				}
			}

			current = current.parentNode;
		} while (current);

		return false;
	},
	htmlEntities: function (str) {
		// converts special characters (like <) into their escaped/encoded values (like &lt;).
		// This allows you to show to display the string without the browser reading it as HTML.
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	},
	cleanupAttrs: function (el, attrs) {
		attrs.forEach(function (attr) {
			el.removeAttribute(attr);
		});
	},

	cleanupTags: function (el, tags) {
		if (tags.indexOf(el.nodeName.toLowerCase()) !== -1) {
			el.parentNode.removeChild(el);
		}
	},

	unwrapTags: function (el, tags) {
		if (tags.indexOf(el.nodeName.toLowerCase()) !== -1) {
			Util.unwrap(el, document);
		}
	},
	unwrap: function (el, doc) {
		var fragment = doc.createDocumentFragment(),
			nodes = Array.prototype.slice.call(el.childNodes);

		// cast nodeList to array since appending child
		// to a different node will alter length of el.childNodes
		for (var i = 0; i < nodes.length; i++) {
			fragment.appendChild(nodes[i]);
		}

		if (fragment.childNodes.length) {
			el.parentNode.replaceChild(fragment, el);
		} else {
			el.parentNode.removeChild(el);
		}
	},
	// http://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div
	insertHTMLCommand: function (doc, html) {
		!doc && (doc = document);
		var selection, range, el, fragment, node, lastNode, toReplace,
			res = false,
			ecArgs = ['insertHTML', false, html];

		/* Edge's implementation of insertHTML is just buggy right now:
		 * - Doesn't allow leading white space at the beginning of an element
		 * - Found a case when a <font size="2"> tag was inserted when calling alignCenter inside a blockquote
		 *
		 * There are likely other bugs, these are just the ones we found so far.
		 * For now, let's just use the same fallback we did for IE
		 */
		if (!Util.isEdge && doc.queryCommandSupported('insertHTML')) {
			try {
				return doc.execCommand.apply(doc, ecArgs);
			} catch (ignore) {}
		}

		selection = doc.getSelection();
		if (selection.rangeCount) {
			range = selection.getRangeAt(0);
			toReplace = range.commonAncestorContainer;

			// https://github.com/yabwe/medium-editor/issues/748
			// If the selection is an empty editor element, create a temporary text node inside of the editor
			// and select it so that we don't delete the editor element
			if (Util.isEditorElement(toReplace) && !toReplace.firstChild) {
				range.selectNode(toReplace.appendChild(doc.createTextNode('')));
			} else if ((toReplace.nodeType === 3 && range.startOffset === 0 && range.endOffset === toReplace.nodeValue.length) ||
					(toReplace.nodeType !== 3 && toReplace.innerHTML === range.toString())) {
				// Ensure range covers maximum amount of nodes as possible
				// By moving up the DOM and selecting ancestors whose only child is the range
				while (!Util.isEditorElement(toReplace) &&
						toReplace.parentNode &&
						toReplace.parentNode.childNodes.length === 1 &&
						!Util.isEditorElement(toReplace.parentNode)) {
					toReplace = toReplace.parentNode;
				}
				range.selectNode(toReplace);
			}
			range.deleteContents();

			el = doc.createElement('div');
			el.innerHTML = html;
			fragment = doc.createDocumentFragment();
			while (el.firstChild) {
				node = el.firstChild;
				lastNode = fragment.appendChild(node);
			}
			range.insertNode(fragment);

			// Preserve the selection:
			if (lastNode) {
				range = range.cloneRange();
				range.setStartAfter(lastNode);
				range.collapse(true);
				Selection.selectRange(doc, range);
			}
			res = true;
		}

		// https://github.com/yabwe/medium-editor/issues/992
		// If we're monitoring calls to execCommand, notify listeners as if a real call had happened
		if (doc.execCommand.callListeners) {
			doc.execCommand.callListeners(ecArgs, res);
		}
		return res;
	},
	execFormatBlock: function (doc, tagName) {
		// Get the top level block element that contains the selection
		!doc && (doc = document);
		var blockContainer = Util.getTopBlockContainer(Selection.getSelectionStart(doc)),
			childNodes;

		// Special handling for blockquote
		if (tagName === 'blockquote') {
			if (blockContainer) {
				childNodes = Array.prototype.slice.call(blockContainer.childNodes);
				// Check if the blockquote has a block element as a child (nested blocks)
				if (childNodes.some(function (childNode) {
					return Util.isBlockContainer(childNode);
				})) {
					// FF handles blockquote differently on formatBlock
					// allowing nesting, we need to use outdent
					// https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
					return doc.execCommand('outdent', false, null);
				}
			}

			// When IE blockquote needs to be called as indent
			// http://stackoverflow.com/questions/1816223/rich-text-editor-with-blockquote-function/1821777#1821777
			if (Util.isIE) {
				return doc.execCommand('indent', false, tagName);
			}
		}

		// If the blockContainer is already the element type being passed in
		// treat it as 'undo' formatting and just convert it to a <p>
		if (blockContainer && tagName === blockContainer.nodeName.toLowerCase()) {
			tagName = 'p';
		}

		// When IE we need to add <> to heading elements
		// http://stackoverflow.com/questions/10741831/execcommand-formatblock-headings-in-ie
		if (Util.isIE) {
			tagName = '<' + tagName + '>';
		}

		// When FF, IE and Edge, we have to handle blockquote node seperately as 'formatblock' does not work.
		// https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand#Commands
		if (blockContainer && blockContainer.nodeName.toLowerCase() === 'blockquote') {
			// For IE, just use outdent
			if (Util.isIE && tagName === '<p>') {
				return doc.execCommand('outdent', false, tagName);
			}

			// For Firefox and Edge, make sure there's a nested block element before calling outdent
			if ((Util.isFF || Util.isEdge) && tagName === 'p') {
				childNodes = Array.prototype.slice.call(blockContainer.childNodes);
				// If there are some non-block elements we need to wrap everything in a <p> before we outdent
				if (childNodes.some(function (childNode) {
					return !Util.isBlockContainer(childNode);
				})) {
					doc.execCommand('formatBlock', false, tagName);
				}
				return doc.execCommand('outdent', false, tagName);
			}
		}
console.log('formatBlock', doc, blockContainer, tagName);
		return doc.execCommand('formatBlock', false, tagName);
	},

}
module.exports = Util;
