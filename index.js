
/**
 * Module dependencies
 */

var EventEmitter = require('events').EventEmitter
  , domify = require('domify')


/**
 * Expose `topcoat`
 */

var topcoat = module.exports = {};


/**
 * Returns the head of an array like object
 *
 * @api private
 * @param {Array} `a`
 */

function head (a) {
	return a[0];
}


/**
 * Returns the head of an array like object
 *
 * @api private
 * @param {Array} `a`
 */

function tail (a) {
	return a[a.length - 1];
}


/**
 * Checks if a given element has a class
 *
 * @api public
 * @param {Element} `el`
 * @param {String} `className`
 */

function hasClass (el, className) {
	return !!~el.className.split(' ').indexOf(className);
}


/**
 * Adds a class to a given DOM element
 *
 * @api private
 * @param {Element} `el`
 * @param {String} `className`
 */

function addClass (el, className) {
	if (hasClass(el, className)) return false;
	el.className += ' '+ className;
	el.className = el.className.trim();
	return true;
}


/**
 * Removes a class to a given DOM element
 *
 * @api private
 * @param {Element} `el`
 * @param {String} `className`
 */

function removeClass (el, className) {
	if (!hasClass(el, className)) return false;
	var classes = el.className.split(' ');
	classes.splice(classes.indexOf(className), 1);
	el.className = classes.join(' ');
	el.className = el.className.trim();
	return true;
}


/**
 * Replaces a class with another
 *
 * @api private
 * @param {Element} `el`
 * @param {String} `className`
 * @param {String} `newClassName`
 */

function replaceClass (el, className, newClassName) {
	removeClass(el, className);
	addClass(el, newClassName);
}


/**
 * Proxy events from element to `EventEmitter` instance
 *
 * @api public
 * @param {Element} `el`
 * @param {Object} `emitter`
 */

function proxyEvents (el, emitter) {
	// meta
	proxy('load');
	proxy('abort');
	proxy('error');
	proxy('invalid');
	proxy('reset');
	proxy('scroll');
	proxy('select');
	proxy('selectstart');
	proxy('submit');
	proxy('webkitfullscreenchange', 'fullscreenchange');
	proxy('webkitfullscreenerror', 'fullscreenerror');
	proxy('fullscreenchange');
	proxy('fullscreenerror');

	// interactions
	proxy('click');
	proxy('dblclick');
	proxy('contextmenu');
	proxy('drag');
	proxy('dragenter');
	proxy('dragend');
	proxy('dragleave');
	proxy('dragover');
	proxy('dragstart');
	proxy('drop');

	// mouse events
	proxy('mousemove');
	proxy('mouseover');
	proxy('mouseenter');
	proxy('mouseout');
	proxy('mouseleave');
	proxy('mouseup');
	proxy('mousedown');
	proxy('mousewheel');

	// copy/cut/paste events
	proxy('beforecopy');
	proxy('copy');
	proxy('beforecut');
	proxy('cut');
	proxy('beforepatse');
	proxy('patse');

	// input events
	proxy('blur');
	proxy('change');
	proxy('focus');
	proxy('input');

	// keyboard
	proxy('keydown');
	proxy('keyup');
	proxy('keypress');
	


	function proxy(event, as) {
		el.addEventListener(event, emitter.emit.bind(emitter, as || event), false);
	}
}


/**
 * `TopcoatElement` constructor
 *
 * @api public
 */

topcoat.TopcoatElement = TopcoatElement;
function TopcoatElement (el) {
	if (!(this instanceof Button)) return new Button(el);
	else if (el && !(el instanceof Element)) throw new TypeError("expecting an instance of `Element`");
	EventEmitter.call(this)
	this.el = el || domify('<span />');
	// proxy events
	proxyEvents(this.el, this);
}

// inherit from `EventEmitter`
TopcoatElement.prototype.__proto__ = EventEmitter.prototype;
TopcoatElement.prototype.constructor = TopcoatElement;


