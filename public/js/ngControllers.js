'use strict';

/* Controllers */

var projectControllers = angular.module('projectControllers', []);

projectControllers.controller('ProjectListCtrl', ['$scope', 'Project',
  function($scope, Project) {    
    $scope.projects = Project.list();
    //$scope.orderProp = 'age';
  }]);

projectControllers.controller('ProjectDetailCtrl', ['$scope', '$routeParams', 'Project',
  function($scope, $routeParams, Project) {
    $scope.project = Project.query({projectId: $routeParams.projectId}, function(project) {
      //$scope.mainImageUrl = project.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    };
  }]);


