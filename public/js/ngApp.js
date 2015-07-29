'use strict';

/* App Module */

var projectApp = angular.module('projectApp', [
  'ngRoute',
  'projectControllers',
  'projectEndPoint'
]);

projectApp.config(['$routeProvider',
  function($routeProvider) {
  $routeProvider.
      when('/projects', {
        templateUrl: '../views/project-list.html',
        controller: 'ProjectListCtrl'
      }).
      when('/projects/:projectId', {
        templateUrl: '../views/project-detail.html',
        controller: 'ProjectDetailCtrl'
      }).
      otherwise({
        redirectTo: '/projects'
      });
  }]);



