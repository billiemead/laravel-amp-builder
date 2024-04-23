function checkNewSectionName(name)
{
	var index = 0;
	if(name != undefined && window.siteInfo.sectionCategories != undefined)
		for(var i in window.siteInfo.sectionCategories){
			for(var j in window.siteInfo.sectionCategories[i])
			if(name == j){
				return true;
			}
		}
	return false;
}
function getSectionLess(styles){
	var s = '';
	for(var i in styles){
		if(styles[i]['css'] != undefined)
			s += 'section.' + styles[i]['type'] + '{' +  styles[i]['css'] + '}';
	}
	return s;
}
function getSectionData(name){

	for(var i in window.siteInfo.sectionCategories){
		for(var j in window.siteInfo.sectionCategories[i])
		if(name == j){
			category = i;
		}
	}
	var data;
	if(window.siteInfo.sections[name] != undefined)
		data = {
			name:name,
			display_name:window.siteInfo.sections[name].display_name,
			category:category,
			html: window.siteInfo.sections[name].data,
			css: window.siteInfo.sections[name].css,
			attributes: window.siteInfo.sections[name].attributes,
		}
	return data;
}
function testSectionCSS(data, pageEdit)
{
	var styles = [];
	var sections = angular.copy(window.siteInfo.sections);
	var isNew = true;
	for(var i in sections){
		if(i == data.name){
			styles.push({type:data.name, css: data.css});
			isNew = false;
		}
		else if(sections[i].css != undefined){
			styles.push({type:i, css: sections[i].css});
		}
	}
	if(isNew){
		styles.push({type:data.name, css: data.css});
	}
	var sectionLessContent = getSectionLess(styles);
	var rs = pageEdit.preprocessor.changeSectionContent(sectionLessContent, window.siteInfo.themeConfig);
	return rs;
}
function editSection(data){
	var index  = 0;
	var lastElement;
	
	var section = {
		name:data.name,type:data.name,
		display_name: data.display_name,
		html: data.html,
		css:data.css,
		attributes:data.attributes
	};
	var styles = [];
	for(var i in window.siteInfo.sections){
		if(i == data.name){
			styles.push({type:data.name, css: data.css});
		}
		else if(window.siteInfo.sections[i].css != undefined){
			styles.push({type:i, css: window.siteInfo.sections[i].css});
		}
	}
	window.siteInfo.sections[data.name] = section;
	var sectionLessContent = getSectionLess(styles);
	var rs = pageEdit.preprocessor.changeSectionContent(sectionLessContent, window.siteInfo.themeConfig);
	if(rs != undefined){
		rs.then(function(result) {
			
		});
	}
}
export { checkNewSectionName, getSectionLess, editSection, testSectionCSS }

