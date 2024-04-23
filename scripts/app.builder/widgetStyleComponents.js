export default angular.module('widgetStyleComponents', [])
.directive('widgetStyle', require('./directives/widgetStyle').default)
.component('widgetCheckbox', require('./widgetControls/checkbox/checkbox.component').default)

.component('widgetInput', require('./widgetControls/input/input.component').default)
.component('widgetSelect', require('./widgetControls/select/select.component').default)
.component('widgetRadio', require('./widgetControls/radio/radio.component').default)
.component('widgetSlider', require('./widgetControls/slider/slider.component').default)

.component('widgetOption', require('./widgetControls/option/checkboxItem.component').default)

.component('widgetStyleLabel', require('./widgetStyles/label/label.component').default)

.component('widgetStyleInput', require('./widgetStyles/input/input.component').default)
.component('widgetStyleNumber', require('./widgetStyles/number/input.component').default)

.component('widgetStyleCheckbox', require('./widgetStyles/checkbox/checkbox.component').default)
.component('widgetStyleSelect', require('./widgetStyles/select/select.component').default)

.component('widgetStyleCheckboxItem', require('./widgetStyles/checkboxItem/checkboxItem.component').default)
.component('widgetStyleMargin', require('./widgetStyles/margin/margin.component').default)
.component('widgetStyleCorner', require('./widgetStyles/corner/corner.component').default)

.component('widgetStyleFont', require('./widgetStyles/font/font.component').default)

.component('widgetStyleBorder', require('./widgetStyles/border/border.component').default)
.component('widgetStyleTextShadow', require('./widgetStyles/text-shadow/shadow.component').default)
.component('widgetStyleBoxShadow', require('./widgetStyles/box-shadow/shadow.component').default)
.component('widgetStyleBackgroundImage', require('./widgetStyles/background-image/background.component').default)
.component('widgetStyleColumns', require('./widgetStyles/columns/columns.component').default)

.filter('widgetStyleShadow', require('./widgetStyles/text-shadow/shadow.filter').default)
.filter('widgetStyleBG', require('./widgetStyles/background-image/filter').default)

.component('widgetStyleColor', require('./widgetStyles/color/color.component').default)
.component('widgetStyleSlider', require('./widgetStyles/slider/slider.component').default)

.name;

