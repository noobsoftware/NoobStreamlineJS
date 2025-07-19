app.navigation = {
	//initial_callback: null,
	prevent_setting_url: false,
	init: function(callback, prevent_settings_url) {
		var branch = this;
		branch.parse_href_index = {};
		/*if(typeof prevent_settings_url !== 'undefined' && prevent_settings_url === true) {
			branch.prevent_settings_url = true;
		}*/
		/*if(typeof callback !== 'undefined') {
			branch.initial_callback = callback;
		}*/
		//if(!branch.prevent_setting_url) {
			$(window).bind("popstate", function (e) {
				//////////console.log('popstate', window.location.href.split('?path=')[1]);

				var href = window.location.href;
				if(href.indexOf('goto[') !== -1) {
					branch.load_tag_url(window.location.href);
					/**/
				} else {

					var hash_value = window.location.href.split('?path=')[1];
					//hash_value = window._atob(hash_value);
					/*if(branch.current_href == hash_value) {
						return;
					}*/
					if(typeof hash_value !== 'undefined' && hash_value.length > 0) {
						//hash_value = branch.check_default_page(hash_value);
						//branch.current_href = hash_value;
						//console.log('parserhref', hash_value);


						branch.parse_href(atob(hash_value));//decodeURIComponent
						
					}
				}
				e.preventDefault();
				/*if(hash_value.indexOf('&') != -1) {
					hash_value.split('&')[0];
				}
				if(typeof hash_value !== 'undefined' && hash_value.length > 0) {
				} else {
					branch.poll_hash();
				}*/
			});
		//}
		this.load_routes();
	},
	load_tag_url: function(href) {
		var branch = this;
		//console.log('href: ', href);
		var set_tag = href.split('goto[')[1];
		set_tag = decodeURIComponent(set_tag.split(']')[0]);
		//alert(set_tag);

		//this.load_
		//console.log(branch.root.global_tags.tags[part]);
		var part = set_tag;
		var tags_page = branch.root.global_tags.page_index[branch.root.global_tags.tags[part].type].page;
		var send_data = {
			id: branch.root.global_tags.tags[part].id
		};


		/*var parsed_href = branch.parse_href('0:index:;1:mainpage:;2:mainmenu:;', true);
		for(var key of Object.keys(send_data)) {
			parsed_href[key
		}*/

		var href_data = {
			page: ['index', 'mainpage', 'mainmenu', tags_page],
			target_frame: [0, 1, 2, 3],//branch.root.global_tags.tags_page_target_frame,
			get_data: [{}, {}, {}, send_data],
			//$element: part_value,
			//$element: $('.dummy_anchor').first(),
			navigate_to: true
		};
		if(branch.root.interpretation.find_frame(3) != null) {
			//alert('set');
			var href_data = {
				page: [tags_page],
				target_frame: [3],//branch.root.global_tags.tags_page_target_frame,
				get_data: [send_data],
				//$element: part_value,
				//$element: $('.dummy_anchor').first(),
				navigate_to: true
			};
		}
		//console.log(href_data);
		branch.prevent_setting_url = true;
		branch.generate_href(href_data);

		branch.post_navigation_callbacks.push(function() {
			branch.prevent_setting_url = false;
			window.history.replaceState({}, window.title, href);
			//branch.load_tag_url(href);
		});
		/*alert(href_value);
		var string_value = branch.href_to_string(href_value);*/
		//var string_value = branch.root.definition.routes['everyone'].default_route+'3:movies:'+send_data.id+';';//branch.href_to_string(href_data);

		//branch.parse_href(string_value);
		//window.history.replaceState({}, window.title, href);
	},
	route_loaded: false,
	load_routes: function() {
		var branch = this;

		var user_group = branch.root.base.authentication.status.user_group;
		var set_routes = branch.root.definition.routes['everyone'];
		if(typeof branch.root.definition.routes[user_group] !== 'undefined') {
			set_routes = branch.root.definition.routes[user_group];
		}
		var default_route = set_routes.default_route;
		//if(!branch.prevent_setting_url) {
			var href = window.location.href;
			var set_goto = false;
			if(href.indexOf('goto[') !== -1) {
				//setTimeout(function() {
				//}, 25);
				set_goto = true;
				/**/
			}// else {
				if(!set_goto && window.location.href.indexOf('?path') != -1) {
					branch.route_loaded = true;
					var hash_value = window.location.href.split('?path=')[1];
					if(typeof hash_value !== 'undefined' && hash_value.length > 0) {

						//hash_value = branch.check_default_page(hash_value);
						branch.parse_href(atob(hash_value));
					}
				} else if(!branch.route_loaded) {
					branch.route_loaded = true;
					if(set_goto) {
						branch.load_tag_url(window.location.href);

						//var parsed_href = branch.parse_href(current_href, true);
						
						/*branch.post_navigation_callbacks.push(function() {
							branch.load_tag_url(href);
						});*/
					} else {
						branch.set_href(default_route);

						//hash_value = branch.check_default_page(default_route);
						branch.parse_href(default_route);
					}
				}
				/*if(set_goto) {

					branch.load_tag_url(href);
				}*/
			//}
		/*} else {
			branch.parse_href(default_route);
		}*/
	},
	set_href: function(href) {
		//branch.load_hash($(this).attr('hash_link'));
		//if(!branch.prevent_setting_url) {
			href = "?path="+btoa(href);
			window.history.replaceState({}, window.title, href); //pushState
		//}
	},
	/*compare_anchors: function(compare_href) {
		var href = "?path="+encodeURIComponent(compare_href);
	},*/
	frame_for_element: function($element) {
		var $parent = $element.parent();
		var found = false;
		while($parent != null) {
			if($parent.hasClass('frame')) {
				return {
					$frame: $parent,
					id: $parent.attr('id')
				};
			}
			$parent = $parent.parent();
		}
		return null;
	},
	/*compare_anchors: function() {
		var current_href = decodeURIComponent(window.location.href.split('?path=')[1]);
		$('a').each(function() {
			var $this = $(this);
			if($this.attr('set_href').indexOf(current_href) != -1) {
				$this.addClass('active_selected');
			}
		});
	},*/
	fix_valid_url: function(current_href) {
		var branch = this;
		var parsed_href = branch.parse_href(current_href, true);
		var parsed_href_copy = [...parsed_href];
		var removed_item = false;
		////console.log('frame-ref', parsed_href_copy);

		var valid_url = branch.is_valid_url(current_href, parsed_href_copy);

		/*if(!valid_url) {
			alert('invalid url, url hase been malformed somehow');
			window.location.href = 'https://noob.software/videogalaxy/noobapps/apps/videogalaxy/index.php';
			return;
		}*/

		for(var parsed_item of parsed_href_copy) {
			
			////console.log('frame-ref', parsed_item);
			var frame_reference_value = branch.root.interpretation.find_frame(parsed_item.frame_id);

			/*if(frame_reference_value == null) {
				//console.log('frame-ref is null', parsed_item.frame_id);
			}*/
			var frame_reference_value_item = branch.root.interpretation.get_page_frame_reference(parsed_item.frame_id);
			////console.log('frame_reference_value--', frame_reference_value_item);
			if((parsed_item.page_id == null || parsed_item.page_id == 'null') && frame_reference_value_item != null) {
				////console.log('frame_reference_value--', frame_reference_value_item);
				parsed_item.page_id = frame_reference_value_item.default_page;
			}
			var page_item = branch.root.interpretation.get_page(parsed_item.page_id);
			if((!valid_url && parsed_item.frame_id > 3)|| (typeof page_item.clean_trailing_url !== 'undefined' || (typeof page_item.clean_trailing_url_on_refresh !== 'undefined' && branch.last_href_value_navigated === null))) {
				var index = parsed_href.map(function(e) {
					return e.page_id;
				}).indexOf(parsed_item.page_id);
				////console.log('trailing index', index);
				if(index != -1) {
					////console.log('trailing index', parsed_href);
					//var additional_href = parsed_href.splice(index
					parsed_href = parsed_href.splice(0, index+1);
					////console.log('trailing index', parsed_href);
				}
			}
			/*if(frame_reference_value == null) { // || frame_reference_value.$frame.parent().parent().length == 0
				var index = parsed_href.map(function(e) {
					return e.frame_id;
				}).indexOf(parsed_item.frame_id);
				parsed_href.splice(index, 1);
				removed_item = true;
			}*/
		}
		//clean_trailing_url
		/*if(removed_item) {
			//console.log('frame-ref', parsed_href);
		}*/

		/*if(!Array.isArray(page)) {
			page = [page];
		}
		if(!Array.isArray(target_frame)) {
			target_frame = [target_frame]
		}
		if(!Array.isArray(dynamic)) {
			dynamic = [dynamic]
		}
		if(!Array.isArray(get_data)) {
			get_data = [get_data]
		}*/
		/*var set_index_value = -1;
		for(i in page) {
			var set_reference_key = -1;
			for(href_reference_key in parsed_href) {
				var href_reference = parsed_href[href_reference_key];
				if(href_reference.frame_id == target_frame[i]) {
					set_reference_key = href_reference_key;
					set_index_value = set_reference_key;
				}
			}

			var set_get_data_value = get_data[i];
			if(typeof input.apply_get_to_all !== 'undefined') {
				set_get_data_value = get_data[0];
			}
			if(set_reference_key != -1) {
				parsed_href[set_reference_key].page_id = page[i];

				if(typeof input.persist_previous_get_data !== 'undefined') { // && Object.keys(set_get_data_value).length == 0
					Object.assign(parsed_href[set_reference_key].get_data, set_get_data_value);
				} else {
					parsed_href[set_reference_key].get_data = set_get_data_value;
				}
			} else {
		}
		var prevent_default = true;
		if(typeof input.clear_after_set_frame !== 'undefined' && input.clear_after_set_frame && set_index_value != -1) {
			//alert(input.clear_after_set_frame + ' '+page );
			//prevent_default = false;
			parsed_href.splice(set_index_value+1, parsed_href.length - set_index_value+1);
			//alert(JSON.stringify(parsed_href));
		}*/
		set_href = branch.href_to_string(parsed_href);
		return set_href;
	},
	navigate_to: function(target_page, target_frame, send_data) {
		var branch = this;
		branch.generate_href({
			page: target_page,
			get_data: send_data,
			target_frame: target_frame,
			navigate_to: true
		});
	},
	generate_href: function(input) {
		var branch = this;
		var $element = null;
		var set_input_value = [];


		/*if(Array.isArray(input.page)) {

		}*/
		//if(input.page
		if(typeof input.$element !== 'undefined') {
			$element = input.$element;
		} else {
			$element = $('<a></a>');
			//$('body').append($element);
			//$element.hide();
			//input.destroy_after = true;
		}

		var reset_all = false;
		if(typeof input.reset_all !== 'undefined') {
			reset_all = true;
		}

		if($element.get(0).tagName.toLowerCase() != 'a') {
			$element.wrap('<a></a>');
			$element = $element.parent();
		}
		/*if(!Array.isArray(input)) {
			input = [input];
		}*/
		var reset_link_href_callback = function() {
			var page = null;
			var set_tag = null;

			if(typeof input.get_data !== 'undefined') {
				if(typeof input.get_data.id !== 'undefined' && Object.keys(input.get_data).length === 1) {
					/*var tags_page = branch.root.global_tags.page_index[branch.root.global_tags.tags[part].type].page;
					var send_data = {
						id: branch.root.global_tags.tags[part].id
					};*/
					var tag_title = branch.root.global_tags.titles[input.get_data.id];
					var tags_page = null;
					if(typeof tag_title !== 'undefined') {
						tags_page = branch.root.global_tags.page_index[branch.root.global_tags.tags[tag_title].type].page;
					}
					if(typeof tag_title !== 'undefined' && (typeof input.page === 'undefined' || tags_page == input.page)) {
						set_tag = tag_title;

						if(/*typeof input.set_href_to === 'undefined' &&*/ typeof input.navigate_to === 'undefined' || input.navigate_to == false) {
							var target_frame = 3;
							var href = '?path=goto['+set_tag+']';
							//var href = 'goto['+set_tag+']';

							$element.attr('target_frame', target_frame)
							//$element.attr('target_frame', target_frame)
							$element.attr('href', href);
							//$element.attr('set_href', set_href);
							//$element.attr('dynamic', dynamic);
							$element.off('click.navigate').on('click.navigate', function(e) {
								var $this = $(this);
								//alert('click and prevent');
								console.log('clicked', $this.attr('set_href'));
								console.log(e);
								//alert('click proper');
								if((typeof e.metaKey === 'undefined' || !e.metaKey)) { //&& prevent_default
									if(typeof e.preventDefault !== 'undefined') {
										e.preventDefault();
									}
									console.log('go clicked');

									/*if(typeof input.pre_callback !== 'undefined' && input.pre_callback != null) {
										input.pre_callback();
									}*/
									branch.load_tag_url(href);
									window.history.pushState({}, window.title, href);
									//alert($this.attr('href')+' - '+e.namespace+' - '+e.type+' - '+e.currentTarget);
									/*if(e.namespace == 'navigate') {*/
										//alert('navigate');
										
										//var set_href = atob($this.attr('set_href'));
										/*var set_href = $this.attr('set_href');
										var href = $this.attr('href');

										////////console.log(set_href);
										//e.stopPropagation();
										branch.current_href = href;
										//if(!branch.prevent_setting_url) {
										//}
										//window.history.replaceState({}, window.title, href);
										//alert(set_href);
										if(typeof input.callback !== 'undefined') {
											branch.post_navigation_callbacks.push(input.callback);
										}
										branch.parse_href(set_href, false, target_frame); //, input
										if(typeof input.post_callback !== 'undefined' && input.post_callback != null) {
											input.post_callback();
										}*/
									//}
									//alert('navigate');
									//return false;
									return false;
								}/* else {
									alert('goto href:'+set_href);
								}*/
							});
							return;
						}
					}
				}
			}

			if(typeof input.page !== 'undefined') {
				page = input.page;
			}
			var target_frame = 'self';
			if(typeof input.target_frame !== 'undefined') {
				target_frame = input.target_frame;
			}
			var frame_item = null;
			if(target_frame == 'self') { // || (page == 'self' && frame_item == null && )
				if(typeof input.$element_reference !== 'undefined') {
					frame_item = branch.frame_for_element(input.$element_reference);
				} else {
					frame_item = branch.frame_for_element($element);
				}
				if(frame_item != null) {
					target_frame = frame_item.id;
				}
			}
			if(page == 'self') {
				if(frame_item == null && typeof input.$element_reference !== 'undefined') {
					frame_item = branch.frame_for_element(input.$element_reference);
				} else {
					alert('no frame');
					return;
				}
				page = frame_item.$frame.find('.page').first().attr('id');
				////console.log('page: ', page, frame_item);
				//return;
			}
			var dynamic = true;
			if(typeof input.dynamic !== 'undefined') {
				dynamic = input.dynamic;
			}

			var get_data = {};
			if(typeof input.get_data !== 'undefined') {
				get_data = input.get_data;
			}

			var set_href = null;
			////////console.log(window.location.href);
			var current_href = atob(window.location.href.split('?path=')[1]);
			var parsed_href = [];
			if(current_href.indexOf('goto[') !== -1) {
				/*if(typeof branch.last_before_goto !== 'undefined') {
					current_href = branch.last_before_goto;
					current_href = atob(current_href.split('?path=')[1])
					//alert(current_href);
				} else {*/
					current_href = null;
				//}
			}
			if(current_href != null) {
				//var current_href = decodeURIComponent(branch.current_href.split('?path=')[1]);
				/*var*/ parsed_href = branch.parse_href(current_href, true);
				var parsed_href_copy = [...parsed_href];
				var removed_item = false;
				////console.log('frame-ref', parsed_href_copy);

				var valid_url = branch.is_valid_url(current_href, parsed_href_copy);

				/*if(!valid_url) {
					alert('invalid url, url hase been malformed somehow');
					window.location.href = 'https://noob.software/videogalaxy/noobapps/apps/videogalaxy/index.php';
					return;
				}*/

				for(var parsed_item of parsed_href_copy) {
					
					////console.log('frame-ref', parsed_item);
					var frame_reference_value = branch.root.interpretation.find_frame(parsed_item.frame_id);

					/*if(frame_reference_value == null) {
						//console.log('frame-ref is null', parsed_item.frame_id);
					}*/
					var frame_reference_value_item = branch.root.interpretation.get_page_frame_reference(parsed_item.frame_id);
					////console.log('frame_reference_value--', frame_reference_value_item);
					if((parsed_item.page_id == null || parsed_item.page_id == 'null') && frame_reference_value_item != null) {
						////console.log('frame_reference_value--', frame_reference_value_item);
						parsed_item.page_id = frame_reference_value_item.default_page;
					}
					console.log('parsed_item', parsed_item);
					var page_item = branch.root.interpretation.get_page(parsed_item.page_id);

					console.log(page_item);

					var load_mask = {};
					if(typeof input.get_data !== 'undefined') {
						for(var key of Object.keys(input.get_data)) {
							load_mask[key] = key;
						}
					}
					//alert(page_item.page_data);
					if(typeof input.set_href_to !== 'undefined') {
						if(frame_reference_value.active_pages.length > 0) {
							branch.root.interpretation.apply_load_mask(load_mask, frame_reference_value.active_pages[0].page_data, input.get_data, undefined, undefined, true);
							//console.log('frame_reference_value_item', frame_reference_value);
							//console.log('frame_reference_value_item', load_mask, frame_reference_value.active_pages[0].page_data, input.get_data);
						}
					}
					/*if() {

					}*/
					if(typeof page_item.remove_page_url !== 'undefined') {
						var index = parsed_href.map(function(e) {
							return e.page_id;
						}).indexOf(parsed_item.page_id);
						////console.log('trailing index', index);
						if(index != -1) {
							////console.log('trailing index', parsed_href);
							//var additional_href = parsed_href.splice(index
							parsed_href = parsed_href.splice(0, 1);
							////console.log('trailing index', parsed_href);
						}
					} else {
						if((!valid_url && parsed_item.frame_id > 3) || (typeof page_item.clean_trailing_url !== 'undefined' || (typeof page_item.clean_trailing_url_on_refresh !== 'undefined' && branch.last_href_value_navigated === null))) {
							var index = parsed_href.map(function(e) {
								return e.page_id;
							}).indexOf(parsed_item.page_id);
							////console.log('trailing index', index);
							if(index != -1) {
								////console.log('trailing index', parsed_href);
								//var additional_href = parsed_href.splice(index
								parsed_href = parsed_href.splice(0, index+1);
								////console.log('trailing index', parsed_href);
							}
						}
					}
					/*if(frame_reference_value == null) { // || frame_reference_value.$frame.parent().parent().length == 0
						var index = parsed_href.map(function(e) {
							return e.frame_id;
						}).indexOf(parsed_item.frame_id);
						parsed_href.splice(index, 1);
						removed_item = true;
					}*/
				}
			}
			//clean_trailing_url
			/*if(removed_item) {
				//console.log('frame-ref', parsed_href);
			}*/

			if(!Array.isArray(page)) {
				page = [page];
			}
			if(!Array.isArray(target_frame)) {
				target_frame = [target_frame]
			}
			if(!Array.isArray(dynamic)) {
				dynamic = [dynamic]
			}
			if(!Array.isArray(get_data)) {
				get_data = [get_data]
			}
			var set_index_value = -1;
			for(i in page) {
				var set_reference_key = -1;
				for(href_reference_key in parsed_href) {
					var href_reference = parsed_href[href_reference_key];
					if(href_reference.frame_id == target_frame[i]) {
						set_reference_key = href_reference_key;
						set_index_value = set_reference_key;
					}
				}

				var set_get_data_value = get_data[i];
				if(typeof input.apply_get_to_all !== 'undefined') {
					set_get_data_value = get_data[0];
				}
				if(set_reference_key != -1) {
					parsed_href[set_reference_key].page_id = page[i];

					if(typeof input.persist_previous_get_data !== 'undefined') { // && Object.keys(set_get_data_value).length == 0
						Object.assign(parsed_href[set_reference_key].get_data, set_get_data_value);
					} else {
						parsed_href[set_reference_key].get_data = set_get_data_value;
					}
				} else {

					/*if(frame_reference_value != null) {
						if(frame_reference_value.$frame.length > 0) {*/
							var insert_item = {
								frame_id: target_frame[i],
								page_id: page[i],
								get_data: set_get_data_value
							};
							var index = 0;
							for(parsed_item of parsed_href) {
								if(parsed_item.frame_id < target_frame[i]) {
									index++;
								}
							}
							parsed_href.splice(index, 0, insert_item);
						/*}
					}*/
				}
			}
			var prevent_default = true;
			if(typeof input.clear_after_set_frame !== 'undefined' && input.clear_after_set_frame && set_index_value != -1) {
				//alert(input.clear_after_set_frame + ' '+page );
				//prevent_default = false;
				parsed_href.splice(set_index_value+1, parsed_href.length - set_index_value+1);
				//alert(JSON.stringify(parsed_href));
			}
			set_href = branch.href_to_string(parsed_href);

			if(typeof input.navigation_merge !== 'undefined') {
				var last_href = JSON.stringify(set_href);
				var last_href_value = branch.last_href_value; //decodeURIComponent(window.location.href.split('?path=')[1]);//
				if(last_href_value == null) {
					last_href_value = branch.current_href;
				}
				set_href = branch.merge_href(last_href_value, set_href);
				if(JSON.stringify(set_href) == last_href) {
					////console.log('SAME: ', set_href, $element.text());
					//alert('same');
				} else {
					/*$element.addClass('merge_link_href').off('reset_merge').on('reset_merge', function() {
					});*/
					$element.addClass('merge_link_href');
					branch.post_navigation_callbacks.push(function() {
						$('a.merge_link_href').each(function() {
							$(this).trigger('reset_link_href');
						});
					});
				}
				//href = '?path='+encodeURIComponent(set_href);
			}


			var href = "?path="+btoa(set_href);
			/*if(typeof load_object !== 'undefined' && load_object != null) {
				href += '&app='+load_object.app;
			}
			$(this).attr('href', href);*/
			////////console.log(href);
			if(typeof input.set_href_to !== 'undefined') { // && !branch.prevent_setting_url
				if(branch.current_href != href) {
					//pushState
					window.history.replaceState({}, window.title, href);
				}
				branch.current_href = href;
			} else {
				$element.attr('target_frame', target_frame)
				//$element.attr('target_frame', target_frame)
				$element.attr('href', href);
				$element.attr('set_href', set_href);
				$element.attr('dynamic', dynamic);
				$element.off('click.navigate').on('click.navigate', function(e) {
					var $this = $(this);
					//alert('click');
					console.log('clicked', $this.attr('set_href'));
					console.log(e);
					if((typeof e.metaKey === 'undefined' || !e.metaKey) && prevent_default) {
						if(typeof e.preventDefault !== 'undefined') {
							e.preventDefault();
						}
						console.log('go clicked');

						if(typeof input.pre_callback !== 'undefined' && input.pre_callback != null) {
							input.pre_callback();
						}
						//alert($this.attr('href')+' - '+e.namespace+' - '+e.type+' - '+e.currentTarget);
						/*if(e.namespace == 'navigate') {*/
							//alert('navigate');
							
							//var set_href = atob($this.attr('set_href'));
							var set_href = $this.attr('set_href');
							var href = $this.attr('href');

							////////console.log(set_href);
							//e.stopPropagation();
							branch.current_href = href;
							if(!branch.prevent_setting_url) {
								//branch.last_before_goto = href;
								window.history.pushState({}, window.title, href);
							} else {
								if(href.indexOf('goto[') == -1) {
									branch.last_before_goto = href;
								}
							}
							//window.history.replaceState({}, window.title, href);
							//alert(set_href);
							if(typeof input.callback !== 'undefined') {
								branch.post_navigation_callbacks.push(input.callback);
							}
							if(typeof input.highlight_id_callback !== 'undefined') {
								branch.root.interpretation.global_callbacks.push(function() {
									var $highlight_item = $('#'+input.highlight_id_callback).first();
									$highlight_item.closest('.page').first().animate({
										scrollTop: $highlight_item.position().top+'px'
									}, 250, 'easeInOutQuint', function() {

									});
									$highlight_item.addClass('highlight');
									setTimeout(function() {
										$highlight_item.removeClass('highlight');
									}, 550);
								});
							}
							branch.parse_href(set_href, false, target_frame); //, input
							if(typeof input.post_callback !== 'undefined' && input.post_callback != null) {
								input.post_callback();
							}
						//}
						//alert('navigate');
						//return false;
					}/* else {
						alert('goto href:'+set_href);
					}*/
				});
			}
		};
		if(typeof input.set_href_to !== 'undefined') {
			reset_link_href_callback();

			//branch.root.interpretation.apply_load_mask(load_mask, result, self.page_data, undefined, self);
			$('.reload_on_navigation').trigger('reload_element');
		} else {
			if(typeof input.skip_reset === 'undefined') {
				$element.off('reset_link_href').on('reset_link_href', function(e) {
					reset_link_href_callback();
				});
				$element.trigger('reset_link_href');
			} else {
				reset_link_href_callback();
			}
			if(typeof input.navigate_to !== 'undefined' && input.navigate_to) {
				/*if(typeof input.navigate_to_on_reload !== 'undefined') {
					var target_frame = $element.attr('target_frame');
					if($('.frame_'+target_frame).first().find('.page').length == 0) {
						$element.trigger('click');
					}
				} else {*/
					$element.trigger('click');
				//}
				//$element.trigger('click');
				if(typeof input.destroy_after !== 'undefined') {
					$element.remove();
				}
			}
			
		}
		if(typeof input.navigate_to_on_reload !== 'undefined') {
			var target_frame = $element.attr('target_frame');
			branch.post_navigation_callbacks.push(function() {
			//branch.root.interpretation.global_callbacks.push(function() {
				if($('.frame_'+target_frame).first().find('.page').length == 0) {
					$element.trigger('click');
				}
			});
		}
		//var navigate_to_after_load = false;
		if(typeof input.navigate_to_after_load !== 'undefined' && input.navigate_to_after_load === true) {
			//
			////console.log('callbacks---', branch.root.interpretation.global_callbacks);
			//branch.register_navigation_callback(function() {
			branch.post_navigation_callbacks.push(function() {
				branch.root.interpretation.global_callbacks.push(function() {
					//return;
					//alert(decodeURIComponent($element.attr('href')));
					/**/	
					branch.post_navigation_callbacks.push(function() {
						$('a').each(function() {
							$(this).trigger('reset_link_href');
						});
					});

					branch.in_navigate_to = 0;

					var current_href = branch.last_href_value;
					if(current_href == null) {
						current_href = atob(window.location.href.split('?path=')[1]);
					}
					if(typeof input.navigation_merge !== 'undefined') {

						/*if(typeof input.navigate_to_on_reload !== 'undefined') {
							alert($('.frame_'+target_frame).first().find('.page').length);

						}*/
						////console.log('last set href merge_href', current_href);
						var set_href = branch.merge_href(current_href, $element.attr('href'));
						//console.log('navigate_to last set href merge_href', set_href);
						branch.last_href_value = set_href;
						//return;
						//window.history.pushState({}, window.title, href);
						//}
						//window.history.replaceState({}, window.title, href);
						//alert(set_href);
						/*if(typeof input.callback !== 'undefined') {
							branch.post_navigation_callbacks.push(input.callback);
						}*/
						//window.history.pushState({}, window.title, '?path='+encodeURIComponent(set_href));
						branch.parse_href(set_href, false, $element.attr('target_frame')); // $element.attr('target_frame')
						//branch.last_href_value = set_href;
					} else {
						
						/*if(typeof input.navigate_to_on_reload !== 'undefined') {
							//alert($('.frame_'+target_frame).first().find('.page').length);
							if($('.frame_'+target_frame).first().find('.page').length == 0) {
								$element.trigger('click');
							}
						} else {*/
							$element.trigger('click');
						//}
					}
					$('a').each(function() {
						$(this).trigger('reset_link_href');
					});
					branch.in_navigate_to = -1;
					//$element.trigger('click');
				});
			});
			/*if(branch.root.interpretation.global_callback_called) {
				if(branch.post_navigation_callbacks.length > 0) {
					alert('global called');
					var set_callbacks = branch.post_navigation_callbacks;
					branch.post_navigation_callbacks = [];
					for(var callback of set_callbacks) {
						callback();
					}
					//window.reload();
				}
			}*/
			/*branch.register_navigation_callback(function() {
				$element.trigger('click');
			});*/	
		} 
	},
	merge_href: function(old_href, new_href) {
		var branch = this;
		var href_old = branch.parse_href_values(old_href);
		var href_new = branch.parse_href_values(new_href);

		////console.log('merge_href', href_old, href_new);
		////console.log(href_new);

		var href_old_index = {};

		for(var href_reference of href_old) {
			href_old_index[href_reference.frame_id] = href_reference;
		}

		for(var href_reference of href_new) {
			href_old_index[href_reference.frame_id] = href_reference;
		}

		//alert(JSON.stringify(href_old_index));
		////console.log(href_old_index);
		var set_href = branch.href_to_string(Object.values(href_old_index));
		////console.log(set_href);
		return set_href;

		//return old_href;
	},
	current_href: window.location.href,
	last_href: null,
	/*register_links: function($container) {
		////////console.log('register');
		$('.active_selected').removeClass('active_selected');
		var current_href = decodeURIComponent(window.location.href.split('?path=')[1]);
		//var longest_match = null;
		$container.find('a').each(function() {
			var $this = $(this);
			var dynamic = $this.attr('dynamic');
			//////////console.log('set', dynamic);
			if(typeof dynamic !== 'undefined' && dynamic == 'true') {
				$this.trigger('reset_link_href');
				////////console.log('trigger');
			}
			if(typeof $this.attr('set_href') !== 'undefined' && ($this.attr('set_href') == current_href)) { // || $this.attr('set_href').indexOf(current_href) != -1
				//setTimeout(function() {
					$this.children().first().addClass('active_selected').trigger('mouseup.sub_items');
				//}, 1);
			}
		});
		//$('a').each(function() {
			
		//});
	},*/

	register_links: function($container) {
		var branch = this;
		////////console.log('register');
		$('.active_selected').removeClass('active_selected');
		var current_href = atob(window.location.href.split('?path=')[1]);
		/*if(current_href.indexOf('goto[') != -1) {
			//current_href = branch.last_before_goto;
			//return;
		}*/
		//var longest_match = null;
		$container.find('a').each(function() {
			var $this = $(this);
			if($this.hasClass('set_href_value')/* && typeof $this.attr('set_href') !== 'undefined'*/) {
				$this.removeClass('set_href_value');
				$this.off('click.navigate').on('click.navigate', function(e) {
					var $this = $(this);
					//alert('click');
					console.log('clicked', $this.attr('set_href'));
					//alert($this.attr('href')+$this.attr('set_href'));
					//alert('clicked');
					if(!e.metaKey) {
						e.preventDefault();
						var href = $this.attr('href');
						if(href.indexOf('goto[') !== -1) {
							branch.load_tag_url(href);
							return false;
						}
						//alert($this.attr('href')+' - '+e.namespace+' - '+e.type+' - '+e.currentTarget);
						/*if(e.namespace == 'navigate') {*/
							//alert('navigate');
							var set_href = atob($this.attr('set_href'));
							/*if(typeof $this.attr('href') === 'undefined' || $this.attr('href') == null) {
								$this.attr('href', '?path='+encodeURIComponent(set_href));
							}*/
							var href = $this.attr('href');

							////////console.log(set_href);
							//e.stopPropagation();
							branch.current_href = href;


							if(!branch.prevent_setting_url) {
								//branch.last_before_goto = href;
								window.history.pushState({}, window.title, href);
							} else {
								if(href.indexOf('goto[') == -1) {
									branch.last_before_goto = href;
								}
							}
							//if(!branch.prevent_setting_url) {
								//window.history.pushState({}, window.title, href);
							/*} else {

							}*/
							//window.history.replaceState({}, window.title, href);
							//alert(set_href);
							/*if(typeof input.callback !== 'undefined') {
								branch.post_navigation_callbacks.push(input.callback);
							}*/
							branch.parse_href(set_href, false, undefined); //, input
						//}
						//alert('navigate');
						//return false;
					}/* else {
						alert('goto href:'+set_href);
					}*/
				});
			}
			var dynamic = $this.attr('dynamic');
			//////////console.log('set', dynamic);
			if(typeof dynamic !== 'undefined' && dynamic == 'true') {
				//$this.trigger('reset_link_href');
				////////console.log('trigger');
			}
			if(typeof $this.attr('set_href') !== 'undefined' && branch.is_match($this.attr('set_href'), current_href)) { 
			// && (($this.attr('set_href') == current_href) || $this.attr('set_href').indexOf(current_href) != -1)) { // 
				//setTimeout(function() {
					$this.children().first().addClass('active_selected').trigger('mouseup.sub_items');
				//}, 1);
			}
		});

		$container.find('.default_first_active_selected').each(function() {
			var $item = $(this);
			if($item.find('.active_selected').length == 0) { //einnig haegt ad skilgreina children sem potential_active_selected
				var $potential = $item.find('.potential_active_selected');
				if($potential.length > 0) {
					$potential.first().addClass('active_selected');
				} else {
					$item.children().first().addClass('active_selected');
				}
			}
		});
		//$('a').each(function() {
			
		//});
	},
	is_match: function(value, b) {
		value = value.split(':').join('').split(';').join('');
		b = b.split(':').join('').split(';').join('');
		if((value == b) || b.indexOf(value) != -1) { //) { // 
			return true;
		}
		return false;
	},
	reload_current_href: function() {
		this.parse_href();
	},	
	href_to_string: function(href_object) {
		var branch = this;
		var set_string = '';
		var frame_strings = [];
		for(parsed_item of href_object) {
			if(parsed_item.page_id == null) {
				//console.log('frame-ref', parsed_item);
			}
			var frame_string = parsed_item.frame_id+':'+parsed_item.page_id+':';
			var count = 0;
			if(typeof parsed_item.get_data !== 'undefined') {
				for(get_data_item of Object.keys(parsed_item.get_data)) {
					if(count > 0) {
						frame_string += '&';
					}
					frame_string += get_data_item+'='+encodeURIComponent(parsed_item.get_data[get_data_item]); //.split(' ').join('%20')
					count++; 
				}
			}
			frame_strings.push(frame_string);
		}
		var result = frame_strings.join(';');
		if(result.lastIndexOf(';') != result.length-1) {
			result += ';';
		}
		return result;
	},
	navigate_back: function() {
		history.back();
	},
	last_target_href_frame: null,
	last_load: [],
	/*is_well_formed: function(href) {
		var branch = this;

	},*/
	navigation_callbacks: [],
	register_navigation_callback: function(callback) {
		var branch = this;
		branch.navigation_callbacks.push(callback);
	},
	set_href_and_go: function(set_href) {
		var branch = this;
		var href = "?path="+btoa(set_href);
		//branch.current_href = set_href;
		window.history.replaceState({}, window.title, href);
		//alert(set_href);
		//branch.last_href = null;
		branch.parse_href(set_href);
	},
	clean_url: function(invalid_frame) {
		var branch = this;
		var href = atob(window.location.href.split('?path=')[1]);
		var hash_default_split = href.split(';');
		var remove = false;
		//alert(hash_default_split);
		for(var split_value of hash_default_split) {
			var split = split_value.split(':');
			var frame_id = split[0];
			////console.log('clean url', frame_id, invalid_frame);
			if(frame_id == invalid_frame || remove) {
				remove = true;
				var counter = hash_default_split.indexOf(split_value);
				hash_default_split.splice(counter, 1);
				//branch.root.interpretation.remove_frame(frame_id);
			}
		}
		var href_value = hash_default_split.join(';');
		self.set_next_href_value = href_value;
		//var href_value = '?path='+encodeURIComponent(hash_default_split.join(';'));
		//window.location.replace(href_value);
		return href_value;
	},
	check_default_page: function(href) {
		var branch = this;
		if(typeof href === 'undefined') {
			href = atob(window.location.href.split('?path=')[1]);
		}
		/*alert('test1');
		return href;*/
		var $bottom_frame = branch.root.interpretation.get_bottom_frame();
		//alert($bottom_frame.attr('id'));
		var hash_default_split = href.split(';');
		if(hash_default_split[hash_default_split.length-1].trim().length == 0) {
			hash_default_split.splice(hash_default_split.length-1, 1);
		}
		var split_length = hash_default_split.length;
		/*////console.log(hash_default_split.length, $bottom_frame.attr('level'));
		////console.log(branch.previous_hash_value);
		////console.log(branch.hash_value);*/
		//if(typeof $bottom_frame.attr('default_page') !== 'undefined' && (branch.refresh || branch.previous_hash_value != branch.hash_value) && hash_default_split.length == $bottom_frame.attr('level')) {
		//alert('frame length and default page '+$bottom_frame.length+' - '+$bottom_frame.attr('default_page'));
		//alert('split length: '+split_length+' - '+$bottom_frame.attr('level'));
		//alert(hash_default_split.length)
		////console.log('bottomframe', $bottom_frame.attr('default_page'), $bottom_frame.attr('level'), hash_default_split, split_length);
		if(typeof $bottom_frame.attr('default_page') !== 'undefined' && split_length == $bottom_frame.attr('level')) {
			var href = href+""+$bottom_frame.attr('id')+':'+$bottom_frame.attr('default_page')+':;';
			branch.set_href_and_go(href, false);
			return true;
		}
		return false;
	},
	frame_reference_value: function(frame_id) {
		var branch = this;
		var href_references = branch.parse_href_values();

		for(var href_reference of href_references) {
			if(href_reference.frame_id == frame_id) {
				return href_reference;
			}
		}
		return null;
	},
	parse_href_values: function(href, return_parse, target_frame, input) {
		//////////console.log('parse href', href);
		var branch = this;
		if(typeof href === 'undefined') {
			href = atob(window.location.href.split('?path=')[1]);
		}
		if(href.indexOf('?path=') === 0) {
			href = atob(href.split('?path=')[1]);
		}
		/*if(typeof target_frame !== 'undefined') {
			branch.last_target_href_frame = target_frame;
		}*/
		var last_parsed = null;
		if(typeof return_parse === 'undefined' || return_parse == false) {
			var last_href = branch.last_href;
			branch.last_href = href;
			if(last_href != null) {
				last_parsed = branch.parse_href(last_href, true);
			}
		}
		var frame_split = href.split(';')
		var href_references = [];
		for(i in frame_split) {
			if(frame_split[i] != null && frame_split[i].length > 0) {
				var split_value = frame_split[i];
				split_value = split_value.split(':');
				var href_reference = {
					frame_id: split_value[0],
					page_id: split_value[1]
				};
				if(split_value.length > 2) {
					var get_data_split = split_value[2].split('&');
					
					href_reference.get_data = {};
					for(get_data_item of get_data_split) {
						if(get_data_item.indexOf('=') != -1) {
							var get_item_split = get_data_item.split('=');
							href_reference.get_data[get_item_split[0]] = (get_item_split[1]);
						}
					}
				}
				href_references.push(href_reference);
				//////console.log(JSON.stringify(href_reference));
			}
		}
		return href_references;
	},
	is_valid_url: function(href, href_references_set) {
		var branch = this;
		var href_references = href_references_set;
		if(typeof href_references_set === 'undefined') {
			href_references = branch.parse_href(href, true);
		}
		var valid_url = true;
		if(typeof branch.root.definition.routes.everyone.allowed_routes !== 'undefined') {
			var allowed_routes = {...branch.root.definition.routes.everyone.allowed_routes};
			var set_routes = {};
			for(var href_ref_item of href_references) {
				var frame_id = parseInt(href_ref_item.frame_id);
				if(typeof allowed_routes[frame_id] !== 'undefined' && typeof href_ref_item.page_id !== 'undefined') {
					if(Array.isArray(allowed_routes[frame_id])) {
						if(allowed_routes[frame_id].indexOf(href_ref_item.page_id) != -1) {

						} else {
							valid_url = false;
						}
					} else {
						if(allowed_routes[frame_id] == '*' || allowed_routes[frame_id] == href_ref_item.page_id) {

						} else {
							alert('href_ref_item'+href_ref_item.page_id);
							//alert( allowed_routes[frame_id].);
							valid_url = false;
						}
					}
				} else {
					//alert('allowed_routes'+allowed_routes[frame_id]);
					//valid_url = false;
				}
				if(typeof set_routes[frame_id] === 'undefined') {
					set_routes[frame_id] = href_ref_item.page_id;
				} else {
					valid_url = false;
				}
			}
			if(valid_url) {
				for(var href_ref_item of href_references) {
					var frame_id = parseInt(href_ref_item.frame_id);
					if(typeof branch.root.definition.routes.everyone.allowed_routes_constraints[frame_id] !== 'undefined') {
					//if(valid_url) {
						var constraint = branch.root.definition.routes.everyone.allowed_routes_constraints[frame_id];
					//}
						if(set_routes[frame_id] == constraint.set_page) {
							for(var key of Object.keys(constraint.set_frames)) {
								if(typeof set_routes[key] !== 'undefined') {
									//console.log(set_routes[key]);
									//console.log(constraint.set_frames[key]);
									if(set_routes[key] == constraint.set_frames[key]) {

									} else {
										//alert('not same : '+set_routes[key]+' '+constraint.set_frames[key]);
										valid_url = false;
									}
								}
							}
						}
					}
				}
			}
		}
		if(typeof branch.root.definition.routes.everyone.allowed_routes_callback !== 'undefined') {
			valid_url = branch.root.definition.routes.everyone.allowed_routes_callback(href);
		}
		return valid_url;
	},
	last_href_value: null,
	post_navigation_callbacks: [],
	last_href_value_navigated: null,
	/*last_navigated: null,
	reload_*/
	/*parse_href_index: null,
	parse_href: function(href, return_parse, target_frame, input) {
		var branch = this;
		var input = JSON.stringify([href, return_parse, target_frame, input]);
		if(typeof branch.parse_href_index[input] !== 'undefined') {
			return branch.parse_href_index[input];
		}
		var res = this.parse_href_sub(href, return_parse, target_frame, input);
		branch.parse_href_index[input] = res;
		return res;
	},*/
	parse_href: function(href, return_parse, target_frame, input) {
		//console.log('parsehref href-----', href);
		var branch = this;
		/*if(branch.in_navigate_to != -1) {
			if(branch.in_navigate_to > 0) {
				return;
			}
			branch.in_navigate_to++;
		}*/
		console.log('parse href', href, return_parse, target_frame, input);
		if(typeof href === 'undefined') {
			href = atob(window.location.href.split('?path=')[1]);
			/*if(href.indexOf('goto[') !== -1) {
				href = branch.last_href;
			}*/
		} else {
			/*if(href == branch.last_href_value) {
				return;
			}*/
		}
		/*if(typeof target_frame !== 'undefined') {
			this.last_navigated = href;
		}*/

		/*if(typeof target_frame !== 'undefined') {
			branch.last_target_href_frame = target_frame;
		}*/
		var last_parsed = null;
		if(typeof return_parse === 'undefined' || return_parse == false) {
			var last_href = branch.last_href;
			branch.last_href = href;
			if(last_href != null) {
				last_parsed = branch.parse_href(last_href, true);
			}
		}
		//console.log('continue', return_parse);
		/*if(href == null) {
			return;
		}*/
		var frame_split = href.split(';')
		//console.log('href parse--', frame_split);
		var href_references = [];
		for(var i in frame_split) {
			if(frame_split[i] != null && frame_split[i].length > 0) {
				var split_value = frame_split[i];
				split_value = split_value.split(':');
				////console.log('frame-ref', frame_split[i], split_value);
				var href_reference = {
					frame_id: split_value[0],
					page_id: split_value[1]
				};
				var frame_reference_value_item = branch.root.interpretation.get_page_frame_reference(href_reference.frame_id);
				////console.log('frame_reference_value--', frame_reference_value_item);
				if((href_reference.page_id == null || href_reference.page_id == 'null') && frame_reference_value_item != null) {
					////console.log('frame_reference_value--', frame_reference_value_item);
					href_reference.page_id = frame_reference_value_item.default_page;
					//alert(href_reference.page_id);
				}
				if(split_value.length > 2) {
					var get_data_split = split_value[2].split('&');
					
					href_reference.get_data = {};
					for(get_data_item of get_data_split) {
						if(get_data_item.indexOf('=') != -1) {
							var get_item_split = get_data_item.split('=');
							href_reference.get_data[get_item_split[0]] = decodeURIComponent(get_item_split[1]);
						}
					}
				}
				////console.log('frame-ref', href_reference);
				href_references.push(href_reference);
				//////console.log(JSON.stringify(href_reference));
			}
		}

		if(typeof return_parse === 'undefined' || return_parse == false) {
			/*var valid_url = true;
			if(typeof branch.root.definition.routes.everyone.allowed_routes !== 'undefined') {
				var allowed_routes = {...branch.root.definition.routes.everyone.allowed_routes};
				var set_routes = {};
				for(var href_ref_item of href_references) {
					var frame_id = parseInt(href_ref_item.frame_id);
					if(typeof allowed_routes[frame_id] !== 'undefined' && typeof href_ref_item.page_id !== 'undefined') {
						if(Array.isArray(allowed_routes[frame_id])) {
							if(allowed_routes[frame_id].indexOf(href_ref_item.page_id) != -1) {

							} else {
								valid_url = false;
							}
						} else {
							if(allowed_routes[frame_id] == '*' || allowed_routes[frame_id] == href_ref_item.page_id) {

							} else {
								alert('href_ref_item'+href_ref_item.page_id);
								//alert( allowed_routes[frame_id].);
								valid_url = false;
							}
						}
					} else {
						//alert('allowed_routes'+allowed_routes[frame_id]);
						//valid_url = false;
					}
					if(typeof set_routes[frame_id] === 'undefined') {
						set_routes[frame_id] = href_ref_item.page_id;
					} else {
						valid_url = false;
					}
				}
				if(valid_url) {
					for(var href_ref_item of href_references) {
						var frame_id = parseInt(href_ref_item.frame_id);
						if(typeof branch.root.definition.routes.everyone.allowed_routes_constraints[frame_id] !== 'undefined') {
						//if(valid_url) {
							var constraint = branch.root.definition.routes.everyone.allowed_routes_constraints[frame_id];
						//}
							if(set_routes[frame_id] == constraint.set_page) {
								for(var key of Object.keys(constraint.set_frames)) {
									if(typeof set_routes[key] !== 'undefined') {
										//console.log(set_routes[key]);
										//console.log(constraint.set_frames[key]);
										if(set_routes[key] == constraint.set_frames[key]) {

										} else {
											//alert('not same : '+set_routes[key]+' '+constraint.set_frames[key]);
											valid_url = false;
										}
									}
								}
							}
						}
					}
				}
				//alert(JSON.stringify(href_references));
			}*/

		}
		var reset_href_value_in_url = false;
		var removed = false;
		var href_copy = [...href_references];
		for(var parsed_item of href_copy) {
			////console.log('frame-ref', parsed_item);

			var frame_reference_value = branch.root.interpretation.find_frame(parsed_item.frame_id);

			
			/*if(frame_reference_value != null && frame_reference_value.$frame.parent().parent().length == 0) {
				////console.log('frame not found', parsed_item.frame_id);
				//alert(href_references.indexOf(parsed_item));
				var index = href_references.map(function(e) {
					return e.frame_id;
				}).indexOf(parsed_item.frame_id);
				href_references.splice(index, 1);
				removed = true;
			}*/
		}
		////console.log('frame-ref', href_references);
		if(typeof return_parse !== 'undefined' && return_parse == true) {
			return href_references;
		}

		for(var parsed_item of href_references) {
			var page_item = branch.root.interpretation.get_page(parsed_item.page_id);
			console.log('set page id value: ', page_item, parsed_item.page_id, parsed_item);
			//typeof page_item.clean_trailing_url !== 'undefined' || 
			if(typeof page_item.remove_page_url !== 'undefined') {
				var index = href_references.map(function(e) {
					return e.page_id;
				}).indexOf(parsed_item.page_id);
				////console.log('trailing index', index);
				if(index != -1) {
					////console.log('trailing index', parsed_href);
					//var additional_href = parsed_href.splice(index
					href_references.splice(index, 1);
					////console.log('trailing index', parsed_href);
				}
			} else {
				if(page_item != null && (typeof page_item.clean_trailing_url_on_refresh !== 'undefined' && branch.last_href_value_navigated === null)) {
					var index = href_references.map(function(e) {
						return e.page_id;
					}).indexOf(parsed_item.page_id);
					//console.log('trailing index', index);
					if(index != -1) {
						//console.log('trailing index', href_references);
						href_references = href_references.splice(0, index+1);
						//console.log('trailing index', href_references);
						reset_href_value_in_url = true;
					}
				}
			}
			if(typeof page_item.set_frame !== 'undefined' && parsed_item.frame_id != page_item.set_frame) {
				parsed_item.frame_id = page_item.set_frame;
				reset_href_value_in_url = true;
			}
		}

		//console.log('href parse--', href_references);
		/*if(branch.last_href_value != null) {
			$('.frame').each(function() {
				var $this = $(this);
				var frame = branch.root.interpretation.find_frame($this.attr('id'));
				//console.log('frame--', frame, href_references, frame.active_pages);
				if(frame != null) {
					var index = href_references.map(function(e) {
						return e.frame_id+'';
					}).indexOf(frame.id+'');
					//console.log('remove frame', frame, index);
					if(index === -1) {
						$this.remove();
					}
				} else {
					//console.log('frame----', frame, frame.$frame, frame.$frame.parent().length, frame.$frame.parent().parent().length);
				}
			});
		}*/
		branch.last_href_value = href;
		if(href != null) {
			//console.log('sethref-', href);
			branch.last_href_value_navigated = href;
		}
		/*if(removed) {
			alert(branch.href_to_string(href_references));
			//this.parse_href(branch.href_to_string(href_references));
			return false;
		}*/
		if(last_parsed != null) {
			/*alert(JSON.stringify(last_parsed));
			alert(JSON.stringify(href_references));*/
			var last_parsed_index = 0;
			for(i in last_parsed) {
				if(last_parsed_index < href_references.length) {
					var last_parsed_item = last_parsed[i];
					var next_parsed = href_references[i];
					if(last_parsed_item.page_id != next_parsed.page_id) {
						target_frame = last_parsed_item.frame_id;
					}
				}
				last_parsed_index++;
			}
		}
		/*var set_href_value_string = branch.href_to_string(href_references);

		//console.log('href_reference', href_references);*/

		

		var stringified = branch.href_to_string(href_references);//JSON.stringify(href_references);
		if(reset_href_value_in_url) {
			//window.history.pushState({}, window.title, '?path='+encodeURIComponent(stringified));
			window.history.replaceState({}, window.title, '?path='+btoa(stringified));
			this.reload_current_href();
			//}
			//window.history.replaceState({}, window.title, href);
			//alert(set_href);
			/*if(typeof input.callback !== 'undefined') {
				branch.post_navigation_callbacks.push(input.callback);
			}*/
			//branch.parse_href(stringified, false, target_frame);
			return;
			//window.location.href = '?path='+encodeURIComponent(stringified);
		}
		////console.log('stringified', stringified, branch.last_stringified);
		if(branch.last_stringified == stringified) {
			//branch.in_navigate_to
			//alert('same');
			//return;
		}
		branch.last_stringified = stringified;

		var href_callback = function(send_data) {
			var continue_callback = {};
			var href_reference = href_references.shift();
			/*if(typeof input !== 'undefined' && typeof input.clear_after_set_frame !== 'undefined') {
				href_references.reset_frames = true;
			}*/
			if(href_references.length > 0) {
				/*continue_callback = {
					callback: function() {
						href_callback();
					}
				};*/
				continue_callback.callback = function(send_data) {
					href_callback(send_data);
				};
			} else {
				////console.log('set set_href_value_string', set_href_value_string);

				continue_callback.post_callback = function() {
					var callbacks = branch.post_navigation_callbacks;
					branch.post_navigation_callbacks = [];
					for(var callback of callbacks) {
						callback();
					}
				};
				//last_set_href_callback_string = null;
			}
			/* else {
				continue_callback.callback = function(data) {

					branch.check_default_page(href);
				};
			}*//*else {

				if(branch.check_default_page(href)) {
					return;
				}
				continue_callback.callback = function(send_data) {
					alert(JSON.stringify(Object.keys(send_data)));
				};
			}*/
			if(typeof send_data !== 'undefined' && typeof send_data.pre_active_pages !== 'undefined') {
				continue_callback.pre_active_pages = send_data.pre_active_pages;
				//////////console.log('set-- pre_active_pages', send_data.pre_active_pages);
			}
			if(typeof send_data !== 'undefined' && typeof send_data.pages_to_display !== 'undefined') {
				continue_callback.pages_to_display = send_data.pages_to_display;
				//////////console.log('set-- pages_to_display', send_data.pages_to_display);
			}
			if(typeof target_frame !== 'undefined') {
				continue_callback.href_target_frame = target_frame;
			}

			//////////console.log(continue_callback);
			//////////console.log(href_reference);'
			//var json_compare = JSON.stringify(href_reference);
			var switch_to_page = true
			/*if(typeof branch.last_load[href_reference.target_frame] !== 'undefined') {
				if(branch.last_load[href_reference.target_frame] == json_compare) {
					alert('cancel: '+branch.last_load[href_reference.target_frame]+' - '+json_compare);
					//switch_to_page = false;
				}
			}*/
			if(switch_to_page) {
				//alert('switch to page'+ JSON.stringify(href_reference));
				////console.log('parsehref - switch-to-page', href_reference);
				for(callback of branch.navigation_callbacks) {
					callback(href_reference);
				}
				if(last_href != null) {
					branch.root.interpretation.call_pre_navigation_callbacks(function() {
						var res = branch.root.interpretation.switch_to_page(href_reference, continue_callback);
						if(res == false) {
							branch.reset_href();
						}
					});
				} else {
					var res = branch.root.interpretation.switch_to_page(href_reference, continue_callback);
					if(res == false) {
						branch.reset_href();
					}
				}
				//navigation_callback_main();
				/*if() {
				}*/
				//branch.last_load[href_reference.target_frame] = json_compare;
			}
		};


		/*//console.log('set_href_value_string', set_href_value_string, '---', branch.last_set_href_callback_string);
		if(branch.last_set_href_callback_string == set_href_value_string) {
			return;
		}
		branch.last_set_href_callback_string = set_href_value_string;*/

		//var navigation_callback_main = function() {
			href_callback();
		/*};
		branch.root.interpretation.call_pre_navigation_callbacks(navigation_callback_main);*/
	},
	reset_href: function() {
		var branch = this;
		//alert('reset href');
		var $bottom_frame = branch.root.interpretation.get_bottom_frame();
		var frame_id = $bottom_frame.attr('id');
		////console.log(branch.root.interpretation.find_frame(frame_id).active_pages[0].page_reference.id);
		if(branch.root.interpretation.find_frame(frame_id).active_pages.length == 0) {
			return;
		}
		branch.generate_href({
			target_frame: 'self',
			reset_all: true,
			target_page: branch.root.interpretation.find_frame(frame_id).active_pages[0].page_reference.id,
			$element_reference: $bottom_frame.children().first(),
			set_href_to: true
		});
		//alert('reset');
	},
	last_set_href_callback_string: null,
	navigation_callback_completed: [],
	set_next_navigation_callback: function(callback) {
		this.navigation_callback_completed.push(callback);
	},
	/*register_anchors: function() {
		var branch = this;
		if(typeof branch.root.use_links === 'undefined') {
			//////////console.log('return----');
			return;
		}
		clearTimeout(branch.register_anchors_timeout);
		branch.register_anchors_timeout = setTimeout(function() {
			$('a:not(.registered)').each(function() {
				var $this = $(this);
				if(typeof $(this).attr('href') !== 'undefined' && $(this).attr('href').indexOf('#') == 0  && $(this).attr('href').indexOf('https') === -1) {
					$(this).addClass('registered');
					var href = $(this).attr('href');
					var hash = href;
					$(this).attr('hash_link', hash);
					var href = "?path="+encodeURIComponent(hash);
					if(typeof load_object !== 'undefined' && load_object != null) {
						href += '&app='+load_object.app;
					}
					$(this).attr('href', href);
					$(this).click(function(e) {
						if(!e.metaKey) {
							e.preventDefault();
							branch.load_hash($(this).attr('hash_link'));
							window.history.pushState({}, window.title, $(this).attr('href'));
						}
					});
				}
			});
			clearTimeout(branch.register_selected_timeout);
			branch.register_selected_timeout = setTimeout(function() {
				$('a').each(function() {
					var $this = $(this);
					var href = $this.attr('hash_link');
					if(typeof href !== 'undefined') {
						var $div = null;
						if($this.find('div').length > 0) {
							$div = $this.find('div').first();
						} else {
							$div = $this.parent();
						}
						$div.removeClass('selected');
						if(branch.compare_anchors(href)) {
							$div.addClass('selected');
						}
					}
				});
			}, 250);
		}, 50);
	},*/
};