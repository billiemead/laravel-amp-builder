

class ColorPicker  {
  constructor(input, container) {
	  this.container = container;
    this.input = input
	let button = this.container.querySelector('.' + input.classList);
	input.addEventListener('change', this.update.bind(this));
  }
  update() {
	  let classList = this.input.classList;
	  classList = classList[0];
    let button = this.container.querySelector('button.' + classList);
	//console.log(button);
	let colorLabel = button.querySelector('.ql-color-label');
	
    let value = this.input.value || '';
	//console.log(value, window.ql_palettes);
	if(window.ql_palettes && window.ql_palettes[value] != undefined){
		value = window.ql_palettes[value];
	}
    if (colorLabel) {
      if (colorLabel.tagName === 'line') {
        colorLabel.style.stroke = value;
      } else {
        colorLabel.style.fill = value;
      }
    }
  }
}


export default ColorPicker;
