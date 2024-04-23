class Handler {
	constructor(Grapick, position = 0, color = 'black', select = 1) {
		Grapick.getHandlers().push(this);
		this.gp = Grapick;
		this.position = position;
		this.color = color;
		this.selected = 0;
	
	}
	toJSON() {
		return {
		  position: this.position,
		  color: this.color,
		};
	}

	/**
	* Set color
	* @param {string} color Color string, eg. red, #123, 'rgba(30,87,153,1)', etc..
	* @param {Boolean} complete Indicates if the action is complete
	* @example
	* handler.setColor('red');
	*/
	setColor(color, complete = 1) {
		this.color = color;
	}

	/**
	* Set color
	* @param {integer} position Position integer in percentage, eg. 20, 50, 100
	* @param {Boolean} complete Indicates if the action is complete
	* @example
	* handler.setPosition(55);
	*/
	setPosition(position, complete = 1) {
		//const el = this.getEl();
		this.position = position;
		//el && (el.style.left = `${position}%`);
	}

	/**
	* Get color of the handler
	* @return {string} Color string
	*/
	getColor() {
		return this.color;
	}
	getColorValue() {
		return this.color.value || this.color;
	}
	/**
	* Get position of the handler
	* @return {integer} Position integer
	*/
	getPosition() {
		return this.position;
	}

	/**
	* Indicates if the handler is the selected one
	* @return {Boolean}
	*/
	isSelected() {
		return !!this.selected;
	}

	/**
	* Get value of the handler
	* @return {string}
	* @example
	* handler.getValue(); // -> `black 0%`
	*/
	getValue() {
		return `${this.getColorValue()} ${this.getPosition()}%`;
	}
	remove(options = {}) {
		const handlers = this.gp.getHandlers();
		const removed = handlers.splice(handlers.indexOf(this), 1)[0];
		return removed;
	}

}
const comparator = (l, r) => {
  return l.position - r.position;
}

const typeName = name => `${name}-gradient(`;
export default class Grapick
{
	constructor(options = {}) {
    
		this.handlers = [];
		this.options = options;
		
	}
	getValue(type, angle) {
		const color = this.getColorValue();
		const t = type || this.getType();
		const a = angle || this.getDirection();
		return color ? `${t}-gradient(${a}, ${color})` : '';
	}
	getSafeValue(type, angle) {
		const value = this.getValue(type, angle);
		!this.sandEl && (this.sandEl = document.createElement('div'))


		const style = this.sandEl.style;
		const values = [value, ...this.getPrefixedValues(type, angle)];
		let val;

		for (let i = 0; i < values.length; i++) {
		  val = values[i];
		  style.backgroundImage = val;

		  if (style.backgroundImage == val) {
			  break;
		  }
		}

		return style.backgroundImage;
	}
	getPreferPrefix(type, angle)
	{
		
	}
	setValue(value = '', options = {}) {
		let type = this.type;
		let direction = this.direction;
		let start = value.indexOf('(') + 1;
		let end = value.lastIndexOf(')');
		let gradients = value.substring(start, end);
		const values = gradients.split(/,(?![^(]*\)) /);
		this.clear(options);

		if (!gradients) {
		  this.updatePreview();
		  return;
		}

		if (values.length > 2) {
		  direction = values.shift();
		}

		let typeFound;
		const types = ['repeating-linear', 'repeating-radial', 'linear', 'radial'];
		types.forEach(name => {
		  if (value.indexOf(typeName(name)) > -1 && !typeFound) {
			typeFound = 1;
			type = name;
		  }
		})

		this.setDirection(direction, options);
		this.setType(type, options);
		values.forEach(value => {
		  const hdlValues = value.split(' ');
		  const position = parseFloat(hdlValues.pop());
		  const color = hdlValues.join('');
		  this.addHandler(position, color, 0, options);
		})
	}
	getColorValue() {
		let handlers = this.handlers;
		handlers.sort(comparator);
		handlers = handlers.length == 1 ? [handlers[0], handlers[0]] : handlers;
		return handlers.map(handler => handler.getValue()).join(', ');
	}
	getPrefixedValues(type, angle) {
		const value = this.getValue(type, angle);
		return ['-moz-', '-webkit-', '-o-', '-ms-'].map(prefix =>
		  `${prefix}${value}`);
	}
	setDirection(direction, options = {}) {
		this.options.direction = direction;
	}


	/**
	* Set gradient direction, eg. 'top', 'left', 'bottom', 'right', '90deg', etc.
	* @param {string} direction Any supported direction
	*/
	getDirection() {
		return this.options.direction;
	}
	setType(type, options = {}) {
		this.options.type = type;
		this.change(1, options);
	}


	/**
	* Get gradient type
	* @return {string}
	*/
	getType() {
		return this.options.type;
	}
	addHandler(position, color, options = {}) {
		const handler = new Handler(this, position, color, 1);
	//	!options.silent && this.emit('handler:add', handler);
		return handler;
	}


	/**
	* Get handler by index
	* @param  {integer} index
	* @return {Object}
	*/
	getHandler(index) {
		return this.handlers[index];
	}


	/**
	* Get all handlers
	* @return {Array}
	*/
	getHandlers() {
		return this.handlers;
	}
	getHandlersJson() {
		return this.handlers.map(function(item)
		{
			return item.toJSON();
		});
	}

	/**
	* Remove all handlers
	* @param {Object} [options={}] Options
	* @param {Boolean} [options.silent] Don't trigger events
	* @example
	* ga.clear();
	* // Don't trigger events
	* ga.clear({silent: 1});
	*/
	clear(options = {}) {
		const handlers = this.handlers;

		for (var i = handlers.length - 1; i >= 0; i--) {
		   handlers[i].remove(options);
		}
	}
}
