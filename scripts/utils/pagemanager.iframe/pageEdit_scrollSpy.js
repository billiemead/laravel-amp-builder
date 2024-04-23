export default function(pageEdit_function,pageEdit_reserve_trarsever,lazyLoadWidget,pageEdit_modules,pageEdit_event, pageEdit, pageEdit_layout)
{
	"ngInject";
	this.init = function()
	{
		this.doc = pageEdit_event.iframe.getDocument();
		this.win = pageEdit_event.iframe.getWindow();
		this.winH = this.win.innerHeight;
	}
	this.bindEvent = function(f)
	{
		var scrollingTimer;
		var _this = this;
		function onscroll()
		{
			if (scrollingTimer) {
				clearTimeout(scrollingTimer);
			}

			

			scrollingTimer = setTimeout(function () {
				_this.spy(f);
			}, 10);
		}
		jQuery_iframe(this.win).off('scroll', onscroll);
		jQuery_iframe(this.win).on('scroll', onscroll);


		var resizingTimer;
		function onresize()
		{
			if (resizingTimer) {
				clearTimeout(resizingTimer);
			}
			resizingTimer = setTimeout(function () {
				_this.spy(f);
			}, 10);
		}
		jQuery_iframe(this.win).off('resize', onresize);
		jQuery_iframe(this.win).on('resize', onresize);
		
	}
	this.spy = function(cb) {
		var elems = this.getSectionsViewState();

		if (typeof cb === 'function') {
			cb(elems);
		}
	};
	this.getSectionsViewState = function () {
		var elemsInView = [],
		elemsOutView = [],
		viewStatusList = [];
		var section_elements = jQuery_iframe('body > #main_sections').children("section." + pageEdit_layout.zone_class);
		var that = this;
		section_elements.each(function () {
			var m  = pageEdit.getModule(this);
			if(m == undefined)
				return;
			var isInView = that.isInView(m.element);

			if (isInView) {
				elemsInView.push(m);
			} else {
				elemsOutView.push(m);
			}
			viewStatusList.push(isInView);
		});
	
		return {
			inView: elemsInView,
			outView: elemsOutView,
			viewStatusList: viewStatusList
		};
	};
	this.isInView = function (el) {
		el = el[0] || el;
		
		var winH = this.winH,
		scrollTop = this.doc.documentElement.scrollTop || this.doc.body.scrollTop,
		scrollBottom = scrollTop + winH,
		rect = el.getBoundingClientRect(),
		elTop = rect.top + scrollTop,
		elBottom = elTop + el.offsetHeight;

		return (elTop < scrollBottom) && (elBottom > scrollTop);
	};
	this.destroy = function()
	{
		
	}
}