var base = require('./base').default;
var _ = require('../../libraries/lodash');
class countdown extends base{
	loadElement(element){
		super.loadElement(element);
		
	}
	getData()
	{
		 if(!this.data.end){
			this.data.end = this.getElapsedDate(1); 
		 }
		return super.getData();
	}
	compileTemplate(template){
		if(this.data.end)
			this.data.endDate = this.convertToDateObject(this.data.end);
		return super.compileTemplate(template);
	}
	toCountdownDate(d)
	{
		return {
			date:d.getDate(),
			month:d.getMonth() + 1,
			year:d.getFullYear(),
			hour:d.getHours(),
			minute:d.getMinutes(),
			second:d.getSeconds(),
		};
	}
	getElapsedDate(elaps)
	{
		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate()+elaps);
		return {
			date:tomorrow.getDate(),
			month:tomorrow.getMonth() + 1,
			year:tomorrow.getFullYear(),
			hour:tomorrow.getHours(),
			minute:tomorrow.getMinutes(),
			offset:-(tomorrow.getTimezoneOffset() / 60)
		};
	}
	setProperty(property)
	{
		super.setProperty(property);
		var now = new Date();
		this.data = $.extend({
			end: (this.getElapsedDate(1)),
		}, this.data);
	}
	
	resetCountdown()
	{
		
	}
	getCountdownTemplate()
	{
		
	}
	setupCountdown()
	{
		
	}
	
	
	
}
module.exports = {
	
	default: countdown
}