/**
 * Returns the inner html of the element
 * as a string
 *
 * @api public
 */

TopcoatElement.prototype.toString = function () {
	return this.el.innerHTML;
};


/**
 * Enables the element
 *
 * @api public
 */

TopcoatElement.prototype.enable = function () {
	removeClass(this.el, 'is-disabled')
	return this;
};


/**
 * Disables the element
 *
 * @api public
 */

TopcoatElement.prototype.disable = function () {
	addClass(this.el, 'is-disabled')
	return this;
};


/**
 * Checks if element instance is active
 *
 * @api public
 */

TopcoatElement.prototype.isActive = function () {
	return hasClass(this.el, 'is-active');
};


/**
 * Checks if the element is disabled
 *
 * @api public
 */

TopcoatElement.prototype.isDisabled = function () {
	return hasClass(this.el, 'is-disabled');
};


/**
 * Gets/sets the inner text of the element
 *
 * @api public
 * @param {String} `text`
 */

TopcoatElement.prototype.text = function (text) {
	if (undefined === text) return this.el.innerText;
	else this.el.innerText = text;
	return this;
};


/**
 * Gets/sets the inner html of the element
 *
 * @api public
 * @param {String} `text`
 */

TopcoatElement.prototype.html = function (html) {
	if (undefined === html) return this.el.innerHTML;
	this.el.innerHTML = html;
	return this;
};


/**
 * Gets/sets the width of the element
 *
 * @api public
 * @param {Number} `width`
 */

TopcoatElement.prototype.width = function (width) {
	if (undefined === width) return getComputedStyle(this.el).width;
	if (width !== width) return this;
	if ('number' === typeof width) width = String(width) + 'px';
	this.el.style.setProperty('width', width);
	return this;
};


/**
 * Gets/sets the height of the element
 *
 * @api public
 * @param {Number} `height`
 */

TopcoatElement.prototype.height = function (height) {
	if (undefined === height) return getComputedStyle(this.el).height;
	if (height !== height) return this;
	if ('number' === typeof height) height = String(height) + 'px';
	this.el.style.setProperty('height', height);
	return this;
};


/**
 * Shows the element
 *
 * @api public
 */

TopcoatElement.prototype.show = function (override) {
	this.el.style.setProperty('display', override || 'block');
	return this;
};


/**
 * Hides the element
 *
 * @api public
 */

TopcoatElement.prototype.hide = function () {
	this.el.style.setProperty('display', 'none');
	return this;
};


/**
 * Appends an element as a child
 *
 * @api public
 * @param {Element} `el`
 */

TopcoatElement.prototype.append = function (el) {
	this.el.appendChild(el);
	return this;
};


/**
 * Prepends an element as a child
 *
 * @api public
 * @param {Element} `el`
 */

TopcoatElement.prototype.prepend = function (el) {
	this.el.parentNode.insertBefore(el, this.el);
	return this;
};


/**
 * Appends the element to an element
 *
 * @api public
 * @param {Element} `el`
 */

TopcoatElement.prototype.appendTo = function (el) {
	el.appendChild(this.el);
	return this;
};


/**
 * Prepends the element to an element
 *
 * @api public
 * @param {Element} `el`
 */

TopcoatElement.prototype.prependTo = function (el) {
	el.parentNode.insertBefore(this.el, el);
	return this;
};


/**
 * Removes the element from the DOM
 *
 * @api public
 */

TopcoatElement.prototype.remove = function () {
	delete this.el.parentNode.removeChild(this.el);
	return this;
};


/**
 * Activates or deactivates the element
 *
 * @api public
 * @param {Boolean} `state`
 */

TopcoatElement.prototype.active = function (state) {
	state = (false === state)? false : true;
	if (state && !this.isActive()) addClass(this.el, 'is-active');
	else removeClass(this.el, 'is-active');
	return this;
};


