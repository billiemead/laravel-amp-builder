var moment = require('../../libraries/moment.min');
var moment = require('../../libraries/moment-timezone.min');
var parser = function(input, format){
	var locale = $('html').attr('lang');
	moment.locale(locale);

	// Create an instance of Moment. Use both the
	// date value and timezone information PHP sent
	if(input && input.date && input.timezone)
		var date = moment.tz(input.date, input.timezone);
	else
		date = moment(input);
	if (format == "human") {
		// Special case for formatting. If user asks for "human" format
		// return a value like "13 minutes ago" or "2 weeks ago" etc.
		return date.fromNow();
	} else {
		// Covert the moment to a string using the passed format
		// If nothing is passed, uses default JavaScript date format
		return date.format(format);
	}
}
var filter = function() {
	"ngInject";
    // A filter declaration should return an anonymous function.
    // The first argument is the input passed to the filter
    // Any additional arguments are paramaters passed AFTER the filter name
    return function(input, format) {
		return parser(input, format)
    };
};
module.exports = {
	parser: parser,
	default:filter
}