'use strict';

/* Directives */

var projectDirectives = angular.module('projectDirectives', []);

// List of Works displayed in a searchable grid
projectDirectives.directive('worksList', ['$document', function($document) {

	function setElements(event) {
		var className = 'on';
		var figC = event.target.parentElement;
		var fChilds = figC.children;
		var img = figC.nextElementSibling;
		var toggle = 'add';
		if(fChilds[0].classList.contains('on')) {
			toggle = 'remove';
		}
		try {
			fChilds[0].classList[toggle](className);
			fChilds[1].classList[toggle](className);
			img.classList[toggle](className);
			figC.nextElementSibling.classList[toggle](className);
		} catch(error) {
			console.log('! Line 24. NG Directives check elements classList');
		};
		
	};
	var projectListEl = function(scope, element, attr) {
		element.on('mouseover', function(event) {
			setElements(event);
		});
		element.on('mouseout', function(event) {
			setElements(event);
		});
		element.on('click', function(event) {
			//Scroll the entire document back to the top
			window.scroll(0,0);
		});
	};

	return {
		controller: 'ProjectListCtrl',
		templateUrl: '../views/project-list.html',
		restrict: 'E',
		scope: {
			projectInfo: '=info'
		},
		link: projectListEl
	};
}]);

// Main Project Screenshot
projectDirectives.directive('projectHero', function() {
	return {
		controller: 'ProjectListCtrl',
		restrict: 'E',
		templateUrl: '../views/project-hero.html',
	};
});

// Strategy list (Goals, Design Goals)
projectDirectives.directive('strategyList', function() {
	return {
		controller: 'StrategyListController',
		restrict: 'E',
		templateUrl: '../views/strategy-list.html',
		scope: {
			type: '=',
		}
	};
});


// "@"   (  Text binding / one-way binding )
// "="   ( Direct model binding / two-way binding )
// "&"   ( Behaviour binding / Method binding  )
