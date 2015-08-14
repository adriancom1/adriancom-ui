'use strict';

/* Controllers */
var projectControllers = angular.module('projectControllers', []);

projectControllers.controller('ProjectListCtrl', ['$scope', '$filter', 'Project',
  function($scope, $filter, Project) { 
    var orderBy = $filter('orderBy');
    $scope.projects = Project.list();
    
    //Filter sort order
    $scope.order = function(predicate, reverse) {
      $scope.projects = orderBy($scope.projects, predicate, reverse);
    };
    
}]);

projectControllers.controller('ProjectDetailCtrl', ['$scope', '$routeParams', 'Project',
  function($scope, $routeParams, Project) {
    $scope.project = Project.query({projectId: $routeParams.projectId}, function(project) {
      $scope.hero = {}; //Properties for the Hero Images 
      $scope.slideshow = {};
      $scope.hero.type = "single";
      $scope.hero.image = project.hero[0]; //Initial

      if((project.hero.length > 1)) {
        $scope.hero.type = "multiple";
        $scope.hero.images = project.hero;
      }

      //Enable animation only when set to True
      animInit(project.slideshow.animate);
    });
}])
.controller('StrategyListController', ['$scope', '$routeParams', 'Project',
  function($scope, $routeParams, Project) {
    Project.query({projectId: $routeParams.projectId}, function(project) {
      $scope.goals = project.strategy.goals;
      $scope.design = project.strategy.design;
      $scope.development = project.strategy.development;
    });

}]);