/**
 * Adds a class on the element
 *
 * @api public
 * @param {String} `className`
 */

TopcoatElement.prototype.addClass = function (className) {
	addClass(this.el, className);
	return this;
};


/**
 * Removes a class on the element
 *
 * @api public
 * @param {String} `className`
 */

TopcoatElement.prototype.removeClass = function (className) {
	removeClass(this.el, className);
	return this;
};


/**
 * Replaces a class on the element
 *
 * @api public
 * @param {String} `className`
 * @param {String} `newClassName`
 */

TopcoatElement.prototype.replaceClass = function (className, newClassName) {
	replaceClass(this.el, className, newClassName);
	return this;
};


/**
 * Checks if the element has a class
 *
 * @api public
 * @param {String} `className`
 */

TopcoatElement.prototype.hasClass = function (className) {
	hasClass(this.el, className);
	return this;
};


/**
 * `Button` constructor
 *
 * @api public
 * @param {Element} `el` - optional
 */

topcoat.Button = Button;
function Button (el) {
	if (!(this instanceof Button)) return new Button(el);
	else if (el && !(el instanceof Element)) throw new TypeError("expecting an instance of `Element`");
	TopcoatElement.call(this, el);
	this.el = el || domify('<a></a>');

	this.addClass('topcoat-button');
	proxyEvents(this.el, this);
}

// inherit from `TopcoatElement`
Button.prototype.__proto__ = TopcoatElement.prototype;


/**
 * `QuietButton` constructor
 *
 * @api public
 */

topcoat.QuietButton = QuietButton;
function QuietButton (el) {
	if (!(this instanceof QuietButton)) return new QuietButton(el);
	Button.call(this, el);
	this.removeClass('topcoat-button');
	this.addClass('topcoat-button--quiet');
}

// inherit from `Button`
QuietButton.prototype.__proto__ = Button.prototype;


/**
 * `LargeButton` constructor
 *
 * @api public
 */

topcoat.LargeButton = LargeButton;
function LargeButton (el) {
	if (!(this instanceof LargeButton)) return new LargeButton(el);
	Button.call(this, el);
	this.removeClass('topcoat-button');
	this.addClass('topcoat-button--large');
}

// inherit from `Button`
LargeButton.prototype.__proto__ = Button.prototype;


/**
 * `LargeQuietButton` constructor
 *
 * @api public
 */

topcoat.LargeQuietButton = LargeQuietButton;
function LargeQuietButton (el) {
	if (!(this instanceof LargeQuietButton)) return new LargeQuietButton(el);
	Button.call(this, el);
	this.replaceClass('topcoat-button', 'topcoat-button--large--quiet');
}

// inherit from `Button`
LargeQuietButton.prototype.__proto__ = Button.prototype;


/**
 * `CallToActionButton` constructor
 *
 * @api public
 */

topcoat.CallToActionButton = CallToActionButton;
function CallToActionButton (el) {
	if (!(this instanceof CallToActionButton)) return new CallToActionButton(el);
	Button.call(this, el);
	this.replaceClass('topcoat-button', 'topcoat-button--cta');
}

// inherit from `Button`
CallToActionButton.prototype.__proto__ = Button.prototype;


/**
 * `CallToActionButton` constructor
 *
 * @api public
 */

topcoat.LargeCallToActionButton = LargeCallToActionButton;
function LargeCallToActionButton (el) {
	if (!(this instanceof LargeCallToActionButton)) return new LargeCallToActionButton(el);
	Button.call(this, el);
	this.replaceClass('topcoat-button', 'topcoat-button--large--cta');
}

// inherit from `Button`
LargeCallToActionButton.prototype.__proto__ = Button.prototype;


/**
 * `IconButton` constructor
 *
 * @api public
 * @param {Element} `el`
 */

