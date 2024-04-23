export default function($scope,communication, $dialog,$file_manager) {
	"ngInject";
	communication.getList("posts").then(function(json) {
		$scope.posts = json;
	});
	communication.getList("posts_categories").then(function(json) {
		$scope.posts_categories = json;
	});
	$scope.deletePost = function(index) {
		$dialog.confirm({
			title: window.t("LBL_DELETE_POST_TITLE"),
			message: window.t("LBL_DELETE_POST_MESSAGE"),
		}).result.then(function(result){
			if(result == 1) {
				communication.api("deletePost", {id:$scope.posts[index].id}).then(function(json)
				{
					if(json == 1) {
						$scope.posts.splice(index ,1);
						communication.removeList('posts');
					}
					else {
						$scope.errors = json;
					}
					
				});
				
			}
		});;
	}
	$scope.browseImage = function(data) {
		$file_manager.open().result.then(function(images){
			if(images.length == 0)
			return;
			var image = images[0];
			data.image = (image.full_url);
		});
	}
}