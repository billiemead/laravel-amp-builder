angular.module('ngCkeditor', [])
.run(['$q', '$timeout', function($q, $timeout) {
    var $defer, loaded = false;
	$defer = $q.defer();
	var CKEDITOR = window.CKEDITOR;
    if (angular.isUndefined(CKEDITOR)) {
        //throw new Error('CKEDITOR not found');
    }
	else{
		CKEDITOR.disableAutoInline = true;
		function checkLoaded() {
			if (CKEDITOR.status === 'loaded') {
				loaded = true;
				$defer.resolve();
			} else {
				checkLoaded();
			}
		}
		CKEDITOR.on('loaded', checkLoaded);
		$timeout(checkLoaded, 100);
	}
    
}])
.directive('ckeditor', ['$timeout', '$q', function ($timeout, $q) {
    'use strict';
    return {
        restrict: 'AC',
        require: ['ngModel', '^?form'],
        scope: false,
        link: function (scope, element, attrs, ctrls) {
			var $defer, loaded = false;
            var ngModel = ctrls[0];
            var form    = ctrls[1] || null;
            var EMPTY_HTML = '<p></p>',
                isTextarea = element[0].tagName.toLowerCase() === 'textarea',
                data = [],
                isReady = false;

            if (!isTextarea) {
                element.attr('contenteditable', true);
            }

            var onLoad = function () {
                var options = {
                    toolbar: 'full',
                    toolbar_full: [ //jshint ignore:line
                        { name: 'basicstyles',
                            items: [ 'Bold', 'Italic', 'Strike', 'Underline' ] },
                        { name: 'paragraph', items: [ 'BulletedList', 'NumberedList', 'Blockquote' ] },
                        { name: 'editing', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
                        { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
                        { name: 'tools', items: [ 'SpellChecker', 'Maximize' ] },
                        '/',
                        { name: 'styles', items: [ 'Format', 'FontSize', 'PaletteTextColor', 'PasteText', 'PasteFromWord', 'RemoveFormat' ] },
                        { name: 'insert', items: [ 'Image', 'Table', 'SpecialChar' ] },
                        { name: 'forms', items: [ 'Outdent', 'Indent' ] },
                        { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
                        { name: 'document', items: [ 'PageBreak', 'Source' ] }
                    ],
                    disableNativeSpellChecker: true,
                    uiColor: '#FAFAFA',
                    height: '400px',
                    width: '100%'
                };
                options = angular.extend(options, scope[attrs.ckeditor]);

                var instance = (isTextarea) ? CKEDITOR.replace(element[0], options) : CKEDITOR.inline(element[0], options),
                    configLoaderDef = $q.defer();

                element.bind('$destroy', function () {
                    instance.destroy(
                        false //If the instance is replacing a DOM element, this parameter indicates whether or not to update the element with the instance contents.
                    );
                });
                var setModelData = function(setPristine) {
                    var data = instance.getData();
                    if (data === '') {
                        data = null;
                    }
                    $timeout(function () { // for key up event
                      if (setPristine !== true || data !== ngModel.$viewValue)
                        ngModel.$setViewValue(data);

                      if (setPristine === true && form)
                        form.$setPristine();
                    }, 0);
                }, onUpdateModelData = function(setPristine) {
                    if (!data.length) { return; }


                    var item = data.pop() || EMPTY_HTML;
                    isReady = false;
                    instance.setData(item, function () {
                        setModelData(setPristine);
                        isReady = true;
                    });
                };

                //instance.on('pasteState',   setModelData);
                instance.on('change',       setModelData);
                instance.on('blur',         setModelData);
                //instance.on('key',          setModelData); // for source view

                instance.on('instanceReady', function() {
                    scope.$broadcast('ckeditor.ready');
                    scope.$apply(function() {
                        onUpdateModelData(true);
                    });

                    instance.document.on('keyup', setModelData);
                });
                instance.on('customConfigLoaded', function() {
                    configLoaderDef.resolve();
                });

                ngModel.$render = function() {
                    data.push(ngModel.$viewValue);
                    if (isReady) {
                        onUpdateModelData();
                    }
                };
            };

            if (CKEDITOR.status === 'loaded') {
                loaded = true;
            }
            if (loaded) {
                onLoad();
            } else {
                $defer.promise.then(onLoad);
            }
        }
    };
}]);