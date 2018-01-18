/**
 * @file Jas 模块 js异步控制工具
 * @author 偷自论坛某位大神
 */

define(function (data){
　　　var uid = 1;
	var Jas = function(){
	    this.map = {};
	    this.rmap = {};
	};
	var indexOf = Array.prototype.indexOf || function(obj){
	    for (var i=0, len=this.length; i<len; ++i){
	        if (this[i] === obj) return i;
	    }
	    return -1;
	};
	var fire = function(callback, thisObj){
	    setTimeout(function(){
	        callback.call(thisObj);
	    }, 0);
	};
	Jas.prototype = {
	    when: function(resources, callback, thisObj){
	        var map = this.map, rmap = this.rmap;
	        if (typeof resources === 'string') resources = [resources];
	        var id = (uid++).toString(16);
	        map[id] = {
	            waiting: resources.slice(0),
	            callback: callback,
	            thisObj: thisObj || window
	        };
	        
	        for (var i=0, len=resources.length; i<len; ++i){
	            var res = resources[i],
	                list = rmap[res] || (rmap[res] = []);
	            list.push(id);
	        }
	        return this;
	    },
	    trigger: function(resources){
	        if (!resources) return this;
	        var map = this.map, rmap = this.rmap;
	        if (typeof resources === 'string') resources = [resources];
	        for (var i=0, len=resources.length; i<len; ++i){
	            var res = resources[i];
	            if (typeof rmap[res] === 'undefined') continue;
	            this._release(res, rmap[res]); 
	            delete rmap[res]; 
	        }
	        return this;
	    },
	    _release: function(res, list){
	        var map = this.map, rmap = this.rmap;
	        for (var i=0, len=list.length; i<len; ++i){
	            var uid = list[i], mapItem = map[uid], waiting = mapItem.waiting,
	                pos = indexOf.call(waiting, res);
	            waiting.splice(pos, 1); 
	            if (waiting.length === 0){ 
	                fire(mapItem.callback, mapItem.thisObj); 
	                delete map[uid];
	            }
	        }
	    }
	};
		
　　　　return  Jas;
　　});