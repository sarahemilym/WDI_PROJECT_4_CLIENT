angular
.module('MuSync')
.service('TokenService', TokenService);

TokenService.$inject = ['$window', 'jwtHelper'];
function TokenService($window, jwtHelper) {
  const self = this;
console.log('self token', self)
  self.setToken = (token) => {
    return $window.localStorage.setItem('Auth-token', token);
  };
  self.getToken = () => {
    return $window.localStorage.getItem('Auth-token');
  };
  self.decodeToken = () => {
    const token = self.getToken();
    return token ? jwtHelper.decodeToken(token) : null;
  };
  self.removeToken = () => {
    $window.localStorage.clear();
    console.log('remove token');
  };
}