topcoat.IconButton = IconButton;
function IconButton (el) {
	if (!(this instanceof IconButton)) return new IconButton(el);
	Button.call(this, el);
	this.replaceClass('topcoat-button', 'topcoat-icon-button');
	this.el.appendChild(domify(
		'<span class="topcoat-icon topcoat-icon--menu-stack"></span>'
	));

}

// inherit from `Button`
IconButton.prototype.__proto__ = Button.prototype;


/**
 * `QuietIconButton` constructor
 *
 * @api public
 * @param {Element} `el`
 */

topcoat.QuietIconButton = QuietIconButton;
function QuietIconButton (el) {
	if (!(this instanceof QuietIconButton)) return new QuietIconButton(el);
	IconButton.call(this, el);
	this.replaceClass('topcoat-icon-button', 'topcoat-icon-button--quiet');

}

// inherit from `IconButton`
QuietIconButton.prototype.__proto__ = IconButton.prototype;


/**
 * `LargeIconButton` constructor
 *
 * @api public
 * @param {Element} `el`
 */

topcoat.LargeIconButton = LargeIconButton;
function LargeIconButton (el) {
	if (!(this instanceof LargeIconButton)) return new LargeIconButton(el);
	IconButton.call(this, el);
	this.replaceClass('topcoat-icon-button', 'topcoat-icon-button--large');

}

// inherit from `IconButton`
LargeIconButton.prototype.__proto__ = IconButton.prototype;


/**
 * `LargeQuietIconButton` constructor
 *
 * @api public
 * @param {Element} `el`
 */

topcoat.LargeQuietIconButton = LargeQuietIconButton;
function LargeQuietIconButton (el) {
	if (!(this instanceof LargeQuietIconButton)) return new LargeQuietIconButton(el);
	IconButton.call(this, el);
	this.replaceClass('topcoat-icon-button', 'topcoat-icon-button--large--quiet');

}

// inherit from `IconButton`
LargeQuietIconButton.prototype.__proto__ = IconButton.prototype;


/**
 * `List` constructor
 *
 * @api public
 */

topcoat.List = List;
function List () {
	if (!(this instanceof List)) return new List();
	TopcoatElement.call(this);
	this.el = domify('<div class="topcoat-list__container"></div>');
	this.header = ListHeader();
	this.container = ListContainer();
	this.length = [];
	this.items = this.container.items;

	this.append(this.header.el);
	this.append(this.container.el);
	// proxy events
	proxyEvents(this.el, this);
}

// inherit from `TopcoatElement`
List.prototype.__proto__ = TopcoatElement.prototype;


/**
 * Adds a list item to the bottom of the list
 *
 * @api public
 * @param {String|ListItem} `item`
 */

List.prototype.push = 
List.prototype.add = function (item) {
	this.container.push(item);
	this.length = this.container.length;
	return this;
};


/**
 * Adds a list item to the top of the list
 *
 * @api public
 * @param {String|ListItem} `item`
 */

List.prototype.unshift = function (item) {
	this.container.unshift(item);
	this.length = this.container.length;
	return this;
};


/**
 * Removes a list item from the bottom of the list
 *
 * @api public
 */

List.prototype.pop = function () {
	var item = this.container.pop();
	this.length = this.container.length;
	return item;
};


/**
 * Removes a list item from the top of the list
 *
 * @api public
 */

List.prototype.shift = function () {
	var item = this.container.shift();
	this.length = this.container.length;
	return item;
};


/**
 * Clears all items from the list
 *
 * @api public
 */

List.prototype.clear = function () {
	this.container.clear();
	return this;
};


/**
 * Reverses all items in the list
 *
 * @api public
 */

List.prototype.reverse = function () {
	this.container.reverse();
	return this;
};


/**
 * Calls a function for each element in the list
 *
 * @api public
 * @param {Function} `fn`
 */

List.prototype.forEach = function (fn) {
	this.container.forEach(fn);
	return this;
};


