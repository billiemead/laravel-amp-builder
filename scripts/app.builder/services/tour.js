require('../../utils/tour/bootstrap-tour');
export default function(API, pageEdit_event){
	"ngInject";
	this.init = function(json, force){
		var that = this;
		if(json && json.steps){
			
			var steps = [];
			for(var i in json.steps){
				var step = json.steps[i];
				if(step != undefined){
					steps.push({
						element:step.element,
						title: step.title,
						content: step.description,
						placement : step.placement
					});
				}
			}
			
			var tourClass = window.Tour;
			if(json.in_iframe == 1){
				tourClass = pageEdit_event.iframe.getWindow().Tour;
			}
			var tour = new tourClass({
				name: 'tour'+json.id,
				steps: steps,
				backdrop: json.backdrop == 1,
				onEnd: function(tour){
					if(json.next_tour_id && json.next_tour_id != 0 ){
						that.init(json.next_tour_id, force);
					}
				}
			});
			tour.init();
			var dontshownext = (tour._getState('dontshownext'));
			var force_start = json.force_start == 1;
			if(force || !dontshownext)
				tour.start(force_start);
		}
	}
	
}