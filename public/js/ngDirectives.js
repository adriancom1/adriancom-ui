'use strict';

/* Directives */

var projectDirectives = angular.module('projectDirectives', []);

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
		element.on('mouseover', setElements.bind(event.target));
		element.on('mouseout', setElements.bind(event.target));
		element.on('click', function(event) {
			
		});
	};

	return {
		controller: 'ProjectListCtrl',
		templateUrl: '../views/project-list.html',
		scope: {
			projectInfo: '=info'
		},
		link: projectListEl
	};
}]);