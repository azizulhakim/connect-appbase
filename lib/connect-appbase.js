var appbase = require('appbase-js');
var util = require('util');

module.exports = function(session){
	var Store = session.Store;
	
	function AppbaseStore(options){
		
		if (options.client){
			this.client = options.client;
		}
		else{
			this.client = new appbase(options);
		}
	}
	
	util.inherits(AppbaseStore, Store);
	
	AppbaseStore.prototype.get = function(sid, fn){
		this.client.get({
			type: 'SessionStore',
			id: sid
		}).on('data', function(response) {
			var result = response._source;
			fn(null, result);
		}).on('error', function(error) {
			fn(error);
		});
	};
	
	AppbaseStore.prototype.set = function(sid, sess, fn){		
		this.client.index({
			type: 'SessionStore',
			id: sid,
			body: sess
			
		}).on('data', function(response){
			
		}).on('error', function(error){
			return fn(error);
		});
		
		fn.apply(null, arguments);
	};
	
	AppbaseStore.prototype.destroy = function(sid, fn){
		this.client.delete({
			type: 'SessionStore',
			id: sid
		}).on('data', function(res) {
			console.log(res);
			fn();
		}).on('error', function(err) {
			console.log(err);
			fn();
		});
	};
	
	return AppbaseStore;
};