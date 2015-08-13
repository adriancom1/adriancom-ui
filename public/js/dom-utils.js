
var DomUtils = {
	elements : {},
	mOverTarget : {},
	mOutTarget : {},
	slideAnimQueue: [],
	isGridAnimEnabled :  false,
	// Todo: Create a dynamic style sheet for custom rules
	cssStyles : (function() {
		var css = document.createElement('style');
		document.head.appendChild(css);
		return css.sheet;
	})(),
	onclick : function(elementId, handler) {
		var self = this;
		var el = document.getElementById(elementId);
		this._setElementCache(elementId, el);
		el.addEventListener('click', handler.bind(self, elementId, this.__onclick_applyRule.bind(self)), false);
	},
	__onclick_applyRule : function() {
		var id = arguments[0];
		var el = this._getFromCache(id);
		var cssClass = arguments[1];
		if(!this.applyCss(el, cssClass)) {
			return;
		}
	},
	_children : function(elementId) {
		var el = this._getElement(elementId);
		this._setElementCache(elementId, el.children);
		return Array.prototype.slice.call(this._getFromCache(elementId),0);
	},	
	_setElementCache : function(elementId, element) {
		this.elements[elementId] = element;
	},
	_getFromCache : function(elementId) {
		var id = elementId;
		return (this.elements.hasOwnProperty(id)) ? this.elements[id] : document.getElementById(id);
	},
	_getQueryFromCache : function(elementId) {
		var id = elementId;
		if(this.elements.hasOwnProperty(id)) {
			return this.elements[id];
		} else {
			var el = document.querySelector(id);
			this._setElementCache(elementId, el);
			return el;
		}
	},
	_query : function() {
		var elementName = arguments[0];
		var el = this._getQueryFromCache(elementName);
		this._setElementCache(elementName, el);
		this.applyCss(el, arguments[1]);
	},
	_getElement : function(elementId) {
		var id = elementId;
		if(this.elements.hasOwnProperty(id)) {
			return this.elements[id];
		} else {
			var el = document.getElementById(id);
			this._setElementCache(elementId, el);
			return el;
		}
	},
	_removeElement : function(elementId) {
		this.elements[elementId] = null;
		delete this.elements[elementId];
	},
	get : function(elementId) {
		return this._getElement(elementId);
	},
	toArray : function(object) {
		return Array.prototype.slice.call(object, 0);
	},
	randomBg : function(config) {
		var images = config.images;
		var rand = Math.floor(Math.random() * images.length);
		this.addRule(config.selector + '{background: url('+config.folder +'/'+ config.images[rand] + ') no-repeat center center fixed}');
	},


	setHoverFxChild : function(selector, cssClass, partial) {
		/* Todo: Refactor needed to support wider range of elements */
		var el = document.querySelectorAll(selector);
		var len = (partial) ? (el.length/2) : el.length;
		for(var i=0; i < len; i++) {
			var index = (partial) ? (i << 1) : i;
			el[index].onmouseover = function(e) {
				var _el = e.target.nextElementSibling;				
				_el.classList.add(cssClass);
			};
			el[index].onmouseout = function(e) {
				var _el = e.target.nextElementSibling;
				_el.classList.remove(cssClass);
			};
		}
	},
	setHoverFxChildren : function(selector, nthLevels, targetClass /*optional*/) {
		var target = targetClass || 'fx-hover';
		var levels = nthLevels;
		var self = this;
		var root = document.querySelectorAll(selector);

		for(var i=0; i < root.length; i++) {
			root[i].onmouseover = mOver;
			root[i].onmouseout = mOut;
 		}

		function mOver(event) {
			var overT = self.mOverTarget;
			var root = event.currentTarget.children;
			if(self.mOverTarget.source == null) {
				if( (event.toElement || event.relatedTarget).className !== target) {
					for(var i=0; i<root.length; i++) {
						if(root[i].className == target) {
							root[i].classList.add('on');
							overT.source = root[i];
							break;
						} 
					}
					applyFx(root, 'add');					
					return;
				}
				(event.toElement || event.relatedTarget).classList.add('on');
				//overT.from = (event.fromElement || event.explicitOriginalTarget); //not needed
				overT.source = (event.toElement || event.relatedTarget);
				//Apply Efx
				applyFx(root, 'add');
			}
		};
		function mOut(event) {
			var hoveredChild = false;
			var overT = self.mOverTarget;
			
			var root = event.currentTarget.children;
			if(overT.source == (event.toElement || event.relatedTarget)) {
				return;
			}
			for(var i=0; i < levels.length; i++) {
				var _el = self.nthChild(event.currentTarget, levels[i]);
				if(_el == (event.toElement || event.relatedTarget)) {
					hoveredChild = true;
					break;
				}
			}
			if(hoveredChild) return;
			overT.source.classList.remove('on');
			self.mOverTarget.source = null;	
			applyFx(root, 'remove');
		};

		function applyFx(childNodes, toggle) {
			var nodes = childNodes;
			var parent = nodes[0].parentNode;
			var nodeLen = nodes.length;
			parent.nextElementSibling.classList[toggle]('on');
			for(var i=0; i < nodeLen; i++) {
				if(nodes[i].classList.contains('fx')) {
					nodes[i].classList[toggle]('on');	
				}
			}

		};
	},
	addCss : function(selector, cssClass) {
		this._query(selector, cssClass);
	},
	applyCss : function(element, cssClass, toggleCssClass) {
		var el = element;
		if(el.classList.contains(cssClass)) {
			el.classList.remove(cssClass);
			el.offsetWidth;
			if(toggleCssClass) {
				el.classList.add(toggleCssClass);
			}
			return false;
		}
		el.classList.add(cssClass);
		return true;
	},
	addRule : function(cssRule) {
		this.cssStyles.insertRule(cssRule, 0);
	},
	animationEnabled : function(boolean) {
		this.isGridAnimEnabled = boolean;
	},
	slideUpAll : function(element, delay) {
		var self = this;
		var _el = this.nthChild(element);
		
		var update = function(element) {
			self.applyCss(element, 'on');
		};

		_el = this.toArray(_el);
		_el.forEach(function(item, i) {
			if(delay) {
				setTimeout(function() {
					update(item);
				}, (i * delay) * 100);
			} else {
				update(item);
			}
		});
		
	},
	slideMulti : function(elementId, axis, dir, delay) {
		var axis = axis || 'x';
		var dir = dir || '+';
		var shown, visible;
		var children = document.getElementById(elementId).children;
		var total = children.length;
		var pe = children[1].parentElement;
		var parentDim = (axis == 'x') ? pe.clientWidth : pe.clientHeight;
		var queue = [0];
		var time = null;
		var i=1;

		axis = axis.toUpperCase();
		for(; i<children.length; i++ ) {
			children[i].style.transform = children[i].style.webkitTransform = "translate" + axis + "(" + dir + parentDim + 'px)';
			queue.push(i);
		}
		function reposition() {
			children[shown].style.transform = children[shown].style.webkitTransform = "translate" + axis + "(" + dir + parentDim +"px)";
		};

		function slideUp() {
			shown = queue.shift();
			//children[shown].style.transform = "translate" + axis + "(-100%)";
			children[shown].style.transform =  children[shown].style.webkitTransform = "translate" + axis + "(" + ((dir == '+') ? ~100 : 100) +"%)";
			visible = queue[0];
			children[visible].style.transform =  children[visible].style.webkitTransform = "translate" + axis + "(0)";
			children[visible].style.zIndex = total;
			children[shown].style.zIndex = 0;
			queue.push(shown);			
			setTimeout(reposition, 1000);
		};
		var id = setInterval(slideUp, delay * 1000);
		this.slideAnimQueue.push(id);
	},
	slideMultiStop : function(index) {
		var id = this.slideAnimQueue[index];
		console.log(id, 'fuck!!!', this.slideAnimQueue[index], index);
		clearInterval(id);
	},
	fxOn : function(elementId) {
		var _el = this._getElement(elementId);
		this.applyCss(_el, 'on');
	},
	toggleHide : function(element, forceHide) {
		var self = this;
		var el = this._getQueryFromCache(element);
		this.applyCss(el, 'noshow');
		if(forceHide) {			
			if(el.style.display === 'none') {
				el.style.display = '';
			} else {
				el.style.display = 'none';
			}
		}
	},	
	toggleCss : function(element, cssClass) {
		element.classList.remove(cssClass);
		element.offsetWidth;
		element.classList.add(cssClass);
	},
	tellTarget : function(selector, targetElement, cssClass) {
		/* Todo: Need implementation */
	},
	remove : function(elementId) {
		var _el = this._getElement(elementId);
		_el.style.opacity = 0;
		//IE workaroud
		var parent = _el.parentElement;
		parent.removeChild(_el);
		this._removeElement(elementId);
	},
	resetRule : function(ruleA, ruleB) {
		this.classList.remove(ruleA);
		this.classList.add(ruleB);
		this.addEventListener("transitionend", function(item) {
			item.target.classList.remove(ruleB);
		}, false);

	},
	setCoords : function(x, y) {
		this.setAttribute('data-x', x);
		this.setAttribute('data-y', y);
	},
	setDimensions : function(width, height) {
		var units = 'px'; 
		this.style.width = width + units;
		this.style.height = height + units;
	},
	setSpacing : function (value) {
		var n = value/2;
		var unit = 'px';
		this.style.paddingTop = n/2 + unit;
		this.style.paddingBottom = n + unit;
		this.style.paddingLeft = n/2 + unit;
		this.style.paddingRight = n + unit;
	},
	setContent : function (value) {
		this.innerHTML = value;
	},
	link : function(elementId, url) {
		var el = document.getElementById(elementId);
		el.onclick = function() {
			window.location.href = url;
		};
	},
	nthSibling : function(root, level) {
		var el = root;
		for(var i=1; i <= level; i++) {
			el = el.firstElementChild;
		}
		return el;
	},
 	nthChild : function(root, level) {
		var el = root.children;
		if(level == null) {
			return el;
		}
		return el[level];
	},
	keyboard : function(handler, event) {
		if(Event.prototype.isPrototypeOf(event)) {
			if(event.keyCode == 27) {
				handler.call(this);
			}
			return;
		};
		document.body.onkeyup = this.keyboard.bind(this, handler);
	}
};	