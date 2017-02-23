angular
  .module('MuSync')
  .controller('UserRegisterCtrl', UserRegisterCtrl);

UserRegisterCtrl.$inject = ['User', 'CurrentUserService', '$state'];
function UserRegisterCtrl(User, CurrentUserService, $state) {
  const vm = this;

  vm.register = () => {
    User
    .register(vm.user)
    .$promise
    .then(user => {
      CurrentUserService.getUser();
      $state.go('roomsIndex');
      console.log(vm.user);
    }, err => {
      console.log('error', err);
    });
  };
}
