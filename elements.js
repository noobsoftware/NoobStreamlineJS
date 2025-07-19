app.elements_control = {
	render_count: {},
	get_element_reference: function(element_definition) {
		//console.log(element_definition);
		return this.root.elements[element_definition.type].init(element_definition);
	},
	append: function(element, $item, $container) {
		if(typeof element.template_target_selector !== 'undefined') {
			var $template_target = $container.find(element.template_target_selector).first()
			$template_target.html($item);
		} else {
			$container.append($item);
		}
	},
	render_base: function(input, $container, html, element, self) {
		if(typeof input.page_reference !== 'undefined') {
			$container = input.page_reference.$element;
			self.page_reference = input.page_reference;
		}
		if(typeof input.$container !== 'undefined') {
			$container = input.$container;
		}
		var $item = $(html);
		$item.attr('id', element.id);

		if(typeof element.template_target_selector !== 'undefined') {
			var $template_target = $container.find(element.template_target_selector).first()
			$template_target.html($item);
		} else {
			if(typeof input.wrap !== 'undefined') {
				$item = $container.children();
			} else {
				$container.append($item);
			}
		}
		self.$element = $item;
		return $item;
	}
};