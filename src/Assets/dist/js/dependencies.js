/*!
 * *************************************
 *    Solar Content Management System 
 * *************************************
 * 
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);
/******/ 		if(moreModules[0]) {
/******/ 			installedModules[0] = 0;
/******/ 			return __webpack_require__(0);
/******/ 		}
/******/ 	};
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "c966c7b02321f4a013af"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				fn[name] = __webpack_require__[name];
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			for(var chunkId in installedChunks)
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		0:0
/******/ 	};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}

/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);

/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;

/******/ 			script.src = __webpack_require__.p + "" + chunkId + ".js/" + ({"1":"tp"}[chunkId]||chunkId) + ".js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};

/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	//VENDOR SCSS
	//require('../scss/vendor');

	//VENDOR SCRIPTS
	'use strict';

	window.Waves = __webpack_require__(2);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global) {/*!
	 * Waves v0.7.4
	 * http://fian.my.id/Waves
	 *
	 * Copyright 2014 Alfiana E. Sibuea and other contributors
	 * Released under the MIT license
	 * https://github.com/fians/Waves/blob/master/LICENSE
	 */

	;(function(window, factory) {
	    'use strict';

	    // AMD. Register as an anonymous module.  Wrap in function so we have access
	    // to root via `this`.
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return factory.apply(window);
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }

	    // Node. Does not work with strict CommonJS, but only CommonJS-like
	    // environments that support module.exports, like Node.
	    else if (typeof exports === 'object') {
	        module.exports = factory.call(window);
	    }

	    // Browser globals.
	    else {
	        window.Waves = factory.call(window);
	    }
	})(typeof global === 'object' ? global : this, function() {
	    'use strict';

	    var Waves            = Waves || {};
	    var $$               = document.querySelectorAll.bind(document);
	    var toString         = Object.prototype.toString;
	    var isTouchAvailable = 'ontouchstart' in window;


	    // Find exact position of element
	    function isWindow(obj) {
	        return obj !== null && obj === obj.window;
	    }

	    function getWindow(elem) {
	        return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
	    }

	    function isObject(value) {
	        var type = typeof value;
	        return type === 'function' || type === 'object' && !!value;
	    }

	    function isDOMNode(obj) {
	        return isObject(obj) && obj.nodeType > 0;
	    }

	    function getWavesElements(nodes) {
	        var stringRepr = toString.call(nodes);

	        if (stringRepr === '[object String]') {
	            return $$(nodes);
	        } else if (isObject(nodes) && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) && nodes.hasOwnProperty('length')) {
	            return nodes;
	        } else if (isDOMNode(nodes)) {
	            return [nodes];
	        }

	        return [];
	    }

	    function offset(elem) {
	        var docElem, win,
	            box = { top: 0, left: 0 },
	            doc = elem && elem.ownerDocument;

	        docElem = doc.documentElement;

	        if (typeof elem.getBoundingClientRect !== typeof undefined) {
	            box = elem.getBoundingClientRect();
	        }
	        win = getWindow(doc);
	        return {
	            top: box.top + win.pageYOffset - docElem.clientTop,
	            left: box.left + win.pageXOffset - docElem.clientLeft
	        };
	    }

	    function convertStyle(styleObj) {
	        var style = '';

	        for (var prop in styleObj) {
	            if (styleObj.hasOwnProperty(prop)) {
	                style += (prop + ':' + styleObj[prop] + ';');
	            }
	        }

	        return style;
	    }

	    var Effect = {

	        // Effect duration
	        duration: 750,

	        // Effect delay (check for scroll before showing effect)
	        delay: 200,

	        show: function(e, element, velocity) {

	            // Disable right click
	            if (e.button === 2) {
	                return false;
	            }

	            element = element || this;

	            // Create ripple
	            var ripple = document.createElement('div');
	            ripple.className = 'waves-ripple waves-rippling';
	            element.appendChild(ripple);

	            // Get click coordinate and element width
	            var pos       = offset(element);
	            var relativeY = 0;
	            var relativeX = 0;
	            // Support for touch devices
	            if('touches' in e && e.touches.length) {
	                relativeY   = (e.touches[0].pageY - pos.top);
	                relativeX   = (e.touches[0].pageX - pos.left);
	            }
	            //Normal case
	            else {
	                relativeY   = (e.pageY - pos.top);
	                relativeX   = (e.pageX - pos.left);
	            }
	            // Support for synthetic events
	            relativeX = relativeX >= 0 ? relativeX : 0;
	            relativeY = relativeY >= 0 ? relativeY : 0;

	            var scale     = 'scale(' + ((element.clientWidth / 100) * 3) + ')';
	            var translate = 'translate(0,0)';

	            if (velocity) {
	                translate = 'translate(' + (velocity.x) + 'px, ' + (velocity.y) + 'px)';
	            }

	            // Attach data to element
	            ripple.setAttribute('data-hold', Date.now());
	            ripple.setAttribute('data-x', relativeX);
	            ripple.setAttribute('data-y', relativeY);
	            ripple.setAttribute('data-scale', scale);
	            ripple.setAttribute('data-translate', translate);

	            // Set ripple position
	            var rippleStyle = {
	                top: relativeY + 'px',
	                left: relativeX + 'px'
	            };

	            ripple.classList.add('waves-notransition');
	            ripple.setAttribute('style', convertStyle(rippleStyle));
	            ripple.classList.remove('waves-notransition');

	            // Scale the ripple
	            rippleStyle['-webkit-transform'] = scale + ' ' + translate;
	            rippleStyle['-moz-transform'] = scale + ' ' + translate;
	            rippleStyle['-ms-transform'] = scale + ' ' + translate;
	            rippleStyle['-o-transform'] = scale + ' ' + translate;
	            rippleStyle.transform = scale + ' ' + translate;
	            rippleStyle.opacity = '1';

	            var duration = e.type === 'mousemove' ? 2500 : Effect.duration;
	            rippleStyle['-webkit-transition-duration'] = duration + 'ms';
	            rippleStyle['-moz-transition-duration']    = duration + 'ms';
	            rippleStyle['-o-transition-duration']      = duration + 'ms';
	            rippleStyle['transition-duration']         = duration + 'ms';

	            ripple.setAttribute('style', convertStyle(rippleStyle));
	        },

	        hide: function(e, element) {
	            element = element || this;

	            var ripples = element.getElementsByClassName('waves-rippling');

	            for (var i = 0, len = ripples.length; i < len; i++) {
	                removeRipple(e, element, ripples[i]);
	            }
	        }
	    };

	    /**
	     * Collection of wrapper for HTML element that only have single tag
	     * like <input> and <img>
	     */
	    var TagWrapper = {

	        // Wrap <input> tag so it can perform the effect
	        input: function(element) {

	            var parent = element.parentNode;

	            // If input already have parent just pass through
	            if (parent.tagName.toLowerCase() === 'i' && parent.classList.contains('waves-effect')) {
	                return;
	            }

	            // Put element class and style to the specified parent
	            var wrapper       = document.createElement('i');
	            wrapper.className = element.className + ' waves-input-wrapper';
	            element.className = 'waves-button-input';

	            // Put element as child
	            parent.replaceChild(wrapper, element);
	            wrapper.appendChild(element);

	            // Apply element color and background color to wrapper
	            var elementStyle    = window.getComputedStyle(element, null);
	            var color           = elementStyle.color;
	            var backgroundColor = elementStyle.backgroundColor;

	            wrapper.setAttribute('style', 'color:' + color + ';background:' + backgroundColor);
	            element.setAttribute('style', 'background-color:rgba(0,0,0,0);');

	        },

	        // Wrap <img> tag so it can perform the effect
	        img: function(element) {

	            var parent = element.parentNode;

	            // If input already have parent just pass through
	            if (parent.tagName.toLowerCase() === 'i' && parent.classList.contains('waves-effect')) {
	                return;
	            }

	            // Put element as child
	            var wrapper  = document.createElement('i');
	            parent.replaceChild(wrapper, element);
	            wrapper.appendChild(element);

	        }
	    };

	    /**
	     * Hide the effect and remove the ripple. Must be
	     * a separate function to pass the JSLint...
	     */
	    function removeRipple(e, el, ripple) {

	        // Check if the ripple still exist
	        if (!ripple) {
	            return;
	        }

	        ripple.classList.remove('waves-rippling');

	        var relativeX = ripple.getAttribute('data-x');
	        var relativeY = ripple.getAttribute('data-y');
	        var scale     = ripple.getAttribute('data-scale');
	        var translate = ripple.getAttribute('data-translate');

	        // Get delay beetween mousedown and mouse leave
	        var diff = Date.now() - Number(ripple.getAttribute('data-hold'));
	        var delay = 350 - diff;

	        if (delay < 0) {
	            delay = 0;
	        }

	        if (e.type === 'mousemove') {
	            delay = 150;
	        }

	        // Fade out ripple after delay
	        var duration = e.type === 'mousemove' ? 2500 : Effect.duration;

	        setTimeout(function() {

	            var style = {
	                top: relativeY + 'px',
	                left: relativeX + 'px',
	                opacity: '0',

	                // Duration
	                '-webkit-transition-duration': duration + 'ms',
	                '-moz-transition-duration': duration + 'ms',
	                '-o-transition-duration': duration + 'ms',
	                'transition-duration': duration + 'ms',
	                '-webkit-transform': scale + ' ' + translate,
	                '-moz-transform': scale + ' ' + translate,
	                '-ms-transform': scale + ' ' + translate,
	                '-o-transform': scale + ' ' + translate,
	                'transform': scale + ' ' + translate
	            };

	            ripple.setAttribute('style', convertStyle(style));

	            setTimeout(function() {
	                try {
	                    el.removeChild(ripple);
	                } catch (e) {
	                    return false;
	                }
	            }, duration);

	        }, delay);
	    }


	    /**
	     * Disable mousedown event for 500ms during and after touch
	     */
	    var TouchHandler = {

	        /* uses an integer rather than bool so there's no issues with
	         * needing to clear timeouts if another touch event occurred
	         * within the 500ms. Cannot mouseup between touchstart and
	         * touchend, nor in the 500ms after touchend. */
	        touches: 0,

	        allowEvent: function(e) {

	            var allow = true;

	            if (/^(mousedown|mousemove)$/.test(e.type) && TouchHandler.touches) {
	                allow = false;
	            }

	            return allow;
	        },
	        registerEvent: function(e) {
	            var eType = e.type;

	            if (eType === 'touchstart') {

	                TouchHandler.touches += 1; // push

	            } else if (/^(touchend|touchcancel)$/.test(eType)) {

	                setTimeout(function() {
	                    if (TouchHandler.touches) {
	                        TouchHandler.touches -= 1; // pop after 500ms
	                    }
	                }, 500);

	            }
	        }
	    };


	    /**
	     * Delegated click handler for .waves-effect element.
	     * returns null when .waves-effect element not in "click tree"
	     */
	    function getWavesEffectElement(e) {

	        if (TouchHandler.allowEvent(e) === false) {
	            return null;
	        }

	        var element = null;
	        var target = e.target || e.srcElement;

	        while (target.parentElement !== null) {
	            if (target.classList.contains('waves-effect') && (!(target instanceof SVGElement))) {
	                element = target;
	                break;
	            }
	            target = target.parentElement;
	        }

	        return element;
	    }

	    /**
	     * Bubble the click and show effect if .waves-effect elem was found
	     */
	    function showEffect(e) {

	        // Disable effect if element has "disabled" property on it
	        // In some cases, the event is not triggered by the current element
	        // if (e.target.getAttribute('disabled') !== null) {
	        //     return;
	        // }

	        var element = getWavesEffectElement(e);

	        if (element !== null) {

	            // Make it sure the element has either disabled property, disabled attribute or 'disabled' class
	            if (element.disabled || element.getAttribute('disabled') || element.classList.contains('disabled')) {
	                return;
	            }

	            TouchHandler.registerEvent(e);

	            if (e.type === 'touchstart' && Effect.delay) {

	                var hidden = false;

	                var timer = setTimeout(function () {
	                    timer = null;
	                    Effect.show(e, element);
	                }, Effect.delay);

	                var hideEffect = function(hideEvent) {

	                    // if touch hasn't moved, and effect not yet started: start effect now
	                    if (timer) {
	                        clearTimeout(timer);
	                        timer = null;
	                        Effect.show(e, element);
	                    }
	                    if (!hidden) {
	                        hidden = true;
	                        Effect.hide(hideEvent, element);
	                    }
	                };

	                var touchMove = function(moveEvent) {
	                    if (timer) {
	                        clearTimeout(timer);
	                        timer = null;
	                    }
	                    hideEffect(moveEvent);
	                };

	                element.addEventListener('touchmove', touchMove, false);
	                element.addEventListener('touchend', hideEffect, false);
	                element.addEventListener('touchcancel', hideEffect, false);

	            } else {

	                Effect.show(e, element);

	                if (isTouchAvailable) {
	                    element.addEventListener('touchend', Effect.hide, false);
	                    element.addEventListener('touchcancel', Effect.hide, false);
	                }

	                element.addEventListener('mouseup', Effect.hide, false);
	                element.addEventListener('mouseleave', Effect.hide, false);
	            }
	        }
	    }

	    Waves.init = function(options) {
	        var body = document.body;

	        options = options || {};

	        if ('duration' in options) {
	            Effect.duration = options.duration;
	        }

	        if ('delay' in options) {
	            Effect.delay = options.delay;
	        }

	        if (isTouchAvailable) {
	            body.addEventListener('touchstart', showEffect, false);
	            body.addEventListener('touchcancel', TouchHandler.registerEvent, false);
	            body.addEventListener('touchend', TouchHandler.registerEvent, false);
	        }

	        body.addEventListener('mousedown', showEffect, false);
	    };


	    /**
	     * Attach Waves to dynamically loaded inputs, or add .waves-effect and other
	     * waves classes to a set of elements. Set drag to true if the ripple mouseover
	     * or skimming effect should be applied to the elements.
	     */
	    Waves.attach = function(elements, classes) {

	        elements = getWavesElements(elements);

	        if (toString.call(classes) === '[object Array]') {
	            classes = classes.join(' ');
	        }

	        classes = classes ? ' ' + classes : '';

	        var element, tagName;

	        for (var i = 0, len = elements.length; i < len; i++) {

	            element = elements[i];
	            tagName = element.tagName.toLowerCase();

	            if (['input', 'img'].indexOf(tagName) !== -1) {
	                TagWrapper[tagName](element);
	                element = element.parentElement;
	            }

	            if (element.className.indexOf('waves-effect') === -1) {
	                element.className += ' waves-effect' + classes;
	            }
	        }
	    };


	    /**
	     * Cause a ripple to appear in an element via code.
	     */
	    Waves.ripple = function(elements, options) {
	        elements = getWavesElements(elements);
	        var elementsLen = elements.length;

	        options          = options || {};
	        options.wait     = options.wait || 0;
	        options.position = options.position || null; // default = centre of element


	        if (elementsLen) {
	            var element, pos, off, centre = {}, i = 0;
	            var mousedown = {
	                type: 'mousedown',
	                button: 1
	            };
	            var hideRipple = function(mouseup, element) {
	                return function() {
	                    Effect.hide(mouseup, element);
	                };
	            };

	            for (; i < elementsLen; i++) {
	                element = elements[i];
	                pos = options.position || {
	                    x: element.clientWidth / 2,
	                    y: element.clientHeight / 2
	                };

	                off      = offset(element);
	                centre.x = off.left + pos.x;
	                centre.y = off.top + pos.y;

	                mousedown.pageX = centre.x;
	                mousedown.pageY = centre.y;

	                Effect.show(mousedown, element);

	                if (options.wait >= 0 && options.wait !== null) {
	                    var mouseup = {
	                        type: 'mouseup',
	                        button: 1
	                    };

	                    setTimeout(hideRipple(mouseup, element), options.wait);
	                }
	            }
	        }
	    };

	    /**
	     * Remove all ripples from an element.
	     */
	    Waves.calm = function(elements) {
	        elements = getWavesElements(elements);
	        var mouseup = {
	            type: 'mouseup',
	            button: 1
	        };

	        for (var i = 0, len = elements.length; i < len; i++) {
	            Effect.hide(mouseup, elements[i]);
	        }
	    };

	    /**
	     * Deprecated API fallback
	     */
	    Waves.displayEffect = function(options) {
	        console.error('Waves.displayEffect() has been deprecated and will be removed in future version. Please use Waves.init() to initialize Waves effect');
	        Waves.init(options);
	    };

	    return Waves;
	});

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ]);