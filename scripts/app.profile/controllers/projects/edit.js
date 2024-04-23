export default function($scope, $state, $stateParams,$rootScope, $dialog, API, popup, popup_section_list)
{
	"ngInject";
	$scope.site_id = $stateParams.id;
	$scope.data = {};
	API.one('page', $stateParams.id).get().then(function(json){
		$scope.data = json;
	}, function(error) {
		if(error.status = 404)
			$state.go("projects.list", {}, { reload: true });
		//console.log(error)
	});
	$scope.variants = [];
	API.service('page').get('variants', {site_id: $stateParams.id}).then(function(json){
		$scope.variants = json.variants;
		$scope.discarded_variants = json.discarded_variants;
	});
	$scope.addVariant = function()
	{
		popup_section_list.open({type:'page'}).result.then(function(template){
			popup.open({
				name:'add_variant',
				controller: function($scope,$modalInstance)
				{
					"ngInject";
					$scope.data = {name:'newpage', template: template.id|| template};
					
					$scope.ok = function()
					{
						API.one('page/variants').customPOST({site_id: $stateParams.id, data:$scope.data}).then(function(json){
							if(json.id)
								$modalInstance.close(json);
							else
								$scope.errors = json;
							
						});
					}
				}
			}).result.then(function(data)
			{
				$scope.variants.push(data);
			});
		});
	}
	$scope.cloneVariant = function(variant){
		API.service('page/variants/clone/'+variant.id).post({}).then(function(json){
			$scope.variants.push(json);
			
		});
	}
	$scope.changeName = function(variant)
	{
		popup.open({
				name:'edit_variant',
				controller: function($scope, $modalInstance)
				{
					"ngInject";
					$scope.data = {name:variant.name};
					
					$scope.ok = function()
					{
						var postData = {id: variant.id, data:$scope.data}
						var id = variant.id;
					
						API.one('page/variants/'+ id).customPUT(postData).then(function(json){
							if(json.id)
								$modalInstance.close(json);
							else
								$scope.errors = json;
							
						});
					}
				}
			}).result.then(function(data)
			{
				variant.name = data.name;
			});
		
	}
	
	$scope.removeVariant = function(index)
	{
		if($scope.variants.length <= 1)
			return;
		var id = $scope.variants[index].id;
		API.one('page/variants', id).remove().then(function(json){
			$scope.discarded_variants.push($scope.variants[index]);
			$scope.variants.splice(index, 1);
		});
	}
	$scope.restoreVariant = function(index){
		var id = $scope.discarded_variants[index].id;
		API.service('page/variants/restore/' + id).post({}).then(function(json){
			$scope.variants.push(json);
			$scope.discarded_variants.splice(index, 1);
			
		});
	}
	$scope.destroyVariant = function(index){
		var id = $scope.discarded_variants[index].id;
		API.service('page/variants/forceDelete/' + id).post({}).then(function(json){
			$scope.discarded_variants.splice(index, 1);
		});
	}
	$scope.addDomain = function()
	{
		var site_id = $scope.data.id;
		popup.open({
			name:'add_domain',
			controller: function($scope, $modalInstance)
			{
				"ngInject";
				$scope.isNew = true;
				$scope.data = {subdomain:1, site_id: site_id};
				
				$scope.ok = function(form)
				{
					API.service('page/domain').post($scope.data).then(function(json)
					{
						if(json.name)
							$modalInstance.close(json);
						else if(json[0] != undefined){
							form.name.$setValidity('uniqued', false);
							$scope.error = json[0];
						}
							
					});
					
				}
			}
		}).result.then(function(d)
		{
			$scope.data.domains = $scope.data.domains || [];
			$scope.data.domains.push(d)
		});
	}
	$scope.removeDomain = function(index)
	{
		var id = $scope.data.domains[index].id;
		API.one('page/domain', id).remove().then(function(json){
			$scope.data.domains.splice(index, 1);
		});
	}
}