/**
 * Returns true if the testing function returns
 * `true` for every element in the list
 *
 * @api public
 * @param {Function} `fn`
 */

List.prototype.every = function (fn) {
	return this.container.every(fn);
};


/**
 * Returns true if the testing function returns
 * `true` for at least one element in the list
 *
 * @api public
 * @param {Function} `fn`
 */

List.prototype.some = function (fn) {
	return this.container.some(fn);
};


/**
 * Returns the first index of a given input
 * in the element list
 *
 * @api public
 * @param {Function} `input`
 */

List.prototype.indexOf = function (input) {
	return this.container.indexOf(input);
};


/**
 * Returns the last index of a given input
 * in the element list
 *
 * @api public
 * @param {Function} `input`
 */

List.prototype.lastIndexOf = function (input) {
	return this.container.lastIndexOf(input);
};



/**
 * `ListHeader` constructor
 *
 * @api public
 */

topcoat.ListHeader = ListHeader;
function ListHeader () {
	if (!(this instanceof ListHeader)) return new ListHeader();
	TopcoatElement.call(this);
	this.el = domify('<h3 class="topcoat-list__header"></h3>');
	// proxy events
	proxyEvents(this.el, this);
}

// inherit from `TopcoatElement`
ListHeader.prototype.__proto__ = TopcoatElement.prototype;


/**
 * `ListContainer` constructor
 *
 * @api public
 */

topcoat.ListContainer = ListContainer;
function ListContainer () {
	if (!(this instanceof ListContainer)) return new ListContainer();
	TopcoatElement.call(this);
	this.el = domify('<ul class="topcoat-list"></ul>');
	this.items = [];
	this.length = 0;
	// proxy events
	proxyEvents(this.el, this);
}

// inherit from `TopcoatElement`
ListContainer.prototype.__proto__ = TopcoatElement.prototype;


/**
 * Pushes a `ListItem` to the bottom of the list
 *
 * @api public
 * @param {String|ListItem} `item`
 */

ListContainer.prototype.push = 
ListContainer.prototype.add = function (item) {
	if ('string' === typeof item)
		item = ListItem().text(item);
	else if (item instanceof Element)
		item = ListItem.wrap(item);

	if (!(item instanceof ListItem))
		throw new TypeError("expecting `string` or an instance of `ListItem`");

	this.items.push(item);
	this.append(item.el);
	this.length++;
	return this;
};


/**
 * Unnshifts a `ListItem` to the top of the list
 *
 * @api public
 * @param {String|ListItem} `item`
 */

ListContainer.prototype.unshift = function (item) {
	if ('string' === typeof item)
		item = ListItem().text(item);
	else if (item instanceof Element)
		item = ListItem.wrap(item);

	if (!(item instanceof ListItem))
		throw new TypeError("expecting `string` or an instance of `ListItem`");

	this.items.unshift(item);
	this.prepend(item.el);
	this.length++;
	return this;
};


/**
 * Pops a `ListItem` off from the bottom of the list
 *
 * @api public
 * @param {String|ListItem} `item`
 */

ListContainer.prototype.pop = function () {
	var item = this.items.pop()
	  , nodes = this.el.querySelectorAll('.topcoat-list__item')
	  , node = tail(nodes)

	if (!item || !node)	return false;
	else if (node !== item.el) return false;
	
	item.remove();
	this.length--;
	return item;
};


/**
 * Shifts a `ListItem` off from the bottom of the list
 *
 * @api public
 * @param {String|ListItem} `item`
 */

ListContainer.prototype.shift = function () {
	var item = this.items.shift()
	  , nodes = this.el.querySelectorAll('.topcoat-list__item')
	  , node = head(nodes)

	if (!item || !node)	return false;
	else if (node !== item.el) return false;
	
	item.remove();
	this.length--;
	return item;
};



/**
 * Reverses the order of the elements in the list container
 *
 * @api public
 */

