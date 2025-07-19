app.elements.link = {
	init: function(element) {
		var branch = this;
		//console.log(branch);
		var item_reference = {
			id: element.id,
			definition_reference: element,
			$element: null,
			render: function(input) { //page_reference getur verid element_reference lika
				var self = this;
				var $container = null;
				//console.log('input', input);
				if(typeof input.page_reference !== 'undefined') {
					$container = input.page_reference.$element;
					self.page_reference = input.page_reference;
				}
				if(typeof input.$container !== 'undefined') {
					$container = input.$container;
				}
				var $item = $("<div class='link'></div>");
				$item.attr('id', element.id);
				if(typeof element.content !== 'undefined') {
					$item.html(element.content);
				}
				if(typeof element.template_target_selector !== 'undefined') {
					var $template_target = $container.find(element.template_target_selector).first();
					if(typeof element.ready_selector === 'undefined') {
						$template_target.html($item);
					} else {
						$item = $template_target;
					}
				} else if(typeof element.contained !== 'undefined') {
					$item = $container;
				} else {
					if(typeof input.wrap !== 'undefined') {
						$item = $container.children();
					} else {
						$container.append($item);
					}
				}
				self.$element = $item;
				if(typeof element.hidden !== 'undefined' && element.hidden) {
					$item.hide();
				}
				//console.log(input);
				if(typeof self.definition_reference.url_link !== 'undefined') {
					self.$element.wrap("<a></a>");
					self.$element.parent().parent().find('a').first().attr('href', self.definition_reference.url_link);
				} else if(typeof self.definition_reference.target_href !== 'undefined') {
					/*var target_frame = 'self';
					if(typeof self.definition_reference.target_frame !== 'undefined') {
						target_frame = self.definition_reference.target_frame;
					}*/
					var send_data = {
						page: self.definition_reference.target_href,
						$element: self.$element,
						get_data: {}
					};
					var load_data = input.page_reference.page_data;
					if(typeof input.set_load_data !== 'undefined') {
						load_data = input.set_load_data;
					}
					if(typeof self.definition_reference.target_frame !== 'undefined') {
						send_data.target_frame = self.definition_reference.target_frame;
					}
					if(typeof self.definition_reference.top_level_load !== 'undefined') {
						send_data.target_frame = 0;
						send_data.clear_after_set_frame = true;
					}
					if(typeof self.definition_reference.post_data !== 'undefined') {
						branch.root.interpretation.apply_load_mask(self.definition_reference.post_data, send_data.get_data, load_data, undefined, input.page_reference);
					}
					if(typeof self.definition_reference.target_persist_get_data !== 'undefined') {
						send_data.persist_previous_get_data = true;
					}
					if(typeof self.definition_reference.navigate_to !== 'undefined' && (send_data.navigate_to === true || send_data.navigate_to === 1)) {
						send_data.navigate_to = true;
					}
					if(typeof self.definition_reference.navigate_to_after_load !== 'undefined' && self.definition_reference.navigate_to_after_load === true) {
						send_data.navigate_to_after_load = self.definition_reference.navigate_to_after_load;
					}
					if(typeof self.definition_reference.apply_get_to_all !== 'undefined') {
						send_data.apply_get_to_all = self.definition_reference.apply_get_to_all;
					}	
					if(typeof self.definition_reference.navigation_merge !== 'undefined') {
						send_data.navigation_merge = self.definition_reference.navigation_merge;
					}
					if(typeof self.definition_reference.skip_reset !== 'undefined') {
						send_data.skip_reset = self.definition_reference.skip_reset;
					}
					if(typeof self.definition_reference.navigate_to_on_reload !== 'undefined') {
						send_data.navigate_to_on_reload = self.definition_reference.navigate_to_on_reload;
					}
					if(typeof self.definition_reference.highlight_item_id_callback !== 'undefined') {
						var set_id_value = $item.closest(self.definition_reference.highlight_item_id_callback).attr('id');
						if(set_id_value != null) {
							send_data.highlight_id_callback = set_id_value;
						}
					}
					/*if(typeof self.definition_reference.highlight_id_callback !== 'undefined' && typeof send_data.id !== 'undefined') {
						highlight_id_callback = send_data.id;
					}*/
					branch.root.navigation.generate_href(send_data);
				} else if(typeof input.page_reference.page_data[element.id] !== 'undefined') {
					self.$element.children().wrap("<a></a>");
					self.$element.find('a').first().attr('href', input.page_reference.page_data[element.id]);
				}
			},
			load: function(input) {
				var self = this;
				if(typeof input.send_data !== 'undefined') {
					
				}
				if(typeof element.click_if_no_href_is_active !== 'undefined') {
					//branch.root.interpretation.persistant_global_callbacks.push(function() {
					//alert(self.$element.parent('.page').length);
					self.page_reference.$element.off('load.persistant').on('load.persistant', function() {
						var $active_selected = $('.active_selected');
						//alert($active_selected.length);
						if($active_selected.length == 0) {
							self.$element.trigger('click');//.trigger('click');
						}
					});
				}
				if(typeof input.callback !== 'undefined') {
					input.callback();
				}
			}
		};

		return item_reference;
	}
};