var base = require('../../base');

module.exports =
{
    name:'integration/google',
    template: require('./popup.tmpl'),
    controller: function ($scope,$modalInstance, $dialog, popupParams, communication, $controller, popup, API) {
        "ngInject";
        
    },
}