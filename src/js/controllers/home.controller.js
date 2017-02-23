angular
  .module('MuSync')
  .controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = [
  'CurrentUserService',
  'TokenService',
  '$state',
  '$auth',
  '$window',
  '$http',
  'User'
];
function HomeCtrl(
  CurrentUserService,
  TokenService,
  $state,
  $auth,
  $window,
  $http,
  User
) {
  if (CurrentUserService.currentUser) {
    return $state.go('roomsIndex');
  }

  const vm        = this;
  vm.authorize    = authorize;
  vm.login        = login;
  vm.register     = register;
  vm.showRegister = false;

  vm.toggleShowRegister = () => {
    vm.showRegister = !vm.showRegister;
  };

  function authorize(provider='spotify') {
    $auth
    .authenticate(provider)
    .then(() => {
      const token = TokenService.getItem('satellizer_token');

      $http
      .get('https://api.spotify.com/v1/me',
        { headers: {Authorization: `Bearer ${token}`}
        })
      .then(response => {
        TokenService.setItem('spotify_id', response.data.id);
        $state.go('roomsIndex');
      });
    })
    .catch(response => {
      console.log('something went wrong', response);
    });
  }

  function login(user) {
    User
      .login(user)
      .$promise
      .then(() => {
        CurrentUserService.getUser();
        authorize();
      }, err => {
        console.log(err);
      });
  }

  function register(user) {
    User
      .register(user)
      .$promise
      .then(() => {
        CurrentUserService.getUser();
        authorize();
      }, err => {
        console.log('error', err);
      });
  }
}
