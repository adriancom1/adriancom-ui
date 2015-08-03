'use strict';

/* Controllers */

var projectControllers = angular.module('projectControllers', []);

projectControllers.controller('ProjectListCtrl', ['$scope', 'Project',
  function($scope, Project) {    
    $scope.projects = Project.list();
}]);

projectControllers.controller('ProjectDetailCtrl', ['$scope', '$routeParams', 'Project',
  function($scope, $routeParams, Project) {
    $scope.project = Project.query({projectId: $routeParams.projectId});
    
    animInit();

}])
.controller('StrategyListController', ['$scope', '$routeParams', 'Project',
  function($scope, $routeParams, Project) {
    Project.query({projectId: $routeParams.projectId}, function(project) {
      $scope.goals = project.strategy.goals;
      $scope.design = project.strategy.design;
      $scope.development = project.strategy.development;
    });

}]);