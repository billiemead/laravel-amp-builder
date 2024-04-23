var base = require('./base').default;
class facebookcomment extends base{
	
	compileTemplate(template){
		if(!this.data.href)
			this.data.href = window.basePath;
		return super.compileTemplate(template);
	}
	
	
	
}
module.exports = {
	
	default: facebookcomment
}