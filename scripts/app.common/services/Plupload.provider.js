export class PluploadProvider {
	constructor () {
		this.blockServices = {};
	}
	
	config(options)
	{
		if(typeof this.configFunction == 'function'){
			var rs = this.configFunction(options);
			if(rs != undefined)
				return rs;
		}
		return options;
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
			config: (configurer) => this.config(configurer),
			setConfigFunction: (f) => this.setConfigFunction(f)
        };
    }
	
}
