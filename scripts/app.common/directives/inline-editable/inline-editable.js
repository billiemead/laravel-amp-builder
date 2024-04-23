export default function($sce)
{
	"ngInject";
	return {
		require: '?ngModel',
		
		link: function(scope, element, attrs, ngModel)
		{
			if (!ngModel) return;
			$(element).attr('contenteditable', true);
			$(element).on('focus', function(){
				$(this).data('before', $(this).html());
			});
			
			var updateOnEnter = (attrs.updateOnEnter != undefined);
			var numberOnly = (attrs.numberOnly != undefined);
			ngModel.$render = function() {
				var content = (ngModel.$viewValue);
				$(element).html(content);
				return;
			};
			$(element).on('blur keydown paste input', function(event){
				const $this = $(this);
				var trigger = true;
				if(updateOnEnter){
					trigger = ( ((event.type=='keydown' || event.type == 'input') && event.keyCode == 13 )? true: false);
					if(trigger){
						event.preventDefault();
					}
				}
				if(numberOnly){
					
					if(!((event.keyCode >=48 &&  event.keyCode <= 57) || event.keyCode == 8|| event.keyCode == 46)){
						
						event.preventDefault();
						//event.stopPropagation();
					}
						
				
				}
				console.log('trigger', $this.data('before'), $this.html());
				console.log(event.keyCode);
				if ($this.data('before') !== $this.html()) {
					
					$this.data('before', $this.html());
					if(trigger){
						ngModel.$setViewValue($this.html());
					}
						
				}
				if(trigger){
					ngModel.$setViewValue($this.html());
				}
			
			});
			
		}
	}
}
