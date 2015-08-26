'use strict';

/* Services */

var projectEndPoint = angular.module('projectEndPoint', ['ngResource']);

projectEndPoint.factory('Project', ['$resource',
  function($resource) {
  	var Project = $resource('http://adriancom-data.herokuapp.com/projects/:projectId',
  		{projectId:'@projectId'} , 
  		{
	    	query: {
	      		method:'GET',
	      		isArray: false,
	      		cache: true
	     	},
	     	list : {
	     		isArray:true
	     	}
    	});
  	return Project;
}]);
