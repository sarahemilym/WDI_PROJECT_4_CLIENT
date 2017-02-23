angular
.module('MuSync')
.config(Router);

Router.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', '$sceDelegateProvider', '$authProvider'];
function Router($stateProvider, $locationProvider, $urlRouterProvider, $sceDelegateProvider, $authProvider){
  $locationProvider.html5Mode(true);

  $authProvider.spotify({
    clientId: 'a66b7d062208471c95fc1f931d933478',
    url: '/auth/spotify',
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    redirectUri: window.location.origin,
    optionalUrlParams: ['state'],
    requireUrlParams: ['scope'],
    scope: ['playlist-read-private playlist-read-collaborative user-library-read playlist-modify-public playlist-modify-private'],
    scopePrefix: '',
    scopeDeliminator: ',',
    responseType: 'token',
    oauthType: '2.0'
  });

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: '/js/views/home.html',
    controller: 'HomeCtrl',
    controllerAs: 'home'
  })
  .state('roomsIndex', {
    url: '/rooms',
    templateUrl: '/js/views/rooms/index.html',
    controller: 'RoomsIndexCtrl',
    controllerAs: 'roomsIndex'
  })
  .state('roomsCreate', {
    url: '/rooms/new',
    templateUrl: '/js/views/rooms/new.html',
    controller: 'RoomsCreateCtrl',
    controllerAs: 'roomsCreate'
  })
  .state('roomsShow', {
    url: '/rooms/:id',
    templateUrl: '/js/views/rooms/show.html',
    controller: 'RoomsShowCtrl',
    controllerAs: 'roomsShow'
  })
  .state('roomsEdit', {
    url: '/rooms/:id/edit',
    templateUrl: '/js/views/rooms/edit.html',
    controller: 'RoomsEditCtrl',
    controllerAs: 'roomsEdit'
  })
  .state('usersIndex', {
    url: '/users',
    templateUrl: '/js/views/users/index.html',
    controller: 'UsersIndexCtrl',
    controllerAs: 'usersIndex'
  })
  .state('requestsIndex', {
    url: '/request',
    templateUrl: '/js/views/requests/index.html',
    controller: 'RequestsIndexCtrl',
    controllerAs: 'requestsIndex'
  });

  $urlRouterProvider.otherwise('/');
}
