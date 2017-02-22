angular
.module('MuSync')
.controller('RoomsShowCtrl', RoomsShowCtrl);

RoomsShowCtrl.$inject = ['API', '$stateParams', 'User', 'Room', 'CurrentUserService', '$state', '$auth', '$window', '$http'];
function RoomsShowCtrl(API, $stateParams, User, Room, CurrentUserService, $state, $auth, $window, $http){
  const vm = this;

  vm.room = Room.get($stateParams);
  vm.delete = roomsDelete;
  vm.token = $window.localStorage.getItem('satellizer_token');
  CurrentUserService.getUser();


  vm.playlist = {};

  vm.authorize = authorize;
  vm.createPlaylist = createPlaylist;
  vm.searchArtists = searchArtists;
  vm.searchTracks = searchTracks;
  vm.addToPlaylist = addToPlaylist;
  vm.playlistShow = playlistShow;
  vm.findArtistsSongs = findArtistsSongs;
  vm.fetchTracks = fetchTracks;
  vm.playlistCreated = false;
  vm.searchArtistAlbums = false;
  vm.showPlaylist = false;
  vm.authorized = false;
  vm.searchstatusArtists = false;
  vm.searchstatusTracks = false;

  Room.get($stateParams, (data) => {
    vm.room = data;
    console.log('room', vm.room);
    checkUser();

    $http
    .get(`https://api.spotify.com/v1/users/${vm.room.owner_id}/playlists/${vm.room.playlist_id}`,  { headers: {Authorization: `Bearer ${vm.token}`}
    })
    .then(response => {
      vm.fullPlaylist = response.data.tracks.items;
      console.log('playlist', vm.fullPlaylist);
      // vm.player = `https://embed.spotify.com/?uri=${response.data.uri}`;
    });
  });

  function checkUser(){
    if (CurrentUserService.currentUser.id === vm.room.user.id){
      vm.currentUserPlaylist = true;
    } else {
      vm.currentUserPlaylist = false;
    }
  }


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
    .then(() => {
      vm.authorized = true;
      vm.token = $window.localStorage.getItem('satellizer_token');
      $http
      .get('https://api.spotify.com/v1/me',
        { headers: {Authorization: `Bearer ${vm.token}`}
        })
        .then(response => {
          vm.user_id = response.data.id;
        });
    })
    .catch(function(response) {
      console.log('something went wrong', response);
    });
  }


function createPlaylist(){
  vm.playlistCreated = true;
  const url = 'https://api.spotify.com/v1/users/sarahemily-m/playlists';
  const parameter = JSON.stringify({'name': vm.playlist.name, 'public': false, 'collaborative': true});
  // vm.playlist.public = false;
  // vm.playlist.collaborative = true;
  $http
  .post(url, parameter, vm.token)
  .then(function(data) {
    vm.playlist = data.data;
    vm.playlistid = data.data.id;
    vm.room.playlist = data.data.id;
  })
  .catch(err => {
    console.log(err);
  });
}


function searchArtists() {
  vm.searchstatusArtists = false;
  const text = vm.searchArtistsText;

  $http
  .get('https://api.spotify.com/v1/search?q='+text+'&type=artist')
  .then(response => {
    vm.results = response.data.artists.items;

    vm.searchstatusArtists = true;
    vm.searchstatusTracks = false;
    vm.searchArtistAlbums = false;
    vm.searchArtistsText = '';
  });
}

function searchTracks(){
  vm.searchstatus = false;
  const text = vm.searchTracksText;
  $http
  .get(`https://api.spotify.com/v1/search?q=${text}&type=track`)
  .then(response => {
    vm.results = response.data.tracks.items;
    // vm.uri = response.data.tracks.items.uri;

    vm.searchstatusArtists = false;
    vm.searchstatusTracks = true;
    vm.searchArtistAlbums = false;
    vm.searchTracksText = '';
  });
}

function addToPlaylist(uri){
  vm.uri = uri;
  const url = `https://api.spotify.com/v1/users/${vm.room.owner_id}/playlists/${vm.room.playlist_id}/tracks?uris=${vm.uri}`;
  $http
  .post(url, vm.token)
  .then(function(data) {
    console.log('playlist tracks', data);
    // vm.fullPlaylist.push(data);
    // vm.playlist.push(data);
  //   $http
  //   .get(`https://api.spotify.com/v1/users/${vm.user_id}/playlists/${vm.playlistid}`,  { headers: {Authorization: `Bearer ${vm.token}`}
  //   })
  //   .then(response => {
  //     vm.fullPlaylist = response.data.tracks.items;
  //     vm.player = `https://embed.spotify.com/?uri=${response.data.uri}`;
  //   })
  //   .catch(function() {
  //     console.log('error');
  //   });
  });
}


function playlistShow(){
  vm.showPlaylist = true;
}

function findArtistsSongs(artist){
  vm.searchstatusArtists = false;
  vm.searchstatusTracks = false;
  vm.searchArtistAlbums = true;
  const clickedArtist = artist;

  $http
  .get(`https://api.spotify.com/v1/artists/${clickedArtist}/albums`)
  .then(response => {

    vm.artistAlbums = response.data.items
    const albumId = response.data.items[0].id
    // $http
    //   .get(`https://api.spotify.com/v1/albums/${albumId}/tracks`)
    //   .then(response => {
    //     console.log('album tracks', response)
    //   });
  });
}

function fetchTracks(id){
  const albumId = id;
  $http
  .get(`https://api.spotify.com/v1/albums/${albumId}/tracks`)
  .then(response => {
    vm.albumTracks = response.data.items;
  });
}
}