ListContainer.prototype.reverse = function () {
	var items = [].concat(this.items).reverse() // clone and reverse
	if (!items.length) return this;
	this.clear();
	for (var i = 0; i < items.length; ++i) this.push(items[i]);
	return this;
};


/**
 * Clears the container of all items
 *
 * @api public
 */

ListContainer.prototype.clear = function () {
	for (var i = this.items.length - 1; i >= 0; i--) this.pop();
	return this;
};


/**
 * Calls a function for each element in the list
 *
 * @api public
 * @param {Function} `fn`
 */

ListContainer.prototype.forEach = function (fn) {
	this.items.forEach(fn);
	return this;
};


/**
 * Returns `true` if every element in the list
 * satisfies a provided test function
 *
 * @api public
 * @param {Function} `fn`
 */

ListContainer.prototype.every = function (fn) {
	this.items.every(fn);
	return this;
};



/**
 * Returns `true` if at least one element in the list
 * satisfies a provided test function
 *
 * @api public
 * @param {Function} `fn`
 */

ListContainer.prototype.some = function (fn) {
	this.items.some(fn);
	return this;
};


/**
 * Returns the first index of an element found
 * in the list
 *
 * @api public
 * @param {Mixed} `input`
 */

ListContainer.prototype.indexOf = function (input) {
	return this.items.indexOf(input);
};


/**
 * Returns the last index of an element found
 * in the list
 *
 * @api public
 * @param {Mixed} `input`
 */

ListContainer.prototype.indexOf = function (input) {
	return this.items.lastIndexOf(input);
};


/**
 * `ListItem` constructor
 *
 * @api public
 */

topcoat.ListItem = ListItem;
function ListItem (el) {
	if (!(this instanceof ListItem)) return new ListItem(el);
	TopcoatElement.call(this);
	this.el = el || domify('<li></li>');
	this.addClass('topcoat-list__item');
	// proxy events
	proxyEvents(this.el, this);
}

// inherit from `TopcoatElement`
ListItem.prototype.__proto__ = TopcoatElement.prototype;


/**
 * Wraps an element in a `ListItem` instance
 *
 * @api public
 * @param {Element} `el`
 */

ListItem.wrap = function (el) {
	return ListItem().append(el);
};


/**
 * `NavigationBar` constructor
 *
 * @api public
 */

topcoat.NavigationBar = NavigationBar;
function NavigationBar (el) {
	if (!(this instanceof NavigationBar)) return new NavigationBar(el);
	TopcoatElement.call(this);
	this.el = el || domify('<div></div>');
	this.items = [];
	this.titleItem = null;
	this.addClass('topcoat-navigation-bar');
	// proxy events
	proxyEvents(this.el, this);
}

// inherit from `TopcoatElement`
NavigationBar.prototype.__proto__ = TopcoatElement.prototype;


/**
 * Adds an item to the `NavigationBar` container
 *
 * @api public
 * @param {TopcoatElement} `item`
 * @param {Object} `opts`
 */

NavigationBar.prototype.add = function (item, opts) {
	if (item instanceof NavigationBarItem) {
		return this.add(TopcoatElement(item.el), opts);
	} else if (item instanceof TopcoatElement) {
		var navItem = NavigationBarItem()
		navItem.append(item.el);
		this.items.push(navItem);
		this.append(navItem.el);
		if (opts && opts.align) navItem.align(opts.align);
		if (opts && opts.size) navItem.size(opts.size);
		return navItem;
	} else if (item instanceof Element) {
		return this.add(TopcoatElement(item), opts);
	} else {
		throw new TypeError("expecting instance of `TopcoatElement` or `NavigationBarItem`");
	}
};



/**
 * Creates a title for the `NavigationBar` instance
 *
 * @api public
 * @param {String} `title`
 * @param {Object} `opts`
 */

NavigationBar.prototype.title = function (title, opts) {
	// remove any existing title objects
	if (this.titleItem) this.titleItem.remove();
	return this.add(NavigationBarTitle().text(title), opts);
};



