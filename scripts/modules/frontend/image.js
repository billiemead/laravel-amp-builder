var base = require('./base').default;

class image extends base{
	getAMPElement()
	{
		return this.getElement().children('amp-img')
	}
	reCalculateAMPSize()
	{
		var amp_layout = this.getAMPLayout();
		var imageElement = this.getAMPElement().children('img');
		var that = this;
		imageElement.load(function()
		{
			//console.log(this.naturalWidth, this.naturalHeight);
			this._reCalculateAMPSize(this);
		});
		this._reCalculateAMPSize(imageElement[0]);
	}
	_reCalculateAMPSize(image)
	{
		if(!image)
			return;
		//console.log(image);
		//console.log(image.naturalWidth, image.naturalHeight);
	}
}
module.exports = {
	
	default: image
}