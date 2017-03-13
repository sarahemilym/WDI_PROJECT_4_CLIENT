angular
  .module('MuSync')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = [
  '$rootScope',
  'CurrentUserService',
  '$state'
];
function MainCtrl(
  $rootScope,
  CurrentUserService,
  $state) {
  const vm = this;

  vm.logout = () => {
    CurrentUserService.removeUser();
    $state.go('landing');
  };

  $rootScope.$on('loggedIn', () => {
    vm.user = CurrentUserService.currentUser;
  });

  $rootScope.$on('loggedOut', () => {
    vm.user = null;
    console.log('logged out user', vm.user);
  });
}