/**
 * `NavigationBarItem` constructor
 *
 * @api public
 * @param {Element} `el`
 */
topcoat.NavigationBarItem = NavigationBarItem;
function NavigationBarItem (el) {
	if (!(this instanceof NavigationBarItem)) return new NavigationBarItem(el);
	TopcoatElement.call(this);
	this.el = el || domify(
		'<div></div>'
	);

	this.addClass('topcoat-navigation-bar__item');
	// proxy events
	proxyEvents(this.el, this);
}

// inherit from `TopcoatElement`
NavigationBarItem.prototype.__proto__ = TopcoatElement.prototype;


/**
 * Sets the size of the item
 *
 * @api public
 * @param {String|Number} `size`
 */

NavigationBarItem.prototype.size = function (size) {
	var supported = [
		'quarter', 'half', 'third', 'full', 'three-quarters', 'two-thirds'
	];

	if (undefined === size) {
		for (var i = 0; i < supported.length; ++i) {
			if (hasClass(thie.el, supported[i])) return supported[i];
		}
	}

	if ('string' === typeof size) {
		if (!~supported.indexOf(size))
			throw new Error("unsupported size `"+ size +"`");

		// sanitize before adding
		for (var i = 0; i < supported.length; ++i)
			removeClass(this.el, supported);

		// add size to class list
		addClass(this.el, size);

	} else if ('number' === typeof size) {
		this.width(size);
	}

	return this;
};


/**
 * Sets the alignment of the item
 *
 * @api public
 * @param {String|Number} `alignment`
 */

NavigationBarItem.prototype.align = function (alignment) {
	var supported = [
		'left', 'center', 'right'
	];

	if (undefined === alignment) {
		for (var i = 0; i < supported.length; ++i) {
			if (hasClass(thie.el, supported[i])) return supported[i];
		}
	}

	if (!~supported.indexOf(alignment))
		throw new Error("unsupported alignment `"+ alignment +"`");

	// sanitize before adding
	for (var i = 0; i < supported.length; ++i)
		removeClass(this.el, supported);

	// add alignment to class list
	addClass(this.el, alignment);

	return this;
};


/**
 * `NavigationBarTitle` constructor
 *
 * @api public
 * @param {Element} `el`
 */

topcoat.NavigationBarTitle = NavigationBarTitle;
function NavigationBarTitle (el) {
	if (!(this instanceof NavigationBarTitle)) return new NavigationBarTitle(el);
	TopcoatElement.call(this);
	this.el = el || domify(
		'<h1></h1>'
	);

	this.addClass('topcoat-navigation-bar__title')
	// proxy events
	proxyEvents(this.el, this);
}

// inherit from `TopcoatElement`
NavigationBarTitle.prototype.__proto__ = TopcoatElement.prototype;


/**
 * `Input` constructor
 *
 * @api public
 * @param {Element} `el`
 */

topcoat.Input = Input;
function Input (el) {
	if (!(this instanceof Input)) return new Input(el);
	TopcoatElement.call(this);
	this.el = el || domify(
		'<input type="text" value="" placeholder=""/>'
	);

	this.addClass('topcoat-text-input');
	// proxy events
	proxyEvents(this.el, this);
}

// inherit from `TopcoatElement`
Input.prototype.__proto__ = TopcoatElement.prototype;


/**
 * Sets the input type
 *
 * @api public
 * @param {String} `type`
 */

Input.prototype.type = function (type) {
	if (undefined === type) return this.el.getAttribute('type');
	else this.el.setAttribute('type', type);
	return this;
};


/**
 * Gets/sets the input value
 *
 * @api public
 * @param {Mixed} `value`
 */

Input.prototype.value = function (value) {
	if (undefined === value) return this.el.getAttribute('value');
	else (this.el.value = value) && this.el.setAttribute('value', value);
	return this;
};


