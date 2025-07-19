//Dropzone.autoDiscover = false;

app.base = {
	/*get_length: function(object) {
		return Object.keys(object).length;
	},*/
	current_properties: {},
	generate_random_color: function() {
		return [
			Math.floor(Math.random() * 256),
			Math.floor(Math.random() * 256),
			Math.floor(Math.random() * 256)
		]
	},
	vectors: {		
		length_value: function(u, v) {
			if(typeof v === 'undefined') {
				v = [];
				for(var u_item of u) {
					v.push(0);
				}
			}
			var total_term = 0;
			var index = 0;
			for(var u_value of u) {
				var term_value = u_value - v[index];
				term_value = Math.pow(term_value, 2);
				total_term = total_term + term_value;
				index++;
			}

			var value = Math.pow(total_term, 1/2);
			return value;
		},
		normalize_vector: function(u) {
			var length = this.length_value(u);
			var vector = [];
			for(var u_value of u) {
				vector.push(u_value/length);
			}
			return vector;
		},
		add_vector: function(u, v) {
			var vector = [];
			if(u.length == v.length) {
				var index = 0;
				for(var u_value of u) {
					vector.push(v[index] + u_value);
					index++;
				}
			}
			return vector;
		},
		subtract_vector: function(u, v) {
			var vector = [];
			if(u.length == v.length) {
				var index = 0;
				for(var u_value of u) {
					vector.push(v[index] - u_value);
					index++;
				}
			}
			return vector;
		},
		stretch_vector: function(u, unit_value) {
			var vector = [];
			for(var u_value of u) {
				vector.push(unit_value*u_value);
			}
			return vector;
		}
	},
	global_timeouts: [],
	to_string: function(obj) {
		return JSON.stringify(obj);
		if(obj == null) {
			return 'null';
		}
		if(typeof obj === 'object') {
			if(Array.isArray(obj)) {
				var intermediate = '';
				for(var item of obj) {
					intermediate += this.to_string(item)+','
				}
				return '['+intermediate+']';
			} else {
				var keys = Object.keys(obj);
				keys.sort();
				var intermediate = '';
				for(var key of keys) {
					intermediate += key+':'+this.to_string(obj[key])+';'
				}
				return '{'+intermediate+'}';
			}
		} else {
			return obj;
		}
	},
	find_parent: function($element, selector) {
		while($element != null && $element.length > 0 && !$element.is('body')) {
			$element = $element.parent();
			if(typeof selector !== 'undefined') {
				if($element.is(selector)) {
					return $element;
				}
			}
		}
		return null;
	},
	local_data: {
		message_counter: -1,
		messages_values: [],
		send_messages: [],
		callbacks: [],
		sleep: function(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		},
		send: function(data, callback) {
			var branch = this;
			branch.message_counter++;
			data.message_counter = branch.message_counter;
			if(typeof callback !== 'undefined') {
				branch.callbacks[data.message_counter] = function(received_data) {
					delete branch.callbacks[data.message_counter];
					//branch.global_callbacks(data);
					if(Object.keys(branch.callbacks).length == 0) {
						branch.message_counter = -1;
					}
					callback(received_data);
				};
			}
			window.webkit.messageHandlers.mainMessageHandler.postMessage(data);
		},
		receive_messages: function(data) {
			var branch = this;
			if(typeof branch.callbacks[data.message_counter] !== 'undefined') {
				branch.callbacks[data.message_counter](data.message);
			}
			return {
				result: true
			};
		},
	},
	data: {
		escape: false,
		stored_updates: [],
		init_keys: function() {
			var branch = this;
			$(window).on('keydown', function(e) {
				if(e.keyCode == 27) {
					if(branch.escape) {

						branch.escape = false;
					} else {
						branch.escape = true;
					}
				}
			});
		},
		current_state: null,
		assign_to_parent: function(data, item) {
			var mapped = {};
			var foreign_key_id = item+'_id';
			var foreign_key_name = foreign_key_id;
			if(data.length > 0) {
				if(typeof data[0][foreign_key_id] === 'undefined') {
					return data;
				}
				data.sort(function(a, b) {
					if(typeof a[foreign_key_name] === 'undefined' || typeof b[foreign_key_name] === 'undefined') {
						return 0;
					}
					//a[foreign_key_name] = parseInt(
					if(a[foreign_key_name] > b[foreign_key_name]) {
						return 1;
					} else if(a[foreign_key_name] == b[foreign_key_name]) {
						if(a.id > b.id) {
							return 1;
						} else if(a.id < b.id) {
							return -1;
						}
						return 0;
					}
					return -1;
				});
				for(item of data) {
					mapped[item.id] = item;
					item.children = {};
				}
				for(id of Object.keys(mapped)) {
					var item = mapped[id];
					if(item[foreign_key_id] != 0 && item[foreign_key_id] != null && item[foreign_key_id] != -1) {
						delete mapped[id];
						if(typeof mapped[item[foreign_key_id]] !== 'undefined') {
							mapped[item[foreign_key_id]].children[item.id] = item;
						}
					}
				}
			}
			//console.log(mapped);
			var to_array = function(object) {
				var result = [];
				for(var item of Object.values(object.children)) {
					item.children = to_array(item);
					result.push(item);
				}
				return result;
			};
			var result = to_array({ children: mapped });
			//console.log('toarray', result);
			return result;
		},
		transform_datatypes: function(data) {
			if(data == null) {
				return data;
			}
			if(typeof data === 'object') {
				if(Array.isArray(data)) {
					for(index in data) {
						data[index] = this.transform_datatypes(data[index]);
					}
				} else {
					for(index of Object.keys(data)) {
						data[index] = this.transform_datatypes(data[index]);
					}
				}
				return data;
			} else {
				var parsed_int = parseInt(data);
				if(parsed_int == data) {
					return parsed_int;
				}
				return data;
			}
		},
		convert_data: function(data, page) {
			var branch = this;
			if(typeof branch.root.definition.plasticity !== 'undefined' && branch.root.definition.plasticity === true) {
				for(var x in data) {
					var x_altered = x.split('.').join('_');
					data[x_altered+'__'+page] = data[x];
				}
			}
		},
		data: [],
		actions: "actions.php",
		loaded_pre_loaded_data: false,
		post_callbacks: [],
		register_post_callback: function(callback) {
			var branch = this;
			branch.post_callbacks.push(callback);
		},
		clean_item: function(item) {
			delete item.obj_id;
			delete item.parent;
			delete item.root;
		},
		post: function(input) {
			var branch = this;
			var datatype = 'json';
			this.clean_item(input.post_data);
			if(typeof branch.actions_responder_callback !== 'undefined' && branch.root.base.authentication.status.user_id == -1) {
				//&& input.action == '_' || input.action.indexOf('_') === 0 || input.action.indexOf('delete') === 0
				branch.actions_responder_callback();
			}
			//console.log('post', input);
			if(typeof input.datatype !== 'undefined') {
				datatype = input.datatype;
			}
			var callback;
			if(typeof input.callback !== 'undefined') {
				callback = input.callback;
			}
			var cancel_callback;
			if(typeof input.cancel_callback !== 'undefined') {
				cancel_callback = input.cancel_callback;
			}

			//console.log('post-data', input.post_data);
			if(typeof branch.root.no_cache === 'undefined') {
				if(typeof input.post_data.__no_cache !== 'undefined' || typeof input.post_data.search_term !== 'undefined') {
					delete input.post_data.__no_cache;
				} else {
					if(typeof branch.current_state != null && (input.post_data.action == '_' || typeof input.use_current_state !== 'undefined')) {
						var hash_value = decodeURIComponent(window.location.href.split('?path=')[1]);
						var current_state = {...branch.current_state};
						
						current_state.image = null;


						current_state.url = hash_value;
						//console.log(current_state);
						if(typeof current_state.page_data.title === 'undefined') {
							current_state.page_data.title = document.title;
							//console.log('set title', document.title);
						}
						//console.log(current_state);
						if(typeof input.post_data.__current_state === 'undefined') {
							input.post_data.__current_state = JSON.stringify(current_state);
						}

					}
				}
			}
			/*if(typeof input.post_data.action !== 'undefined' && input.post_data.action.indexOf('_') === 0 || input.post_data.action.indexOf('delete') === 0) {*/
				var callback_store = callback;
				callback = function(data) {
					//perform view update
					var $global_loaded_container;
					if(typeof input.$container !== 'undefined') {
						$global_loaded_container = input.$container;
					}
					callback_store(data);
					branch.root.interpretation.global_loaded_callback($global_loaded_container);
					for(var post_callback of branch.post_callbacks) {
						post_callback(input.post_data, data);
					}
				};
			//}
			var data_result = null;
			var perform_action = true;
			/*if(typeof input.post_data.item !== 'undefined') {
				if(input.post_data.action == 'load' && typeof input.view_update === 'undefined') {
					perform_action = false;
					data_result = branch.data.items[input.post_data.item];
				} else {
					switch(input.post_data.action) {
						case 'delete':
							var index = branch.data.items[input.post_data.item].map(function(e) {
								return e.id;
							}).indexOf(input.post_data.id);
							if(index != -1) {
								branch.data.items[input.post_data.item].splice(index, 1);
							}

							break;
						/*case '_':
							var insert_data = {...input.post_data};
							delete insert_data.action;
							break;*/
					/*}
				}
			}*/
			var cache_value = null;
			var key_cache = null;
			/*if(typeof input.cache !== 'undefined') {
				key_cache = JSON.stringify(input.post_data);
				var cache_value_date = localStorage.getItem(key_cache+'-date');
				var datetime = null;
				if(typeof cache_value_date !== 'undefined' && cache_value_date != null) {
					datetime = (Date.now()-Date.parse(cache_value_date))/1000/60;
					if(datetime <= input.cache) {
						cache_value = localStorage.getItem(key_cache);
						perform_action = false;
						data_result = JSON.parse(cache_value);
						//console.log('used cache', data_result);
					}
				}
			}*/
			if(perform_action) {
				var inner_callback = function(data) {
					branch.transform_datatypes(data);
					/*if(typeof data.result !== 'undefined' && data.result != null && typeof data.result.__result !== 'undefined') {
						data.result = data.result.__result;
					}*/
					/*if(input.post_data.action.indexOf('_select') != -1 && typeof branch.root.definition.plasticity !== 'undefined' && branch.root.definition.plasticity) {
						var item = null;
						if(typeof input.post_data.item !== 'undefined') {
							item = input.post_data.item;
						} else {
							item = input.post_data.action.split('__')[0];
						}
						data.result = branch.assign_to_parent(data.result, item);
					}*/
					var perform_callback = true;
					if(typeof data.has_access !== 'undefined') {
						if(!data.has_access) {
							//alert(JSON.stringify(data));
							if(typeof data.result !== 'undefined' && typeof data.pending_update !== 'undefined' && data.result) {
								if(data.pending_update === false) {
									branch.parent.error_messages.display('This change has been declined before and will not be submitted.');
									if(typeof input.pending_callback !== 'undefined') {
										perform_callback = input.pending_callback();
									}
								} else {
									branch.parent.error_messages.display('This change has been submitted and awaits approval.');
									if(typeof input.pending_callback !== 'undefined') {
										perform_callback = input.pending_callback();
									}
									perform_callback = true;
								}
							} else {
								var message_callback = function() {
									branch.parent.error_messages.display('You do not have access.');
								};
								branch.parent.authentication.init(function() {
									branch.parent.authentication.login_callbacks.push(function() {
										//branch.root.navigation.reload_current_href();
										//branch.root.interpretation.reload_all_pages(true, { hard_reload: true });
									});
									if(data.user_id == -1) {
										branch.parent.authentication.display_login_window(message_callback);
									} else {
										message_callback();
									}
								});
								perform_callback = false;
							}
						}
					}
					if(perform_callback) {
						callback(data.result);
					}
				};
				if(typeof branch.root.definition !== 'undefined' && typeof branch.root.definition.plasticity !== 'undefined' && branch.root.definition.plasticity === true) {
					//input.post_data.__plasticity__ = true;
					input.post_data.__plasticity__application_id = branch.root.p_app_id;
					
				}
				var post_callback;
				if(typeof branch.root.is_local === 'undefined' || branch.root.is_local === false) {
					var propagate_tags = false;
					if(input.post_data.action == '_') {
						if(typeof input.post_data.item !== 'undefined') {
							if(branch.root.global_tags.tags_update_items.indexOf(input.post_data.item) != -1) {
								propagate_tags = true;
							}
						}
					}
					post_callback = function() {
						//console.log('call post', input);
						/*if(branch.actions != 'actions.php') {

							$.get(branch.actions, input.post_data, function(data) {
								//console.log(data);
								inner_callback(data);
							}, datatype);
						} else {*/
						//}

						if(branch.root.is_cocoa_app || typeof branch.root.videogalaxy !== 'undefined') {
							if(typeof branch.root.base.authentication.status.session_user_id !== 'undefined') {
								input.post_data.session_user_id = branch.root.base.authentication.status.session_user_id;
							}
						}
						var actions = branch.actions;
						if(typeof input.actions !== 'undefined') {
							actions = input.actions;
						}
						if(typeof input.post_data.module !== 'undefined' || typeof input.use_actions !== 'undefined') {
							if((input.post_data.action != 'make_login_attempt' && input.post_data.action != '_user' && input.post_data.module == 'authentication') || typeof input.use_actions !== 'undefined') {
								//actions = 'actions.php';
								//alert(input.use_actions);
							} else {
								if(typeof input.post_data.username !== 'undefined') {
									input.post_data.username = window.user_decode(input.post_data.username);
								}
							}
						}
						
						/*if(typeof app.dev !== 'undefined') {
							actions = 'http://127.0.0.1:10787/actions.php':
						}*/
						/*if(typeof app.dev !== 'undefined') {
							actions = 'http://127.0.0.1:10787/actions.php';
							alert(actions);
						}*/
						if(actions != 'actions.php') {
							/*if(input.post_data.action != '_' && input.post_data.action.indexOf('_') !== 0 && input.post_data.action.indexOf('delete') === -1 && branch.no_distribute.indexOf(input.post_data.action) === -1) {*/

							/*if(typeof branch.root.base.authentication.status.user_id != -1) {

							} else {*/
								/*if(input.post_data.action == 'load' || input.post_data.action == 'get') {
								//if(input.post_data.action.indexOf(branch.no_distribute) === -1 && !(typeof input.post_data.module !== 'undefined' && input.post_data.module == 'authentication')) {ß
									var random = Math.floor(Math.random() * 10);
									if(random <= 4) {
										actions = '/respondermedia3/actions.php';
									}
								}*/
							/*}*/
							if(branch.root.base.dev) {

								//if((input.post_data.action == 'load' || input.post_data.action == 'get') && input.post_data.item != 'userpageview' || (typeof input.post_data.module !== 'undefined' && input.post_data.module == 'calendar')) {
									//actions = 'http://88.149.66.252:8080/index';//'/respondermedia3/index';
									//console.log(actions, input.post_data);
									//
								//}
							}//*/
						}
						
						/* && (typeof input.post_data.item !== 'undefined' && input.post_data.item != 'all_movies' && input.post_data.item != 'movie')*/

						var update_queue = false;
						if((input.post_data.item == 'queue' || input.post_data.item == 'views') && input.post_data.action == '_') {
							update_queue = true;
						}
						$.post(actions, input.post_data, function(data) {
							console.log(data);
							/*if(Array.isArray(data)) {
							} else if(typeof data == 'object') {
								data = {...data};
							}*/
							inner_callback(data);
							/*if(typeof second_callback !== 'undefined') {
								second_callback();
							}*/
							if(propagate_tags) {
								//alert('propagate');

								branch.root.global_tags.init(function() {									
									branch.root.view_update.ws_connection.send(JSON.stringify({
										'action': 'propagate_tags_update'
									}));
								}, true);	
							}
							/*if(update_queue) {
								branch.root.view_update.ws_connection.send(JSON.stringify({
									'action': 'to_user',
									'to_action': 'queue_update',
								}));
							}*/
						}, datatype).fail(function() {
							/*var next_responder = '/respondermedia2/actions.php';
							if(input.actions != next_responder) {
								input = {...input};
								input.actions = next_responder;
								branch.post(input);
							} else {*/
								//alert(JSON.stringify(input.post_data));
								alert('error in request or server maintenance is in progress, please bear with us.');
							//}
						});
					};
				} else {
					post_callback = function() {
						branch.root.base.local_data.send(input.post_data, function(data) {
							inner_callback(data);
							/*if(typeof second_callback !== 'undefined') {
								second_callback();
							}*/
						});
					};
				}
				if(input.post_data.action == 'delete' && typeof input.bypass_delete_warning === 'undefined') {
					branch.root.base.error_messages.display_with_buttons('Are you sure you want to delete this item, and all items attached to it?', post_callback, function() {

						});
				} else if(false && branch.escape && typeof input.post_data.item !== 'undefined' && branch.ignore_items.indexOf(input.post_data.item) == -1 && input.post_data.action.indexOf('_') === 0) {
					/*branch.root.base.error_messages.display_with_buttons('Are you want to submit this change?', post_callback, function() {
							if(typeof cancel_callback !== 'undefined') {
								cancel_callback();
							}	
						});*/
					//branch.stored_callbacks.push(post_callback);

				} else {
					post_callback();
				}

			} else {
				callback(data_result);
			}
			if(typeof input.apply_to !== 'undefined' && typeof input.post_data.id !== 'undefined') {
				var item_index = input.apply_to.map(function(e) {
					return e.id;
				}).indexOf(input.post_data.id);
				var item = input.apply_to[item_index];
				for(key of Object.keys(input.post_data)) {
					item[key] = input.post_data[key];
				}
			}	
		},
		no_distribute: [
			'upload',
			'add_image_size',
			'delete',
			'get_user_id'
		],
		ignore_items: ['searchresults', 'votes', 'views',],
	},
	data_functions: {
		data_uri_type: function(data_uri) {
			if(data_uri.indexOf('data:image/jpeg') == 0) {
				return 'jpg';
			} else {
				return 'png';
			}
		},
		dataURItoBlob: function(dataURI) {
		    // convert base64 to raw binary data held in a string
		    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
		    var byteString = atob(dataURI.split(',')[1]);

		    // separate out the mime component
		    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		    // write the bytes of the string to an ArrayBuffer
		    var ab = new ArrayBuffer(byteString.length);
		    var ia = new Uint8Array(ab);
		    for (var i = 0; i < byteString.length; i++) {
		        ia[i] = byteString.charCodeAt(i);
		    }

		    //Old Code
		    //write the ArrayBuffer to a blob, and you're done
		    //var bb = new BlobBuilder();
		    //bb.append(ab);
		    //return bb.getBlob(mimeString);

		    //New Code
		    return new Blob([ab], {type: mimeString});
		}
	},
	assign_root_object: function(object, alt_names) {
		var branch_root = this;
		
		function assign_root(object_path, object) {
			var statement = 'var obj = '+object_path+';';
			//alert(statement);
			eval(statement);
			/*if(typeof obj.inherit !== 'undefined' && typeof obj.inherit === 'string') {
				root.functions.inherit(obj.inherit, obj);	
			}*/
			for(var x in obj) {
				if(typeof obj[x] === 'object' && obj[x] != null && typeof obj[x].length === 'undefined' && 
					x != 'root' && x != 'parent' && typeof obj[x].context === 'undefined' && x != 'instance_root' && x != 'instance_parent' && x != 'element_branch' && x.indexOf('branch') == -1 && x != 'page_data' && x != 'post_data' && x != 'content_item' && x.indexOf('___') != 0 && (typeof obj[x].root === 'undefined' || typeof obj[x].instance_root === 'undefined')) {
					if(typeof alt_names === 'undefined') {
						obj[x].root = object;
						obj[x].parent = obj;
					} else {
						//console.log('set: '+x);
						obj[x].root = branch_root;
						//obj[x].root = object;
						obj[x].parent = obj;
						obj[x].instance_root = object;
						obj[x].instance_parent = obj;
					}
					obj[x].obj_id = x;//object.substr(object.lastIndexOf('.')+1, object.length-1);
					var str = object_path + '.' + x;
					assign_root(str, object);	
				}
			}
		}
		assign_root("object", object);
	},
	assign_root: function(path, override) {
		var root = app;
		//var main_root = app;
		if(typeof path !== 'undefined') {
			root = path;
		}
		function assign_root(object) {
			var obj = object;
			for(x in obj) {
				if(obj[x] != null && (typeof obj[x].root === 'undefined')) {//|| typeof override !== 'undefined'
					if(typeof obj[x] === 'object' && obj[x] != null && typeof obj[x].length === 'undefined' && 
						x != 'root' && x != 'parent' && typeof obj[x].context === 'undefined' && x.indexOf('___') != 0) {
						
						obj[x].root = root;
						obj[x].parent = obj;
						obj[x].obj_id = x;
						var str = object[x];
						assign_root(str);	
					}
				}
			}
		}
		assign_root(path);
		/*if(typeof path === 'undefined') {
			assign_root(app);
		} else {
			assign_root(path);
		}*/
	},
	init: function() {
		this.black_overlay.init();
		this.error_messages.init();
	},
	/*user_groups: [
		'everyone',
		'user',
		'admin'
	],*/
	error_messages: {
		in_display: false,
		init: function() {
			var branch = this;
			branch.$error_message = branch.parent.black_overlay.$black_overlay.find('.error_message').first();

		},
		display: function(message, not_logged_in) {
			var branch = this;
			branch.$error_message.find('.buttons').hide();
			branch.$error_message.find('.message').first().html(message);
			branch.parent.black_overlay.display(function($self) {
				branch.$error_message.show();
				setTimeout(function() {
					branch.$error_message.addClass('flash');
					setTimeout(function() {
						branch.$error_message.fadeOut('slow');
						if(typeof not_logged_in === 'undefined') {
							branch.parent.black_overlay.hide();
						} else {
							branch.parent.authentication.display_login_window();
							//self.find('.login').show();
							//!$self.find('.login').is(':visible') && 
						}
					}, 4500);
				}, 25);
			});
		},
		display_with_buttons: function(message, ok_callback, no_callback) {
			var branch = this;
			branch.$error_message.find('.buttons').show();
			branch.$error_message.find('.buttons').find('.ok_button').off('click').on('click', function() {
				branch.parent.black_overlay.hide();
				ok_callback();
			});
			branch.$error_message.find('.buttons').find('.cancel_button').off('click').on('click', function() {
				branch.parent.black_overlay.hide();
				no_callback();
			});
			branch.$error_message.find('.message').first().html(message);
			branch.parent.black_overlay.display(function($self) {
				branch.$error_message.show();

			});
		}
	},
	/*auto_generate_tags: {
		tags: {
		},
		init: function(callback) {
			var branch = this;
			if(typeof branch.root.definition.auto_generate_tags !== 'undefined') {
				var total_length = branch.root.definition.auto_generate_tags.length;
				var counter = 0;
				for(tag_group of branch.root.definition.auto_generate_tags) {
					branch.root.base.data.post({
						post_data: {
							action: 'get_tags',
							item: tag_group
						}, 
						callback: function(data) {
							branch.tags[tag_group] = data;
							counter++;
							if(counter == total_length) {
								if(typeof callback !== 'undefined') {
									callback();
								}
							}
						}
					});
				}
			}
		},
		generate_tags: function(input) {
			var branch = this;
			for(tag_group of Object.keys(branch.tags)) {
				for(tag_item of branch.tags[tag_group])) {

				}
			}
		}
	},*/
	authentication: {
		login_callbacks: [],
		call_login_callbacks: function(set_callback) {
			this.has_access = true;
			for(callback of this.login_callbacks) {
				callback();
			}
			this.login_callbacks = [];
			if(typeof set_callback !== 'undefined') {
				set_callback();
			}
		},
		no_access: function(callback) {
			var branch = this;
			branch.has_access = false;
			this.login_callbacks.push(callback);
			branch.display_login_window();
		},
		status: {
			user_group: 'everyone',
			user_id: -1,
		},
		render_username_callback: null,
		$user_name_wrap_clone: null,
		reset_index_callback: function() {
			var branch = this;
			
			if(branch.$user_name_wrap_clone != null) {
				var $wrap = $('.body_frame .user_name_wrap').first();
				$wrap.replaceWith(branch.$user_name_wrap_clone);
				//branch.$user_name_wrap_clone.find('a').first().addClass('set_href_value');
				branch.root.user_button.loaded_callback();
				//branch.root.navigation.register_links(branch.$user_name_wrap_clone);
			}
		},
		init: function(callback) {
			var branch = this;
			var set_information = function(data) {
				if(data.user_id != -1) {
					branch.status.user_id = data.user_id;
					branch.status.email = data.email;
					branch.status.user_group = data.user_group;
					if(typeof data.session_user_id !== 'undefined') {
						branch.status.session_user_id = data.session_user_id;
					}
					$('.body_frame').addClass('login_active');
					//console.log(branch.status);
					//branch.init_user_menu();
				} else {
					/*if(typeof branch.root.user_local_fallback !== 'undefined') {
						branch.status = {
							user_group: 'everyone',
							user_id: -1,
						};
					} else {*/
						branch.status = {
							user_group: 'everyone',
							user_id: -1,
						};
					//}
				}
				if(typeof callback !== 'undefined') {
					callback();
				}
				branch.root.base.authentication.init_user_menu();
				var $username_wrap = $('.body_frame .user_name_wrap').first().off('click');
				if(typeof branch.status.email !== 'undefined') {
					var $username_value = $('<div class="user_button">'+'</div>');
					/*alert(branch.status.email);
					alert(window.user_encode(branch.status.email));
					alert(window.user_decode(window.user_encode(branch.status.email)));*/
					$username_value.attr('username', window.user_encode(branch.status.email));
					$username_wrap.html($username_value);

					branch.$user_name_wrap_clone = $('.body_frame .user_name_wrap').first().html();//.clone(true);
					branch.root.user_button.loaded_callback();
					//app-specific
					/*var frame_3 = branch.root.interpretation.find_frame(3);
					if(frame_3 != null) {
						alert('reload');
						branch.root.interpretation.reload_all_pages(frame_3, {
							//'only_reload_soft': true
						});
					}*/
					//branch.root.navigation.reload_current_href();
					//branch.root.interpretation.reload_all_pages(true, {});
				} else {
					//sign up
					$username_wrap.html('').on('click', function(e) {
						branch.display_login_window();
					});
				}
				if(branch.root.use_view_update) {
					branch.root.view_update.init();
				}
			};
			if(branch.root.is_cocoa_app) {
				var user_information = localStorage.getItem('noob_login_information');
				if(user_information != 'null' && user_information != null) {
					user_information = JSON.parse(user_information);
					set_information(user_information);
				} else {

					set_information({ user_id: -1 });
				}

				return;
			}
			var post_data_values_auth = {
				action: 'get_user_id',
				module: 'authentication'
			};
			if(typeof localStorage.getItem('user_session_id') !== 'undefined' && localStorage.getItem('user_session_id') != null) {
				post_data_values_auth.session_user_id_value = localStorage.getItem('user_session_id');
			}
			branch.root.base.data.post({
				post_data: post_data_values_auth, 
				callback: function(data) {
					//alert('get user id');
					set_information(data);
				}
			});

			
		},
		has_access: true,
		initialized: false,
		$username: null,
		$password: null,
		$login: null,
		user_menu_validation: function() {
			var branch = this;
			var valid = true;
			if(branch.$username.val() == null || branch.$username.val().length == 0) {
				branch.$username.addClass('invalid');
				valid = false;
			}
			if(branch.$password.val() == null || branch.$password.val().length == 0) {
				branch.$password.addClass('invalid');
				valid = false;
			}
			return valid;
		},
		init_user_info: function() {
			var branch = this;
			var $account_container = $('.body_frame .account_container').first();
			
			$account_container.find('.user_menu_button').off('click').on('click', function() {
				branch.display_login_window();
			});
			//$account_container.find('.user_name_wrap').first().html(branch.status.email);
		},
		init_user_menu: function() {
			var branch = this;
			branch.init_user_info();
			if(!branch.initialized) {
				/*if($account_container.length == 0) {
					return;
				}*/
				branch.initialized = true;
				var $login = branch.parent.black_overlay.$black_overlay.find('.login').first();
				branch.$login = $login;
				branch.$username = $login.find('.username').first();
				branch.$password = $login.find('.password').first();
				branch.$username.on('keydown', function(e) {
					if(e.keyCode == 13) {
						branch.$password.focus();
					}
					branch.$username.removeClass('invalid');
				});
				branch.$password.on('keydown', function(e) {
					if(e.keyCode == 13) {
						$login.find('.signin_button').first().trigger('click');
					}
					branch.$password.removeClass('invalid');
				});
				$login.find('.signin_button').first().click(function() {
					if(branch.user_menu_validation()) {
						branch.root.base.data.post({
							post_data: {
								username: branch.$username.val(),
								password: branch.$password.val(),
								'module': 'authentication',
								'action': 'login'
							}, 
							callback: function(data_login_values) {
								console.log(data_login_values);
								var data = data_login_values;
								branch.$password.val('');
								if(branch.root.is_cocoa_app && data != -1) {
									var user_information = data;
									data = user_information.user_id;
									localStorage.setItem('noob_login_information', JSON.stringify(user_information));
								} else {
									localStorage.setItem('noob_login_information', null);
								}
								console.log(data);
								if(data != -1) {
									if(typeof data.session_user_id !== 'undefined') {
										localStorage.setItem('user_session_id', data.session_user_id);
									}
									branch.parent.black_overlay.hide();
									branch.init(function() {
										//alert(branch.root.base.authentication.status.user_id);
										//alert('reload');
										window.location.reload();
										//branch.root.navigation.reload_current_href();
										//var frame_3 = branch.root.interpretation.find_frame(3);
										//branch.root.interpretation.reload_all_pages(frame_3, { hard_reload: true });
									});
									branch.call_login_callbacks(function() {
										//alert('reload');
									});
									//window.location.reload();
									//
								} else {
									branch.parent.error_messages.display('Incorect login information', true);
								}
								branch.init_user_menu();
							}
						});
					}
				});
				$login.find('.signup_button').first().click(function() {
					if(branch.user_menu_validation()) {
						branch.create_user({
							email: branch.$username.val(),
							password: branch.$password.val(),
						});
					}
				});
				$login.find('.close_button').first().click(function() {
					if(branch.has_access) {
						branch.parent.black_overlay.hide();
					} else {
						/*if(document.referrer.indexOf('noob.software') != -1) {
							history.back();
						} else {*/
							branch.parent.error_messages.display('You do not have access to this page');
						//}
					}
				});
				$('.black_overlay .logged_in_menu .close_button').first().click(function() {
					branch.parent.black_overlay.hide();
				});
				branch.parent.black_overlay.$black_overlay.find('.logout_button').first().click(function() {

					if(branch.root.is_cocoa_app) {
						localStorage.setItem('noob_login_information', null);
					}
					branch.root.base.data.post({
						post_data: {
							'action': 'logout',
							'module': 'authentication'
						},
						callback: function(data) {
							/*branch.status = {
								user_group: 'everyone',
								user_id: -1,
							};*/
							localStorage.setItem('user_session_id', null);
							branch.init(function() {

								branch.display_login_window();
							});
						}
					});
				});
			}
			//branch.render_username_callback();
		},
		display_login_window: function() {
			var branch = this;
			var display_callback = function($self) {
				$self.children().hide();
				if(branch.status.user_id != -1) {
					$self.find('.logged_in_menu').first().show();
				} else {
					$self.find('.login').show();
				}
			};
			if(branch.parent.black_overlay.$black_overlay.is(':visible')) {
				display_callback(branch.parent.black_overlay.$black_overlay);
			} else {
				branch.parent.black_overlay.display(function($self) {
					display_callback($self);
				});
			}
		},
		hide_login_window: function(callback) {
			var branch = this;
			if(branch.parent.black_overlay.$black_overlay.hasClass('view_visible')) {
				branch.parent.black_overlay.hide(function($self) {
					$self.children().hide();
					if(branch.status.user_id != -1) {
						$self.find('.logged_in_menu').first().show();
					} else {
						$self.find('.login').show();
					}
					if(typeof callback !== 'undefined') {
						callback();
					}
				});
			} else {
				if(typeof callback !== 'undefined') {
					callback();
				}
			}
		},
		create_user: function(data) {
			var branch = this;
			/*grecaptcha.ready(function() {
				grecaptcha.execute('6Le5NsMZAAAAAGv4ZylH0rEyu6ikXXz1VAXXmGih', {action: '_user'}).then(function(token) {
					data.token = token;
					//$.post(branch.root.actions, data, function(data) {
					branch.root.base.data.post({
						post_data: data, 
						callback: function(data) {
							//////console.log(data);
							if(data != "-1") {
								location.href = '/objectives/';
								//location.reload();	
							} else {
								submit_callback(data);
							}
						}
					});
				});
			});*/
			data.action = '_user';
			data.module = 'authentication';
			branch.root.base.data.post({
				post_data: data, 
				callback: function(data) {
					//////console.log(data);
					/*if(data != "-1") {
						location.href = '/objectives/';
						//location.reload();	
					} else {
						submit_callback(data);
					}*/
					////console.log(data);
					if(data != -1) {
						$('.login .signin_button').trigger('click');
					} else {
						alert('could not create user');
					}
				}
			});
		}	
	},
	black_overlay: {
		$black_overlay: null,
		init: function() {
			var branch = this;
			branch.$black_overlay = $('.black_overlay').first();
		},
		display: function(pre, callback) {
			var branch = this;
			branch.$black_overlay.children().hide();
			if(typeof pre !== 'undefined') {
				pre(branch.$black_overlay);
			}
			branch.$black_overlay.addClass('view_visible').css({
				'display': 'block',
			}).animate({
				'opacity': 1
			}, 250, 'easeInOutQuint', function() {
				if(typeof callback !== 'undefined') {
					callback(branch.$black_overlay);
				}
			});
			$('.body_frame input').each(function() {
				var $this = $(this);
				$this.attr('tabindex', -1);
			});
		},
		hide: function(callback) {
			var branch = this;

			$('.body_frame input').each(function() {
				var $this = $(this);
				$this.removeAttr('tabindex');
			});

			branch.$black_overlay.removeClass('view_visible').animate({
				'opacity': 0
			}, 250, 'easeInOutQuint', function() {
				branch.$black_overlay.hide();
				branch.$black_overlay.children().hide();
				if(typeof callback !== 'undefined') {
					callback(branch.$black_overlay);
				}
			});
		}
	},
	global_tags: {
		enabled: false,
		tags: [],
		collections: [],
		init: function(callback) {
			var branch = this;
			branch.root.base.data.post({
				post_data: {
					'action': 'get_global_tags'
				},
				callback: function(data) {
					if(typeof branch.preprocess !== 'undefined') {
						data = branch.preprocess(data);
					}
					/*data = data.map(function(e) {
						if(e.name.indexOf(':')) {
							e.name = e.name.split(':')[0];
						}
						return e;
					});*/
					console.log(data);
					var collections = [];
					var titles = [];
					if(!Array.isArray(data)) {
						if(branch.root.base.data.actions == '/responder/actions.php') {
							collections = data.collections;
							data = data.tags;
						} else if(branch.root.base.data.actions == '/respondermedia/actions.php') {
							titles = data.medias;
							data = data.tags;
						}
					}
					var result = {};
					for(var item of data) {
						if(typeof item.name !== 'undefined') {
							result[item.name] = item.id;
						}
					}
					var collections_result = {};
					for(var item of collections) {
						if(typeof item.name !== 'undefined') {
							collections_result[item.name] = item.id;
							result[item.name] = item.id;
						}
					}
					var titles_result = {};
					for(var item of titles) {
						console.log('title item', item);
						titles_result[item.id] = item.name;
					}
					console.log('titles result', titles_result);
					if(Object.values(titles_result).length > 0) {
						branch.titles = titles_result;
					}
					branch.tags = result;
					branch.collections = collections_result;
					//alert(JSON.stringify(data));
					if(typeof callback !== 'undefined') {
						callback();
					}
					if(typeof branch.corrections !== 'undefined') {
						branch.corrections.init_mispellings();
					}
				},
			});
		},
		loaded_callback: function() {
			var branch = this;
			if(!branch.enabled) {
				return;
			}
			$('.global_tag_enabled_container:not(.global_tags_registered)').each(function() {
				var $this = $(this);
				$this.addClass('global_tags_registered');
				var value = $this.html();
				$this.attr('global_tag_original_value', value);
				var resolved = branch.resolve(value);
				//console.log(resolved);
				if(!Array.isArray(resolved)) {
					return;
				}
				$this.html('');
				var is_tag = false;
				for(part of resolved) {
					var part_value = part;
					if(is_tag) {
						var $span = $(document.createElement('span'));
						$span.html(part_value);
						$span.addClass('artist_tag_link');
						part_value = $span;
					}
					$this.append(part_value);
					if(is_tag && typeof branch.tags[part] !== 'undefined') {
						var tags_page = branch.tags_page;
						if(typeof branch.collections[part] !== 'undefined') {
							tags_page = branch.collections_page;
						}
						var send_data = {
							id: branch.tags[part]
						};

						var href_data = {
							page: tags_page,
							target_frame: branch.tags_page_target_frame,
							get_data: send_data,
							$element: part_value,
							//navigate_to: true
						};
						branch.root.navigation.generate_href(href_data);
					}
					if(!is_tag) {
						is_tag = true;
					} else {
						is_tag = false;
					}
				}
				/*//console.log('resolved', resolved);
				var assigned = branch.assign_values(resolved);

				//$this.html();
				//console.log('assigned', assigned);*/
			});
			branch.perform_tag_check_callback();
		},
		perform_tag_check_callback: function() {
			var branch = this;
			$('.tag_check:not(.tag_check_registered)').each(function() {
				var $item = $(this);
				$item.addClass('tag_check_registered').wrap('<div class="tag_check_wrap"></div>');
				$item.parent().append('<div class="corrections"></div>');
				var $corrections = $item.parent().find('.corrections').first();
				var timeout = null;
				$item.off('input.tag_check').on('input.tag_check', function(e) {
					clearTimeout(timeout);
					timeout = setTimeout(function() {
						var value = [$item.val()];
						var corrections = branch.root.base.global_tags.corrections.detect_mispellings(value, $corrections);
					}, 225);
				});
			});
			$('.tag_check_delimit:not(.tag_check_registered)').each(function() {
				var $item = $(this);
				var delimiter = ';';
				if(typeof $item.attr('delimiter') !== 'undefined') {
					delimiter = new RegExp($item.attr('delimiter'), 'ig');
				}
				$item.addClass('tag_check_registered').wrap('<div class="tag_check_wrap"></div>');
				$item.parent().append('<div class="corrections"></div>');
				var $corrections = $item.parent().find('.corrections').first();
				var timeout = null;
				$item.off('input.tag_check').on('input.tag_check', function(e) {
					clearTimeout(timeout);
					timeout = setTimeout(function() {
						var value = $item.val().split(delimiter);
						var corrections = branch.root.base.global_tags.corrections.detect_mispellings(value, $corrections);
						//console.log('corrections', corrections);
					}, 225);
				});
			});
		},
		collections_page: 'collections',
		tags_page: 'person',
		tags_page_target_frame: 3,
		assign_values: function(resolved) {
			var branch = this;
			var is_tag = 0;
			for(value_index in resolved) {
				if(is_tag == 1) {
					var tag_value = resolved[value_index];
					/*var span = document.createElement('span');
					span.innerHTML = tag_value;
					resolved[value_index] = $(span);

					var send_data = {
						id: branch.tags[tag_value]
					};

					var href_data = {
						page: branch.tags_page,
						target_frame: 'self',
						get_data: send_data,
						$element: resolved[value_index],
						//navigate_to: true
					};
					branch.root.navigation.generate_href(href_data);

					resolved[value_index].attr('href', href);	*/
				}
				if(is_tag == 0) {
					is_tag = 1;
				} else {
					is_tag = 0;
				}
			}
			return resolved;
		},
		resolve: function(value, split_token) {
			if(typeof split_token === 'undefined') {
				split_token = '$$';
			}
			var split_nodes = [];

			if((this.root.interpretation.current_page != null && this.root.interpretation.current_page.id.indexOf('manage') == 0) || value.indexOf(split_token) == -1) {
				return value;
			}
			//$('.dummy_div').html(value);
			if(value.lastIndexOf(split_token) !== value.length-2) {
				value += split_token;
			}
			var $dummy_div = $('<div></div>');
			$dummy_div.html(value);
			var original_node = $dummy_div.clone().get(0);

			var continue_find = true;
			var find_queue = [];
			var find = function(item) {
				////console.log('call find');
				var split_node_item = null;
				/*$(item).contents().filter(function() {
					//console.log(this.nodeValue);
					//console.log(this.nodeType);
				 	if(this.nodeType == Node.TEXT_NODE && this.nodeValue != null && this.nodeValue.indexOf('$$') != -1) {
				 		split_node_item = this;
				 		//console.log('set');
				 	} else {
				 		//find(this);
				 	}
				});
				$(item).children().each(function() {
					////console.log(this);
					var intermediate_value = find(this);
					if(intermediate_value != null) {
						split_node_item = intermediate_value;
					}
				});*/
				for(child of item.childNodes) {
					if(child.nodeType == Node.TEXT_NODE && child.nodeValue != null && child.nodeValue.indexOf(split_token) != -1) {
						if(child.nodeValue.trim() == split_token) {
							return child;
						}
						var split = child.nodeValue.split(split_token);
						/*var return_result = document.createTextNode(split[0]);
						$(child).after($(return_result));
						$(child).after($(document.createTextNode(split[1])));
						$(child).remove();*/
						var counter = 0;
						var return_result = null;
						var original_child = child;
						for(split_value of split) {
							var text_node = document.createTextNode(split_value);
							$(child).after($(text_node));
							child = text_node;
							if(counter < split.length-1) {
								var dollar_node = document.createTextNode(split_token);
								$(child).after($(dollar_node));
								if(return_result == null) {
									return_result = dollar_node;
								}
								child = dollar_node;
							}
							counter++;
						}
						$(original_child).remove();
						return return_result;
				 	} else {
				 		var intermediate_value = find(child);
						if(intermediate_value != null) {
							split_node_item = intermediate_value;
							return split_node_item;
						}
				 	}
				}
				return split_node_item;
			};

			function splitOn(bound, cutElement) {
			    // cutElement must be a descendant of bound
			    for (var parent = cutElement.parentNode; bound != parent; parent = grandparent) {
			        var right = parent.cloneNode(false);
			        while (cutElement.nextSibling)
			            right.appendChild(cutElement.nextSibling);
			        var grandparent = parent.parentNode;
			        grandparent.insertBefore(right, parent.nextSibling);
			        grandparent.insertBefore(cutElement, right);
			    }
			}

			//split_nodes.push(original_node);
			split_node = original_node;
			var set_html = '';
			while(continue_find) {
				split_node = find(original_node);
				if(split_node != null) {
					//var split_node_clone = $(original_node).clone().get(0);
					if(original_node.tagName != 'p') {

					}
					splitOn(original_node, split_node);
					var split = $(original_node).html().split(split_token);
					/*var $first_p = $(original_node).find('p').first();
					//console.log('first p: ', $first_p.html());
					$first_p.remove();
					split_nodes.push($first_p.html());*/
					split_nodes.push(split[0]);
					split.splice(0, 1);
					set_html = split.join(split_token);
					if(set_html.trim().length > 0) {
						$dummy_div.html(set_html);
						split_node = $dummy_div.get(0);
						if(split_node.tagName != 'p') {
							original_node = $(split_node).wrap('p').get(0);
						}
					} else {
						continue_find = false;
					}
				} else {
					continue_find = false;
				}
				/*//console.log('split_node');
				//console.log(split_node);
				if(split_node != null) {
					split_nodes.push(split_node);
					$(split_node).remove();
					split_node = original_node;
				} else {
					continue_find = false;
				}*/
			}
			return split_nodes;
		}
	},
	language_functions: {
		init: function() {
			if(typeof set_app_language !== 'undefined') {
				this.root.language = set_app_language;
			}
		},
		resolve_language_object_values: function(value) {
			var branch = this;
			var suffix = parseInt(branch.root.language)+1;
			suffix = "_"+suffix;
			if((this.root.interpretation.current_page != null && this.root.interpretation.current_page.id.indexOf('manage') == 0) || value == null) {
				return value;
			}
			if(Array.isArray(value)) {
				for(item_key in value) {
					value[item_key] = this.resolve_language_object_values(value[item_key]);
				}
			} else if(typeof value === 'object') {
				for(item_key of Object.keys(value)) {
					if(branch.root.language != 0) {
						if(typeof value[item_key+suffix] !== 'undefined') {
							value[item_key] = value[item_key+suffix];
						}
					}
				}
			}
			return value;
		},
		resolve_language_object: function(value) {
			if(value == null) {
				return null;
			}
			if(typeof this.root.resolve_languages !== 'undefined' && this.root.resolve_languages === true) {
				if(Array.isArray(value)) {
					for(index in value) {
						value[index] = this.resolve_language_object(value[index]);
					}
				} else if(typeof value === 'object') {
					for(index of Object.keys(value)) {
						value[index] = this.resolve_language_object(value[index]);
					}
				} else if(typeof value === 'string') {
					value = this.resolve_language(value);
				}
			}
			return value;
		},
		resolve_language: function(value) {
			var split_nodes = [];
			//console.log(value);

			if((this.root.interpretation.current_page != null && this.root.interpretation.current_page.id.indexOf('manage') == 0) || value.indexOf('$$') == -1) {
				return value;
			}
			//$('.dummy_div').html(value);
			var $dummy_div = $('<div></div>');
			$dummy_div.html(value);
			var original_node = $dummy_div.clone().get(0);

			var continue_find = true;
			var find_queue = [];
			var find = function(item) {
				////console.log('call find');
				var split_node_item = null;
				/*$(item).contents().filter(function() {
					//console.log(this.nodeValue);
					//console.log(this.nodeType);
				 	if(this.nodeType == Node.TEXT_NODE && this.nodeValue != null && this.nodeValue.indexOf('$$') != -1) {
				 		split_node_item = this;
				 		//console.log('set');
				 	} else {
				 		//find(this);
				 	}
				});
				$(item).children().each(function() {
					////console.log(this);
					var intermediate_value = find(this);
					if(intermediate_value != null) {
						split_node_item = intermediate_value;
					}
				});*/
				for(child of item.childNodes) {
					if(child.nodeType == Node.TEXT_NODE && child.nodeValue != null && child.nodeValue.indexOf('$$') != -1) {
						if(child.nodeValue.trim() == '$$') {
							return child;
						}
						var split = child.nodeValue.split('$$');
						/*var return_result = document.createTextNode(split[0]);
						$(child).after($(return_result));
						$(child).after($(document.createTextNode(split[1])));
						$(child).remove();*/
						var counter = 0;
						var return_result = null;
						var original_child = child;
						for(split_value of split) {
							var text_node = document.createTextNode(split_value);
							$(child).after($(text_node));
							child = text_node;
							if(counter < split.length-1) {
								var dollar_node = document.createTextNode('$$');
								$(child).after($(dollar_node));
								if(return_result == null) {
									return_result = dollar_node;
								}
								child = dollar_node;
							}
							counter++;
						}
						$(original_child).remove();
						return return_result;
				 	} else {
				 		var intermediate_value = find(child);
						if(intermediate_value != null) {
							split_node_item = intermediate_value;
							return split_node_item;
						}
				 	}
				}
				return split_node_item;
			};

			function splitOn(bound, cutElement) {
			    // cutElement must be a descendant of bound
			    for (var parent = cutElement.parentNode; bound != parent; parent = grandparent) {
			        var right = parent.cloneNode(false);
			        while (cutElement.nextSibling)
			            right.appendChild(cutElement.nextSibling);
			        var grandparent = parent.parentNode;
			        grandparent.insertBefore(right, parent.nextSibling);
			        grandparent.insertBefore(cutElement, right);
			    }
			}

			//split_nodes.push(original_node);
			split_node = original_node;
			var set_html = '';
			while(continue_find) {
				split_node = find(original_node);
				if(split_node != null) {
					//var split_node_clone = $(original_node).clone().get(0);
					if(original_node.tagName != 'p') {

					}
					splitOn(original_node, split_node);
					var split = $(original_node).html().split('$$');
					/*var $first_p = $(original_node).find('p').first();
					//console.log('first p: ', $first_p.html());
					$first_p.remove();
					split_nodes.push($first_p.html());*/
					split_nodes.push(split[0]);
					split.splice(0, 1);
					set_html = split.join('$$');
					if(set_html.trim().length > 0) {
						$dummy_div.html(set_html);
						split_node = $dummy_div.get(0);
						if(split_node.tagName != 'p') {
							original_node = $(split_node).wrap('p').get(0);
						}
					} else {
						continue_find = false;
					}
				} else {
					continue_find = false;
				}
				/*//console.log('split_node');
				//console.log(split_node);
				if(split_node != null) {
					split_nodes.push(split_node);
					$(split_node).remove();
					split_node = original_node;
				} else {
					continue_find = false;
				}*/
			}
			//console.log(original_node);
			//console.log(split_nodes);
			//return 'undefined';
			//console.log('split nodes', split_nodes);
			var lang = parseInt(this.root.language);
			/*var node = split_nodes[lang];
			if(node.nodeType == Node.TEXT_NODE) {
				return node.nodeValue;
			}*/
			//console.log('lang:');
			//console.log(lang);
			//console.log(split_nodes[lang]);
			return split_nodes[lang];
		}
	},
};