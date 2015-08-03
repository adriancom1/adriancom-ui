'use strict';

/* Services */

var projectEndPoint = angular.module('projectEndPoint', ['ngResource']);

projectEndPoint.factory('Project', ['$resource',
  function($resource) {
  	var Project = $resource('http://localhost:3000/projects/:projectId',
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
