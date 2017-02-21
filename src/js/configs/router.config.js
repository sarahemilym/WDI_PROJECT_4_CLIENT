angular
.module('MuSync')
.config(Router);

Router.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', '$sceDelegateProvider', '$authProvider'];
function Router($stateProvider, $locationProvider, $urlRouterProvider, $sceDelegateProvider, $authProvider){
  $locationProvider.html5Mode(true);

  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'https://api.spotify.com/*',
    'https://embed.spotify.com/?uri=']);

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
    template: '<h2>Home</h2>'
  })
  .state('register', {
    url: '/register',
    templateUrl: '/js/views/users/register.html',
    controller: 'RegisterCtrl',
    controllerAs: 'register'
  })
  .state('login', {
    url: '/login',
    templateUrl: '/js/views/users/login.html',
    controller: 'LoginCtrl',
    controllerAs: 'login'
  })
  .state('test', {
    url: '/test',
    templateUrl: '/js/views/test.html',
    controller: 'TestCtrl',
    controllerAs: 'test'
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
  });
  $urlRouterProvider.otherwise('/');
}
