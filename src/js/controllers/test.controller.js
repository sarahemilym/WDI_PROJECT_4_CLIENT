angular
.module('MuSync')
.controller('TestCtrl', TestCtrl);

TestCtrl.$inject = ['$http', '$auth', '$window'];
function TestCtrl($http, $auth, $window) {
  const vm = this;
  vm.createPlaylistsOnOff = false;
  vm.authorize = authorize;
  vm.trialRequest = trialRequest;
  vm.searchArtists = searchArtists;
  vm.searchTracks = searchTracks;
  vm.createPlaylistsOn = createPlaylistsOn;
  // vm.createPlaylists = createPlaylists;
  vm.logout = logout;
  vm.clear = clear;
  vm.searchstatusArtists = false;

  // function authorize(provider){
  //   $auth.authenticate(provider)
  //
  // }

  //
  // console.log('token', token)


  function authorize(spotify) {
    $auth.authenticate(spotify)
  .then(function(response) {
  console.log('working', response)
  })
  .catch(function(response) {
    console.log('something went wrong')
  });
}
  //   $auth
  //   .authenticate(provider)
  //   .then(response => {
  //     console.log('spotify log in', response)
  //   })
  //   .catch(function(response) {
  //     console.log(response)
  //   });
  // }

// THIS IS WORKING! But hardcoded for now
  function trialRequest(){
    vm.token = $window.localStorage.getItem('satellizer_token');
    console.log('token', vm.token)
    $http
    .get('https://api.spotify.com/v1/users/nahcardoso/playlists/5lX7NNvxUfImN2nr4sNfuI/tracks',
    {
      headers: {'Authorization': `Bearer ${vm.token}`}
    })
    .then(response => {
      console.log(response.data);
    });
  };


  // console.log('Token', token)

  // console.log('TOKEN', $auth.getToken());

  // function authorize() {
  //   $http({
  //     method: 'GET',
  //     url: 'https://accounts.spotify.com/authorize/?client_id=a66b7d062208471c95fc1f931d933478&response_type=code&redirect_uri=http://localhost:4000/test&scope=user-read-private%20user-read-email&state=34fFs29kd09'
  //   }).then(response => {
  //     console.log(response);
  //   });
  // }



  // $http({
  //   method: 'GET',
  //   url: 'https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj'
  // }).then(response => {
  //   vm.music = response.data;
  //   vm.uri = response.data.tracks.items[0].uri;
  //   console.log('uri', vm.uri);
  //   console.log('music', response.data);
  //   // const data = response.data;
  // }, err => {
  //   console.log('error', err);
  // });

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

  function createPlaylistsOn() {
    vm.createPlaylistsOnOff = true;
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

  // function createPlaylists() {
  //   $http({
  //     method: 'POST',
  //     url: 'https://api.spotify.com/v1/users/{user_id}/playlists',
  //     authorization: 'Bearer kez0xs9exeurdtp0all3di'
  //   }).then(response => {
  //     console.log('spotify', response)
  //   });
  // }
  function logout() {
    // $auth.removeToken();
    $window.localStorage.removeItem('satellizer_token');
    console.log('logged out')
  }
}
