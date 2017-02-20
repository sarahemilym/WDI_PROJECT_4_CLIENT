angular
.module('MuSync')
.service('CurrentUserService', CurrentUserService);

CurrentUserService.$inject = ['TokenService', 'User', '$rootScope'];
function CurrentUserService(TokenService, User, $rootScope) {
  const self = this;

  self.getUser = () => {
    
    const decoded = TokenService.decodeToken();
console.log('decoded', decoded)
    if (decoded) {
      User
      .get({ id: decoded.id })
      .$promise
      .then(data => {
        self.currentUser = data;
        $rootScope.$broadcast('loggedIn');
      }, err => {
        console.log(err);
      });
      self.removeUser = () => {
        console.log('remove user');
        self.currentUser = null;
        TokenService.removeToken();
        $rootScope.$broadcast('loggedOut');
      };
    }
  };
  self.getUser();

}
