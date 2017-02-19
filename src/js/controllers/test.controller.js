angular
.module('MuSync')
.controller('TestCtrl', TestCtrl);

TestCtrl.$inject = ['$http'];
function TestCtrl($http) {
  $http({
    method: 'GET',
    url: 'https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj'
  }).then(response => {
    console.log('music', response);
  }, err => {
    console.log('error', err);
  });
}
