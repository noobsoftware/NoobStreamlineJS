app.interpretation = {
	base_frame: {
		id: 0,
		$frame: null,
		active_pages: [],
		sub_frames: [],
		level: 0,

	},
	get_page: function(page_id) {
		var branch = this;
		var pages = branch.root.definition.pages;
		for(var page of pages) {
			if(page.id == page_id) {
				return page;
			}
		}
		return null;
	},
	get_page_frame_reference: function(page_id) {
		var branch = this;
		var pages = branch.root.definition.pages;
		for(var page of pages) {
			for(var content_item of page.content) {
				if(content_item.id == page_id && content_item.type == 'frame') {
					return content_item;
				}
			}
		}
		return null;
	},
	remove_frame: function(frame) {
		var parent_frame = this.find_frame(frame.id, undefined, true);
		if(parent_frame != null) {
			if(parent_frame.active_pages.length == 0) {
				this.remove_frame(parent_frame);
			}
		}
		/*if(frame.active_pages.length == 0) {
			////console.log('remove frame', frame.id);
			frame.$frame.remove();
		}*/
		/*var $bottom = this.get_bottom_frame();
		if($bottom.length > 0 && !$bottom.hasClass('checked_remove')) {
			//console.log('bottom remove frame', $bottom.get(0));
			var bottom_frame = this.find_frame($bottom.attr('id'), undefined, true);
			//console.log('bottom remove frame', bottom_frame);
			$bottom.addClass('checked_remove');
			if(bottom_frame != null) {
				this.remove_frame(bottom_frame);
			}
		}*/
		/*var bottom_frames = this.get_all_bottom_frames();
		for(var bottom_frame of bottom_frames) {
			var $bottom_frame = $(bottom_frame);

		}*/
	},
	reload_all_pages: function(frame, options) {
		var branch = this;
		var reload_all = false;
		if(frame === true) {
			reload_all = true;
		}
		if(typeof frame === 'undefined' || frame === true) {
			frame = branch.base_frame;
		}

		/*var $input_focus = $(':input:focus');
		if($input_focus.length > 0) {
			return;
		}*/

		//breyta í callback
		for(var page of frame.active_pages) {
			if(reload_all) {
				if(typeof page.prevent_reload === 'undefined') {
					var params = {
						callback: function() {
							for(subframe of frame.sub_frames) {
								branch.reload_all_pages(subframe, options);
							}
						}
					};
					if(typeof options !== 'undefined' && typeof options.soft_load !== 'undefined' && options.soft_load) {
						params.soft_load = true;
					}
					page.load(params);
				}
			} else {
				if(branch.root.reload_pages_all.indexOf(page.page_reference.id) != -1) {
				//if(page.id == 'titlemedia') {
					if(typeof options !== 'undefined' && typeof options.only_reload_soft !== 'undefined') {
						page.$element.find('.reloadable_element').each(function() {
							$(this).trigger('reload');
						});
					} else {
						var $input_focus = page.$element.find(':input:focus');
						//if(page.$element.hasClass('in_edit')) {
						if($input_focus.length > 0) {
							$input_focus.off('focusout.page_reload').on('focusout.page_reload', function() {
								$input_focus.off('focusout.page_reload');
								page.load({
									soft_load: true
								});

							});
						} else {
							page.load({
								soft_load: true
							});
						}
					}
				}
			}
			//page_control.reload_main_callback();
		}
	},
	/*get_bottom_page: function(frame) {
		if(typeof frame === 'undefined' || frame === true) {
			frame = branch.base_frame;
		}
		for(frame of frame.sub_frames) {

			var res = this.get_bottom_page(frame);
			if(res != null) {
				return res;
			}
		}
		return null;
	},*/
	get_all_bottom_frames: function() {
		var max_level = -1;
		var $frames = $('.frame');
		$frames.each(function() {
			var $this = $(this);
			var level = $this.attr('level');
			if(level > max_level) {
				max_level = level;
			}
		});

		var results = [];

		$frames.each(function() {

			var $this = $(this);
			var level = $this.attr('level');
			if(level == max_level) {
				results.push(this);
			}
		});

		return results;
	},
	get_bottom_frame: function($frame) {
		var branch = this;
		if(typeof $frame === 'undefined') {
			$frame = branch.base_frame.$frame;//$('.body_frame');
		}
		var $first_child_frame = $frame.find('.frame').first();
		if($first_child_frame.length == 0) {
			return $frame;
		}
		return this.get_bottom_frame($first_child_frame);
	},
	all_frames_loaded: function(frame) {
		if(typeof frame === 'undefined') {
			frame = branch.base_frame;
		}
		/*if(frame.active_pages.length == 0) {

		}*/
	},
	init: function($templates, $body_frame) {
		var branch = this;
		branch.root.$templates_original = $('#templates').first();
		branch.root.$templates = $('#templates').first().clone();
		branch.root.$templates.detach();
		//branch.root.$templates.detach();
		branch.base_frame.$frame = $('.body_frame').first();
		if(typeof $templates !== 'undefined') {
			branch.root.$templates = $templates;
		}
		if(typeof $body_frame !== 'undefined') {
			branch.base_frame.$frame = $body_frame;
		}
	},
	apply_item_data: function(post_data, self) {
		var branch = this;
		if(typeof branch.root.definition.plasticity !== 'undefined' && branch.root.definition.plasticity === true) {
			post_data.action = self.definition_reference.fullname;
		} else if(typeof self.definition_reference.item !== 'undefined') {
			post_data.item = self.definition_reference.item;
		}
	},
	find_element: function(linked_item, page_reference) {
		var linked_split = null;
		var page_id_from_linked = null;
		if(linked_item.indexOf('__') !== -1) {
			/*var initial_split = linked_item.split('__');
			page_id_from_linked = initial_split[0];
			linked_item = initial_split[1];*/
			linked_item = linked_item.split('__').join('##');
		}
		//alert(linked_item);
		if(linked_item.indexOf('.') != -1) {
			linked_split = linked_item.split('.');
			linked_type = linked_split[0];
		} else {
			linked_type = linked_item;
		}
		if(linked_type != 'page_data' && linked_type.indexOf('_') != -1) {
			is_page_data = false;
			var further_split = linked_type.split('_');
			var linked_type = further_split[1];
			var element_id = further_split[0].split('##').join('__');
			var element_object = page_reference.elements_by_type[linked_type][element_id];
			console.log('findelement', page_reference.elements_by_type);
			return element_object;
		}
		return null;
	},
	toggle_frame_check_is_displayed: function(frame_id, callback) {
		var branch = this;
		var frame = branch.find_frame(frame_id);
		var $frame_container = frame.$frame.parent();
		if(!$frame_container.is(':visible')) {
			$frame_container.css({
				'display': 'block',
				'opacity': 0,
			}).addClass('animation_in_progress').animate({
				'opacity': 1
			}, 950, 'easeInOutQuad', function() {
				$(this).removeClass('animation_in_progress');
				if(typeof callback !== 'undefined') {
					callback();
				}
			});
			return true;
		} else {
			$frame_container.addClass('animation_in_progress').animate({
				'opacity': 0
			}, 950, 'easeInOutQuad', function() {
				$(this).css({
					'display': 'none'
				}).removeClass('animation_in_progress');
				if(typeof callback !== 'undefined') {
					callback();
				}
			});
			return false;
		}
	},
	show_frame: function(frame_id) {
		var branch = this;
		var frame = branch.find_frame(frame_id);
		var $frame_container = frame.$frame.parent();
		//crummy-fix
		var $pages = $frame_container.find('.page');
		if($pages.length > 1) {
			//$pages.first().remove();
			var counter = 0;
			$pages.each(function() {
				var $page_this = $(this);
				if(counter > 0 && !$page_this.hasClass('animation_in_progress')) {
					$page_this.remove();
				} else {
					//$(this).show();
				}
				counter++;
			});
		}
		//$pages.first().trigger('reload');
		$frame_container.css({
			'display': 'block',
			'opacity': 0,
		}).addClass('animation_in_progress').animate({
			'opacity': 1
		}, 950, 'easeInOutQuad', function() {
			$(this).removeClass('animation_in_progress');
		});
	},
	hide_frame: function(frame_id) {
		var branch = this;
		var frame = branch.find_frame(frame_id);
		var $frame_container = frame.$frame.parent();
		$frame_container.addClass('animation_in_progress').animate({
			'opacity': 0
		}, 950, 'easeInOutQuad', function() {
			$(this).css({
				'display': 'none'
			}).removeClass('animation_in_progress');
		});
	},
	non: ['parent', 'root', 'obj_id'],
	find_event_relations: function(page) {
		var content = page.content;
		var branch = this;
		var post_data_linked_elements = {};
		
		var form_element_linked_elements = {};

		for(var x in content) {
			var id = content[x].id;
			var type = content[x].type;
			if(typeof content[x].post_data !== 'undefined') {
				for(var z of Object.keys(content[x].post_data)) {
					if(branch.non.indexOf(z) == -1) {
						//////console.log(content[x].post_data);
						var post_data_item = content[x].post_data[z];
						//////console.log(post_data_item);
						if(post_data_item.indexOf('.') !== -1) {
							var split = post_data_item.split('.');
							var form = split[0];
							var form_element = split[1];
							if(typeof post_data_linked_elements[form] === 'undefined') {
								post_data_linked_elements[form] = {};	
							}
							if(typeof post_data_linked_elements[form][form_element] === 'undefined') {
								post_data_linked_elements[form][form_element] = Array();	
							}
							post_data_linked_elements[form][form_element].push(id+'_'+type);
						}
					}
				}
			}
			/*if(typeof content[x].dependencies !== 'undefined') {
				for(content_dependency of content[x].dependencies) {
					var post_data_item = content_dependency.link;
					if(post_data_item.indexOf('.') !== -1) {
						var split = post_data_item.split('.');
						var form = split[0];
						var form_element = split[1];
						if(typeof post_data_linked_elements[form] === 'undefined') {
							post_data_linked_elements[form] = {};	
						}
						if(typeof post_data_linked_elements[form][form_element] === 'undefined') {
							post_data_linked_elements[form][form_element] = Array();	
						}
						post_data_linked_elements[form][form_element].push(id+'_'+type);
					}
				}
			}*/
			if(type == 'form') {
				for(var e in content[x].content) {
					if(typeof content[x].content[e].post_data !== 'undefined') {
						////////console.log('post_data');
						////////console.log(content[x].content[e].post_data);
						for(var z in content[x].content[e].post_data) {
							var post_data_item = content[x].content[e].post_data[z];
							if(post_data_item.indexOf('.') !== -1) {
								var split = post_data_item.split('.');
								var form = split[0];
								var form_element = split[1];
								if(typeof post_data_linked_elements[form] === 'undefined') {
									post_data_linked_elements[form] = {};	
								}
								if(typeof post_data_linked_elements[form][form_element] === 'undefined') {
									post_data_linked_elements[form][form_element] = Array();	
								}
								post_data_linked_elements[form][form_element].push(id+'_'+type+"."+content[x].content[e].id);
							}
						}
					}
				}
			}
		}

		page.post_data_linked_elements = post_data_linked_elements;
	},
	apply_load_mask: function(load_mask, send_data, page_data, other_data, page_reference, prevent_convert_bases) {
		var branch = this;
		var ignore = ['parent', 'root', 'obj_id'];
		if(typeof load_mask === 'undefined' || typeof send_data === 'undefined') {
			return;
		}
		////console.log('dependency apply load_mask', load_mask, send_data, page_data, other_data);
		for(var mask_item of Object.keys(load_mask)) {
			////console.log('dependency mask_item', mask_item, load_mask[mask_item]);
			if(ignore.indexOf(mask_item) == -1) {
				if(load_mask[mask_item].indexOf("'") === 0) {

					send_data[mask_item] = load_mask[mask_item].split("'")[1];
				} else {
					var mask_item_key = load_mask[mask_item];

					////console.log('dependency mask item key', mask_item_key);
					if(mask_item_key.indexOf('.') !== -1) {
						////console.log('depdenceny in 1');
						var split = mask_item_key.split('.');
						var form_name = split[0];
						mask_item_key_value = split[1];
						if(split[0] == 'page_data') {
							if(typeof page_data[mask_item_key_value] !== 'undefined') {
								send_data[mask_item] = page_data[mask_item_key_value];
								////console.log('set send data', mask_item, page_data[mask_item_key_value]);
							} else if(typeof other_data !== 'undefined' && typeof other_data[mask_item_key] !== 'undefined') {
								send_data[mask_item] = other_data[mask_item_key_value];
							}
						} else if(split[0] == 'self') {
							var self_data = {
								user_id: branch.root.base.authentication.status.user_id
							};
							if(typeof self_data[mask_item_key_value] !== 'undefined') {
								send_data[mask_item] = self_data[mask_item_key_value];
							}
						} else {
							/*var type_split = split[0].split('_');
							var type = type_split[1];
							var id = type_split[0];*/
							if(typeof page_reference !== 'undefined') {
								//////console.log('in page reference apply load mask');
								var element = this.find_element(form_name, page_reference);
								////console.log('apple load mask element', element);
								//////console.log(mask_item_key, page_reference, element, mask_item);
								//////console.log('mask item key value', mask_item_key_value);
								/*if(typeof element === 'undefined') {
									alert(form_name);
								}*/
								send_data[mask_item] = element.$element.find('#'+mask_item_key_value).first().val();
								if(send_data[mask_item] == null || send_data[mask_item].trim().length == 0) {
									send_data[mask_item] = 0;
								}
							}
							//find element for example form
						}
						/*var value_mask_item = send_data[mask_item];
						if(mask_item_key.lastIndexOf('__base') != -1 && mask_item_key.lastIndexOf('__base') == mask_item_key.length-('__base').length) {
							value_mask_item = btoa(value_mask_item);
						} else if(mask_item.indexOf('__base') != -1 && mask_item.indexOf('__base') == mask_item.length-('__base').length) {
							value_mask_item = btoa(value_mask_item);
						}
						send_data[mask_item] = value_mask_item;*/
					} else if(page_data != null) {
						if(typeof page_data[mask_item_key] !== 'undefined') {
							var value_mask_item = page_data[mask_item_key];
							if(!prevent_convert_bases) {
								if(mask_item_key.lastIndexOf('__base') != -1 && mask_item_key.lastIndexOf('__base') == mask_item_key.length-('__base').length) {
									/*alert('base: '+value_mask_item);
									alert('base: '+atob(value_mask_item));*/
									value_mask_item = atob(value_mask_item);
								} else if(mask_item.indexOf('__base') != -1 && mask_item.indexOf('__base') == mask_item.length-('__base').length) {
									value_mask_item = btoa(value_mask_item);
								}
							}
							send_data[mask_item] = value_mask_item;
						}
					}
				}
			}
		}
		for(var key of Object.keys(send_data)) {
			var value = send_data[key];
			if(typeof send_data[key] === 'undefined' || value == 'undefined') {
				delete send_data[key];
			}
		}
		////console.log('send_data: ', send_data);
	},
	global_loaded_callback: function($container) {
		var branch = this;
		return;
		if(typeof $container === 'undefined') {
			$container = branch.base_frame.$frame;
		}
		$container.find('.date_field:not(.registered_loaded)').each(function() {
			var $this = $(this);
			var $html = $this.html();
			$this.addClass('registered_loaded');
			$this.html(branch.root.date.format_date($html));
		});
		/*var editable_access = false;
		if(branch.root.base.authentication.status.user_id != -1) {
			editable_access = true;
		}

		if(editable_access) {
			$container.find('.editable_item_button').each(function() {
				var $this = $(this);
				$this.show();
			});
			$container.find('.editable_item:not(.registered_edit)').each(function() {
				var $this = $(this);
				$this.addClass('registered_edit');
				var $edit_button = $('<div class="edit_button">Edit item <i class="icofont-pencil-alt-2"></i></div>');
				$this.append($edit_button);
				var in_edit = false;
				$edit_button.off('click').on('click', function() {
					if(!in_edit) {
						$this.find('.editable_input').each(function() {
							var $editable_input = $(this);
							var $input = $("<input type='text' />");
							$input.val($editable_input.html());
							$editable_input.html($input);
						});
						in_edit = true;
					} else {
						$this.find('.editable_input').each(function() {
							var $editable_input = $(this);
							var $input = $editable_input.find('input').first();
							$editable_input.html($input.val());
						});

						$this.trigger('save');
						in_edit = false;
					}
				});
			});
		}*/
	},
	register_loadable_component_load_callbacks: [],
	register_loadable_component_load: function(callback) {
		if(this.register_loadable_component_load_callbacks.indexOf(callback) === -1) {
			this.register_loadable_component_load_callbacks.push(callback);
		}
		if($('.loadable_component').length == $('.loaded_component').length) {
			for(var callback_item of this.register_loadable_component_load_callbacks) {
				callback_item();
			}
			this.register_loadable_component_load_callbacks = [];
		}
	},
	interpretation_in_progress: {},
	persistant_global_callbacks: [],
	global_callbacks: [],
	global_final_callback: function() { //seinasta callback
		var branch = this;
		//branch.interpretation_in_progress = false;
		//branch.clean_frames();

		/*if(branch.global_callback_called) {
			return;
		}*/
		
		var set_callbacks = this.global_callbacks;
		this.global_callbacks = [];
		for(var callback of set_callbacks) {
			callback();
		}
		//branch.root.navigation.check_default_page();
	
		branch.global_callback_called = true;
		//console.log('global--final');
		branch.root.base.global_tags.loaded_callback();
		if(typeof branch.root.user_button !== 'undefined') {
			branch.root.user_button.loaded_callback();
		}
		branch.root.navigation.register_links($('body'));
		/**/

		branch.root.base.authentication.init_user_info();

		$('.page .secondary_account_button').each(function() {
			$(this).off('click.account').on('click.account', function(e) {
				$('.user_menu_button').trigger('click');
			});
		});

		$('.page a.set_to_href_item').each(function() {
			var $this = $(this);
			if($this.hasClass('set_to_href_item')) {
				var send_data = {
					page: $this.attr('set_to_href'),
					$element: $this,
					get_data: {}
				};
				branch.root.navigation.generate_href(send_data);
				$this.removeClass('set_to_href_item');
			}
		});

		if(branch.root.base.authentication.status.user_id != -1) {
			$('.hide_if_logged_in').hide();
		}

		$('.autoresize_input:not(.autoresize_input_registered)').each(function() {
			var $this = $(this);
			var set_width = $this.css('width');
			$this.addClass('autoresize_input_registered');
			var $dummy_div = $('<div class="autoresize_dummy_div"></div>');
			$dummy_div.hide();
			$('body').append($dummy_div);

			$dummy_div.css('min-width', set_width);


			$this.on('input', function(e) {
				console.log($this.val());
				$dummy_div.html($this.val());
				var width = $dummy_div.width();
				console.log('width', width);
				//if(width > set_width) {
					$this.css('width', width+'px');
				//}
			});
		});

		if(isMobile.any()) {
			$('.body_frame a#logo_main_link_button').off('click').on('click', function(e) {
				e.preventDefault();
				var $menuframe = $('.body_frame .menuframe').first();
				//$menuframe.toggleClass('mobile');
				$menuframe.toggleClass('mobile');
				return false;
			});
		} else {
			/*$('.body_frame a#logo_main_link_button').off('mouseenter').on('mouseenter', function(e) {
				//e.preventDefault();
				var $menuframe = $('.body_frame .menuframe').first();
				//$menuframe.toggleClass('mobile');
				$menuframe.addClass('mobile');
			});*/
		}

		setTimeout(function() {
			//if(typeof branch.root.remove_duplicate_frames !== 'undefined') {
				
				/*var $pages_pres = $('.frame');
				$pages_pres.each(function() {
					var $this = $(this);
					//if(!$this.hasClass('frame_11')) {
						var $pages_pre = $this.find('>.page');
						if($pages_pre.length > 1) {
							$pages_pre.first().remove();
							//alert($pages_pre.first().attr('id'));
						}
					//}
				});*/

			//}
			$('.page').each(function() {
				$(this).trigger('load.persistant');
			});

			if(branch.root.base.authentication.status.user_id != -1 && typeof branch.root.set_search_images !== 'undefined') {
				/*setTimeout(function() {
					var $img = $('.imageitem').first();

					if($img.length > 0) {

						var hash_value = decodeURIComponent(window.location.href.split('?path=')[1]);
						hash_value = hash_value.split('3:')[1];
						hash_value = hash_value.split(/5\:searchresults\:search_term\=[a-z0-9\-]*\;/gi).join('');
						branch.root.base.data.post({
							post_data: {
								__no_cache: true,
								item: 'searchresults',
								action: '_',
								url: hash_value,
								image: $img.attr('id')
							},
							callback: function(data) {
							}
						});
					}
				}, 1);*/
			}
		}, 150);

		
		branch.root.base.authentication.reset_index_callback();

		for(var callback of this.persistant_global_callbacks) {
			callback();
		}

	},
	get_page_reference: function(page_id) {
		var branch = this;
		var pages = branch.root.definition.pages;
		var index = pages.map(function(e) {
			return e.id;
		}).indexOf(page_id);
		return pages[index];
	},
	find_frame: function(frame_id, parent_frame, return_parent_frame) {
		var branch = this;
		if(typeof parent_frame === 'undefined') {
			parent_frame = branch.base_frame;
		}
		if(frame_id == 0) {
			return parent_frame;
		}
		////console.log('sub frames render', parent_frame.sub_frames);
		for(sub_frame of parent_frame.sub_frames) {
			if(sub_frame.id == frame_id) {
				if(typeof return_parent_frame !== 'undefined') {
					return parent_frame;
				}
				return sub_frame;
			}
		}
		var intermediate_result = null;
		for(sub_frame of parent_frame.sub_frames) {
			intermediate_result = branch.find_frame(frame_id, sub_frame);
			if(intermediate_result != null) {
				return intermediate_result;
			}
		}
		return null;
	},
	clean_frames: function(frame_id, parent_frame) {
		var branch = this;
		if(typeof parent_frame === 'undefined') {
			parent_frame = branch.base_frame;
		}
		/*if(frame_id == 0) {
			return parent_frame;
		}*/
		////console.log('sub frames render', parent_frame.sub_frames);
		for(sub_frame of parent_frame.sub_frames) {
			/*if(sub_frame.id == frame_id) {
				return sub_frame;
			}*/
			if(sub_frame.$frame.length == 0) {
				alert('clean frame: '+sub_frame.frame_id);
				parent_frame.sub_frames.splice(parent_frame.sub_frames.indexOf(sub_frame), 1);
			}
		}
		var intermediate_result = null;
		for(sub_frame of parent_frame.sub_frames) {
			intermediate_result = branch.find_frame(frame_id, sub_frame);
			/*if(intermediate_result != null) {
				return intermediate_result;
			}*/
		}
	},
	find_parent_frame: function(frame_id, parent_frame) {
		var branch = this;
		if(typeof parent_frame === 'undefined') {
			parent_frame = branch.base_frame;
		}
		if(frame_id == 0) {
			return parent_frame;
		}
		for(sub_frame of parent_frame.sub_frames) {
			if(sub_frame.id == frame_id) {
				return parent_frame;
			}
		}
		var intermediate_result = null;
		for(sub_frame of parent_frame.sub_frames) {
			intermediate_result = branch.find_parent_frame(frame_id, sub_frame);
			if(intermediate_result != null) {
				return intermediate_result;
			}
		}
		return null;
	},
	display_pages_in_frame: function(frame) {
		for(page of frame.active_pages) {
			page.display({});
		}
	},
	reload_all_elements: function(input) {
		var branch = this;
		var active_pages = this.get_active_pages(this.base_frame);
		////////console.log(active_pages);
		for(active_page of active_pages) {
			//reload elements in correct order and not reload elements which have bound load events
			active_page.load();
		}
	},
	get_active_pages: function(frame, active_pages) {
		var branch = this;
		if(typeof active_pages === 'undefined') {
			active_pages = [];
		}
		active_pages = active_pages.concat(frame.active_pages);
		for(sub_frame of frame.sub_frames) {
			this.get_active_pages(sub_frame, active_pages);
		}
		return active_pages;
	},
	global_callback_called: false,
	switch_to_page: function(input, navigation_callback_reference) {
		var branch = this;
		var page_id = null;
		var frame_id = null;
		var get_data = null;
		////alert('get received: '+JSON.stringify(input.get_data));
		if(typeof input.page_id !== 'undefined') {
			page_id = input.page_id;
		}
		if(typeof input.frame_id !== 'undefined') {
			frame_id = input.frame_id;
		}
		if(typeof input.get_data !== 'undefined') {
			get_data = input.get_data;
		}
		if(typeof get_data.id !== 'undefined') {
			if((get_data.id+'').length == 0) {
				return;
			}
		}
		/*if(typeof branch.interpretation_in_progress[frame_id] !== 'undefined') {
			return;
		}
		branch.interpretation_in_progress[frame_id] = true;*/
		//alert('input page data: '+JSON.stringify(input.get_data));
		branch.global_callback_called = false;
		//////////console.log('call switch_to_page');
		//////////console.log(frame_id);
		////console.log('render:::', input, frame_id);
		/*var clear_frames = false;
		if(frame_id == 0) {
			clear_frames = true;
		}*/
		var frame_reference = branch.find_frame(frame_id);
		//console.log('frame--- frame_reference', frame_id, frame_reference);
		/*
			frame reference bendir a gamalt?

			Mogulega lausn : kalla i branch.find_frame i render fallinu i frame og remove-a containerinn????
		*/
		//console.log('frame reference', frame_reference);
		if(frame_reference != null && frame_reference.$frame.length > 0) {
			//frame_reference.$frame.detach();
			/*var $frame_item = $('.frame#'+frame_id);
			$frame_item.replaceWith(frame_reference.$frame);*/
			/**/
			/*var $frame_item = $('.frame#'+frame_id).first();
			$frame_item.remove();
			frame_reference = null;*/

			 //frame_reference.$frame
			/*.before(frame_reference.$frame);//.remove();//.replaceWith(frame_reference.$frame);
			$frame_item.remove();*/
		}

		//////////console.log('find frame reference', frame_reference);
		var pre_active_pages = [];
		if(frame_reference != null) {
			pre_active_pages = [...frame_reference.active_pages];
		}
		if(typeof navigation_callback_reference !== 'undefined') {
			if(typeof navigation_callback_reference.pre_active_pages !== 'undefined') {
				//////////console.log('set pre_active_pages');
				pre_active_pages = pre_active_pages.concat(navigation_callback_reference.pre_active_pages);
				//////////console.log('concat', pre_active_pages);
			}
		}
		////console.log('preactivepages', pre_active_pages, page_id);
		var index = pre_active_pages.map(function(e) {
			return e.page_reference.id;
		}).indexOf(page_id);
		if(page_id == null) {
			return;
		}
		////console.log(index);
		/*if(frame_reference.active_pages.length != pre_active_pages.length) {
			index = -1;
		}*/
		////console.log('index: ', index);

		if(index !== -1) {
			var page_data = {...pre_active_pages[index].page_data};
			////console.log('page-data-prior', pre_active_pages[index]);
			if(typeof pre_active_pages[index].page_reference.page_data_post_data !== 'undefined') {
				page_data = {...pre_active_pages[index].page_reference.page_data_post_data};
				////console.log('page-data-prior');
			}
			delete page_data.root;
			delete page_data.obj_id;
			delete page_data.parent;
			delete get_data.root;
			delete get_data.obj_id;
			delete get_data.parent;
			var previous_get_data = page_data;
			////console.log('page-data', index, page_data, get_data);
			//alert(JSON.stringify(page_data));
			/*alert(previous_get_data+'-'+JSON.stringify(get_data));
			if(previous_get_data != JSON.stringify(get_data)) {
				index = -1;
			}*/
			////////console.log('checkdata', get_data, previous_get_data);
			var keys = Object.keys(previous_get_data);
			/*if(Object.values(previous_get_data).length == Object.values(get_data).length) {
				//alert(JSON.stringify(previous_get_data)+JSON.stringify(get_data));
			} else {*/
				//console.log('getdatacompare', previous_get_data, get_data);
				for(var key of keys) {
					if(typeof get_data[key] === 'undefined') {
					//if(typeof get_data[key] !== 'undefined' && get_data[key] != previous_get_data[key]) {
						index = -1;
						//console.log('key different', get_data, previous_get_data);
						////////console.log('checkdata minuseone');
					}
				}
				keys = Object.keys(get_data);
				for(var key of keys) {
					if((typeof get_data[key] !== 'undefined' && get_data[key] != previous_get_data[key])) {
						index = -1;
						//console.log('key different', get_data, previous_get_data);
						////////console.log('checkdata minuseone');
					}
				}
			//}

			/*if(keys.length != Object.keys(previous_get_data).length) {
				index = -1;
			}*/ 
			/*if(keys.length == 0 && Object.keys(previous_get_data).length > 0) {
				index = -1;
			} else if(keys.length > 0 && Object.keys(previous_get_data).length == 0) {
				index = -1;
			}*/

			/*for(key of keys) {
				if(typeof get_data[key] === 'undefined' || get_data[key] != previous_get_data[key]) {
					index = -1;
					//////console.log('checkdata minuseone');
				}
			}*/
			/*var get_data_keys = Object.keys(get_data);
			for(key of get_data_keys) {
				if(typeof previous_get_data[key] === 'undefined' || get_data[key] != previous_get_data[key]) {
					index = -1;
					//////console.log('checkdata minuseone');
				}
			}*/
		}

		var prevent_hard_reload_pages = [];
		for(page of pre_active_pages) {
			if(typeof page.page_reference.prevent_hard_reload !== 'undefined') {
				prevent_hard_reload_pages.push(page);
			}
		}
		/*for(page of prevent_hard_reload_pages) {
			var index = pre_active_pages.indexOf(page);
			pre_active_pages.splice(index, 1);
		}*/

		var pages_to_display;
		if(typeof navigation_callback_reference.pages_to_display === 'undefined') {
			pages_to_display = [];
		} else {
			pages_to_display = navigation_callback_reference.pages_to_display;
			//////////console.log('set nav callback reference', pages_to_display); 
		}


		/*for(prevent_hard_reload_page of prevent_hard_reload_pages) {
			var prevent_hard_index = pages_to_display.map(function(e) {
				return e.page_reference.id
			}).indexOf(prevent_hard_reload_page.page_reference.id);
			if(prevent_hard_index != -1) {
				pages_to_display.splice(index, 1);
			}
		}*/


		/*if(pages_to_display.length == 0) {
			//alert(JSON.stringify(pages_to_display));
			return;
			//if(JSON.stringify(input.get_data) == JSON.stringify(
		}*/

		var loading_callback = function(pre_active_pages, pages_to_display) {
			var loaded_count = 0;
			var loaded_callback = function() {
				
				/*for(page_control of pages_to_display) {
					if(typeof page_control.page_reference.animation !== 'undefined') {
						for(animation_item of page_control.page_reference.animation) {
							if(animation_item.type == 'overlay') {
								var from_page = animation_item.from_page;
								var index = pre_active_pages.map(function(e) {
									return e.page_reference.id;
								}).indexOf(from_page);
								if(index != -1) {
									pre_active_pages.splice(index, 1);
								}
							}
						}
					}
				}*/
				/*$('.page').each(function() {
					var $this = $(this);*/
					branch.root.navigation.register_links(branch.base_frame.$frame);
				//});
				for(page_control of pre_active_pages) {
					var hide_send_data = {
						pages_to_display: pages_to_display,
						pre_active_pages: pre_active_pages,
						remove: true,
					};
					if(typeof navigation_callback_reference.href_target_frame !== 'undefined') {
						hide_send_data.href_target_frame = navigation_callback_reference.href_target_frame;
					}
					//page_control.clear_intervals();
					page_control.hide(hide_send_data);
					//////////console.log('hide page');
				}
				//alert('pages_to_display: '+pages_to_display.length);
				//if(clear_frames) {
				//}
				for(page_control of pages_to_display) {
					page_control.display({
						pre_active_pages: pre_active_pages,
						pages_to_display: pages_to_display,
					});
				}
			};
			//////////console.log('loadingcallback pages to display', pages_to_display, pre_active_pages);
			//alert(pages_to_display.length);
			//pages_to_display.concat(prevent_hard_reload_pages);
			for(page_control of pages_to_display) {
				(function(page_control) {
					page_control.load({
						callback: function() {
							loaded_count++;
							//alert('callback: '+loaded_count);
							if(loaded_count == pages_to_display.length) {
								loaded_callback();
								var complete_callback = function() {
									if(typeof navigation_callback_reference.post_callback !== 'undefined') {
										navigation_callback_reference.post_callback();	
									}
									branch.global_final_callback();
									page_control.load_global_elements();
								};
								if(branch.root.base.authentication.has_access) {
									branch.root.base.authentication.hide_login_window();
								}// else {
									complete_callback();
								//}
								//delete branch.interpretation_in_progress[frame_id];
							}
						}
					});
				}(page_control));
			}
			/*for(page_control of prevent_hard_reload_pages) {
				page_control.load({
					callback: function() {
					}
				});
			}*/
			if(pages_to_display.length == 0) {
				var has_access = true;
				var page_reference = pre_active_pages[0];
				if(typeof page_reference !== 'undefined' && typeof page_reference.user_access !== 'undefined') {
					if(page_reference.user_access != 'everyone') {
						if(page_reference.user_access == 'user') {
							if(branch.root.base.authentication.status.user_id == -1) {
								has_access = false;
							}
						} else {
							if(page_reference.user_access != branch.root.base.authentication.status.user_group) {
								has_access = false;
							}
						}
					}
				}
				if(has_access) {
					branch.root.base.authentication.has_access = true;
					branch.root.base.authentication.hide_login_window();
				}
				loaded_callback();
				branch.global_final_callback();
			}
		};
		if(index != -1) {
			////////console.log('------', pre_active_pages[index]);
			var pre_page_get_data = pre_active_pages[index].page_data;
			//if(JSON.stringify(pre_page_data) == JSON.stringify(get_data)) {
			if(pre_page_get_data.id != get_data.id) {
				index = -1;
			}
		}
		if(frame_reference == null) {
			//alert('frame not found: '+frame_id);
			loading_callback(pre_active_pages, pages_to_display);
			//branch.root.navigation.clean_url(frame_id);
			return false;
		}
		if(index != -1) {
			//pre_active_pages.splice(index, 1);
			//////////console.log('ins3', page_id, pre_active_pages);
			if(typeof navigation_callback_reference !== 'undefined') {
				if(typeof navigation_callback_reference.callback !== 'undefined') {
					////////console.log(pages_to_display);
					navigation_callback_reference.callback({
						pre_active_pages: pre_active_pages,
						pages_to_display: pages_to_display
					});
				} else {
					loading_callback(pre_active_pages, pages_to_display);
				}
			}
			/*if(prevent_hard_reload_pages.length > 0) {
				for(page_control of prevent_hard_reload_pages) {
					page_control.load({
						callback: function() {
							loaded_count++;
							//alert('callback: '+loaded_count);
							if(loaded_count == pages_to_display.length) {
								loaded_callback();
								if(branch.root.base.authentication.has_access ) {
									branch.root.base.authentication.hide_login_window();
								}
							}
						}
					});
				}
			}*/
		} else { 
			//////////console.log('pre active pages', pre_active_pages);

			var page_reference = branch.get_page_reference(page_id);

			if(page_reference == null) {
				alert(page_id);
			}
			
			branch.find_event_relations(page_reference);
			//////////console.log(input);
			var render_callback = function(page_data) {
				//////////console.log('ins1');
				var send_data = {
					frame_reference: frame_reference,
					$frame: frame_reference.$frame,
					page: page_reference,
					pre_active_pages: pre_active_pages,
					page_data: page_data
					//navigation_callback: continue_navigation_callback
				};
				if(typeof navigation_callback_reference !== 'undefined' && typeof navigation_callback_reference.callback !== 'undefined') {
					//////////console.log('set continue navigation callback');
					send_data.main_callback = function() {
						navigation_callback_reference.callback({
							pre_active_pages: pre_active_pages,
							pages_to_display: pages_to_display
						});
					};
				} else {
					send_data.main_callback = function() {
						//for(page_reference
						loading_callback(pre_active_pages, pages_to_display);
					};
					//tharf ad geta kallad i animation eda display fall fyrir allar nyjar sidur byrja a fyrstu sidu/ramma
				}
				/*if(typeof page_reference.prevent_hard_reload !== 'undefined' && prevent_hard_reload_pages.length > 0) {
					//pages_to_display.push(prevent_hard_reload_pages[0]);
					for(page_control of prevent_hard_reload_pages) {
						page_control.page_data = page_data;
						page_control.load({
							//soft_load: true,
							callback: function() {*/
								/*send_data.main_callback = function() {
									navigation_callback_reference.callback({
										pre_active_pages: pre_active_pages,
										pages_to_display: pages_to_display
									});
								};*/
							/*}
						});
					}
				} else {*/
					var page_control = branch.render_page(send_data);

					
					pages_to_display.push(page_control);
					if(typeof navigation_callback_reference !== 'undefined') {
						navigation_callback_reference.pages_to_display = pages_to_display;
					}
					var render_send_data = {};
					if(typeof input.reset_frames !== 'undefined') {
						render_send_data.reset_frames = input.reset_frames;
					}
					page_control.render(render_send_data);
				//}
			};
			var main_callback = render_callback;
			if(typeof page_reference.get_data !== 'undefined') {
				main_callback = function(get_data, set_callback_from_page) {
					var post_data = {
						'action': 'getpage_'+page_id
					};
					/*if(typeof set_callback_from_page !== 'undefined') {
						get_data = page_reference.get_data;
					}*/
					if(get_data != null) {
						page_reference.page_data_prior = {...get_data};
						////console.log('set data from page_data prioir', page_reference.page_data_prior);
					} else {
						get_data = {...page_reference.page_data_prior};
						////console.log('get data from page_data prioir', get_data);
					}
					if(typeof branch.root.definition.plasticity !== 'undefined' && branch.root.definition.plasticity === true) {
						if(typeof page_reference.get_page !== 'undefined') {
							post_data.action = page_reference.get_page;
						} else {
							post_data.action = 'get_'+page_id;
						}
					} else if(typeof page_reference.get_data === 'object') {
						if(typeof page_reference.get_data.item !== 'undefined') {
							post_data.item = page_reference.get_data.item;
						}
					}
					if(typeof get_data !== 'undefined') {
						Object.assign(post_data, get_data);
					}
					page_reference.page_data_post_data = {...post_data};
					delete page_reference.page_data_post_data.action;
					delete page_reference.page_data_post_data.item;
					////console.log('page-data-set', page_reference);
					if(typeof page_reference.no_get_no_id !== 'undefined' && typeof post_data.id === 'undefined' || post_data.id == 'undefined') {
						render_callback({});
						return;
					}
					////console.log('post_data ', post_data);
					//alert('get page data');
					branch.root.base.data.post({
						post_data: post_data, 
						callback: function(data) {
							console.log('getpage results--', data);
							var page_callback = function(data) {
								////console.log('get-result ', data);
								//branch.root.base.data.convert_data(data, page_id);
								//console.log('getdata', data, get_data);
								Object.assign(data, get_data);

								if(typeof data.can_edit !== 'undefined') {
									if(branch.root.base.authentication.status.user_id == -1) {
										delete data.can_edit;
									}
								}
								if(typeof set_callback_from_page === 'undefined') {
									render_callback(data);
								} else {
									//alert(JSON.stringify(data));
									set_callback_from_page(data);
								}
							};

							if(branch.root.is_cocoa_app && typeof page_reference.no_php_get === 'undefined') {
								$.post('actions.php', post_data, function(additional_data) {
									if(typeof additional_data.result !== 'undefined') {
										additional_data = additional_data.result;
									}
									if(typeof additional_data.image !== 'undefined') {
										data.image = additional_data.image;
									}
									page_callback(data);
								}, "json");
							} else {
								page_callback(data);
							}
						}
					});
				};
				page_reference.get_page_data = main_callback;
				//page_control.reload_main_callback = main_callback;
			}/* else {
				page_reference.get_page_data = render_callback;
			}*/
			//////////console.log('main callback');
			/*if(typeof branch.root.preload_data !== 'undefined' && branch.root.base.data.loaded_pre_loaded_data === false) {
				branch.root.base.data.post({
					'post_data': {
						'action': 'get_all_data'
					},
					callback: function(data) {
						branch.root.base.data.loaded_pre_loaded_data = true;
						branch.root.base.data.data = data;
						////////console.log('all data: ', data);
						main_callback();
					}
				});
			} else {*/
			//}
			var has_access = true;
			if(typeof page_reference.user_access !== 'undefined') {
				if(page_reference.user_access != 'everyone') {
					if(page_reference.user_access == 'user') {
						if(branch.root.base.authentication.status.user_id == -1) {
							has_access = false;
						}
					} else {
						if(page_reference.user_access != branch.root.base.authentication.status.user_group) {
							has_access = false;
						}
					}
				}
			}
			if(has_access) {
				//alert('has access2');
				//branch.root.base.authentication.call_login_callbacks();
				branch.root.base.authentication.has_access = true;
				//branch.root.base.authentication.hide_login_window();
				//page_reference.get_data =
				main_callback(get_data);
			} else {
				branch.root.base.authentication.no_access(function() {
					main_callback(get_data);
				});
			}
		}
		for(callback of branch.root.navigation.navigation_callback_completed) {
			////console.log(callback);
			callback();
		}
		branch.root.navigation.navigation_callback_completed = [];
	},
	call_on_submit: function(on_submit, send_data, page_reference) {
		var branch = this;
		for(var x in on_submit) {
			var load_mask = true;
			var submit_value = on_submit[x];
			if(typeof on_submit[x] === 'object') {
				if(typeof on_submit.load_mask !== 'undefined') {
					load_mask = on_submit.load_mask;
				}
				submit_value = on_submit[x].link;
			}
			if(submit_value.indexOf('__') != -1) {
				submit_value = submit_value.split('__').join('##');
			}
			var callback_item = submit_value;//on_submit[x];
			var split = callback_item.split("_");
			var type = split[split.length-1]; //+"s";
			/*var statement = "var element = branch.root.elements."+type+"['"+callback_item+"']";
			eval(statement);*/
			//////console.log(page_reference);
			//var element_id = split[0].split('##').join('__').join('_');
			split.splice(split.length-1, 1);
			var element_id = split.join('_');
			var element = page_reference.elements_by_type[type][element_id];
			//console.log('load on submit', element, element_id, type);
			//////console.log(on_submit);
			switch(type) {
				default:
					////alert('on submit');
					/*if(type == 'formclassic') {
						element.operation.load(send_data);	
					} else {*/
						element.load({ data: send_data });
					//}
					break;
			}
		}	
	},
	pre_navigation_callbacks: [],
	call_pre_navigation_callbacks: function(main_callback) {
		var branch = this;
		if(branch.pre_navigation_callbacks.length == 0) {
			main_callback();
			return;
		}
		var pre_callbacks = [...branch.pre_navigation_callbacks];

		var callback = function() {
			if(pre_callbacks.length == 0) {
				branch.pre_navigation_callbacks = [];
				main_callback();
			} else {
				var pre_callback = pre_callbacks.shift();
				pre_callback(function() {
					callback();
				});
			}
		};
		callback();
	},
	render_page: function(input) {
		var branch = this;
		var $container;
		if(typeof input.$container !== 'undefined') {
			$container = input.$container;
		}
		if(typeof input.$frame !== 'undefined') {
			$container = input.$frame;
			////console.log('input is frame');
		}
		////console.log('container $container is : ', $container, $container.get(0), $container.parent().parent().parent().attr('id'));
		var page_reference = null;
		if(typeof input.page !== 'undefined') {
			page_reference = input.page;
		}
		var page_data = null;
		if(typeof input.page_data !== 'undefined') {
			page_data = input.page_data;
		}
		if(typeof input.frame_reference.inactive_pages !== 'undefined') {
			//console.log('inactive pages, ', input.frame_reference.inactive_pages, input.page);
			var set_index = input.frame_reference.inactive_pages.map(function(e) {
				return e.page_reference.id;
			}).indexOf(input.page.id);
			if(set_index != -1) {
				/*var set_control = input.frame_reference.inactive_pages[set_index];
				set_control.$container = $container;
				set_control.frame = input.frame_reference;
				return set_control;*/
				//alert('same');
			}
		}
		////console.log('render :---', input.frame_reference);
		var page_control = {
			elements: [],
			$container: $container,
			//$elememt: null,
			frame: input.frame_reference,
			$element: null,
			interpretation: branch,
			page_reference: page_reference,
			page_data: page_data,
			
			//$page: null,
			elements: [],
			elements_by_type: [],
			clear_intervals: function() {
				for(var element of this.elements) {
					if(typeof element.main_interval !== 'undefined') {
						clearInterval(element.main_interval);
					}
				}
			},
			reload_page_data: function() {

			},
			navigate_to: function() {
				var self = this;
				if(typeof self.page_reference !== 'undefined') {
					branch.root.navigation.generate_href({ 
						navigate_to: true,
						$element_reference: self.$element,
						frame: 'self',
						page: self.page_reference.id,
						get_data: self.page_reference.page_data_prior,
					});
				}
				//branch.root.navigation.generate_href({ apply_get_to_all: true, get_data: send_data_values, page: self.definition_reference.on_load_target_href, target_frame: self.definition_reference.on_load_target_frame, navigate_to: true });
			},
			dependency_set_callbacks: [],
			last_page_data: null,
			render: function(input) {
				var self = this;
			
				/*var $dropzones = $('body > input');
				$dropzones.eq(0).remove();
				$dropzones.eq(1).remove();
				$('.dropzone').remove();*/

				//self.page_reference.page_control = self;
				var page_data = {...self.page_data};
				/*var page_data = {...self.page_data};
				if(typeof page_data.can_edit !== 'undefined') {
					if(page_data.can_edit) {
						if(branch.root.base.authentication.status.user_id == -1) {
							//alert(branch.root.base.authentication.status.user_id);
							delete page_data.can_edit;
							//page_data.can_edit = -1;
						}
						//alert(page_data.can_edit);
					}
				}*/
				delete page_data.parent;
				delete page_data.root;
				delete page_data.obj_id;
				var current_state = {
					id: self.page_reference.id,
					page_data: {...page_data}
				};	
				branch.root.base.data.current_state = current_state;
				var stringified = branch.root.base.to_string(page_data);//JSON.stringify(page_data);
				var $pre_pages = self.$container.find('.page');
				/*if(typeof self.page_reference.keep_page !== 'undefined') {
					
				} else {
					//$pre_pages.remove();
				}*/
				if(false && self.page_reference.id == 'subitemstree') { // !== 'undefined') {
				
					if($pre_pages.length > 0) { //&& 
						var last_page_data = $pre_pages.first().attr('last_page_data');
						if(typeof last_page_data !== 'undefined' && last_page_data != null) {
							var from_last = JSON.parse(last_page_data);
							if(page_data != null) {
								console.log(from_last, page_data);
								var keys = Object.keys(page_data);
								var same = true;

								for(var key of keys) {
									if(from_last[key] != page_data[key]) {
										same = false;
									}
								}
								//if(last_page_data != stringified && stringified != 'null') {
								if(!same) {
									//alert(last_page_data+' - '+stringified);
									$pre_pages.detach();
								} else {
									//alert(stringified);
									//return;
								}
							}
						}
						/*console.log(self.last_page_data, stringified);
						return;*/
					}
				}

				self.last_page_data = stringified;
				var $page = $("<div class='page'></div>");
				$page.attr('last_page_data', stringified);
				if(typeof self.page_reference.url_property_page_classes !== 'undefined') {
					for(var url_property_reference of self.page_reference.url_property_page_classes) {
						if(typeof self.page_data[url_property_reference.property] !== 'undefined') {
							if(self.page_data[url_property_reference.property] == url_property_reference.value) {
								$page.addClass(url_property_reference.class_value);
							}
						} else {
						}
					}
				}
				$page.hide().on('reload', function() {
					branch.reload_all_pages(self.frame);
				});
				$page.on('click', function() {
					$(':not(tr).selected').removeClass('selected');
				});
				self.$element = $page;
				$page.attr('id', self.page_reference.id);
				if(typeof self.page_reference.template !== 'undefined') {
					var $template_item_reference = branch.root.$templates.find(self.page_reference.template).first();
					branch.root.$templates_original.find(self.page_reference.template).first().remove();
					$page.append($template_item_reference.html());
					if(self.page_reference.template == 'index_container') {
						$template_item_reference.remove();
					}
				}
				self.$container.append($page);
				/*setTimeout(function() {
				//if(typeof self.page_reference.keep_page !== 'undefined') {
				if(self.page_reference.id == 'subitemstree') {
				}
				}, 250);*/
				/*if(typeof self.page_reference.template_content_target_selector !== 'undefined') {
					var $template_content = branch.root.$templates.find(
					self.$container.append($template_content);
				}*/
				if(true || typeof input.reset_frames !== 'undefined') {
					/*self.frame.$frame.find('.frame').each(function() {
						$(this).remove();
					});*/
					self.frame.sub_frames = [];
				}
				self.elements = [];
				for(element of self.page_reference.content) {
				//var index_element = 0;
				/*var end_element_callback = null;
				var main_element_load_callback = function() {*/
					//var element = self.page_reference.content[index_element];
					/*element = {...element};
					element.definition_reference*/
					(function(element) {
						var element_reference = branch.root.elements_control.get_element_reference(element);
						if(typeof element_reference.definition_reference.frame_dependency !== 'undefined') {
							//alert(page_reference.parent.frame.id);
							////console.log('frame dependency', page_reference, element, self);
							//alert(element.frame.id);
							if(self.frame.id != element_reference.definition_reference.frame_dependency) {
								return;
							}
						}
						element_reference.current_state = current_state;
						self.elements.push(element_reference);
						if(typeof self.elements_by_type[element_reference.definition_reference.type] === 'undefined') {
							self.elements_by_type[element_reference.definition_reference.type] = {};
						}
						if(typeof element.property_references !== 'undefined') {
							for(var property_reference of element.property_references) {
								var load_mask = {};
								load_mask[property_reference.target] = property_reference.reference;
								branch.root.interpretation.apply_load_mask(load_mask, element_reference.definition_reference, self.page_data, undefined, self);
								//console.log('property reference', load_mask, element_reference.definition_reference, self);
							}
						}

						self.elements_by_type[element_reference.definition_reference.type][element_reference.id] = element_reference;
						element_reference.render({
							page_reference: self
						});
						if(typeof element.extra_class !== 'undefined') {
							var class_split = element.extra_class.split(' ');
							for(var class_item of class_split) {
								element_reference.$element.addClass(class_item);
							}	
						}
						if(typeof element.reload_on_navigation !== 'undefined') {
							if(element.reload_on_navigation) {
								(function(element_reference) {
									element_reference.$element.addClass('reload_on_navigation');
								}(element_reference));
							}
						}
						if(element_reference.$element != null) {
							(function(element_reference) {
								element_reference.$element.on('reload_element', function() {
									element_reference.load({
										callback: function() {
											branch.global_final_callback();
										},
									});
								});
							}(element_reference));
						}
						////console.log('render element: '+element_reference.id+' - '+element_reference.definition_reference.type);
						if(typeof element.dependency !== 'undefined') {
							if(!Array.isArray(element.dependency)) {
								element.dependency = [element.dependency];
							}
							var set_hide;
							if(element.dependency.length > 1) {
								set_hide = null;
							}
							for(var x in element.dependency) {
								(function(x) {
									var linked_item = element.dependency[x].linked_item;
									if(typeof linked_item === 'undefined') {
										linked_item = element.dependency[x].link;
									}
									var dependency_callback = function(override) {
										////console.log('called dependency', linked_item);
										var type = 'hide';
										if(typeof element.dependency[x].type !== 'undefined') {
											type = element.dependency[x].type;
										}
										var load_mask;
										load_mask = {
											active: linked_item
										};
										var result = {};
										//branch.root.interpretation.apply_load_mask(load_mask, result, input.page_data, undefined, self);
										if(linked_item == 'global.user_id') {
											result.active = branch.root.base.authentication.status.user_id;
										} else {
											branch.root.interpretation.apply_load_mask(load_mask, result, self.page_data, undefined, self);
										}
										////console.log('dependency result', result, page_data, load_mask);
									
										//alert(JSON.stringify(result)+' '+element.id);

										var display = false;
										if(typeof element.dependency[x].value === 'undefined' || element.dependency[x].value == 'set') {
											if(result.active != -1  && result.active != 0 && result.active) {
											/*if(typeof result.active !== 'undefined') {*/
												display = true;
											}
										} else if(element.dependency[x].value == 'not_set') {
											display = true;
											//alert(result.active);
											if(result.active != -1 && result.active) {
												display = false;
											}
										}
										switch(type) {
											case 'hide':
												if(display) {
													if(typeof override !== 'undefined' && set_hide == null) {
														//set_hide = false;
													} else {
														element_reference.$element.show();
													}
												} else {
													if(typeof override !== 'undefined' && set_hide == null) {
														set_hide = true;
													} else {
														element_reference.$element.hide();
													}
												}
												break;
											case 'disabled':
												if(display) {
													element_reference.$element.find('.disabled_overlay').first().remove();
												} else {
													element_reference.$element.wrap("<div style='position:relative;'></div>").parent().append("<div class='disabled_overlay'></div>");
												}
												break;
										}
									}
									var is_page_data = true;
									if(linked_item.indexOf('.') != -1) {
										var linked_split = linked_item.split('.');
										var linked_type = linked_split[0];
										if(linked_type != 'page_data' && linked_type.indexOf('_') != -1) {
											is_page_data = false;
											var further_split = linked_type.split('_');
											var linked_type = further_split.splice(further_split.length-1, 1)[0];
											var dependency_set_callback = function() {
												//////console.log(linked_type);
												//////console.log(linked_split[1]);
												var id_from_split = further_split.join('_');
												var element_object = self.elements_by_type[linked_type][id_from_split];
												var $linked_element = element_object.$element;
												var $linked_item = $linked_element.find('#'+linked_split[1]).first();
												$linked_item.on('change', function(e) {
													////alert($(this).val());
													dependency_callback();
												});
												dependency_callback();
											}
											self.dependency_set_callbacks.push(dependency_set_callback);
										}
									}
									if(is_page_data) {
										dependency_callback(true);
									}
								}(x));
								if(set_hide) {
									element_reference.set_disabled = true;
									element_reference.$element.hide();
								} else {
									element_reference.$element.show();
								}
							}
						}

					}(element));
				}
				//end_element_callback = function() {
					if(typeof self.main_callback !== 'undefined') {
						var callback_send_data = {

						};
						if(typeof input.pre_active_pages !== 'undefined') {
							callback_send_data.pre_active_pages = input.pre_active_pages;
							//////////console.log('--set callback_send_data.pre_active_pages', input.pre_active_pages);
						}
						self.main_callback(callback_send_data);
					}
				//};
			},
			load_global_elements: function($container) {
				var page_control = this;
				if(typeof page_control.global_elements !== 'undefined' && page_control.global_elements != null) {

					var global_elements = [...page_control.global_elements];
					var load_callback = function() {
						var global_element = global_elements.pop();
						//for(var global_element of page_control.global_elements) {
							global_element.load({
								$loaded_container: $container,
								callback: function() {
									if(global_elements.length > 0) {
										load_callback();
									}
								}
							});
						//}
					}
					if(global_elements.length > 0) {
						load_callback();
					}
				}
			},	
			post_load_pre_view_callbacks: [],
			global_elements: [],
			set_title: function(title_value) {
				var self = this;
				var title_tab_value = '';
				if(typeof self.page_data.title !== 'undefined') {
					title_tab_value = self.page_data.title;
				} else if(typeof self.page_reference.title !== 'undefined') {
					title_tab_value = self.page_reference.title;
				} else { 
					title_tab_value = self.page_reference.id.split('_')[0].split('');
					title_tab_value[0] = title_tab_value[0].toUpperCase();
					title_tab_value = title_tab_value.join('');
				}

				title_tab_value = title_tab_value+' - '+branch.root.main_name;
				document.title = title_tab_value;
			},
			load: function(input) {
				var self = this;
				self.post_load_pre_view_callbacks = [];
				var total_count = 0;//self.elements.length;
				var count = 0;
				self.global_elements = [];
				//load elements in correct order and not load elements which have bound load events
				for(element of self.elements) {
					if(typeof element.definition_reference.is_global === 'undefined') {
						total_count++;
					} else {
						self.global_elements.push(element);
					}
				}
				self.set_title();
				var load_elements_callback = function() {
					//for(element of self.elements) {
					//var element_set_index = 0;
					var element_load_callback = function() {
						var element = self.elements[count];
						if(typeof element.definition_reference.is_global === 'undefined') {
							var params = null;
							params = {
								page_data: self.page_data,
								callback: function() {
									/*if(count == total_count && typeof input.callback !== 'undefined') {
										input.callback();
									}*/
									//console.log('pre view callbacks', self.post_load_pre_view_callbacks);
									/*if(count == total_count-self.post_load_pre_view_callbacks.length && self.post_load_pre_view_callbacks.length > 0) {
										for(var load_after_item of self.post_load_pre_view_callbacks) {
											//alert('load after item');
											console.log('load after item');
											load_after_item(params);
										}
									} else */
									count++;
									if(count == total_count) {
										if(typeof self.page_reference.callback !== 'undefined') {
											self.page_reference.callback(self.$element, branch);
										}
										if(typeof input.callback !== 'undefined') {
											input.callback();
										}
									} else {
										element_load_callback();
										//element_set_index++;
									}
								}
							};
							if(typeof input.soft_load !== 'undefined' && input.soft_load) {
								params.soft_load = true;
							}
							////console.log('load element', element);
							if(typeof element.definition_reference.form_wrap_id !== 'undefined' && typeof element.definition_reference.load_always === 'undefined' && !self.page_data.can_edit) {

								/*count++;
								if(count == total_count && typeof input.callback !== 'undefined') {
									input.callback();
								}*/
								params.callback();
							} else {
								if(typeof element.set_disabled !== 'undefined') {
									/*count++;
									if(count == total_count && typeof input.callback !== 'undefined') {
										input.callback();
									}*/

									params.callback();
								} else {
									/*if(typeof element.definition_reference.load_after_page !== 'undefined') {
										(function(element) {
											console.log('push', element);
											self.post_load_pre_view_callbacks.push(function(params) {
												element.load(params);

											});
										}(element));
									} else {*/
										element.load(params);
									//}
									//element.load(params);
								}
							}
						}
					};
					element_load_callback();
				};
				if(typeof input.soft_load !== 'undefined') {
					if(typeof self.page_reference.get_page_data !== 'undefined') {
						self.page_reference.get_page_data(null/*self.page_data*/, function(data) {

							self.page_data = data;
							load_elements_callback();
						});
					} else {
						load_elements_callback();
					}
				} else {
					load_elements_callback();
				}
			},
			display: function(input) {
				var self = this;

				for(dependency_set_callback of self.dependency_set_callbacks) {
					dependency_set_callback();
				} 
				self.dependency_set_callbacks = [];

				var pages_to_display = [];
				if(typeof input.pages_to_display !== 'undefined') {
					pages_to_display = input.pages_to_display;
				}
				var pre_active_pages = [];
				if(typeof input.pre_active_pages !== 'undefined') {
					pre_active_pages = input.pre_active_pages;
				}
				//////////console.log('display---:', pages_to_display, pre_active_pages);
				var page_show = true;
				if(typeof self.page_reference.animation !== 'undefined') {
					for(animation_item of self.page_reference.animation) {
						var index = pre_active_pages.map(function(e) {
							return e.page_reference.id;
						}).indexOf(animation_item.from_page);
						if(animation_item.from_page == '*') {
							index = pre_active_pages.map(function(e) {
								return e.frame;
							}).indexOf(self.frame);
						}
						if(index != -1) {
							var pre_active_page = pre_active_pages[index];
							if(pre_active_page.frame == self.frame) {
								switch(animation_item.type) {
									case 'overlay': 
										page_show = false;
										if(self.$element.find('.close_button').length == 0) {
											var $close_button = $('<div class="close_button_general general_element"><i class="icofont-close-line-circled"></i></div>');
											$close_button.find('i').first().click(function() {
												//history.back();

												if(self.frame.active_pages.length > 1) {
													var page = self.frame.active_pages[0];
													page.navigate_to();
												}

											});
											self.$element.prepend($close_button);
											if(typeof self.page_data.id !== 'undefined') {
												if(self.frame.active_pages.length > 1) {
													var page = self.frame.active_pages[0];
													var $item_reference = page.$element.find('#'+self.page_data.id).first();
													if($item_reference.parent().is('a')) {
														$item_reference = $item_reference.parent();
														var $prev = $item_reference.prev();
														if($prev.length > 0 && $prev.is('a')) {
															var $previous_button = $('<br><i class="icofont-rounded-double-left"></i>');
															$close_button.append($previous_button);
															$previous_button.click(function() {
																$prev.get(0).click();
															});
														}
														var $next = $item_reference.next();
														if($next.length > 0 && $next.is('a')) {
															var $next_button = $('<br><i class="icofont-rounded-double-right"></i>');
															$close_button.append($next_button);
															$next_button.click(function() {
																$next.get(0).click();
															});
														}
													}
												}
											}
										}
										self.$element.addClass('overlay');
										self.$element.fadeIn('slow');
										break;
									case 'slide_in':
										/*self.$element.css({
											'margin-right': '-100%'
										}).animate({
											'margin-right': '0px'
										}, 1200);*/
										var height = pre_active_page.$element.height();
										self.$element.css({
											/*'margin-left': '110%',
											'margin-right': '-110%',*/
											'position': 'absolute',
											'right': '-100%',
											'left': '100%',
											//'height': height
										});
										self.$element.show().addClass('animation_in_progress');
										self.$element.animate({
											'right': '0px',
											'left': '0px'
										}, 750, 'easeOutQuad', function() {
											self.$element.css({
												'position': '',
												'height': ''
											}).removeClass('animation_in_progress');
										});
										break;
									/*case 'unset_overlay':
										$self.$element.removeClass('blur');
										break;*/
								}
							}
						}
						/*index = pages_to_display.map(function(e) {
							return e.page_reference.id;
						}).indexOf(animation_item.from_page);
						if(index != -1) {
							var pre_active_page = pages_to_display[index];
							if(pre_active_page.frame == self.frame) {
								switch(animation_item.type) {
									case 'unset_overlay':
										$self.$element.removeClass('blur');
										break;
								}
							}
						}*/
					}
				}

				if(page_show) {
					self.$element.show();
					//console.log('page show');
					if(typeof self.page_reference.animation !== 'undefined') {
						var overlay_index = self.page_reference.animation.map(function(e) {
							return e.type;
						}).indexOf('overlay');
						if(overlay_index != -1) {
							self.$element.addClass('overlay');
						}
					}
					////console.log('show element', self.page_reference);
					var parent_frame = branch.find_parent_frame(self.frame.id);
					if(parent_frame != self.frame) {
						branch.display_pages_in_frame(parent_frame);
					}
				}
				/*alert($('.page:visible').length +' - '+ $('.page').length);
				if($('.page:visible').length == $('.page').length) {
					branch.global_final_callback();
				}*/
			},
			hide: function(input) {
				var remove = false;
				////////console.log('hide input: ', input);
				if(typeof input.remove !== 'undefined') {
					remove = input.remove;
				}
				//////////console.log(input);
				var pages_to_display = [];
				if(typeof input.pages_to_display !== 'undefined') {
					pages_to_display = input.pages_to_display;
				}
				var pre_active_pages = [];
				if(typeof input.pre_active_pages !== 'undefined') {
					pre_active_pages = input.pre_active_pages;
				}
				//////////console.log('hide input: ', pages_to_display, pre_active_pages);
				//impelement animations per from page and to page
				var self = this;
				var end_callback = function() {
					if(typeof remove !== 'undefined') {
						self.remove();
					}
					//dropzone fix
					/*if(typeof app.dropzone_global !== 'undefined') {
						app.dropzone_global.destroy();
					}
					var $dropzones = $('body > input');
					$dropzones.eq(0).remove();
					$dropzones.eq(1).remove();*/
				};
				var href_target_frame = null;
				if(typeof input.href_target_frame !== 'undefined') {
					href_target_frame = input.href_target_frame;
				}
				var perform_animation = false;
				if(typeof self.page_reference.animation !== 'undefined') {
					for(animation_item of self.page_reference.animation) {
						var index = pages_to_display.map(function(e) {
							return e.page_reference.id;
						}).indexOf(animation_item.from_page);
						if(animation_item.from_page == '*') {
							index = pages_to_display.map(function(e) {
								return e.frame;
							}).indexOf(self.frame);
						}
						if(index != -1) {
							var pre_active_page = pages_to_display[index];
							if(pre_active_page.frame == self.frame) {
								//perform_animation = true;
								switch(animation_item.type) {
									/*case 'overlay': 
										//self.$element.addClass('overlay');
										//////////console.log('hide overlay');
										self.$element.fadeOut('slow', function() {
											end_callback();
										});
										break;*/
									case 'slide_in':
										perform_animation = true;
										//self.$element.show();
										var height = self.$element.height();
										self.$element.css({
											'position': 'absolute',
											'height': height
										}).addClass('animation_in_progress').animate({
											'left': '-100%',
											'right': '100%'
										}, 750, 'easeOutQuad', function() {
											self.$element.hide().removeClass('animation_in_progress');
											end_callback();
										});
										break;
									case 'unset_overlay':
										perform_animation = true;
										self.$element.addClass('blur');
										break;
								}
							}
						}
						index = pre_active_pages.map(function(e) {
							return e.page_reference.id;
						}).indexOf(animation_item.from_page);
						////////console.log('hide animation item', animation_item);
						if(index != -1) {
							pre_active_page = pre_active_pages[index];
							if(pre_active_page.frame == self.frame && self.frame.id == href_target_frame) {
								switch(animation_item.type) {
									/*case 'slide_in':
										perform_animation = true;

										//self.$element.show();
										self.$element.animate({
											'margin-left': '-110%',
											'margin-right': '110%',
										}, 750, 'easeOutQuad', function() {

										});
										break;*/
									case 'overlay': 
										perform_animation = true;
										//self.$element.addClass('overlay');
										//////////console.log('hide overlay');
										if(pages_to_display.length > 0) {
											/*alert(pre_active_page.page_reference.id);
											alert(pages_to_display[0].page_reference.id);*/
											if(pre_active_page.page_reference.id == pages_to_display[0].page_reference.id) {
												self.frame.$frame.find('.blur').removeClass('blur').first();
											}
										} else {
											self.frame.$frame.find('.blur').removeClass('blur').first();
										}
										self.$element.fadeOut('slow', function() {
											end_callback();
										});
										break;
								}
							}
						}
					}
				}
				if(!perform_animation) {
					var perform_hide = false;
					/*//console.log(pages_to_display.map(function(e) {
						return e.page_reference.id;
					}), self.frame.active_pages.map(function(e) {
						return e.page_reference.id;
					}));*/
					////console.log(pages_to_display);
					for(page_display of pages_to_display) {
						////console.log('display frame: ', page_display.frame, self.frame);
						if(page_display.frame == self.frame) {
							////alert('same frame');
							perform_hide = true;
						}
					}
					if(perform_hide) {
						self.clear_intervals();
						self.$element.hide();
						end_callback();
					}
				}/* else {
					//console.log('not performa nimation', self.frame.active_pages.map(function(e) {
						return e.page_reference.id;
					}));
				}*/
				
			},
			remove: function() {
				var self = this;
				var keep_page = false;
				if(typeof self.page_reference.keep_page !== 'undefined') {
					keep_page = true;
				}
				var index = self.frame.active_pages.indexOf(self);
				self.frame.active_pages.splice(index, 1);
				//console.log('remove', self, 'keep_page', keep_page, branch.base_frame);
				/*if(keep_page) {
					
					self.$element.detach();
				} else {*/
					self.$element.remove();
				//}
					/*var $stored_element = self.$element.detach();
					self.$stored_element = $stored_element;
					if(typeof self.frame.inactive_pages === 'undefined') {
						self.frame.inactive_pages = [self];
					}*/
				//}
				//branch.remove_frame(self.frame);
				
				//$('.checked_remove').removeClass('checked_remove');
			}
		};
		if(typeof input.main_callback !== 'undefined') {
			page_control.main_callback = input.main_callback;
		}
		branch.root.base.assign_root(page_control, true);
		if(input.frame_reference.active_pages.indexOf(page_control) == -1) {
			input.frame_reference.active_pages.push(page_control);
		}


		return page_control;
	}
};