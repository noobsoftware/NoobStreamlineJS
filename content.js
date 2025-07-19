app.elements.content = {
	init: function(element) {
		var branch = this;
		var outer_branch = this;
		var item_reference = {
			id: element.id,
			definition_reference: element,
			$element: null,
			render: function(input) { //page_reference getur verid element_reference lika
				var self = this;
				//console.log('content input: ', input);
				var $container = null;
				if(typeof input.page_reference !== 'undefined') {
					self.page_reference = input.page_reference;
					$container = input.page_reference.$element;
				}
				if(typeof input.$container !== 'undefined') {
					$container = input.$container;
					/*debug*/
					
				}
				if(true) {
					if(Array.isArray(element.content)) {
						element.content = element.content.join(', ');
					}
				}
				var $item = $("<div class='content'></div>");
				$item.attr('id', element.id);
				if(typeof element.content !== 'undefined') {
					if(typeof element.is_image !== 'undefined') {
						var image_location = '';
						if(typeof element.image_location !== 'undefined') {
							image_location = element.image_location+'/';
						}
						/*if(input.page_data[set_id].indexOf('.png') == -1) {
							input.page_data[set_id] += '.png';
						}*/
						$item.html("<img src='"+image_location+element.content+"' />");
					} else {
						$item.html(element.content);
					}
				} else if(typeof element.content_selector !== 'undefined') {
					$item.html($('#templates').find(element.content_selector).first().clone());
				}
				if(typeof element.template_target_selector !== 'undefined') {
					var $template_target = $container.find(element.template_target_selector).first();
					$template_target.html($item);
				} else {
					$container.append($item);
				}
				self.$element = $item;
				if(typeof element.class !== 'undefined') {
					self.$element.addClass(element.class);
				}
				if($item.html().trim().length == 0) {
					if(typeof element.hide_if_null !== 'undefined') {
						$item.hide();
					}
				}
				if(typeof element.placeholder !== 'undefined') {
					$item.attr('data-text', element.placeholder);
				} else {
					$item.attr('data-text', '');
				}

				if(typeof element.default_text !== 'undefined') {
					$item.attr('data-text-default', element.default_text);
				} else {
					$item.attr('data-text-default', '');
				}
				
				/*if(typeof element.delimit_and_style_tilde !== 'undefined') {
					var value = $item.text();
					alert(value);
					if(value.indexOf('~') != -1) {
						var split = value.split('~');
						var $span_title = $('<span></span>');
						$span_title.text(split[0]);
						var $span_tilde = $('<span></span>');
						$span_tilde.text(split[1]);
						$item.html($span_title);
						$item.append($span_tilde);
					}
				}*/

				if(typeof element.editable !== 'undefined' && branch.root.base.authentication.status.user_id != -1) {
					var type = 'input';
					if(element.editable !== true) {
						type = element.editable;
					}
					self.$element.on('dblclick', function(e) {
						if(typeof element.editability_dependant_property !== 'undefined') {
							if(typeof input.page_reference.page_data.can_edit !== 'undefined') {
								if(input.page_reference.page_data.can_edit) {
									//return true;
								} else {
									return false;
								}
							} else {
								return false;
							}
						}
						self.$element.addClass('in_edit');
						var last_value = self.$element.text();
						console.log('set value', last_value, self.$element.attr('last_value'));
						if(typeof self.$element.attr('last_value') !== 'undefined' && self.$element.attr('last_value') != null) {
							last_value = self.$element.attr('last_value');
						}
						var last_height = -1;
						var $input = null;
						if(type == 'input') {
							$input = $("<input type='text' class='editable_content_input' />");
							$input.on('keydown', function(e) {
								if(e.keyCode == 13) {
									$input.parent().find('.corrections').remove();
									$(this).blur();
								}
							});
							if(typeof element.sub_type !== 'undefined') {
								if(element.sub_type == 'date') {
									$input.attr('type', 'date');
								}
							}
						} else if(type == 'textarea') {
							var last_height = self.$element.height()+20;
							$input = $("<textarea class='editable_content_input'></textarea>");
						}

						$input.val(last_value);
						self.$element.html($input);

						if(typeof element.tag_check_category !== 'undefined') {
							$input.addClass('tag_check').attr('tag_check_category', element.tag_check_category);
							branch.root.base.global_tags.perform_tag_check_callback(self.$element);
						}

						if(last_height != -1) {
							$input.css('min-height', last_height);
						}
						$input.css('min-width', $input.get(0).scrollWidth+'px');
						$input.focus();

						//$input.get(0).style.width = $input.get(0).value.length+'ch';
						$input.on('input', function() {
							//console.log('scrollwidth', this.scrollWidth, this.clientWidth);
							//this.style.width = this.scrollWidth;
							//this.style.width = this.value.length+'ch';
							$(this).css('min-width', this.scrollWidth)+'px';
						}).off('focusout').on('focusout', function(e) {
							//return false;
							if($input.parent().find('.corrections').length > 0 && $input.val().length > 0) {
								if($input.parent().find('.corrections').find('.correction').length > 0) {
									return;
								}
							}
							self.$element.removeClass('in_edit');
							var post_data = {
								'action': '_'
							};
							if(typeof input.page_reference.page_reference.get_data !== 'undefined') {
								if(typeof input.page_reference.page_data.id !== 'undefined') {
									post_data['id'] = input.page_reference.page_data.id;
								}
								if(typeof input.page_reference.page_reference.get_data === 'object') {
									if(typeof input.page_reference.page_reference.get_data.item !== 'undefined') {
										post_data.item = input.page_reference.page_reference.get_data.item;
									}
								}
							} 
							if(typeof element.item !== 'undefined') {
								post_data.item = element.item;
							}
							if(typeof element.set_id_value !== 'undefined') {
								post_data.id = element.set_id_value;
							}
							if(typeof element.from_element_id !== 'undefined') {
								if(element.from_element_id === true) {
									var attr_id = self.$element.attr('id');

									if(typeof attr_id !== 'undefined' && attr_id != null) {
										post_data.id = attr_id;
									}
								} else {
									var $parent = self.$element.closest('.content_item_container').first();

									var attr_id = $parent.attr('id');

									if(typeof attr_id !== 'undefined' && attr_id != null) {
										post_data.id = attr_id;
									}
								}
							}
							var id_name = element.id;
							if(typeof element.id_name !== 'undefined') {
								id_name = element.id_name;
							}
							if(typeof element.flags !== 'undefined') {
								post_data['__flags'] = {};
								for(var flag of element.flags) {
									post_data['__flags'][flag] = true;
								}
								post_data['__flags'] = JSON.stringify(post_data['__flags']);
							}
							/*if(typeof element.allow_no_id !== 'undefined') {

							} else {*/
								if(typeof post_data.id !== 'undefined' || post_data.id === -1 || typeof self.definition_reference.set_from_post_data !== 'undefined') {
									if(typeof self.definition_reference.set_from_post_data !== 'undefined') {
										delete post_data.id;
									}
									if(typeof self.definition_reference.post_data !== 'undefined') {
										branch.root.interpretation.apply_load_mask(self.definition_reference.post_data, post_data, self.page_reference.page_data, undefined, self.page_reference);
									}
								}
							//}
							var set_value = $input.val().trim();
							if(typeof element.remove_if_empty !== 'undefined' && set_value.trim().length == 0) {
								var delete_data = {
									id: post_data.id,
									'action': 'delete',
								};
								if(typeof element.delete_by_item_id !== 'undefined') {
									var $parent = self.$element.closest('.content_item_container').first();

									var attr_id = $parent.attr('id');

									if(typeof attr_id !== 'undefined' && attr_id != null) {
										delete_data.id = attr_id;
									}
								}
								//alert(JSON.stringify(delete_data));
								if(typeof post_data.item !== 'undefined') {
									delete_data.item = post_data.item;
								}
								if(typeof self.definition_reference.delete_by_post_data !== 'undefined') {
									//delete delete_data.id;

									//alert(JSON.stringify(delete_data));
									//alert(JSON.stringify(self.page_reference.page_data));
									var set_id = delete_data.id;
									if(typeof self.definition_reference.post_data !== 'undefined') {
										branch.root.interpretation.apply_load_mask(self.definition_reference.post_data, delete_data, self.page_reference.page_data, undefined, self.page_reference);
									}
									if(delete_data.id != set_id) {
										var alt_id = delete_data.id;
										delete_data.id = set_id;
										delete_data.alt_id = alt_id;
									}
								}
								if(delete_data.id == -1) {
									self.$element.remove();
								} else {
									//alert(JSON.stringify(delete_data));
									outer_branch.root.base.data.post({
										post_data: delete_data,
										callback: function(data) {
											//self.load();
											if(true) {
												self.$element.remove();
											} else {
												self.$element.remove();
											}
										}
									});
								}
								return false;
							}
							post_data[id_name] = set_value;
							//outer_branch.root.interpretation.apply_item_data(post_data, self);
							//alert(JSON.stringify(post_data));
							//return;
							outer_branch.root.base.data.post({
								post_data: post_data,
								callback: function(data) {
									//branch.root.load();
									self.$element.html(set_value);
									if(typeof self.$element.attr('last_value') !== 'undefined' && self.$element.attr('last_value') != null) {
										self.$element.attr('last_value', set_value);
									}
									if(typeof input.done_editing !== 'undefined') {
										input.done_editing(self.$element.html(), self.$element);
									}
									if(self.$element.hasClass('global_tags_registered')) {
										self.$element.removeClass('global_tags_registered');
										branch.root.base.global_tags.loaded_callback();
									}
								},
								cancel_callback: function() {
									self.$element.html(element.content);
									if(self.$element.hasClass('global_tags_registered')) {
										self.$element.removeClass('global_tags_registered');
										branch.root.base.global_tags.loaded_callback();
									}
									return false;
								},
								pending_callback: function() {
									self.$element.html(element.content);
									if(self.$element.hasClass('global_tags_registered')) {
										self.$element.removeClass('global_tags_registered');
										branch.root.base.global_tags.loaded_callback();
									}
									return false;
								}
							});
						});
					});
				}
			},
			add_value: function(value) {
				var self = this;
				self.$element.trigger('dblclick');
				self.$element.find('input').first().val(value);
			},
			line_clamp: function() {
				var self = this;
				var $item = self.$element;
				if(typeof element.line_clamp !== 'undefined') {
					var text = $item.text();
					//console.log(text);
					$item.html('<div class="start_text"></div><div class="line_clamp_four"></div><div class="read_more_button">See more</div>');
					var lines = text.split('\n');
					$item.find('.start_text').text(lines.splice(0, 1)[0]+'\n');
					var line_clamp_class = 'line_clamp_'+element.line_clamp;
					var $clamp = self.$element.find('.line_clamp_four').first();
					$clamp.text(lines.join('\n'));
					$clamp.addClass(line_clamp_class).click(function() {
						if($clamp.hasClass(line_clamp_class)) {
							$clamp.removeClass(line_clamp_class);
						}/* else {
							self.$element.addClass(line_clamp_class);
						}*/
					});
					$item.find('.read_more_button').first().click(function() {
						$clamp.removeClass(line_clamp_class);
						$(this).hide();
					});
				}
				if(typeof element.format !== 'undefined') {
					if(element.format == 'date') {
						var text = $item.text();
						var date = new Date(text);
						const options = {
							//weekday: "short",
							year: "numeric",
							month: "long",
							day: "numeric",
						};
						var date_string = date.toLocaleDateString("en-US", options);
						$item.text(date_string);
					}
				}
			},
			load: function(input) {
				var self = this;
				if(typeof input.send_data !== 'undefined') {
					
				}
				if(typeof input.page_data !== 'undefined' && typeof self.definition_reference.content === 'undefined') {
					var set_id = self.id;
					if(typeof element.set_id !== 'undefined') {
						set_id = element.set_id;
					}
					if(typeof input.page_data[set_id] !== 'undefined') {
						if(typeof element.content_is_icon !== 'undefined') {
							self.$element.html("<i class='"+input.page_data[set_id]+"' />");
						} else if(typeof element.is_image !== 'undefined') {
							var image_location = '';
							if(typeof element.image_location !== 'undefined') {
								image_location = element.image_location+'/';
							}
							if(input.page_data[set_id].indexOf('.png') == -1) {
								input.page_data[set_id] += '.png';
							}
							if(typeof element.no_reflection === 'undefined') {
								self.$element.html("<div><img src='"+image_location+input.page_data[set_id]+"' /></div><div class='img_reflection_container'><div class='img_reflection'><img src='"+image_location+input.page_data[set_id]+"' /></div><div class='img_reflection_overlay'></div></div>");
							} else {
								self.$element.html("<img src='"+image_location+input.page_data[set_id]+"' />");
							}
						} else {
							self.$element.html(input.page_data[set_id]);
						}
					}
				}

				if(typeof element.link !== 'undefined') {
					var display_link = true;
					if(typeof input.page_data !== 'undefined') {
						if(typeof input.page_data['can_edit'] !== 'undefined') {
							if(input.page_data['can_edit'] == 1) {
								display_link = false;
							}
						}
					}
					if(display_link) {
						var item_data_values = {};
						var link_item_definition = {...element.link};
						if(typeof element.sub_type !== 'undefined' && element.sub_type == 'date') {
							var content = self.$element.text();
							var split = content.split("-");
							var year = "'"+split[0]+"'";
							var month = "'"+split[1]+"'";
							item_data = {
								'year': year,
								'month': month
							};
							link_item_definition.post_data = item_data;
						} else {
							item_data_values.value = self.$element.text();
						}
						//link_item_definition.content = element.content;//events[x].value;
						if(self.$element.parent().find('a').length == 0) {
							var link_item = branch.root.elements['link'].init(link_item_definition);
							link_item.render({ 
								//wrap: true,
								$container: self.$element.first(), 
								page_reference: self.page_reference,
								set_load_data: item_data_values
							});
						}
					}
				}
				self.line_clamp();
				if(typeof input.callback !== 'undefined') {
					input.callback();
				}
			}
		};

		return item_reference;
	}
};