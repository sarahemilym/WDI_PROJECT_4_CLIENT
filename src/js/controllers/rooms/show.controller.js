angular
.module('MuSync')
.controller('RoomsShowCtrl', RoomsShowCtrl);

RoomsShowCtrl.$inject = ['API', '$stateParams', 'User', 'Room', 'CurrentUserService', '$state', '$auth', '$window', '$http'];
function RoomsShowCtrl(API, $stateParams, User, Room, CurrentUserService, $state, $auth, $window, $http){
  const vm = this;

  vm.room = Room.get($stateParams);
  vm.delete = roomsDelete;

  vm.playlist = {};

  vm.authorize = authorize;
  vm.createPlaylist = createPlaylist;
  vm.searchArtists = searchArtists;
  vm.searchTracks = searchTracks;
  vm.addToPlaylist = addToPlaylist;
  vm.playlistCreated = false;
  vm.authorized = false;
  vm.searchstatusArtists = false;
  vm.searchstatusTracks = false;

  Room.get($stateParams, (data) => {
    CurrentUserService.getUser();
    vm.room = data;
    console.log('room data', vm.room);
    vm.email = CurrentUserService.currentUser.email;
    console.log('current users email', vm.email);
  });

  function roomsDelete(room) {
    Room
      .delete({id: room.id})
      .$promise
      .then(() => {
        $state.go('roomsIndex');
      });
  }

  function authorize(provider) {
    $auth.authenticate(provider)
    .then(response => {
      vm.authorized = true;
      vm.token = $window.localStorage.getItem('satellizer_token');
      $http
      .get('https://api.spotify.com/v1/me',
        { headers: {Authorization: `Bearer ${vm.token}`}
      })
      .then(response => {
        vm.user_id = response.data.id
      });
    })
    .catch(function(response) {
      console.log('something went wrong', response);
    });
  }


  function createPlaylist(){
    vm.playlistCreated = true;
      console.log('user', vm.user_id);
      const url = 'https://api.spotify.com/v1/users/sarahemily-m/playlists';
        const parameter = JSON.stringify({'name': vm.playlist.name, 'public': false, 'collaborative': true});
      // vm.playlist.public = false;
      // vm.playlist.collaborative = true;
      $http
      .post(url, parameter, vm.token)
      .then(function(data) {
        console.log('playlist', data.data)
        vm.playlist = data.data;
        vm.playlistid = data.data.id;
      });
      // .err(err => {
      //   console.log(err);
      // });
    }

    function searchArtists() {
      vm.searchstatusArtists = false;
      const text = angular.element(document.querySelector('#searchArtist-text')).val();

      $http
        .get('https://api.spotify.com/v1/search?q='+text+'&type=artist')
        .then(response => {
        vm.results = response.data.artists.items;

        vm.searchstatusArtists = true;
        vm.searchstatusTracks = false;
        angular.element(document.querySelector('#searchArtist-text')).val('');
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

    function addToPlaylist(uri){
      vm.uri = uri
      const url = `https://api.spotify.com/v1/users/${vm.user_id}/playlists/${vm.playlistid}/tracks?uris=${vm.uri}`
      $http
        .post(url, vm.token)
        .then(function(data) {
          console.log('song data', data);
          $http
          .get(`https://api.spotify.com/v1/users/${vm.user_id}/playlists/${vm.playlistid}`,  { headers: {Authorization: `Bearer ${vm.token}`}
        })
        .then(response => {
          console.log('playlist', response.data);
          // vm.fullPlaylist = response.data;
        })
      //   .fail(function(data) {
      //     console.log('error');
      //   });
      // })
    })

    }

}
