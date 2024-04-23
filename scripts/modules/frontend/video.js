var base = require('./base').default;
class video extends base{
	getAMPElement()
	{
		return this.getElement().children();
	}
}
module.exports = {
	
	default: video
}