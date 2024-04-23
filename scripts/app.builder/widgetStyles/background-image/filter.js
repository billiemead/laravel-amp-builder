var stringify = require('../../../utils/css-box-shadow').stringify;

var filter = function() {
	"ngInject";
    // A filter declaration should return an anonymous function.
    // The first argument is the input passed to the filter
    // Any additional arguments are paramaters passed AFTER the filter name
    return function(value) {
		//console.log('bgfilder', value);
		return value.type;
		switch(value.type){
			case 'image':
			break;
			case 'gradient':
			break;
			case 'color':
			break;
		}
		return "";
		var copy = angular.copy(shadow);
		if(shadow.color != undefined  && shadow.color.value != undefined){
			
			copy.color = shadow.color.value
		}
		return stringify([copy]);
    };
};
module.exports = {
	default:filter
}