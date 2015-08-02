'use strict';

/* App Module */

var projectApp = angular.module('projectApp', [
  'ngRoute',
  'projectControllers',
  'projectEndPoint',
  'projectDirectives'
]);

projectApp.config(['$routeProvider',
  function($routeProvider) {
  $routeProvider.
      when('/projects', {
        redirectTo: '/projects/adrian-test'
      }).
      when('/projects/:projectId', {
        templateUrl: '../views/project-detail.html',
        controller: 'ProjectDetailCtrl'
      }).
      otherwise({
        //Default Project
        redirectTo: '/projects/adrian-test'
      });
  }]);