/**
 * Gets/sets the input place holder
 *
 * @api public
 * @param {Mixed} `value`
 */

Input.prototype.placeholder = function (value) {
	if (undefined === value) return this.el.getAttribute('placeholder');
	else this.el.setAttribute('placeholder', value);
	return this;
};


/**
 * `LargeInput` constructor
 *
 * @api public
 * @param {Element} `el`
 */

topcoat.LargeInput = LargeInput;
function LargeInput (el) {
	if (!(this instanceof LargeInput)) return new LargeInput(el);
	Input.call(this);
	this.el = el || domify(
		'<input type="text" value="" placeholder=""/>'
	);
	this.addClass('topcoat-text-input--large');
	proxyEvents(this.el, this);
}

// inherit from `Input`
LargeInput.prototype.__proto__ = Input.prototype;


/**
 * `SearchInput` constructor
 *
 * @api public
 * @param {Element} `el`
 */

topcoat.SearchInput = SearchInput;
function SearchInput (el) {
	if (!(this instanceof SearchInput)) return new SearchInput(el);
	Input.call(this);
	this.el = el || domify(
		'<input type="text" value="" placeholder=""/>'
	);

	this.addClass('topcoat-search-input');
	// proxy events
	proxyEvents(this.el, this);
}

// inherit from `Input`
SearchInput.prototype.__proto__ = Input.prototype;


/**
 * `LargeSearchInput` constructor
 *
 * @api public
 * @param {Element} `el`
 */

topcoat.LargeSearchInput = LargeSearchInput;
function LargeSearchInput (el) {
	if (!(this instanceof LargeSearchInput)) return new LargeSearchInput(el);
	Input.call(this);
	this.el = el || domify(	
		'<input type="text" value="" placeholder=""/>'
	);

	this.addClass('topcoat-search-input--large');
	// proxy events
	proxyEvents(this.el, this);
}

// inherit from `Input`
LargeSearchInput.prototype.__proto__ = Input.prototype;


/**
 * `TextArea` constructor
 *
 * @api public
 * @param {Element} `el`
 */

topcoat.TextArea = TextArea;
function TextArea (el) {
	if (!(this instanceof TextArea)) return new TextArea(el);
	Input.call(this);
	this.el = el || domify(
		'<textarea rows="6" cols="36" placeholder=""></textarea>'
	);

	this.addClass('topcoat-textarea');
	// proxy events
	proxyEvents(this.el, this);
}

// inherit from `Input`
TextArea.prototype.__proto__ = Input.prototype;


/**
 * Gets/sets the row count
 *
 * @api public
 * @param {Number} `size`
 */

TextArea.prototype.rows = function (size) {
	if (undefined === size) return this.el.getAttribute('rows');
	else if ('number' !== typeof size) throw new TypeError("expecting	a `number` for row size");
	else this.el.setAttribute('rows', size);
	return this;
};


/**
 * Gets/sets the column count
 *
 * @api public
 * @param {Number} `size`
 */

TextArea.prototype.columns = 
TextArea.prototype.cols = function (size) {
	if (undefined === size) return this.el.getAttribute('cols');
	else if ('number' !== typeof size) throw new TypeError("expecting	a `number` for column size");
	else this.el.setAttribute('cols', size);
	return this;
};


/**
 * `LargeTextArea` constructor
 *
 * @api public
 * @param {Element} `el`
 */

topcoat.LargeTextArea = LargeTextArea;
function LargeTextArea (el) {
	if (!(this instanceof LargeTextArea)) return new LargeTextArea(el);
	TextArea.call(this);
	this.el = el || domify(
		'<textarea rows="6" cols="36" placeholder=""></textarea>'
	);
	this.addClass('topcoat-textarea--large');
	// proxy events
	proxyEvents(this.el, this);
}

// inherit from `Input`
LargeTextArea.prototype.__proto__ = TextArea.prototype;


