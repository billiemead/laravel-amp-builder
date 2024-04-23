var filter = function() {
	return function(items) {
		return items.slice().reverse();
	};
}
module.exports = {
	default:filter
}