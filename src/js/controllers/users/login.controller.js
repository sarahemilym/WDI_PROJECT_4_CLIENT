angular
.module('MuSync')
.controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['User', 'CurrentUserService', '$state'];
function LoginCtrl(User, CurrentUserService, $state){
  const vm = this;

  vm.login = () => {
    User
    .login(vm.user)
    .$promise
    .then(data => {
      CurrentUserService.getUser();
      $state.go('home');
      console.log(data);
    }, err => {
      console.log(err);
    });
  };
}
