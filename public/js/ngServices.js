'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Phone', ['$resource',
  function($resource) {
  	var Projects = $resource('http://localhost:3000/phones/:phoneId', 
  		{phoneId:'@phoneId'} , 
  		{
	    	query: {
	      		method:'GET',
	      		isArray: false
	     	},
	     	list : {
	     		isArray:true
	     	}
    	});
  	return Projects;
}]);
