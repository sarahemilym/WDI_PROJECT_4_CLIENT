angular
.module('MuSync')
.service('TokenService', TokenService);

TokenService.$inject = ['$window', 'jwtHelper'];
function TokenService($window, jwtHelper) {
  const self = this;

  self.setItem = (tokenName, token) => {
    return $window.localStorage.setItem(tokenName, token);
  };

  self.getItem = (tokenName) => {
    return $window.localStorage.getItem(tokenName);
  };

  self.decodeToken = () => {
    const token = self.getItem('Auth-token');
    return token ? jwtHelper.decodeToken(token) : null;
  };

  self.removeToken = () => {
    $window.localStorage.clear();
  };
}
