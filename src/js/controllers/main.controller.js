angular
  .module('MuSync')
  .controller('MainCtrl', MainCtrl);


MainCtrl.$inject = ['$rootScope', 'CurrentUserService', '$state'];
function MainCtrl($rootScope, CurrentUserService, $state) {
  const vm = this;

  vm.logout = () => {
    CurrentUserService.removeUser();
    $state.go('home');
  };

  $rootScope.$on('loggedIn', () => {
    console.log('logged in')
    vm.user = CurrentUserService.currentUser;
    console.log('user', vm.user)
  });

  $rootScope.$on('loggedOut', () => {
    vm.user = null;
    console.log('logged out user', vm.user)
  });
}
