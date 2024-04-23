export default function(pageEdit_function,pageEdit_modules,pageEdit_layout)
{
	"ngInject";
	this.copy = function(object){
		this.object = object;
	}
	this.get = function(){
		return this.object;
	}
	this.clear = function(){
		delete this.object;
	}
	this.isEmpty = function(){
		return this.object == undefined;
	}
}