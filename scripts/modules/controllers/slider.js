var base = require('./base').default;
var base_structure = require('./base_structure').default;
export default createModuleDefinition([base, base_structure], function($file_manager, pageEdit_layout, pageEdit) 
{
	"ngInject";
	this.tab_editor = ['advance', 'offset', 'margin', 'slides'];
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		$scope.data.slides = $moduleInstance.getCurrentSlides();
		$scope.addSlide = function()
		{
			$moduleInstance.addSlide();
		}
		$scope.removeSlide = function(index)
		{
			$moduleInstance.removeSlide(index);
		}
		$scope.fixedAMPLayout = true;
		
		
	};
	this._design = function($scope, $modalInstance, $moduleInstance, $controller)
	{
		"ngInject";
		$controller($moduleInstance.bases[0]._design, {$scope: $scope, $modalInstance:{}, $moduleInstance:$moduleInstance});
		$scope.slider_styles = $moduleInstance.getCurrentItemStyles('> amp-carousel > div > div > div > .inner_slide') || {};
		if($scope.slider_styles.width == undefined)
			$scope.slider_styles.width = $moduleInstance.frontend_module.getInnerSliderWidth();
		$scope.changeInnerSliderStyle = function(name, value)
		{
			$scope.changeItemStyle(name, value, '> amp-carousel > div > div > div > .inner_slide')
		}
	}
	this.canDropTo = function(module)
	{
		return module && (module.getType() == 'section' || module.getType() == 'section_global');
	}
	this.loadElement = function(element)
	{
		this._loadElement(element);
		this.initModules();
	};
	
	this.getCurrentSlides = function()
	{
		return this.frontend_module.getCurrentSlides();
	}
	this.addSlide = function()
	{
		return this.frontend_module.addSlide();
	}
	this.removeSlide = function(index)
	{
		return this.frontend_module.removeSlide(index);
	}
	this.getStructure = function()
	{
		var s = this._getStructure();
		delete s.data.slides;
		s.slides = this.getSlideStructures();
		return s;
	
	};
	this.getChildModules = function()
	{
		var s = [];
		var that = this;
		var activeSlide = this.frontend_module.getCurrentActiveSlide();
		jQuery_iframe(activeSlide).children('.inner_slide').children('.' + pageEdit_layout.module_class).each(function(i)
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
			jQuery_iframe(slides[i]).children('.inner_slide').children('.' + pageEdit_layout.module_class).each(function(i)
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
			jQuery_iframe(slides[i]).children('.inner_slide').children('.' + pageEdit_layout.module_class).each(function(i)
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
			jQuery_iframe(slides[i]).children('.inner_slide').children('.' + pageEdit_layout.module_class).each(function(i)
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
	this.getLayerTrees = function(depth = 0)
	{
		var rs = [];
		var slides = this.getSlides();
		
		for(var i in slides)
		{
			var slide = slides[i];
			for(var j in slide){
				var module = slide[j];
				var node = module.toTreeNode(depth);
				if(module.getLayerTrees != undefined){
					node.children = module.getLayerTrees(depth + 1);
				}
				rs.push(node);
			}
			

		}
		return rs;
	}
	this.getFloatModuleStructure = function(module)
	{
		var s = {};
		var moduleInstance = pageEdit.getFloatModule(module);
		if(!moduleInstance)
		{
			return;
		}
		
		return moduleInstance.getStructure();
	};
})