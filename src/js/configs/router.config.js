angular
.module('MuSync')
.config(Router);

Router.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', '$sceDelegateProvider'];
function Router($stateProvider, $locationProvider, $urlRouterProvider, $sceDelegateProvider){
  $locationProvider.html5Mode(true);

  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'https://api.spotify.com/*',
    'https://embed.spotify.com/?uri=']);

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
