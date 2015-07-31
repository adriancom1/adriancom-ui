
var ScrollUtils = (function() {
	var elementCache = {};
	elementCache.get = function(element) {
		if(element === null) return;
		if(!this.hasOwnProperty(element) || !this[element]) {
			var el = document.getElementById(element);
			return el;
		}
		return this[element];
	};

	elementCache.put = function(id) {
		if(!this.hasOwnProperty(id)) {
			var element = document.getElementById(id);
		}
		this[id] = element;
	}; 

	var _scroll = {
		context : {},
		scrolledElements : [],
		callbackQueue : [],
		viewPortH : document.documentElement.clientHeight,
		midViewportY : document.documentElement.clientHeight/2,
		scrollYPos : null,
		__onscroll_collisionCheck : function() {
			var ctx = this.context;
			var cssApply = ctx.css;
			var collider = elementCache.get(ctx.collider); //elTarget
			var _targetEl = elementCache.get(ctx.target);
			var source = elementCache.get(ctx.source).getBoundingClientRect();
		    var colliderHeight = collider.offsetHeight;		     
			var offSet = 25;
			
			var boundaryTop = (~(collider/2 - collider.clientHeight) - ~source.top);
			var boundaryBottom = (~(collider/2 - collider.clientHeight) - ~source.bottom);

			//Check if the Source collides with the Top Header		
			if(~((boundaryBottom - offSet) >> 63) === 0) {
				if(!collider.classList.contains('hide')) {
					collider.classList.add('hide');
				}
				//Apply the CSS to the colliding object
				if(~(boundaryBottom >> 63) === 0) { //Hack Binary Boolean Test
					if(!collider.classList.contains(cssApply)) {
						collider.classList.add(cssApply);
					}
				}
			}
			//Check for the bottom boundary of the source element
			if(ctx.hasOwnProperty('targetCss')) {
				if(~((boundaryBottom - offSet) >> 63) === 0) {
					if(!collider.classList.contains(ctx.targetCss)) {
						_targetEl.classList.add(ctx.targetCss);
					}
				}
			}

			//Check for additional scrolled elements
			if(this.scrolledElements.length > 0) {
				var _se = this.scrolledElements;
				var self = this;
				_se.forEach(function(item, counter) {
					var el = elementCache.get(item);
					if(el.getBoundingClientRect().top <= self.midViewportY) {
						self.callbackQueue[counter]();
						//Remove from Queue
						self.callbackQueue.splice(counter, 1);
						self.scrolledElements.splice(counter, 1)
					}
				});
			}

			//Reset the top header
			if(this._topCheck()) { //height
				collider.classList.remove('hide');
				collider.classList.remove(cssApply);
				if(_targetEl) {
					_targetEl.classList.remove(ctx.targetCss);
				}
			}
		},
		_topCheck : function() {
			var scrollY = window.scrollTop || window.pageYOffset || window.scrollY;
			var top = document.documentElement.getBoundingClientRect().top;
			if(top == scrollY || !scrollY) { //(!scrollY) IE Tweak
				return true;
			}
			return false;
		},
		_bottomCheck : function() {
			var bottom = document.documentElement.getBoundingClientRect().bottom;
			if(bottom == window.innerHeight) {
				return true;
			}
			return false;
		},
		_setContext : function(contextObject) {
			var keys = Object.keys(contextObject);
			var self = this;
			this.context.collider = this.headerName; //Target
			keys.forEach(function(item) {
				self.context[item] = contextObject[item];
			});
			this.context = self.context;
		},
		init : function() {
			var self = this;
			var el = Array.prototype.slice.call(arguments, 0);
			el.forEach(function(item){
				elementCache.put(item);
			});
			window.onscroll = this.__onscroll_collisionCheck.bind(self);
			return this;
		},
		getElement : function(elementId) {
			return elementCache.get(elementId);
		},
		getTopRect : function(element) {
			return Math.floor(element.getBoundingClientRect().top);
		},
		setTopHeader : function(elementId) {
			this.headerName = elementId;
			elementCache.put(elementId);
			var el = elementCache.get(elementId);
			this.headerOffsetHeight = el.offsetHeight;
		},
		goTo : function(element) {
			var scrollY = window.pageYOffset || window.scrollY; 
			window.scroll(0, scrollY - (~this.getTopRect(element)  + this.headerOffsetHeight));
		},
		scrollTo : function(targetElement, steps) {
			var element = elementCache.get(targetElement);
			if(this._bottomCheck()) {
				this.goTo(element);
				return;
			}
			var self = this;
			var incr = 0;
			var scrollTo = Math.floor(element.getBoundingClientRect().top)
			this.scrollYPos = window.pageYOffset || window.scrollY;

			var topRect = function() {
				return self.getTopRect(element);
			};

			var reset = function() {
				clearInterval(time);
				incr = 0;
			};

			var isOffTop = function() {
				return (~(topRect() >> 63) == 0);
			};
			
			if(element) {
				var time = setInterval(function() {
					var scrollOffset = document.documentElement.getBoundingClientRect().bottom;
					var scrollY = window.pageYOffset || window.scrollY; 
					var locElement = topRect() - self.headerOffsetHeight;
					var steps = (~incr * 0.02) * 5;
					if(isOffTop()) {
						//Flip direction
						locElement = ~locElement;
						steps = (incr * 0.02) * 5;
					}
					window.scroll(0, scrollY - steps);
					if(locElement >> 63 || self._bottomCheck() || locElement <= 1) {
						reset();
						//Adjust the Y Axis to any offset pixels
						window.scroll(0, scrollY - ~locElement);
					};
					incr++;
				}, 0.5);
			}
		},
		scrolled : function(elementId, callback) {
			var self = this;
			elementCache.put(elementId);
			var el = elementCache.get(elementId);
			this.scrolledElements.push(elementId);
			this.callbackQueue.push(callback.bind(self, el));
		},
		topHeaderLock : function(sourceElementId, cssClass) {
			this._setContext({source: sourceElementId, css: cssClass});
		},
		toggleVideo : function(sourceElementId, targetVideoElementId, cssClass) {
			this._setContext({source: sourceElementId, target: targetVideoElementId, targetCss: cssClass});
		},
		link : function(sourceElementId, targetElementId, home) {
			var link = document.getElementById(sourceElementId);
			var self = this;
			if(home) {
				link.onclick = function() {
					scroll(0,0);
				};
				return;
			}
			link.onclick = function() {
				self.scrollTo(targetElementId);
			};
		},
		top : function(sourceElementId) {
			this.link(sourceElementId,null,true);
		}
	};
	return _scroll;
})();


