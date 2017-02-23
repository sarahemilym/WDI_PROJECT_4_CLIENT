angular
.module('MuSync')
.controller('UserLoginCtrl', UserLoginCtrl);

UserLoginCtrl.$inject = ['User', 'CurrentUserService', '$state'];
function UserLoginCtrl(User, CurrentUserService, $state){
  const vm = this;

  vm.login = () => {
    User
    .login(vm.user)
    .$promise
    .then(data => {
      console.log('controller', vm.user);
      CurrentUserService.getUser();
      $state.go('roomsIndex');
      console.log('data', data);
    }, err => {
      console.log(err);
    });
  };
}
