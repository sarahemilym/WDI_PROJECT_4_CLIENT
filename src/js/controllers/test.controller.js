angular
.module('MuSync')
.controller('TestCtrl', TestCtrl);

TestCtrl.$inject = ['$http'];
function TestCtrl($http) {
  const vm = this;

  $http({
    method: 'GET',
    url: 'https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj'
  }).then(response => {
    vm.music = response.data;
    vm.uri = response.data.tracks.items[0].uri;
    console.log('uri', vm.uri)
    console.log('music', response.data);
    // const data = response.data;
  }, err => {
    console.log('error', err);
  });
}
