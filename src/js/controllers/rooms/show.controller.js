angular
.module('MuSync')
.controller('RoomsShowCtrl', RoomsShowCtrl);

RoomsShowCtrl.$inject = ['API', '$stateParams', 'User', 'Room', 'CurrentUserService', '$state', '$auth', '$window', '$http'];
function RoomsShowCtrl(API, $stateParams, User, Room, CurrentUserService, $state, $auth, $window, $http){
  const vm = this;

  vm.room                = Room.get($stateParams);
  vm.delete              = roomsDelete;
  vm.token               = $window.localStorage.getItem('satellizer_token');
  vm.searchArtists       = searchArtists;
  vm.searchTracks        = searchTracks;
  vm.addToPlaylist       = addToPlaylist;
  vm.playlistShow        = playlistShow;
  vm.findArtistsSongs    = findArtistsSongs;
  vm.fetchTracks         = fetchTracks;
  vm.inviteFriends       = inviteFriends;
  vm.searchArtistAlbums  = false;
  vm.showPlaylist        = false;
  vm.searchstatusArtists = false;
  vm.searchstatusTracks  = false;

  Room.get($stateParams, (data) => {
    vm.room = data;
    checkUser();
    getPlaylist();
  });


  function getPlaylist(){
    $http
      .get(`https://api.spotify.com/v1/users/${vm.room.owner_id}/playlists/${vm.room.playlist_id}`,  { headers: {Authorization: `Bearer ${vm.token}`}
      })
      .then(response => {
        console.log(response);
        vm.uri = response.data.uri;
        vm.fullPlaylist = response.data.tracks.items;
      });
  }

  function checkUser(){
    if (CurrentUserService.currentUser.id === vm.room.user.id){
      vm.currentUserPlaylist = true;
    } else {
      vm.currentUserPlaylist = false;
    }
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

        vm.searchstatusArtists = false;
        vm.searchstatusTracks = true;
        vm.searchArtistAlbums = false;
        vm.searchTracksText = '';
      });
  }

  function addToPlaylist(songUri){
    vm.songUri = songUri;
    const url =     `https://api.spotify.com/v1/users/${vm.room.owner_id}/playlists/${vm.room.playlist_id}/tracks?uris=${vm.songUri}`;
    $http
    .post(url, vm.token)
    .then(function() {
      getPlaylist();
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

  function roomsDelete(room) {
    Room
      .delete({id: room.id})
      .$promise
      .then(() => {
        $state.go('roomsIndex');
      });
  }

  function inviteFriends(id){
    vm.inviteFriends = true;
    vm.search = search;

    User
    .query().$promise
    .then(response => {
      vm.users = response;
      console.log(vm.users);
    });
    console.log('inviting friends')
  }

  function search(){
    $http
      .get('http://localhost:3000/users')
      .then(response => {
        const searchItem = response.data;
        vm.resultArray = [];
        // const text = vm.searchText;

        searchItem.forEach(function(user){
          if (vm.searchText == user.id){
            console.log(user)
            vm.resultArray.push(user);
          } else if (vm.searchText === user.email){
            vm.resultArray.push(user);
          } else if (vm.searchText === user.first_name){
            vm.resultArray.push(user);
          } else if (vm.searchText === user.last_name){
            vm.resultArray.push(user);
          } else if (vm.searchText === user.spotify_id){
            vm.resultArray.push(user);
          }
        });

      });
  }
}
