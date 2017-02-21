angular
.module('MuSync')
.controller('UsersShowCtrl', UsersShowCtrl);

UsersShowCtrl.$inject = ['API', '$stateParams', 'User', '$state', 'CurrentUserService'];
function UsersShowCtrl(API, $stateParams, User, $state, CurrentUserService){
  const vm = this;
  vm.user = User.get($stateParams);

  CurrentUserService.getUser();
  vm.currentUser = CurrentUserService.currentUser.id;


  User.get($stateParams, (data) => {
    vm.user = data;
    console.log(data)

  });
}
