
	var Grid = (function(initParams) {
	'use strict';

	var attribLabelX = "data-x";
	var attribLabelY = "data-y";

	var DomUtils = {
		toggleCss : function(element, cssClass, libRef /*optional*/ ,elementsRef /*optional*/, iterations /*optional*/, delay/*optional*/) {
			element.classList.remove(cssClass);
			element.offsetWidth;
			element.classList.add(cssClass);
			if(elementsRef) {
				if(iterations == elementsRef.length) {

					setTimeout(function(){
						//turn-on the mouseover
						elementsRef.forEach(function(el) {
							el.addEventListener('mouseover', SquareGrid.itemMouseOver.bind(libRef), false);
						});
					}, delay + 700);
				}
			}
		},
		resetRule : function(ruleA, ruleB) {
			var self = this;
			//this.style.display = 'none';
			this.classList.remove(ruleA);
			this.classList.add(ruleB);
			this.addEventListener("transitionend", function(item) {
				item.target.classList.remove(ruleB);
			}, false);

		},
		setCoords : function(x, y) {
			this.setAttribute(attribLabelX, x);
			this.setAttribute(attribLabelY, y);
		},
		setDimensions : function(width, height) {
			var units = 'px'; 
			if(!~navigator.userAgent.toLowerCase().indexOf('firefox') == 0) {
				height = height/2;
			}

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
		clearRules : function(element, classDefs) { /**/
			for(var el in element) {
				classDefs.forEach(function(cls) {
					var cl = element[el].classList;
					if(cl.contains(cls)) {
						cl.remove(cls);
					}
				});
			}
		},
		isIe : function() {
			return (~navigator.userAgent.toLowerCase().indexOf('MSIE') != 0);
		}
	};	

	function Grid(initParams) { 
		var args = initParams;
		this.id = args.id || 'grid-nav';
		this.spacerWidth = args.spacer;
		this.parentElement = Grid.initGridContainer(args.id);
		this.gridElements = new AnimationLib();	
		this.effect = args.effect;
		this.content = args.content || '-';
		this.cellSize = args.cellSize;
		this.hotSpots = [];
		this.isAnimate = true;
		this.hotSpotLen = args.hotSpots;
		this.fxClassName = 'fx'; //Default FX class name
		this.detailsPage = args.detailsPage;
		
	};

	//Factory 
	Grid.generate = function(initParams) {
		var params = initParams || {rows: 20, columns: 20}
		var grid;
		if(params.type === 'square') {
			grid =  new SquareGrid(initParams);
		}
		grid.createGrid();
		return grid;
	};

	Grid.initGridContainer = function(id) {
		var gridContainer = document.getElementById(id);
		return gridContainer;
	};	

	Grid.prototype.doWave = function(x,y) {
		var self = this;
		var el = this.getElementByCoords({x:x, y:y});
		var ev = null
		if(DomUtils.isIe()) {
			ev = new CustomEvent('toggle', {bubbles: true, cancelable: true, detail: self});
		} else {
			//IE Implements CustomEvent slightly different
			ev = document.createEvent("CustomEvent");
			ev.initCustomEvent('toggle', true, true, self);
		}
		el.dispatchEvent(ev);
	};	

	Grid.prototype.coords = function(element) {
		return new Coords(element);
	};
	
	//must be overridden, cannot be called direct
	Grid.prototype.createGrid = function() {};

	Grid.prototype.loadGridImages = function(path, type, imageList) {
		var hs = this.hotSpots;
		var cssClass = this.fxClassName;
		var self = this;

		function load(el, id) {
			var link = document.createElement('a');
			link.href = self.detailsPage + '#/projects/' + id;

			var img = document.createElement('img');
			img.src = path + '/' + id + '-sm.' + type;
			
			link.appendChild(img);
			img.className = cssClass;
			el.appendChild(link);
		}

		for(var i=0; i < hs.length; i++) {
			load(hs[i], imageList[i])
		}

	};	

	Grid.prototype.addElement = function(item) {
		this.gridElements.animatableElements.push(item);
	};

	Grid.prototype.getElementByCoords = function(coords) {
		var arrIndex = (coords.y * 16) + (coords.x + 1) - 1;
		var elements = this.gridElements || this;
		return elements.getItem(arrIndex);
	};
	
	function SquareGrid(initParams) {		
		Grid.call(this, initParams);
		this.columns = this.yLen = initParams.rows;
		this.rows = this.xLen = initParams.columns;
	};
	SquareGrid.itemMouseOver = function (event) {
		var el = event.currentTarget;
		var elements;
		var isAnimOver = false;
		if(this.gridElements) {
			elements = this.gridElements
		} else {
			elements = this;
			isAnimOver = true;
		}
		elements.effects.hoverBubble(el);
//		var items = this.getAdjacentElements(new Coords(el));
		var items = SquareGrid.prototype.getAdjacentElements.call(this, new Coords(el), elements, isAnimOver);
		DomUtils.clearRules(items, ['expand_near', 'expand_far', 'expand_off', 'botl_off', 'botr_off', 'topr', 'topl', 'bottom', 'botr', 'botl', 'expand_near_off', 'expand_far_off', 'topl_off', 'topr_off']);
		elements.effects.hoverMultiBubble(items);
	};

	SquareGrid.prototype = Object.create(Grid.prototype);
	SquareGrid.prototype.constructor = SquareGrid;
	SquareGrid.prototype.disableEdge = function(x, y) {
		return (y!=0 && x!= 0 && x != this.xLen-1 && y != this.yLen-1);
	};
	SquareGrid.prototype.createGrid = function(element) {
		var self = this;
		var grid = this.grid = document.createElement('div');
		grid.className = 'gridContainer';

		var mouseOverHandler = SquareGrid.itemMouseOver.bind(self);

		var clickHandler = this.clickHandler = function (event) {
			var el = event.target;
			var coords = new Coords(el);
			var items = self.getAdjacentElements(coords);
			self.gridElements.effects.hoverMultiBubbleOut(items);
			DomUtils.resetRule.call(el, 'expand', 'expand_off');
			self.doWave(coords.x, coords.y);
			self.gridElements.animatableElements.forEach(function(item) {
			 	item.removeEventListener('mouseover', mouseOverHandler, false);
			});			
		};

		for( var y = 0; y < this.columns; y++ ) {
			var y_el = document.createElement('div');
			y_el.className = 'row';
			for( var x = 0; x < this.rows; x++ ) {
				var x_el = document.createElement('div');
				var innerItem = document.createElement('div');
				//innerItem.innerHTML = x + ',' + y; //Uncomment to debug
				DomUtils.setCoords.call(innerItem, x, y);
				DomUtils.setDimensions.call(x_el, this.cellSize, this.cellSize);

				DomUtils.setSpacing.call(x_el, this.spacerWidth);
				x_el.className = 'cell';
				innerItem.className = 'innerItem';
				x_el.appendChild(innerItem);
				y_el.appendChild(x_el);
				
				innerItem.addEventListener('click', clickHandler, false);

				//Disable the edge elements
				if(this.disableEdge(x, y)) {
					innerItem.addEventListener('mouseover', mouseOverHandler, false);
				} else {
					innerItem.style.display = 'none';
					//innerItem.style.opacity = 0.3; //Uncomment to Debug
				}

				innerItem.onmouseout = function (event) {
					var el = event.currentTarget;
					self.gridElements.effects.hoverBubbleOut(el);
					var items = self.getAdjacentElements(new Coords(el));
					self.gridElements.effects.hoverMultiBubbleOut(items);
				};

				this.addElement(innerItem);
				x_el.addEventListener('toggle', AnimationLib.toggle, false);
				grid.appendChild(y_el);
			}
			this.parentElement.appendChild(grid);
		}
	};
	SquareGrid.prototype.length = function() {
		return this.gridElements.animatableElements.length;
	};

	SquareGrid.prototype.randomizeClicks = function(limit) {
		var limit = limit || this.hotSpotLen;
		var xLen = this.xLen-4;
		var yLen = this.yLen-4;		
		var x, y;		
		var el;
		var dupeCheck = {};
		var self = this;
		var elementRef = [];

		function _rand(max) {
			var num = Math.floor(Math.random() * max);
			if(num == 0) {
				num = Math.floor(Math.random() * max) + 3;
			}
			return num;
		};

		function _fetch(x,y) {
			var x = rand(x);
			var y = rand(y);
			return self.getElementByCoords({x: x, y: y});
		};

		function _dupes() {
			return limit - Object.keys(dupeCheck).length;
		};

		function _removeDupes() {
			for(var i=0; i < elementRef.length; i++) {
			    if(elementRef.lastIndexOf(elementRef[i]) !== i) {			    	
			       Array.prototype.splice.call(self.hotSpots, i, 1);
			    }
			}			
			return self.hotSpots.length;
		};

		function randMain(iterations) {
			for(var i=0; i < iterations; i++) {
				x = _rand(xLen);
				y = _rand(yLen);	
				if(!self.disableEdge(x, y)) {
					//If on edge, re-randomize
					x = _rand(xLen-i);
					y = _rand(yLen-i);
				} 
				el = self.getElementByCoords({x: x, y: y});
				
				//Remove Default click handler 
				el.removeEventListener('click', self.clickHandler);

				//Test for valid element				
				if(!el) {
					el = _fetch(x,y);
				}
				dupeCheck[x+'-'+y] = null;
				//el.style.backgroundColor = 'green';	//Uncomment to Debug
				el.classList.add('hot-spot');
				self.hotSpots.push(el);

				//Coordinates reference of pending elements 
				elementRef.push(self.hotSpots[i].getAttribute(attribLabelX)+'-'+self.hotSpots[i].getAttribute(attribLabelY));
			}
			return _dupes();
		};
		var result = randMain(limit);
		var rDupes = _removeDupes();
		if(rDupes !== limit) {
			var count = rDupes;
			while(count < limit) {
				 result = randMain(result);
				count++;
			}
		}
	};

	SquareGrid.prototype.getAdjacentElements = function(coords, itemsRef, animOverState) {		
		var adjCoords =  function(c) {
			var adjCoords = {
				top 	 : { x : c.x, y : (c.y - 1) },
				bottom   : { x : c.x, y : (c.y + 1) },
				left 	 : { x : (c.x - 1), y : c.y },
				right 	 : { x : (c.x + 1), y : c.y },
				topLeft  : { x : (c.x - 1), y : (c.y - 1) },
				topRight : { x : (c.x + 1), y : (c.y - 1) },
				botLeft  : { x : (c.x - 1), y : (c.y + 1) },
				botRight : { x : (c.x + 1), y : (c.y + 1) }
			}
			return adjCoords;
		}(coords);
		var adjElements = {};

		if(animOverState) {
			for (var item in adjCoords) {
				adjElements[item] = SquareGrid.prototype.getElementByCoords.call(itemsRef, adjCoords[item]);
			}
		} else {
			for (var item in adjCoords) {
				adjElements[item] = SquareGrid.prototype.getElementByCoords.call(this, adjCoords[item]);
			}
		}
		
		return adjElements;
	};

	function AnimationLib() {
		this.iterations = 0;
		this.animatableElements = [];
		return this;
	};

	AnimationLib.toggle = function(event) {
		var grid = event.detail;
		var coordinates = grid.coords(event.target);
		var initParams = {
			effect : grid.effect,
			coords : coordinates
		}
	 	return AnimationLib.mainLoop.call(grid.gridElements, initParams);
	};	

	AnimationLib.mainLoop = function(mainLoopParams) {
		var self = this;
		this.iterations += 1;
		var frame = window.requestAnimationFrame(AnimationLib.mainLoop.bind(self, mainLoopParams));
		
		if(this.iterations >= 1) {
			window.cancelAnimationFrame(frame);
			this.iterations = 0;
		}
		var efx = this.effects[mainLoopParams.effect].bind(self);
		efx(self.animatableElements, mainLoopParams);
	};


	AnimationLib.prototype.addItems = function(item) {
		this.animatableElements.push(item);
	};

	AnimationLib.prototype.getItem = function(index) {
		return this.animatableElements[index];
	};

	AnimationLib.prototype.effects = Object.create({
		isElementNear : function(query) {
			return ( query === 'top' || query === 'bottom' || query === 'left'   || query === 'right') ? true : false;
		},
		drawCubicWave : function(gridElements, targetParams) {
			var self = this;
			gridElements.forEach(function(item) {
				var itemCoords = new Coords(item);
			 	var dx = targetParams.coords.x - itemCoords.x; //finding the difference between the target and the grid
			 	var dy = targetParams.coords.y - itemCoords.y;
			 	var distance = Math.sqrt( dx * dx + dy * dy );
			 	
			 	self.iterations++
			 	var delay = Math.round( distance * 45 )
				setTimeout(DomUtils.toggleCss.bind(this, item, targetParams.effect, self, gridElements, self.iterations, delay), delay);

			});			
		},
		highlightCenter : function() {
			// Todo: For future use
			var coords = new Coords(el);
			var arrIndex = (coords.x + 1) * (coords.y + 1);
		},
		hoverMultiBubble : function(elements) {
			for(var item in elements) {
				var element = elements[item];
				if(this.isElementNear(item)) {
					element.classList.add("expand_near");
				} else {
					element.classList.add("expand_far");
					if(~item.indexOf('top') != 0) {
						if(~item.indexOf('eft') != 0) {
							element.classList.add("topl");
						} else {
							element.classList.add("topr");
						}
					} else {
						elements[item].classList.add("bottom")
						if(~item.indexOf('eft') != 0) {
							element.classList.add("botl");
						} else {
							element.classList.add("botr");
						}
					}
				}
				
			}
		},
		hoverMultiBubbleOut : function(elements) {
			for(var item in elements) {
				var element = elements[item];
				if(this.isElementNear(item)) {
					DomUtils.resetRule.call(element, 'expand_near', 'expand_near_off');
				} else {
					DomUtils.resetRule.call(element, 'expand_far', 'expand_far_off');
					if(~item.indexOf('top') != 0) {
						if(~item.indexOf('eft') != 0) {
							DomUtils.resetRule.call(element, 'topl', 'topl_off');
						} else {
							DomUtils.resetRule.call(element, 'topr', 'topr_off');
						}
					} else {
						elements[item].classList.remove("bottom");
						if(~item.indexOf('eft') != 0) {
							DomUtils.resetRule.call(element, 'botl', 'botl_off');
						} else {
							DomUtils.resetRule.call(element, 'botr', 'botr_off');
						}
					}
				}
			}
		},
		hoverBubble : function(element) {
			element.classList.add('expand');
		},
		hoverBubbleOut : function(element) {
			DomUtils.resetRule.call(element, 'expand', 'expand_off');
		}
	});

	function Coords(element) {
		this.x = parseInt(element.getAttribute(attribLabelX));
		this.y = parseInt(element.getAttribute(attribLabelY));
	};

	return Grid;

})();

