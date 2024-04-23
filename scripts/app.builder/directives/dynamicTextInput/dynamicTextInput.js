export default function($sce, pageEdit_undoManager)
{
	"ngInject";
	return {
		template: require('./template.tmpl'),
		require: '?ngModel',
		
		link: function(scope, element, attrs, ngModel)
		{
			var contentElement = $('[contenteditable]', element);
			contentElement.click(function(event)
			{
				event.stopPropagation();
			})
			var toolbar = $('.quill-toolbar', element);
			function getHtml()
			{
				var editor = $('.ql-editor > p', element);
				return editor.html();
			}
			function setHtml(html)
			{
				var editor = $('.ql-editor', element);
				return editor.html(html);
			}
			scope.dynamic_text_enabled = (attrs.dynamicText != undefined);
			var imported = Quill.imports;
			scope.features = {
				'animatenumber': imported['formats/animatenumber'] != undefined,
				'dynamic': imported['formats/dynamic'] != undefined,
				'dynamicheadline': imported['formats/dynamicheadline'] != undefined
			}
			var quill_editor = new Quill(contentElement[0], {
				theme: 'snow',
				modules: {
					history: {
						undoManager : pageEdit_undoManager
					},
					
					toolbar: {
						container: toolbar[0],
						handlers:{
							
							
						}
					}
				}
			});
			var keyboard = quill_editor.getModule('keyboard');
			delete keyboard.bindings[13];
			$(contentElement).on('keydown', function (e) {
				if (e.keyCode === 13) {
					e.preventDefault();
					
				}
				e.stopPropagation();
			});
			quill_editor.on('text-change', function(delta, oldDelta, source){
				var editor = $('> .ql-container > .ql-editor > p', element);
				var content = getHtml();//$sce.trustAsHtml(editor.html());//quill_editor.getText();
				if ( attrs.stripBr && content == '<br>' ) {
				  content = '';
				}
				ngModel.$setViewValue(content);
			});
			
			if (!ngModel) return;
			ngModel.$render = function() {
				if(!element.closest('html').length)
					return;
				var content = (ngModel.$viewValue);
				if(content != undefined)
					setHtml('<p>' + content + '</p>');
				return;
				
			};
			
		}
	}
}
