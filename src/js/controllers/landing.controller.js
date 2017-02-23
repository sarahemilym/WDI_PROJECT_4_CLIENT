angular
  .module('MuSync')
  .controller('LandingCtrl', LandingCtrl);

LandingCtrl.$inject = ['User', '$state'];
function LandingCtrl(User, $state) {

  const vm = this;

  vm.login    = true;
  vm.register = false;

  vm.showLogin = () => {
    vm.login    = true;
    vm.register = false;
  };

  vm.showRegister = () => {
    vm.login    = false;
    vm.register = true;
  };
}