export default function($scope, communication, popup_section, $dialog, popup,commonUtils, pageEdit, pageEdit_event, pageEdit_scrollSpy, $rootScope, $uploader, safeApply) {
	"ngInject";
	$scope.theme = window.siteInfo.theme;
	function addSection(data){
		var index  = 0;
		var lastElement;
		for(var i in window.siteInfo.sectionCategories[data.category])
			lastElement = i;
		window.siteInfo.sectionCategories[data.category] = window.siteInfo.sectionCategories[data.category] || {};
		window.siteInfo.sectionCategories[data.category][data.name] = {name: data.display_name};
		var newsection = {
			name:data.name,
			type:data.name,
			display_name: data.display_name,
			html: data.html,
			css:data.css,
			attributes:data.attributes
		};
		var styles = [];
		for(var i in window.siteInfo.sections){
			if(window.siteInfo.sections[i].css != undefined){
				styles.push({type:i, css: window.siteInfo.sections[i].css});
			}
		}
		styles.push({type:data.name, css: data.css});
		window.siteInfo.sections[data.name] = newsection;
		communication.api('createSection', {section: newsection, categories: window.siteInfo.sectionCategories, styles: styles}).then(function(json)
		{
			if(lastElement == undefined)	return;
			lastElement = pageEdit.findSection(lastElement);
			if(lastElement == undefined)	return;
			$scope.sections[data.name] = newsection;
			//pageEdit.refreshStylesheets();
			var inserted = lastElement.insertZoneHTML(data.name, data.html, {direction:'bottom'});
			pageEdit_event.iframe.scrollTo(inserted);
		});		
	}
	$scope.addSection = function()
	{
		popup_section.open({
			controller: function($scope, $modalInstance){
				$scope.error = "";
				$scope.ok = function()
				{
					var name = commonUtils.makeSafeForCSS($scope.data.display_name);
					$scope.data.name = name;
					var rs = testSectionCSS($scope.data, pageEdit);
					if(rs != undefined){
						rs.then(function(result) {
							$modalInstance.close($scope.data);
						},
						function(error){
							$scope.error = error.message;
						});
					}
				}
			}
		}).result.then(function(data){
			if(data == undefined)	return;
			//var name = commonUtils.makeSafeForCSS(data.display_name);
			//data.name = name;
			addSection(data);
		});
	}
	$scope.editSectionOptions = function(name)
	{
		
	}
	$scope.editSectionScreeenshot = function(name)
	{
		popup.open({
			name:'section_screenshot',
			controller: function($scope)
			{
				"ngInject";
				$scope.theme = window.siteInfo.theme;
				$scope.section_name = name;
				$scope.path = '/themes/' + $scope.theme + '/sections/' + $scope.section_name + '/preview.jpg';
				var module = pageEdit.findSection(name);
				$scope.uploadScreenshot = function()
				{
					var uploader = new $uploader({
						filters : [
							{title : "Image files", extensions : "jpg,gif,png"}						
						],
						url: getApiPath('uploadSectionScreenshot') + '/' + name,
						onError: function(params)
						{
							console.log(params);
						},
						onUploadComplete : function()
						{
							$scope.path = '/themes/' + $scope.theme + '/sections/' + $scope.section_name + '/preview.jpg' + '?' + new Date().getTime();
							safeApply($scope);
						}
					});
					uploader.start();
				}
				function checkFSAPI()
				{

					
				}
				$scope.takeScreenshot = function(type)
				{
					var iframe_window = pageEdit.iframe.getWindow();
					if(type == 1){
						
						try{
							iframe_window.html2canvas(module.getElement(), {
							  onrendered: function(canvas) {
								var img    = canvas.toDataURL("image/jpg");
								communication.api('saveThemeSection',{theme:window.siteInfo.theme, name:$scope.section_name, image:img}).then(function(){
									$scope.path = '/themes/' + $scope.theme + '/sections/' + $scope.section_name + '/preview.jpg' + '?' + new Date().getTime();
								});
							  },
							});
						}
						catch(e){
							$dialog.message({
								title:'Error',
								message:e
							});
						}
						
					}
					else if(type == 2){
						var api = iframe_window.FireShotAPI;
						if (typeof(api) != "undefined" && api.isAvailable()){
							$('md-backdrop, .md-scroll-mask,.md-dialog-container,.leftPanel').hide();
							api.editPage(false,'edit_page');
							//$('md-backdrop, .md-scroll-mask,.md-dialog-container,.leftPanel').show();
						}
						else{
							$dialog.message({
								title:'Fireshot API Error',
								message:"<b>Fireshot API Not installed</b>, " +
							"<a href='javascript:FireShotAPI.installPlugin()'>install plugin now</a>"
							});
						}
					}
				}
			}
		});
	}
	function editSection(data){
		var index  = 0;
		var lastElement;
		
		var section = {
			name:data.name,type:data.name,
			display_name: data.display_name,
			html: data.html,
			css:data.css,
			attributes:data.attributes
		};
		var styles = [];
		for(var i in window.siteInfo.sections){
			if(i == data.name){
				styles.push({type:data.name, css: data.css});
			}
			else if(window.siteInfo.sections[i].css != undefined){
				styles.push({type:i, css: window.siteInfo.sections[i].css});
			}
		}
		window.siteInfo.sections[data.name] = section;
		var sectionLessContent = getSectionLess(styles);
		var rs = pageEdit.preprocessor.changeSectionContent(sectionLessContent, window.siteInfo.themeConfig);
		if(rs != undefined){
			rs.then(function(result) {
				communication.api('createSection', {section: section, categories: window.siteInfo.sectionCategories, styles: styles}).then(function(json)
				{
					var module = pageEdit.findSection(data.name);
					if(module == undefined)	return;
					if(data.attributes){
						module.changeAttributes(data.attributes);
					}
					module.replaceSource(data.html);
				});
			});
		}
	}
	$scope.editSection = function(name)
	{
		var module = pageEdit.findSection(name);
		if(module == undefined)	return;
		module.view_info();
		return;
		var category = '';
		for(var i in window.siteInfo.sectionCategories){
			for(var j in window.siteInfo.sectionCategories[i])
			if(name == j){
				category = i;
			}
		}
		var data = {
			name:name,
			display_name:window.siteInfo.sections[name].display_name,
			category:category,
			html: $scope.sections[name].data || $scope.sections[name].html,
			css: $scope.sections[name].css,
			attributes: $scope.sections[name].attributes,
		}
		popup_section.open({
			data: data,
			controller: function($scope, $modalInstance){
				"ngInject";
				$scope.ok = function()
				{
					
				}
			}
		}).result.then(function(data){
			editSection(data);
		});
	}
	$scope.removeSection = function(name)
	{
		for(var i in window.siteInfo.sectionCategories){
			delete window.siteInfo.sectionCategories[i][name];
		}
		var styles = [];
		for(var i in window.siteInfo.sections){
			if(i != name && window.siteInfo.sections[i].css != undefined){
				styles.push({type:i, css: window.siteInfo.sections[i].css});
			}
		}
		communication.api('removeSection', {name: name, categories: window.siteInfo.sectionCategories, styles: styles}).then(function(json)
		{
			delete $scope.sections[name];
			delete window.siteInfo.sections[name];
		});
	}
	$scope.sections = window.siteInfo.sections;
	$scope.menuOptions = 
	[
		{
			text: 'Edit',
			click: function ($itemScope, $event, modelValue, text, $li) {
				console.log($itemScope);
				$scope.editSection($itemScope.name);
			}
		},
		{
			text: 'Screenshot',
			click: function ($itemScope, $event, modelValue, text, $li) {
				$scope.editSectionScreeenshot($itemScope.name);
			}
		},

		{
			text: 'Remove',
			click: function ($itemScope, $event, modelValue, text, $li) {
				$dialog.confirm().then(function(json)
				{
					if(json == 1)
					$scope.removeSection($itemScope.name);
				});
				
			}
		},
	];
	$scope.scrollto = function(index)
	{
		if($scope.sections[index] == undefined)
			return;
		var s = pageEdit.findSection($scope.sections[index].name);
		if(s == undefined)	return;
		pageEdit_event.iframe.scrollTo(s.element);
		$scope.inView = $scope.sections[index].name;
		safeApply($scope);
	}
	function initScrollSpy(){
		pageEdit_scrollSpy.init();
		pageEdit_scrollSpy.bindEvent(function(sections)
		{
			if(sections.inView != undefined){
				if(sections.inView.length){
					$scope.inView = sections.inView[0].type;
					safeApply($scope);
				}
			}
		});
	}
	if(!window.jQuery_iframe)
		$rootScope.$on('editorReady', function(e, n){
			initScrollSpy();
		});
	else
		initScrollSpy();
}