export default function($scope, safeApply, $dialog, API, popup){
	"ngInject";
	$scope.clearCache = function()
	{
		API.service('config/clearCache').post().then(function (json)
        {
            $dialog.message({
                title:'Success',
                message:'Your cache have been cleared.'
            });
        });
	}

	$scope.rebuildConfigCache = function()
	{
		API.service('config/rebuildCache').post().then(function (json)
        {
            $dialog.message({
                title:'Success',
                message:'Your cache have been rebuild.'
            });
        });
	}
	$scope.send_test_mail = function(test_email) {
		API.service('mail/test').post({to: test_email}).then(function (json)
        {
            $dialog.message({
                title:'Success',
                message:'Test email sent. Check your mailbox to verify your email settings is working properly.'
            });
        });
	}
}