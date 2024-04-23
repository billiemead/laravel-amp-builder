import extend from 'extend';
import Emitter from '../../../node_modules/quill/core/emitter';
import BaseTheme, { BaseTooltip } from '../../../node_modules/quill/themes/base';
import LinkBlot from './formats/link';

import { Range } from '../../../node_modules/quill/core/selection';
import icons from '../../../node_modules/quill/ui/icons';
import ColorPicker from './ui/color-picker';
import IconPicker from '../../../node_modules/quill/ui/icon-picker';
import Picker from './ui/picker';

const TOOLBAR_CONFIG = [
  [{ header: ['1', '2', '3', false] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean']
];
const ALIGNS = [ false, 'center', 'right', 'justify' ];

const COLORS = [
  
];
class SnowTheme extends BaseTheme {
	constructor(quill, options) {
		if (options.modules.toolbar != null && options.modules.toolbar.container == null) {
			options.modules.toolbar.container = TOOLBAR_CONFIG;
		}
		super(quill, options);
		this.quill.container.classList.add('ql-snow');
	}
	buildPickers(selects, icons) {
	
		this.pickers = selects.map((select) => {
			if (select.classList.contains('ql-align')) {
			if (select.querySelector('option') == null) {
				fillSelect(select, ALIGNS);
			}
				return new IconPicker(select, icons.align);
			} 
			if (select.querySelector('option') != null) {
				return;
			}
		  
			return new Picker(select);
		});
		let update = () => {
			this.pickers.forEach(function(picker) {
				if(picker != undefined)
					picker.update();
			});
		};
		this.quill.on(Emitter.events.EDITOR_CHANGE, update);
	}
	buildInputs(inputs, icons, container) {
	
		this.inputs = inputs.map((input) => {
			if (input.classList.contains('ql-color') || input.classList.contains('ql-background')) {
				return new ColorPicker(input, container);
			} 
			//return new Picker(select);
		});
		let update = () => {
			this.inputs.forEach(function(picker) {
				if(picker != undefined)
					picker.update();
			});
		};
		this.quill.on(Emitter.events.EDITOR_CHANGE, update);
	}
	extendToolbar(toolbar) {
		toolbar.container.classList.add('ql-snow');
		this.buildInputs([].slice.call(toolbar.container.querySelectorAll('input')), icons, toolbar.container);
		this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')), icons);
		//this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')), icons);
		this.tooltip = new SnowTooltip(this.quill, this.options.bounds, this.options.bounding);
		if (toolbar.container.querySelector('.ql-link')) {
			this.quill.keyboard.addBinding({ key: 'K', shortKey: true }, function(range, context) {
				toolbar.handlers['link'].call(toolbar, !context.format.link);
			});
		}
	}
}

function fillSelect(select, values, defaultValue = false) {
	values.forEach(function(value) {
		let option = document.createElement('option');
		if (value === defaultValue) {
			option.setAttribute('selected', 'selected');
		} else {
			option.setAttribute('value', value);
		}
		select.appendChild(option);
	});
}
SnowTheme.DEFAULTS = extend(true, {}, BaseTheme.DEFAULTS, {
	modules: {
		toolbar: {
			handlers: {
				link: function(value) {
					if (value) {
						let range = this.quill.getSelection();
						if (range == null || range.length == 0) return;
						let preview = this.quill.getText(range);
						if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
							preview = 'mailto:' + preview;
						}
						let tooltip = this.quill.theme.tooltip;
						tooltip.edit('link', preview);
					} else {
						this.quill.format('link', false);
					}
				}
			}
		}
	}
});


class SnowTooltip extends BaseTooltip {
	constructor(quill, bounds, bounding) {
		super(quill, bounds);
		this.preview = this.root.querySelector('a.ql-preview');
		this.bounding = bounding;
		if(bounding != undefined){
			document.body.insertBefore(this.root, null);
			this.root.classList.add('ql-snow');
		}
			
	}
	edit(mode = 'link', preview = null) {
		var toolbar = this.quill.theme.modules.toolbar;
		if(toolbar && toolbar.handlers && toolbar.handlers[mode]){
			toolbar.handlers[mode].call(this, true, preview);
		}
		
	}
	save(value = "", mode) {
		mode = mode || this.root.getAttribute('data-mode');
		//let value = this.textbox.value;
		switch(mode) {
			case 'link': {
				let scrollTop = this.quill.root.scrollTop;
				if (this.linkTarget) {
					this.quill.formatText(this.linkTarget.range, 'link', value, Emitter.sources.USER);
					delete this.linkTarget;
				} else {
					this.restoreFocus();
					this.quill.format('link', value, Emitter.sources.USER);
				}
				this.quill.root.scrollTop = scrollTop;
				break;
			}
			
			default:
		}
		this.textbox.value = '';
		this.hide();
	}
	listen() {
		super.listen();
		this.root.querySelector('a.ql-action').addEventListener('click', (event) => {
			if (this.root.classList.contains('ql-editing')) {
				this.save();
			} else {
				var mode = this.root.getAttribute('data-mode');
				this.edit(mode, this[mode + 'Target']);
			}
			event.preventDefault();
		});
		this.root.querySelector('a.ql-remove').addEventListener('click', (event) => {
			if (this.linkTarget != null) {
				let range = this.linkTarget.range;
				this.restoreFocus();
				this.quill.formatText(range, 'link', false, Emitter.sources.USER);
				delete this.linkTarget;
			}
			
			event.preventDefault();
			this.hide();
		});
		this.quill.on(Emitter.events.SELECTION_CHANGE, (range, oldRange, source) => {
			if (range == null) return;
			if (range.length === 0 && source === Emitter.sources.USER) {
				let links = this.getFullFormat(range, 'link');
				if(links != undefined)
				{
					this.linkTarget = links;
					this.root.setAttribute('data-mode', 'link');
					this.preview.textContent = links.full_formats.href;
					this.preview.setAttribute('href', links.full_formats.href);
					
					this.show();
					this.position(this.quill.getBounds(links.range));
					return;
				}
			} else {
				delete this.linkTarget;
			}
			this.hide();
		});
	}
	position(reference) {
		if(this.bounding)
		{
			var offset = this.bounding.getBoundingRect();
			reference.left += offset.left;
			reference.bottom += offset.top;
		}
		super.position(reference);
	}
	getFullFormat(range, mode = 'link')
	{
		var cl = LinkBlot;
		
		let [target, offset] = this.quill.scroll.descendant(cl, range.index);
		if (target != null) {
			let targetRange = new Range(range.index - offset, target.length());
			let full_formats = cl.full_formats(target.domNode);
			return {range: targetRange, full_formats: full_formats};
		}
	}
	
	show() {
		super.show();
		//this.root.removeAttribute('data-mode');
	}
}

SnowTooltip.TEMPLATE = [
  '<a class="ql-preview" target="_blank" href="about:blank"></a>',
  '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">',
  '<a class="ql-action"></a>',
  '<a class="ql-remove"></a>'
].join('');


export default SnowTheme;
