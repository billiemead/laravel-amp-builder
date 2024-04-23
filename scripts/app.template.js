require('./app.builder');
require('./popup/template_history');

angular.module('template_app', ['content_app'])
.controller('headerController', require('./app.template/controllers/header').default)
