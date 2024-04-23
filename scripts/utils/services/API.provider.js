export class APIProvider {
	constructor () {
		this.blockServices = {};
	}
	isBlockedService(url)
	{
		if(typeof this.verifyFunction == 'function'){
			var rs = this.verifyFunction(url);
			if(rs != undefined)
				return rs;
		}
		return this.blockServices[url];
	}
	configRestangular(configurer)
	{
		if(typeof this.configFunction == 'function'){
			var rs = this.configFunction(configurer);
			if(rs != undefined)
				return rs;
		}
	}
	setVerifyFunction(f){
		this.verifyFunction = f;
	}
	setConfigFunction(f){
		this.configFunction = f;
	}
	setBlockService(url){
		this.blockServices[url] = true;
	}
	$get() {
        return {
            //getThings: () => $http.get(this.apiPath)
			isBlockedService: (url) => this.isBlockedService(url),
			configRestangular: (configurer) => this.configRestangular(configurer),
			setBlockService: (url) => this.setBlockService(url),
			setVerifyFunction: (f) => this.setVerifyFunction(f),
			setConfigFunction: (f) => this.setConfigFunction(f)
        };
    }
	
}
