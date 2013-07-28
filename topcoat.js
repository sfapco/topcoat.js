;(function(){


/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-indexof/index.js", Function("exports, require, module",
"\nvar indexOf = [].indexOf;\n\nmodule.exports = function(arr, obj){\n  if (indexOf) return arr.indexOf(obj);\n  for (var i = 0; i < arr.length; ++i) {\n    if (arr[i] === obj) return i;\n  }\n  return -1;\n};//@ sourceURL=component-indexof/index.js"
));
require.register("component-emitter/index.js", Function("exports, require, module",
"\n/**\n * Module dependencies.\n */\n\nvar index = require('indexof');\n\n/**\n * Expose `Emitter`.\n */\n\nmodule.exports = Emitter;\n\n/**\n * Initialize a new `Emitter`.\n *\n * @api public\n */\n\nfunction Emitter(obj) {\n  if (obj) return mixin(obj);\n};\n\n/**\n * Mixin the emitter properties.\n *\n * @param {Object} obj\n * @return {Object}\n * @api private\n */\n\nfunction mixin(obj) {\n  for (var key in Emitter.prototype) {\n    obj[key] = Emitter.prototype[key];\n  }\n  return obj;\n}\n\n/**\n * Listen on the given `event` with `fn`.\n *\n * @param {String} event\n * @param {Function} fn\n * @return {Emitter}\n * @api public\n */\n\nEmitter.prototype.on = function(event, fn){\n  this._callbacks = this._callbacks || {};\n  (this._callbacks[event] = this._callbacks[event] || [])\n    .push(fn);\n  return this;\n};\n\n/**\n * Adds an `event` listener that will be invoked a single\n * time then automatically removed.\n *\n * @param {String} event\n * @param {Function} fn\n * @return {Emitter}\n * @api public\n */\n\nEmitter.prototype.once = function(event, fn){\n  var self = this;\n  this._callbacks = this._callbacks || {};\n\n  function on() {\n    self.off(event, on);\n    fn.apply(this, arguments);\n  }\n\n  fn._off = on;\n  this.on(event, on);\n  return this;\n};\n\n/**\n * Remove the given callback for `event` or all\n * registered callbacks.\n *\n * @param {String} event\n * @param {Function} fn\n * @return {Emitter}\n * @api public\n */\n\nEmitter.prototype.off =\nEmitter.prototype.removeListener =\nEmitter.prototype.removeAllListeners = function(event, fn){\n  this._callbacks = this._callbacks || {};\n\n  // all\n  if (0 == arguments.length) {\n    this._callbacks = {};\n    return this;\n  }\n\n  // specific event\n  var callbacks = this._callbacks[event];\n  if (!callbacks) return this;\n\n  // remove all handlers\n  if (1 == arguments.length) {\n    delete this._callbacks[event];\n    return this;\n  }\n\n  // remove specific handler\n  var i = index(callbacks, fn._off || fn);\n  if (~i) callbacks.splice(i, 1);\n  return this;\n};\n\n/**\n * Emit `event` with the given args.\n *\n * @param {String} event\n * @param {Mixed} ...\n * @return {Emitter}\n */\n\nEmitter.prototype.emit = function(event){\n  this._callbacks = this._callbacks || {};\n  var args = [].slice.call(arguments, 1)\n    , callbacks = this._callbacks[event];\n\n  if (callbacks) {\n    callbacks = callbacks.slice(0);\n    for (var i = 0, len = callbacks.length; i < len; ++i) {\n      callbacks[i].apply(this, args);\n    }\n  }\n\n  return this;\n};\n\n/**\n * Return array of callbacks for `event`.\n *\n * @param {String} event\n * @return {Array}\n * @api public\n */\n\nEmitter.prototype.listeners = function(event){\n  this._callbacks = this._callbacks || {};\n  return this._callbacks[event] || [];\n};\n\n/**\n * Check if this emitter has `event` handlers.\n *\n * @param {String} event\n * @return {Boolean}\n * @api public\n */\n\nEmitter.prototype.hasListeners = function(event){\n  return !! this.listeners(event).length;\n};\n//@ sourceURL=component-emitter/index.js"
));
require.register("juliangruber-events/index.js", Function("exports, require, module",
"var Emitter = require('emitter');\n\n// alias all the things!\nEmitter.prototype.addListener = Emitter.prototype.on;\nEmitter.prototype.removeListener = Emitter.prototype.off;\nEmitter.prototype.removeAllListeners = Emitter.prototype.off;\n\nEmitter.prototype.setMaxListeners = function(){ /* noop */ };\n\nexports.EventEmitter = Emitter;\n//@ sourceURL=juliangruber-events/index.js"
));
require.register("component-domify/index.js", Function("exports, require, module",
"\n/**\n * Expose `parse`.\n */\n\nmodule.exports = parse;\n\n/**\n * Wrap map from jquery.\n */\n\nvar map = {\n  option: [1, '<select multiple=\"multiple\">', '</select>'],\n  optgroup: [1, '<select multiple=\"multiple\">', '</select>'],\n  legend: [1, '<fieldset>', '</fieldset>'],\n  thead: [1, '<table>', '</table>'],\n  tbody: [1, '<table>', '</table>'],\n  tfoot: [1, '<table>', '</table>'],\n  colgroup: [1, '<table>', '</table>'],\n  caption: [1, '<table>', '</table>'],\n  tr: [2, '<table><tbody>', '</tbody></table>'],\n  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],\n  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],\n  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],\n  _default: [0, '', '']\n};\n\n/**\n * Parse `html` and return the children.\n *\n * @param {String} html\n * @return {Array}\n * @api private\n */\n\nfunction parse(html) {\n  if ('string' != typeof html) throw new TypeError('String expected');\n\n  // tag name\n  var m = /<([\\w:]+)/.exec(html);\n  if (!m) throw new Error('No elements were generated.');\n  var tag = m[1];\n\n  // body support\n  if (tag == 'body') {\n    var el = document.createElement('html');\n    el.innerHTML = html;\n    return el.removeChild(el.lastChild);\n  }\n\n  // wrap map\n  var wrap = map[tag] || map._default;\n  var depth = wrap[0];\n  var prefix = wrap[1];\n  var suffix = wrap[2];\n  var el = document.createElement('div');\n  el.innerHTML = prefix + html + suffix;\n  while (depth--) el = el.lastChild;\n\n  var els = el.children;\n  if (1 == els.length) {\n    return el.removeChild(els[0]);\n  }\n\n  var fragment = document.createDocumentFragment();\n  while (els.length) {\n    fragment.appendChild(el.removeChild(els[0]));\n  }\n\n  return fragment;\n}\n//@ sourceURL=component-domify/index.js"
));
require.register("topcoat/index.js", Function("exports, require, module",
"\n/**\n * Module dependencies\n */\n\nvar EventEmitter = require('events').EventEmitter\n  , domify = require('domify')\n\n\n/**\n * Expose `topcoat`\n */\n\nvar topcoat = module.exports = {};\n\n\n/**\n * Returns the head of an array like object\n *\n * @api private\n * @param {Array} `a`\n */\n\nfunction head (a) {\n\treturn a[0];\n}\n\n\n/**\n * Returns the head of an array like object\n *\n * @api private\n * @param {Array} `a`\n */\n\nfunction tail (a) {\n\treturn a[a.length - 1];\n}\n\n\n/**\n * Checks if a given element has a class\n *\n * @api public\n * @param {Element} `el`\n * @param {String} `className`\n */\n\nfunction hasClass (el, className) {\n\treturn !!~el.className.split(' ').indexOf(className);\n}\n\n\n/**\n * Adds a class to a given DOM element\n *\n * @api private\n * @param {Element} `el`\n * @param {String} `className`\n */\n\nfunction addClass (el, className) {\n\tif (hasClass(el, className)) return false;\n\tel.className += ' '+ className;\n\tel.className = el.className.trim();\n\treturn true;\n}\n\n\n/**\n * Removes a class to a given DOM element\n *\n * @api private\n * @param {Element} `el`\n * @param {String} `className`\n */\n\nfunction removeClass (el, className) {\n\tif (!hasClass(el, className)) return false;\n\tvar classes = el.className.split(' ');\n\tclasses.splice(classes.indexOf(className), 1);\n\tel.className = classes.join(' ');\n\tel.className = el.className.trim();\n\treturn true;\n}\n\n\n/**\n * Replaces a class with another\n *\n * @api private\n * @param {Element} `el`\n * @param {String} `className`\n * @param {String} `newClassName`\n */\n\nfunction replaceClass (el, className, newClassName) {\n\tremoveClass(el, className);\n\taddClass(el, newClassName);\n}\n\n\n/**\n * Proxy events from element to `EventEmitter` instance\n *\n * @api public\n * @param {Element} `el`\n * @param {Object} `emitter`\n */\n\nfunction proxyEvents (el, emitter) {\n\t// meta\n\tproxy('load');\n\tproxy('abort');\n\tproxy('error');\n\tproxy('invalid');\n\tproxy('reset');\n\tproxy('scroll');\n\tproxy('select');\n\tproxy('selectstart');\n\tproxy('submit');\n\tproxy('webkitfullscreenchange', 'fullscreenchange');\n\tproxy('webkitfullscreenerror', 'fullscreenerror');\n\tproxy('fullscreenchange');\n\tproxy('fullscreenerror');\n\n\t// interactions\n\tproxy('click');\n\tproxy('dblclick');\n\tproxy('contextmenu');\n\tproxy('drag');\n\tproxy('dragenter');\n\tproxy('dragend');\n\tproxy('dragleave');\n\tproxy('dragover');\n\tproxy('dragstart');\n\tproxy('drop');\n\n\t// mouse events\n\tproxy('mousemove');\n\tproxy('mouseover');\n\tproxy('mouseenter');\n\tproxy('mouseout');\n\tproxy('mouseleave');\n\tproxy('mouseup');\n\tproxy('mousedown');\n\tproxy('mousewheel');\n\n\t// copy/cut/paste events\n\tproxy('beforecopy');\n\tproxy('copy');\n\tproxy('beforecut');\n\tproxy('cut');\n\tproxy('beforepatse');\n\tproxy('patse');\n\n\t// input events\n\tproxy('blur');\n\tproxy('change');\n\tproxy('focus');\n\tproxy('input');\n\n\t// keyboard\n\tproxy('keydown');\n\tproxy('keyup');\n\tproxy('keypress');\n\t\n\n\n\tfunction proxy(event, as) {\n\t\tel.addEventListener(event, emitter.emit.bind(emitter, as || event), false);\n\t}\n}\n\n\n/**\n * `TopcoatElement` constructor\n *\n * @api public\n */\n\ntopcoat.TopcoatElement = TopcoatElement;\nfunction TopcoatElement (el) {\n\tif (!(this instanceof Button)) return new Button(el);\n\telse if (el && !(el instanceof Element)) throw new TypeError(\"expecting an instance of `Element`\");\n\tEventEmitter.call(this)\n\tthis.el = el || domify('<span />');\n\t// proxy events\n\tproxyEvents(this.el, this);\n}\n\n// inherit from `EventEmitter`\nTopcoatElement.prototype.__proto__ = EventEmitter.prototype;\nTopcoatElement.prototype.constructor = TopcoatElement;\n\n\n/**\n * Returns the inner html of the element\n * as a string\n *\n * @api public\n */\n\nTopcoatElement.prototype.toString = function () {\n\treturn this.el.innerHTML;\n};\n\n\n/**\n * Enables the element\n *\n * @api public\n */\n\nTopcoatElement.prototype.enable = function () {\n\tremoveClass(this.el, 'is-disabled')\n\treturn this;\n};\n\n\n/**\n * Disables the element\n *\n * @api public\n */\n\nTopcoatElement.prototype.disable = function () {\n\taddClass(this.el, 'is-disabled')\n\treturn this;\n};\n\n\n/**\n * Checks if element instance is active\n *\n * @api public\n */\n\nTopcoatElement.prototype.isActive = function () {\n\treturn hasClass(this.el, 'is-active');\n};\n\n\n/**\n * Checks if the element is disabled\n *\n * @api public\n */\n\nTopcoatElement.prototype.isDisabled = function () {\n\treturn hasClass(this.el, 'is-disabled');\n};\n\n\n/**\n * Gets/sets the inner text of the element\n *\n * @api public\n * @param {String} `text`\n */\n\nTopcoatElement.prototype.text = function (text) {\n\tif (undefined === text) return this.el.innerText;\n\telse this.el.innerText = text;\n\treturn this;\n};\n\n\n/**\n * Gets/sets the inner html of the element\n *\n * @api public\n * @param {String} `text`\n */\n\nTopcoatElement.prototype.html = function (html) {\n\tif (undefined === html) return this.el.innerHTML;\n\tthis.el.innerHTML = html;\n\treturn this;\n};\n\n\n/**\n * Gets/sets the width of the element\n *\n * @api public\n * @param {Number} `width`\n */\n\nTopcoatElement.prototype.width = function (width) {\n\tif (undefined === width) return getComputedStyle(this.el).width;\n\tif (width !== width) return this;\n\tif ('number' === typeof width) width = String(width) + 'px';\n\tthis.el.style.setProperty('width', width);\n\treturn this;\n};\n\n\n/**\n * Gets/sets the height of the element\n *\n * @api public\n * @param {Number} `height`\n */\n\nTopcoatElement.prototype.height = function (height) {\n\tif (undefined === height) return getComputedStyle(this.el).height;\n\tif (height !== height) return this;\n\tif ('number' === typeof height) height = String(height) + 'px';\n\tthis.el.style.setProperty('height', height);\n\treturn this;\n};\n\n\n/**\n * Shows the element\n *\n * @api public\n */\n\nTopcoatElement.prototype.show = function (override) {\n\tthis.el.style.setProperty('display', override || 'block');\n\treturn this;\n};\n\n\n/**\n * Hides the element\n *\n * @api public\n */\n\nTopcoatElement.prototype.hide = function () {\n\tthis.el.style.setProperty('display', 'none');\n\treturn this;\n};\n\n\n/**\n * Appends an element as a child\n *\n * @api public\n * @param {Element} `el`\n */\n\nTopcoatElement.prototype.append = function (el) {\n\tthis.el.appendChild(el);\n\treturn this;\n};\n\n\n/**\n * Prepends an element as a child\n *\n * @api public\n * @param {Element} `el`\n */\n\nTopcoatElement.prototype.prepend = function (el) {\n\tthis.el.parentNode.insertBefore(el, this.el);\n\treturn this;\n};\n\n\n/**\n * Appends the element to an element\n *\n * @api public\n * @param {Element} `el`\n */\n\nTopcoatElement.prototype.appendTo = function (el) {\n\tel.appendChild(this.el);\n\treturn this;\n};\n\n\n/**\n * Prepends the element to an element\n *\n * @api public\n * @param {Element} `el`\n */\n\nTopcoatElement.prototype.prependTo = function (el) {\n\tel.parentNode.insertBefore(this.el, el);\n\treturn this;\n};\n\n\n/**\n * Removes the element from the DOM\n *\n * @api public\n */\n\nTopcoatElement.prototype.remove = function () {\n\tdelete this.el.parentNode.removeChild(this.el);\n\treturn this;\n};\n\n\n/**\n * Activates or deactivates the element\n *\n * @api public\n * @param {Boolean} `state`\n */\n\nTopcoatElement.prototype.active = function (state) {\n\tstate = (false === state)? false : true;\n\tif (state && !this.isActive()) addClass(this.el, 'is-active');\n\telse removeClass(this.el, 'is-active');\n\treturn this;\n};\n\n\n/**\n * Adds a class on the element\n *\n * @api public\n * @param {String} `className`\n */\n\nTopcoatElement.prototype.addClass = function (className) {\n\taddClass(this.el, className);\n\treturn this;\n};\n\n\n/**\n * Removes a class on the element\n *\n * @api public\n * @param {String} `className`\n */\n\nTopcoatElement.prototype.removeClass = function (className) {\n\tremoveClass(this.el, className);\n\treturn this;\n};\n\n\n/**\n * Replaces a class on the element\n *\n * @api public\n * @param {String} `className`\n * @param {String} `newClassName`\n */\n\nTopcoatElement.prototype.replaceClass = function (className, newClassName) {\n\treplaceClass(this.el, className, newClassName);\n\treturn this;\n};\n\n\n/**\n * Checks if the element has a class\n *\n * @api public\n * @param {String} `className`\n */\n\nTopcoatElement.prototype.hasClass = function (className) {\n\thasClass(this.el, className);\n\treturn this;\n};\n\n\n/**\n * `Button` constructor\n *\n * @api public\n * @param {Element} `el` - optional\n */\n\ntopcoat.Button = Button;\nfunction Button (el) {\n\tif (!(this instanceof Button)) return new Button(el);\n\telse if (el && !(el instanceof Element)) throw new TypeError(\"expecting an instance of `Element`\");\n\tTopcoatElement.call(this, el);\n\tthis.el = el || domify('<a></a>');\n\n\tthis.addClass('topcoat-button');\n\tproxyEvents(this.el, this);\n}\n\n// inherit from `TopcoatElement`\nButton.prototype.__proto__ = TopcoatElement.prototype;\n\n\n/**\n * `QuietButton` constructor\n *\n * @api public\n */\n\ntopcoat.QuietButton = QuietButton;\nfunction QuietButton (el) {\n\tif (!(this instanceof QuietButton)) return new QuietButton(el);\n\tButton.call(this, el);\n\tthis.removeClass('topcoat-button');\n\tthis.addClass('topcoat-button--quiet');\n}\n\n// inherit from `Button`\nQuietButton.prototype.__proto__ = Button.prototype;\n\n\n/**\n * `LargeButton` constructor\n *\n * @api public\n */\n\ntopcoat.LargeButton = LargeButton;\nfunction LargeButton (el) {\n\tif (!(this instanceof LargeButton)) return new LargeButton(el);\n\tButton.call(this, el);\n\tthis.removeClass('topcoat-button');\n\tthis.addClass('topcoat-button--large');\n}\n\n// inherit from `Button`\nLargeButton.prototype.__proto__ = Button.prototype;\n\n\n/**\n * `LargeQuietButton` constructor\n *\n * @api public\n */\n\ntopcoat.LargeQuietButton = LargeQuietButton;\nfunction LargeQuietButton (el) {\n\tif (!(this instanceof LargeQuietButton)) return new LargeQuietButton(el);\n\tButton.call(this, el);\n\tthis.replaceClass('topcoat-button', 'topcoat-button--large--quiet');\n}\n\n// inherit from `Button`\nLargeQuietButton.prototype.__proto__ = Button.prototype;\n\n\n/**\n * `CallToActionButton` constructor\n *\n * @api public\n */\n\ntopcoat.CallToActionButton = CallToActionButton;\nfunction CallToActionButton (el) {\n\tif (!(this instanceof CallToActionButton)) return new CallToActionButton(el);\n\tButton.call(this, el);\n\tthis.replaceClass('topcoat-button', 'topcoat-button--cta');\n}\n\n// inherit from `Button`\nCallToActionButton.prototype.__proto__ = Button.prototype;\n\n\n/**\n * `CallToActionButton` constructor\n *\n * @api public\n */\n\ntopcoat.LargeCallToActionButton = LargeCallToActionButton;\nfunction LargeCallToActionButton (el) {\n\tif (!(this instanceof LargeCallToActionButton)) return new LargeCallToActionButton(el);\n\tButton.call(this, el);\n\tthis.replaceClass('topcoat-button', 'topcoat-button--large--cta');\n}\n\n// inherit from `Button`\nLargeCallToActionButton.prototype.__proto__ = Button.prototype;\n\n\n/**\n * `IconButton` constructor\n *\n * @api public\n * @param {Element} `el`\n */\n\ntopcoat.IconButton = IconButton;\nfunction IconButton (el) {\n\tif (!(this instanceof IconButton)) return new IconButton(el);\n\tButton.call(this, el);\n\tthis.replaceClass('topcoat-button', 'topcoat-icon-button');\n\tthis.el.appendChild(domify(\n\t\t'<span class=\"topcoat-icon topcoat-icon--menu-stack\"></span>'\n\t));\n\n}\n\n// inherit from `Button`\nIconButton.prototype.__proto__ = Button.prototype;\n\n\n/**\n * `QuietIconButton` constructor\n *\n * @api public\n * @param {Element} `el`\n */\n\ntopcoat.QuietIconButton = QuietIconButton;\nfunction QuietIconButton (el) {\n\tif (!(this instanceof QuietIconButton)) return new QuietIconButton(el);\n\tIconButton.call(this, el);\n\tthis.replaceClass('topcoat-icon-button', 'topcoat-icon-button--quiet');\n\n}\n\n// inherit from `IconButton`\nQuietIconButton.prototype.__proto__ = IconButton.prototype;\n\n\n/**\n * `LargeIconButton` constructor\n *\n * @api public\n * @param {Element} `el`\n */\n\ntopcoat.LargeIconButton = LargeIconButton;\nfunction LargeIconButton (el) {\n\tif (!(this instanceof LargeIconButton)) return new LargeIconButton(el);\n\tIconButton.call(this, el);\n\tthis.replaceClass('topcoat-icon-button', 'topcoat-icon-button--large');\n\n}\n\n// inherit from `IconButton`\nLargeIconButton.prototype.__proto__ = IconButton.prototype;\n\n\n/**\n * `LargeQuietIconButton` constructor\n *\n * @api public\n * @param {Element} `el`\n */\n\ntopcoat.LargeQuietIconButton = LargeQuietIconButton;\nfunction LargeQuietIconButton (el) {\n\tif (!(this instanceof LargeQuietIconButton)) return new LargeQuietIconButton(el);\n\tIconButton.call(this, el);\n\tthis.replaceClass('topcoat-icon-button', 'topcoat-icon-button--large--quiet');\n\n}\n\n// inherit from `IconButton`\nLargeQuietIconButton.prototype.__proto__ = IconButton.prototype;\n\n\n/**\n * `List` constructor\n *\n * @api public\n */\n\ntopcoat.List = List;\nfunction List () {\n\tif (!(this instanceof List)) return new List();\n\tTopcoatElement.call(this);\n\tthis.el = domify('<div class=\"topcoat-list__container\"></div>');\n\tthis.header = ListHeader();\n\tthis.container = ListContainer();\n\tthis.length = [];\n\tthis.items = this.container.items;\n\n\tthis.append(this.header.el);\n\tthis.append(this.container.el);\n\t// proxy events\n\tproxyEvents(this.el, this);\n}\n\n// inherit from `TopcoatElement`\nList.prototype.__proto__ = TopcoatElement.prototype;\n\n\n/**\n * Adds a list item to the bottom of the list\n *\n * @api public\n * @param {String|ListItem} `item`\n */\n\nList.prototype.push = \nList.prototype.add = function (item) {\n\tthis.container.push(item);\n\tthis.length = this.container.length;\n\treturn this;\n};\n\n\n/**\n * Adds a list item to the top of the list\n *\n * @api public\n * @param {String|ListItem} `item`\n */\n\nList.prototype.unshift = function (item) {\n\tthis.container.unshift(item);\n\tthis.length = this.container.length;\n\treturn this;\n};\n\n\n/**\n * Removes a list item from the bottom of the list\n *\n * @api public\n */\n\nList.prototype.pop = function () {\n\tvar item = this.container.pop();\n\tthis.length = this.container.length;\n\treturn item;\n};\n\n\n/**\n * Removes a list item from the top of the list\n *\n * @api public\n */\n\nList.prototype.shift = function () {\n\tvar item = this.container.shift();\n\tthis.length = this.container.length;\n\treturn item;\n};\n\n\n/**\n * Clears all items from the list\n *\n * @api public\n */\n\nList.prototype.clear = function () {\n\tthis.container.clear();\n\treturn this;\n};\n\n\n/**\n * Reverses all items in the list\n *\n * @api public\n */\n\nList.prototype.reverse = function () {\n\tthis.container.reverse();\n\treturn this;\n};\n\n\n/**\n * Calls a function for each element in the list\n *\n * @api public\n * @param {Function} `fn`\n */\n\nList.prototype.forEach = function (fn) {\n\tthis.container.forEach(fn);\n\treturn this;\n};\n\n\n/**\n * Returns true if the testing function returns\n * `true` for every element in the list\n *\n * @api public\n * @param {Function} `fn`\n */\n\nList.prototype.every = function (fn) {\n\treturn this.container.every(fn);\n};\n\n\n/**\n * Returns true if the testing function returns\n * `true` for at least one element in the list\n *\n * @api public\n * @param {Function} `fn`\n */\n\nList.prototype.some = function (fn) {\n\treturn this.container.some(fn);\n};\n\n\n/**\n * Returns the first index of a given input\n * in the element list\n *\n * @api public\n * @param {Function} `input`\n */\n\nList.prototype.indexOf = function (input) {\n\treturn this.container.indexOf(input);\n};\n\n\n/**\n * Returns the last index of a given input\n * in the element list\n *\n * @api public\n * @param {Function} `input`\n */\n\nList.prototype.lastIndexOf = function (input) {\n\treturn this.container.lastIndexOf(input);\n};\n\n\n\n/**\n * `ListHeader` constructor\n *\n * @api public\n */\n\ntopcoat.ListHeader = ListHeader;\nfunction ListHeader () {\n\tif (!(this instanceof ListHeader)) return new ListHeader();\n\tTopcoatElement.call(this);\n\tthis.el = domify('<h3 class=\"topcoat-list__header\"></h3>');\n\t// proxy events\n\tproxyEvents(this.el, this);\n}\n\n// inherit from `TopcoatElement`\nListHeader.prototype.__proto__ = TopcoatElement.prototype;\n\n\n/**\n * `ListContainer` constructor\n *\n * @api public\n */\n\ntopcoat.ListContainer = ListContainer;\nfunction ListContainer () {\n\tif (!(this instanceof ListContainer)) return new ListContainer();\n\tTopcoatElement.call(this);\n\tthis.el = domify('<ul class=\"topcoat-list\"></ul>');\n\tthis.items = [];\n\tthis.length = 0;\n\t// proxy events\n\tproxyEvents(this.el, this);\n}\n\n// inherit from `TopcoatElement`\nListContainer.prototype.__proto__ = TopcoatElement.prototype;\n\n\n/**\n * Pushes a `ListItem` to the bottom of the list\n *\n * @api public\n * @param {String|ListItem} `item`\n */\n\nListContainer.prototype.push = \nListContainer.prototype.add = function (item) {\n\tif ('string' === typeof item)\n\t\titem = ListItem().text(item);\n\telse if (item instanceof Element)\n\t\titem = ListItem.wrap(item);\n\n\tif (!(item instanceof ListItem))\n\t\tthrow new TypeError(\"expecting `string` or an instance of `ListItem`\");\n\n\tthis.items.push(item);\n\tthis.append(item.el);\n\tthis.length++;\n\treturn this;\n};\n\n\n/**\n * Unnshifts a `ListItem` to the top of the list\n *\n * @api public\n * @param {String|ListItem} `item`\n */\n\nListContainer.prototype.unshift = function (item) {\n\tif ('string' === typeof item)\n\t\titem = ListItem().text(item);\n\telse if (item instanceof Element)\n\t\titem = ListItem.wrap(item);\n\n\tif (!(item instanceof ListItem))\n\t\tthrow new TypeError(\"expecting `string` or an instance of `ListItem`\");\n\n\tthis.items.unshift(item);\n\tthis.prepend(item.el);\n\tthis.length++;\n\treturn this;\n};\n\n\n/**\n * Pops a `ListItem` off from the bottom of the list\n *\n * @api public\n * @param {String|ListItem} `item`\n */\n\nListContainer.prototype.pop = function () {\n\tvar item = this.items.pop()\n\t  , nodes = this.el.querySelectorAll('.topcoat-list__item')\n\t  , node = tail(nodes)\n\n\tif (!item || !node)\treturn false;\n\telse if (node !== item.el) return false;\n\t\n\titem.remove();\n\tthis.length--;\n\treturn item;\n};\n\n\n/**\n * Shifts a `ListItem` off from the bottom of the list\n *\n * @api public\n * @param {String|ListItem} `item`\n */\n\nListContainer.prototype.shift = function () {\n\tvar item = this.items.shift()\n\t  , nodes = this.el.querySelectorAll('.topcoat-list__item')\n\t  , node = head(nodes)\n\n\tif (!item || !node)\treturn false;\n\telse if (node !== item.el) return false;\n\t\n\titem.remove();\n\tthis.length--;\n\treturn item;\n};\n\n\n\n/**\n * Reverses the order of the elements in the list container\n *\n * @api public\n */\n\nListContainer.prototype.reverse = function () {\n\tvar items = [].concat(this.items).reverse() // clone and reverse\n\tif (!items.length) return this;\n\tthis.clear();\n\tfor (var i = 0; i < items.length; ++i) this.push(items[i]);\n\treturn this;\n};\n\n\n/**\n * Clears the container of all items\n *\n * @api public\n */\n\nListContainer.prototype.clear = function () {\n\tfor (var i = this.items.length - 1; i >= 0; i--) this.pop();\n\treturn this;\n};\n\n\n/**\n * Calls a function for each element in the list\n *\n * @api public\n * @param {Function} `fn`\n */\n\nListContainer.prototype.forEach = function (fn) {\n\tthis.items.forEach(fn);\n\treturn this;\n};\n\n\n/**\n * Returns `true` if every element in the list\n * satisfies a provided test function\n *\n * @api public\n * @param {Function} `fn`\n */\n\nListContainer.prototype.every = function (fn) {\n\tthis.items.every(fn);\n\treturn this;\n};\n\n\n\n/**\n * Returns `true` if at least one element in the list\n * satisfies a provided test function\n *\n * @api public\n * @param {Function} `fn`\n */\n\nListContainer.prototype.some = function (fn) {\n\tthis.items.some(fn);\n\treturn this;\n};\n\n\n/**\n * Returns the first index of an element found\n * in the list\n *\n * @api public\n * @param {Mixed} `input`\n */\n\nListContainer.prototype.indexOf = function (input) {\n\treturn this.items.indexOf(input);\n};\n\n\n/**\n * Returns the last index of an element found\n * in the list\n *\n * @api public\n * @param {Mixed} `input`\n */\n\nListContainer.prototype.indexOf = function (input) {\n\treturn this.items.lastIndexOf(input);\n};\n\n\n/**\n * `ListItem` constructor\n *\n * @api public\n */\n\ntopcoat.ListItem = ListItem;\nfunction ListItem (el) {\n\tif (!(this instanceof ListItem)) return new ListItem(el);\n\tTopcoatElement.call(this);\n\tthis.el = el || domify('<li></li>');\n\tthis.addClass('topcoat-list__item');\n\t// proxy events\n\tproxyEvents(this.el, this);\n}\n\n// inherit from `TopcoatElement`\nListItem.prototype.__proto__ = TopcoatElement.prototype;\n\n\n/**\n * Wraps an element in a `ListItem` instance\n *\n * @api public\n * @param {Element} `el`\n */\n\nListItem.wrap = function (el) {\n\treturn ListItem().append(el);\n};\n\n\n/**\n * `NavigationBar` constructor\n *\n * @api public\n */\n\ntopcoat.NavigationBar = NavigationBar;\nfunction NavigationBar (el) {\n\tif (!(this instanceof NavigationBar)) return new NavigationBar(el);\n\tTopcoatElement.call(this);\n\tthis.el = el || domify('<div></div>');\n\tthis.items = [];\n\tthis.titleItem = null;\n\tthis.addClass('topcoat-navigation-bar');\n\t// proxy events\n\tproxyEvents(this.el, this);\n}\n\n// inherit from `TopcoatElement`\nNavigationBar.prototype.__proto__ = TopcoatElement.prototype;\n\n\n/**\n * Adds an item to the `NavigationBar` container\n *\n * @api public\n * @param {TopcoatElement} `item`\n * @param {Object} `opts`\n */\n\nNavigationBar.prototype.add = function (item, opts) {\n\tif (item instanceof NavigationBarItem) {\n\t\treturn this.add(TopcoatElement(item.el), opts);\n\t} else if (item instanceof TopcoatElement) {\n\t\tvar navItem = NavigationBarItem()\n\t\tnavItem.append(item.el);\n\t\tthis.items.push(navItem);\n\t\tthis.append(navItem.el);\n\t\tif (opts && opts.align) navItem.align(opts.align);\n\t\tif (opts && opts.size) navItem.size(opts.size);\n\t\treturn navItem;\n\t} else if (item instanceof Element) {\n\t\treturn this.add(TopcoatElement(item), opts);\n\t} else {\n\t\tthrow new TypeError(\"expecting instance of `TopcoatElement` or `NavigationBarItem`\");\n\t}\n};\n\n\n\n/**\n * Creates a title for the `NavigationBar` instance\n *\n * @api public\n * @param {String} `title`\n * @param {Object} `opts`\n */\n\nNavigationBar.prototype.title = function (title, opts) {\n\t// remove any existing title objects\n\tif (this.titleItem) this.titleItem.remove();\n\treturn this.add(NavigationBarTitle().text(title), opts);\n};\n\n\n\n/**\n * `NavigationBarItem` constructor\n *\n * @api public\n * @param {Element} `el`\n */\ntopcoat.NavigationBarItem = NavigationBarItem;\nfunction NavigationBarItem (el) {\n\tif (!(this instanceof NavigationBarItem)) return new NavigationBarItem(el);\n\tTopcoatElement.call(this);\n\tthis.el = el || domify(\n\t\t'<div></div>'\n\t);\n\n\tthis.addClass('topcoat-navigation-bar__item');\n\t// proxy events\n\tproxyEvents(this.el, this);\n}\n\n// inherit from `TopcoatElement`\nNavigationBarItem.prototype.__proto__ = TopcoatElement.prototype;\n\n\n/**\n * Sets the size of the item\n *\n * @api public\n * @param {String|Number} `size`\n */\n\nNavigationBarItem.prototype.size = function (size) {\n\tvar supported = [\n\t\t'quarter', 'half', 'third', 'full', 'three-quarters', 'two-thirds'\n\t];\n\n\tif (undefined === size) {\n\t\tfor (var i = 0; i < supported.length; ++i) {\n\t\t\tif (hasClass(thie.el, supported[i])) return supported[i];\n\t\t}\n\t}\n\n\tif ('string' === typeof size) {\n\t\tif (!~supported.indexOf(size))\n\t\t\tthrow new Error(\"unsupported size `\"+ size +\"`\");\n\n\t\t// sanitize before adding\n\t\tfor (var i = 0; i < supported.length; ++i)\n\t\t\tremoveClass(this.el, supported);\n\n\t\t// add size to class list\n\t\taddClass(this.el, size);\n\n\t} else if ('number' === typeof size) {\n\t\tthis.width(size);\n\t}\n\n\treturn this;\n};\n\n\n/**\n * Sets the alignment of the item\n *\n * @api public\n * @param {String|Number} `alignment`\n */\n\nNavigationBarItem.prototype.align = function (alignment) {\n\tvar supported = [\n\t\t'left', 'center', 'right'\n\t];\n\n\tif (undefined === alignment) {\n\t\tfor (var i = 0; i < supported.length; ++i) {\n\t\t\tif (hasClass(thie.el, supported[i])) return supported[i];\n\t\t}\n\t}\n\n\tif (!~supported.indexOf(alignment))\n\t\tthrow new Error(\"unsupported alignment `\"+ alignment +\"`\");\n\n\t// sanitize before adding\n\tfor (var i = 0; i < supported.length; ++i)\n\t\tremoveClass(this.el, supported);\n\n\t// add alignment to class list\n\taddClass(this.el, alignment);\n\n\treturn this;\n};\n\n\n/**\n * `NavigationBarTitle` constructor\n *\n * @api public\n * @param {Element} `el`\n */\n\ntopcoat.NavigationBarTitle = NavigationBarTitle;\nfunction NavigationBarTitle (el) {\n\tif (!(this instanceof NavigationBarTitle)) return new NavigationBarTitle(el);\n\tTopcoatElement.call(this);\n\tthis.el = el || domify(\n\t\t'<h1></h1>'\n\t);\n\n\tthis.addClass('topcoat-navigation-bar__title')\n\t// proxy events\n\tproxyEvents(this.el, this);\n}\n\n// inherit from `TopcoatElement`\nNavigationBarTitle.prototype.__proto__ = TopcoatElement.prototype;\n\n\n/**\n * `Input` constructor\n *\n * @api public\n * @param {Element} `el`\n */\n\ntopcoat.Input = Input;\nfunction Input (el) {\n\tif (!(this instanceof Input)) return new Input(el);\n\tTopcoatElement.call(this);\n\tthis.el = el || domify(\n\t\t'<input type=\"text\" value=\"\" placeholder=\"\"/>'\n\t);\n\n\tthis.addClass('topcoat-text-input');\n\t// proxy events\n\tproxyEvents(this.el, this);\n}\n\n// inherit from `TopcoatElement`\nInput.prototype.__proto__ = TopcoatElement.prototype;\n\n\n/**\n * Sets the input type\n *\n * @api public\n * @param {String} `type`\n */\n\nInput.prototype.type = function (type) {\n\tif (undefined === type) return this.el.getAttribute('type');\n\telse this.el.setAttribute('type', type);\n\treturn this;\n};\n\n\n/**\n * Gets/sets the input value\n *\n * @api public\n * @param {Mixed} `value`\n */\n\nInput.prototype.value = function (value) {\n\tif (undefined === value) return this.el.getAttribute('value');\n\telse (this.el.value = value) && this.el.setAttribute('value', value);\n\treturn this;\n};\n\n\n/**\n * Gets/sets the input place holder\n *\n * @api public\n * @param {Mixed} `value`\n */\n\nInput.prototype.placeholder = function (value) {\n\tif (undefined === value) return this.el.getAttribute('placeholder');\n\telse this.el.setAttribute('placeholder', value);\n\treturn this;\n};\n\n\n/**\n * `LargeInput` constructor\n *\n * @api public\n * @param {Element} `el`\n */\n\ntopcoat.LargeInput = LargeInput;\nfunction LargeInput (el) {\n\tif (!(this instanceof LargeInput)) return new LargeInput(el);\n\tInput.call(this);\n\tthis.el = el || domify(\n\t\t'<input type=\"text\" value=\"\" placeholder=\"\"/>'\n\t);\n\tthis.addClass('topcoat-text-input--large');\n\tproxyEvents(this.el, this);\n}\n\n// inherit from `Input`\nLargeInput.prototype.__proto__ = Input.prototype;\n\n\n/**\n * `SearchInput` constructor\n *\n * @api public\n * @param {Element} `el`\n */\n\ntopcoat.SearchInput = SearchInput;\nfunction SearchInput (el) {\n\tif (!(this instanceof SearchInput)) return new SearchInput(el);\n\tInput.call(this);\n\tthis.el = el || domify(\n\t\t'<input type=\"text\" value=\"\" placeholder=\"\"/>'\n\t);\n\n\tthis.addClass('topcoat-search-input');\n\t// proxy events\n\tproxyEvents(this.el, this);\n}\n\n// inherit from `Input`\nSearchInput.prototype.__proto__ = Input.prototype;\n\n\n/**\n * `LargeSearchInput` constructor\n *\n * @api public\n * @param {Element} `el`\n */\n\ntopcoat.LargeSearchInput = LargeSearchInput;\nfunction LargeSearchInput (el) {\n\tif (!(this instanceof LargeSearchInput)) return new LargeSearchInput(el);\n\tInput.call(this);\n\tthis.el = el || domify(\t\n\t\t'<input type=\"text\" value=\"\" placeholder=\"\"/>'\n\t);\n\n\tthis.addClass('topcoat-search-input--large');\n\t// proxy events\n\tproxyEvents(this.el, this);\n}\n\n// inherit from `Input`\nLargeSearchInput.prototype.__proto__ = Input.prototype;\n\n\n/**\n * `TextArea` constructor\n *\n * @api public\n * @param {Element} `el`\n */\n\ntopcoat.TextArea = TextArea;\nfunction TextArea (el) {\n\tif (!(this instanceof TextArea)) return new TextArea(el);\n\tInput.call(this);\n\tthis.el = el || domify(\n\t\t'<textarea rows=\"6\" cols=\"36\" placeholder=\"\"></textarea>'\n\t);\n\n\tthis.addClass('topcoat-textarea');\n\t// proxy events\n\tproxyEvents(this.el, this);\n}\n\n// inherit from `Input`\nTextArea.prototype.__proto__ = Input.prototype;\n\n\n/**\n * Gets/sets the row count\n *\n * @api public\n * @param {Number} `size`\n */\n\nTextArea.prototype.rows = function (size) {\n\tif (undefined === size) return this.el.getAttribute('rows');\n\telse if ('number' !== typeof size) throw new TypeError(\"expecting\ta `number` for row size\");\n\telse this.el.setAttribute('rows', size);\n\treturn this;\n};\n\n\n/**\n * Gets/sets the column count\n *\n * @api public\n * @param {Number} `size`\n */\n\nTextArea.prototype.columns = \nTextArea.prototype.cols = function (size) {\n\tif (undefined === size) return this.el.getAttribute('cols');\n\telse if ('number' !== typeof size) throw new TypeError(\"expecting\ta `number` for column size\");\n\telse this.el.setAttribute('cols', size);\n\treturn this;\n};\n\n\n/**\n * `LargeTextArea` constructor\n *\n * @api public\n * @param {Element} `el`\n */\n\ntopcoat.LargeTextArea = LargeTextArea;\nfunction LargeTextArea (el) {\n\tif (!(this instanceof LargeTextArea)) return new LargeTextArea(el);\n\tTextArea.call(this);\n\tthis.el = el || domify(\n\t\t'<textarea rows=\"6\" cols=\"36\" placeholder=\"\"></textarea>'\n\t);\n\tthis.addClass('topcoat-textarea--large');\n\t// proxy events\n\tproxyEvents(this.el, this);\n}\n\n// inherit from `Input`\nLargeTextArea.prototype.__proto__ = TextArea.prototype;\n\n\n//@ sourceURL=topcoat/index.js"
));
require.alias("juliangruber-events/index.js", "topcoat/deps/events/index.js");
require.alias("component-emitter/index.js", "juliangruber-events/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("component-domify/index.js", "topcoat/deps/domify/index.js");

if (typeof exports == "object") {
  module.exports = require("topcoat");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("topcoat"); });
} else {
  window["topcoat"] = require("topcoat");
}})();