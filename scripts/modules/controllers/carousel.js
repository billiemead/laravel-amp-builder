var base = require('./base').default;
var base_structure = require('./base_structure').default;
var slider = require('./slider').default;


export default createModuleDefinition([base, base_structure, slider], function($file_manager, pageEdit_layout, pageEdit, pageEdit_ddManager) 
{
	"ngInject";
	this.tab_editor = ['advance', 'offset', 'margin', 'carousel'];
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		$scope.fixedAMPLayout = false;
		$scope.selectFile = function(index)
		{
			$file_manager.open({onlyImage: true}).result.then(function(images)
			{
				if(images.length == 0)
					return;
				$scope.data.images[index].src = images[0].full_url;
				$scope.changeData(false);
				$moduleInstance.frontend_module.updateSlideImage(index, images[0].full_url)
			});
		}
		$scope.removeFile = function(index)
		{
			$scope.data.images.splice(index, 1);
			$scope.changeData(false);
			$moduleInstance.frontend_module.removeSlide(index);
		}
		$scope.addFile = function()
		{
			$file_manager.open({onlyImage: true}).result.then(function(images)
			{
				if(images.length == 0)
					return;
				$scope.data.images.push({src:images[0].full_url});
				$moduleInstance.frontend_module.addSlide(images[0].full_url);
				$scope.changeData(false);
			});
		}
	};
	this.getChildModules = function()
	{
		var s = [];
		var that = this;
		var activeSlide = this.frontend_module.getCurrentActiveSlide();
		jQuery_iframe(activeSlide).children('.' + pageEdit_layout.module_class).each(function(i)
		{
			var structure = pageEdit.getFloatModule(this);
			if(structure != undefined){
				s.push(structure);
			}
		});
		return s;
	}
	this.initModules = function()
	{
		var slides = this.getCurrentSlides();
		for(var i in slides){
			jQuery_iframe(slides[i]).children('.' + pageEdit_layout.module_class).each(function(i)
			{
				var moduleInstance = pageEdit_layout.createFloatModule(this);
			});
		}
	}
	this.getSlideStructures = function(structure = true)
	{
		var that = this;
		var slides = this.getCurrentSlides();
		var rs = [];
		for(var i in slides){
			var s = [];
			jQuery_iframe(slides[i]).children('.' + pageEdit_layout.module_class).each(function(i)
			{
				var structure = that.getFloatModuleStructure(this);
				if(structure != undefined){
					s.push(structure);
				}
			});
			rs.push(s);
		}
		return rs;
	}
	this.getSlides = function(structure = true)
	{
		var that = this;
		var slides = this.getCurrentSlides();
		var rs = [];
		for(var i in slides){
			var s = [];
			jQuery_iframe(slides[i]).children('.' + pageEdit_layout.module_class).each(function(i)
			{
				var structure = pageEdit.getFloatModule(this);
				if(structure != undefined){
					s.push(structure);
				}
			});
			rs.push(s);
		}
		return rs;
	}
	this.isDropTarget = function(event, ui)
	{
		if(ui.helper.module != undefined){
			
			var type = ui.helper.module.getType();
			if(type == 'carousel_box'){
				return true;
			}
		}
		return false;
	}
})