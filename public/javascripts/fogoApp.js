var app = angular.module('fogoApp', ['ngRoute', 'ngResource', 'uiGmapgoogle-maps', 'mgcrea.ngStrap']).run(function ($http, $rootScope) {
  $rootScope.authenticated = false
  $rootScope.current_user = ''

  $rootScope.signout = function () {
    $http.get('auth/signout')
    $rootScope.authenticated = false
    $rootScope.current_user = ''
  }
})

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    // the timeline display
    .when('/', {
      templateUrl: 'main.html',
      controller: 'mainController'
    })
    // the login display
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'authController'
    })
    // the signup display
    .when('/register', {
      templateUrl: 'register.html',
      controller: 'authController'
    })

  $locationProvider.html5Mode(true)
})

app.factory('conversationService', function ($resource) {
  return $resource('/api/conversations/:id')
})

app.controller('mainController', function (conversationService, $scope, $rootScope) {
  $scope.conversations = conversationService.query()
  $scope.newConversation = {created_by: '', text: '', created_at: ''}

  $scope.conversation = function () {
    $scope.newConversation.created_by = $rootScope.current_user
    $scope.newConversation.created_at = Date.now()
    conversationService.save($scope.newConversation, function () {
      $scope.conversations = conversationService.query()
      $scope.newConversation = {created_by: '', text: '', created_at: ''}
    })
  }
  $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 }
  $scope.options = {scrollwheel: false}

})

app.controller('authController', function ($scope, $rootScope, $http, $location) {
  $scope.user = {username: '', password: ''}
  $scope.error_message = ''

  $scope.login = function () {
    $http.post('/auth/login', $scope.user).success(function (data) {
      if (data.state == 'success') {
        $rootScope.authenticated = true
        $rootScope.current_user = data.user.username
        $location.path('/')
      } else {
        $scope.error_message = data.message
      }
    })
  }

  $scope.register = function () {
    $http.post('/api/signup', $scope.user).success(function (data) {
      if (data.state == 'success') {
        $rootScope.authenticated = true
        $rootScope.current_user = data.user.username
        $location.path('/')
      } else {
        $scope.error_message = data.message
      }
    })
  }
})
