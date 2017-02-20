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
    redirectUri: 'http://localhost:4000/test',
    optionalUrlParams: ['state'],
    requireUrlParams: ['scope'],
    scope: ['playlist-read-private playlist-read-collaborative user-library-read'],
    scopePrefix: '',
    scopeDeliminator: ',',
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
  });
  $urlRouterProvider.otherwise('/');
}
