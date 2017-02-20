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
  vm.seeProfile = seeProfile;
  vm.createPlaylistsOn = createPlaylistsOn;
  vm.createPlaylists = createPlaylists;
  vm.addSongsToPlaylist = addSongsToPlaylist;
  vm.logout = logout;
  vm.clear = clear;
  vm.searchstatusArtists = false;


  function authorize(spotify) {
    $auth.authenticate(spotify)
    .then(function(response) {
      console.log('working', response);
    })
    .catch(function(response) {
      console.log('something went wrong', response);
    });
  }

  // THIS IS WORKING! But hardcoded for now
  function trialRequest(){
    vm.token = $window.localStorage.getItem('satellizer_token');
    console.log('token', vm.token);
    $http
    .get('https://api.spotify.com/v1/users/nahcardoso/playlists/5lX7NNvxUfImN2nr4sNfuI/tracks',
      {
        headers: {'Authorization': `Bearer ${vm.token}`}
      })
    .then(response => {
      console.log(response.data);
    });
  }

  function seeProfile(){
    console.log('clicked');
    vm.token = $window.localStorage.getItem('satellizer_token');
    $http
    .get('https://api.spotify.com/v1/me',
      { headers: {Authorization: `Bearer ${vm.token}`}
      })
  .then(response => {
    console.log('user profile', response);
  });
  }


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

  function createPlaylists(){
    vm.token = $window.localStorage.getItem('satellizer_token');
    const url = 'https://api.spotify.com/v1/users/sarahemily-m/playlists';
    const parameter = JSON.stringify({'name': 'Playlist Trial', 'public': false, 'collaborative': true});
    $http
      .post(url, parameter, vm.token)
      .then(function(data) {
        console.log(data);
      })
      .error(function(data) {
        console.log(data);
      });
  }

  // THis is also working, get error but the information posts and comes up in spotify app
  function addSongsToPlaylist(){
    vm.token = $window.localStorage.getItem('satellizer_token');
    const url = 'https://api.spotify.com/v1/users/sarahemily-m/playlists/0pSPwjItUTT1VxoZIVuZhK/tracks?uris=spotify:track:6XOPuFLGzY4ZGAKvmb8jou';
    // const parameter = JSON.stringify({'name': 'Playlist Trial', 'public': false, 'collaborative': true});
    $http
      .post(url, vm.token)
      .then(function(data) {
        console.log(data);
      })
      .error(function(data) {
        console.log(data);
      });
  }


// const data = { 'name': 'First Trial Playlist', 'public': true, 'collaborative': true };
// $http
//   .post('https://api.spotify.com/v1/users/sarahemily-m/playlists',
//     JSON.stringify(data),
//   {
//     headers: {Authorization: `Bearer ${vm.token}` }
//   }).then(response => {
//     console.log('playlist', response)
//   }).catch(function(response) {
//     console.log('This definitely didnt work')
//   });
// }
//   $http({
//     method: 'POST',
//     url: 'https://api.spotify.com/v1/users/sarahemily-m/playlists',
//      JSON.stringify(data)
//     authorization: 'Bearer ${token}'
//   }).then(response => {
//     console.log('spotify', response)
//   });
// }

  function logout() {
    // $auth.removeToken();
    $window.localStorage.removeItem('satellizer_token');
    console.log('logged out');
  }
}
