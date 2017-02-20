angular
.module('MuSync')
.controller('TestCtrl', TestCtrl);

TestCtrl.$inject = ['$http'];
function TestCtrl($http) {
  const vm = this;
  vm.searchArtists = searchArtists;
  vm.searchTracks = searchTracks;
  vm.clear = clear;
  vm.searchstatusArtists = false;


  $http({
    method: 'GET',
    url: 'https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj'
  }).then(response => {
    vm.music = response.data;
    vm.uri = response.data.tracks.items[0].uri;
    console.log('uri', vm.uri);
    console.log('music', response.data);
    // const data = response.data;
  }, err => {
    console.log('error', err);
  });

  function searchArtists() {
    vm.searchstatusArtists = false;
    const text = angular.element(document.querySelector('#search-text')).val();
    console.log(text);

    $http({
      method: 'GET',
      url: 'https://api.spotify.com/v1/search?q='+text+'&type=artist'
    }).then(response => {
      vm.results = response.data.artists.items;

      vm.searchstatusArtists = true;
      vm.searchstatusTracks = false;
      angular.element(document.querySelector('#search-text')).val('');
      console.log('search result', vm.results);
    });
  }

  function searchTracks(){
    vm.searchstatus = false;
    const text = angular.element(document.querySelector('#searchArtists-text')).val();
    $http({
      method: 'GET',
      url: 'https://api.spotify.com/v1/search?q='+text+'&type=track'
    }).then(response => {
      vm.results = response.data.tracks.items;
      // vm.uri = response.data.tracks.items.uri;
      vm.searchstatusArtists = false;
      vm.searchstatusTracks = true;
      angular.element(document.querySelector('#searchArtists-text')).val('');
      console.log('search result', vm.results);
    });
  }


  function clear(){
    vm.searchstatus = false;
  }
}
