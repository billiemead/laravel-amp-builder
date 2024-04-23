var base = require('./base').default;
class video extends base{
	getAMPElement()
	{
		return this.getElement().children('amp-list')
	}
}
module.exports = {
	
	default: video
}