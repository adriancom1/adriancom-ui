'use strict';

/* Services */

var projectEndPoint = angular.module('projectEndPoint', ['ngResource']);

projectEndPoint.factory('Project', ['$resource',
  function($resource) {
  	var Project = $resource('http://192.168.1.12:3000/projects/:projectId',
  		{projectId:'@projectId'} , 
  		{
	    	query: {
	      		method:'GET',
	      		isArray: false
	     	},
	     	list : {
	     		isArray:true
	     	}
    	});
  	return Project;
}]);
