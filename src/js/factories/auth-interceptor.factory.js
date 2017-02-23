angular
  .module('MuSync')
  .factory('AuthInterceptor', AuthInterceptor);

AuthInterceptor.$inject = ['API', 'TokenService'];

function AuthInterceptor(API, TokenService) {
  return{
    request (config) {
      const token = TokenService.getItem('Auth-token');

      if (config.url.indexOf(API) === 0 && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    response (res) {
      if (res.config.url.indexOf(API) === 0 && res.data.token) {
        TokenService.setItem('Auth-token', res.data.token);
      }
      return res;
    }
  };
}
