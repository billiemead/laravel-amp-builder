// abstract module for ajax API

angular.module('pagemanager.ajax',[])


.factory('ajax',['$http','$dialog','$q',function($http,$dialog,$q)
{
	return function()
	{
		//execute ajax request using post method
		this.post = function(url, data)
		{
			data = data || {};
			var that = this;
				return $http(
				{
					url: url,
					method: 'POST',
					data: $.param(data),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				})
				.then(
					function(response)
					{
						var data = response.data;
						return data;
					},
					function(response)
					{
						var data = response.data,
						status = response.status,
						header = response.header,
						config = response.config;
						$dialog.message({message:data, title:'Error'});
					}
				);
		};
		//execute ajax request using get method
		this.get = function(url, data,cache)
		{
			var that = this;
			return $http(
			{
				url:  url,
				method: 'GET',
				params: data,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.then(
				function(response)
				{
					var data = response.data;
					return data;
					
				},
				function(response)
				{
					var data = response.data;
					return data;
				}
			);
		};
		//execute ajax request without display message on error
		this.executeNoMessage = function(url, data)
		{
			return this._execute(url, data,false);
		};
		//execute ajax request with display message on error
		this.execute = function(url, data)
		{
			return this._execute(url, data,true);
		};
		//base function to execute ajax request
		this._execute = function(url, data,messageOnError)
		{
			var that = this;
			data = data || {};
			data['_token']= window.X_CSRF_TOKEN;
			return $http(
			{
				url:  url,
				method: 'POST',
				//data: $.param(data),
				data: data,
				headers: {'X-CSRF-TOKEN': window.X_CSRF_TOKEN}
				//headers: {'X-CSRF-TOKEN': window.X_CSRF_TOKEN, 'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.then(
				function(response)
				{
					
					var data = response.data,
					status = response.status,
					header = response.header,
					config = response.config;
					return data;
				},
				function(response)
				{
					var data = response.data,
					status = response.status,
					header = response.header,
					config = response.config;
					if(response.status == 403)
					{
						$dialog.message({message:data.message, title:'Error'});
					}
					else if(response.status !== 401) 
						$dialog.message({message:data.message, title:'Error'});
					if(messageOnError)
					{
						
					}
					return $q.reject(response);
				}
			);
			
		};
	}
}]);
//angular module extend from ajax module
//contain functions for builder to API with server and client
angular.module('pagemanager.communication',['pagemanager.ajax'])

.directive('fixHeightElement', function($window)
{
	"ngInject";
	return {
			link: function(scope, element)
			{
				var resize = function()
				{
					var e = $(element);
					if(e.children().length == 0)
					{	
						//e.css('height', '');	
						//return;
					}
					var w = $($window);
					
					
					var window_height = w.height();
					var element_top = e.offset().top;
					var element_height = window_height - element_top;
					e.css('min-height', element_height);
				}
				resize();
				$($window).on('resize', resize);
				element.on('$destroy', function(){
					$($window).off('resize', resize);
			  })
			}
	}
})
.factory('communication',function(API, $templateCache,$q,ajax,$cacheFactory)
{
	"ngInject";
	return {
		//function bridge to ajax module
		ajaxCall : function(url, data, displayError)
		{
			if(displayError == undefined)
				displayError = true;
			var ajaxInstance = new ajax();
			
			if(displayError)
				return ajaxInstance.execute(getAjaxPath(url, ''), data);
			return ajaxInstance.executeNoMessage(getAjaxPath(url, ''), data);
		},
		//function bridge to ajax module
		ajaxCallNoMessage : function(url, data)
		{
			var ajaxInstance = new ajax();
			return ajaxInstance.executeNoMessage(url, data);
		},
		
		
		post : function(url, data)
		{
			var ajaxInstance = new ajax();
			return ajaxInstance.post(url, data).then( function(response)
			{
				var data = response;
				return data;
			});
		},
		get : function(url)
		{
			var ajaxInstance = new ajax();
			return ajaxInstance.get(url, {}).then( function(response)
			{
				var data = response;
				return data;
			});
		},
		getWithUrl : function(url)
		{
			var ajaxInstance = new ajax();
			return ajaxInstance.get(url, {}).then( function(response)
			{
				var data = response;
				return {data:data, url:url}
			});
		},
	
		
		//put the list data to cache
		setList:function(name,list)
		{
			var cache = $cacheFactory.get('List');
			cache.put(name, list)
		},
		
		
		
		
		
	};
})
.directive('input', function(){
    return {
        require: '?ngModel',
        link: function(scope, elem, attrs, ngModel){
            if(attrs.type == 'number'){
                ngModel.$formatters.push(function(value){
                    return parseFloat(value);
                });
            }
        }
    };
})
.config(function($httpProvider)
{
	"ngInject";
	$httpProvider.interceptors.push(function($q, $localStorage,$location,$rootScope, $window) {
		"ngInject";
		var isApiUrl = function(config){
			return config != undefined && config.url.startsWith(window.apiPath);
		}
		return {
			request: function (config) {
				if(!isApiUrl(config)){
					$rootScope.activeCalls = $rootScope.activeCalls||0;
					$rootScope.activeCalls += 1;
				}
				var token = $window.localStorage.satellizer_token;
				(config.headers['Authorization'] == undefined && token != undefined) && (config.headers['Authorization'] = 'Bearer ' + token)
				var meta = $('meta[name="bypass_fastcgi"]')
				if(meta.length) {
					var metaContent = meta.attr('content');
					(config.headers[metaContent] == undefined && token != undefined) && (config.headers[metaContent] = 'Bearer ' + token)
				}
				return config;
            },
            requestError: function (rejection) {
				$rootScope.activeCalls = $rootScope.activeCalls||0;
                $rootScope.activeCalls -= 1;
				if ( $rootScope.activeCalls == 0) {
                    $('#loadingSpinner').hide();
                }
                return rejection;
            },
			response: function (response) {
				if(!isApiUrl(response.config)){
				}
				
				return response;
			},
            responseError: function (response) {
				if(!isApiUrl(response.config)){
					$rootScope.activeCalls = $rootScope.activeCalls||0;
					$rootScope.activeCalls -= 1;
					
					if(response.status === 401) {
						$location.path('/signin');
						//$rootScope.$apply(function() {
							$location.path('/signin');
						 // });
						
					}
					if ( $rootScope.activeCalls == 0) {
						$('#loadingSpinner').hide();
					}
				}
				
				return $q.reject(response);
            },
			
		};
	});
});
angular.module('pagemanager.file_manager', ['pagemanager.communication', 'ui.dialog']);
angular.module('pagemanager', ['ui.router','ui.popup','ui.bootstrap','pagemanager.communication'])
.directive('loadingSpinner', function ($http) {
	"ngInject";
    return {
        restrict: 'A',
       // replace: true,
       // template: '<div class=""><div class="ui-block"></div></div>',
        link: function (scope, element, attrs) {
			
            scope.$watch('activeCalls', function (newVal, oldVal) {
                if (newVal == 0) {
                    $(element).hide();
                }
                else {
                    $(element).show();
                }
            });
        }
    };
});
angular.module('pagemanger.controls',[])

.filter('makeRange', function() {
	"ngInject";
	return function(input) {
		var lowBound, highBound;
		switch (input.length) {
		case 1:
			lowBound = 0;
			highBound = parseInt(input[0]) - 1;
			break;
		case 2:
			lowBound = parseInt(input[0]);
			highBound = parseInt(input[1]);
			break;
		default:
			return input;
		}
		var result = [];
		for (var i = lowBound; i <= highBound; i++)
			result.push(i);
		return result;
	};
})