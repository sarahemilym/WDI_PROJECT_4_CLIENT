angular
.module('MuSync')
.controller('RoomsShowCtrl', RoomsShowCtrl);

RoomsShowCtrl.$inject = [
  'API',
  '$stateParams',
  'User',
  'Room',
  'CurrentUserService',
  '$state',
  '$auth',
  '$window',
  '$http',
  'Invite',
  '$timeout',
  'ActionCableSocketWrangler',
  'ActionCableChannel'
];
function RoomsShowCtrl(
  API,
  $stateParams,
  User,
  Room,
  CurrentUserService,
  $state,
  $auth,
  $window,
  $http,
  Invite,
  $timeout,
  ActionCableSocketWrangler,
  ActionCableChannel
){
  const vm = this;
  vm.room   = Room.get($stateParams);
  vm.users  = User.query();
  vm.status = ActionCableSocketWrangler;

  vm.searchTracks = (text) => {
    $http
    .get(`https://api.spotify.com/v1/search?q=${text}&type=track`)
    .then(response => {
      vm.results = response.data.tracks.items;
    });
  };

  vm.showTrack = (track) => {
    vm.room.track_uri = track.uri;
    Room
      .update($stateParams, { room: vm.room }).$promise
      .then(data => {
        vm.sendTrackToRoom(vm.room.track_uri);

        // const url =     `https://api.spotify.com/v1/users/${vm.room.user.spotify_id}/playlists/${vm.room.playlist_id}/tracks?uris=${vm.room.track_uri}`;
        // $http
        // .post(url)
        // .then(response => {
        //   console.log('updated playlist')
        // }, err => {
        //   console.error(err);
        // });

      }, err => {
        console.error(err);
      });
  };

  vm.search = (searchText) => {
    vm.resultArray = [];
    vm.users.forEach(user => {
      if (searchText == user.id){
        vm.resultArray.push(user);
      } else if (searchText.toLowerCase() === user.email.toLowerCase()){
        vm.resultArray.push(user);
      } else if (searchText.toLowerCase() === user.first_name.toLowerCase()){
        vm.resultArray.push(user);
      } else if (searchText.toLowerCase() === user.last_name.toLowerCase()){
        vm.resultArray.push(user);
      } else if (searchText.toLowerCase() === user.spotify_id.toLowerCase()){
        vm.resultArray.push(user);
      }
    });
  };

  vm.sendRequest = (userId) => {
    Invite
    .request({
      receiver_id: userId,
      message: 'This is a test',
      room_id: $stateParams.id
    })
    .$promise
    .then(response => {
      console.log('new request', response);
    }, err => {
      console.error(err);
    });
  };

  // connect to ActionCable
  const consumer = new ActionCableChannel('RoomChannel', {
    id: $stateParams.id
  });

  // When you receive something back from the channel
  const callback = function(track_uri) {
    vm.room.track_uri = track_uri;
  };

  consumer.subscribe(callback).then(function(){
    vm.sendTrackToRoom = function(trackUri){
      consumer.send(trackUri);
    };

    // $scope.$on("$destroy", function(){
    //   consumer.unsubscribe().then(function(){ $scope.sendToMyChannel = undefined; });
    // });
  });











  // vm.addToPlaylist = (track) => {
  //   window.location.href = `https://embed.spotify.com/?uri=${track.uri}`
  //
  //     // const iframe = document.getElementById('player');
  //   //   const innerDocument = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document;
  //   //   const play = innerDocument.getElementById('play-button');
  //   //   console.log(play);
  //   // });
  //
  //   // $timeout(() => {
  //   //
  //   // }, 200);
  //
  //
  //   // $sce.trustAsHtml(``);
  //   // const url =     `https://api.spotify.com/v1/users/${vm.room.user.spotify_id}/playlists/${vm.room.playlist_id}/tracks?uris=${songUri}`;
  //   // $http
  //   // .post(url)
  //   // .then(response => {
  //   //   console.log(response);
  //   //   // var track = response.data.tracks.items[0];
  //   //   // audio.src = track.preview_url;
  //   //   // audio.play();
  //   //   //
  //   //   // $timeout(() => {
  //   //   //   vm.results = false;
  //   //   //   vm.room    = Room.get($stateParams);
  //   //   // }, 5000);
  //   // }, err => {
  //   //   console.error(err);
  //   // });
  // };

  // vm.room                = Room.get($stateParams);
  // vm.delete              = roomsDelete;
  // vm.token               = $window.localStorage.getItem('satellizer_token');
  // vm.searchArtists       = searchArtists;
  // vm.searchTracks        = searchTracks;
  // vm.addToPlaylist       = addToPlaylist;
  // vm.playlistShow        = playlistShow;
  // vm.findArtistsSongs    = findArtistsSongs;
  // vm.fetchTracks         = fetchTracks;
  // vm.inviteFriends       = inviteFriends;
  // vm.sendRequest         = sendRequest;
  // vm.inviteFriendsShow   = false;
  // vm.searchArtistAlbums  = false;
  // vm.showPlaylist        = false;
  // vm.searchstatusArtists = false;
  // vm.searchstatusTracks  = false;
  //
  //
  // Room.get($stateParams, (data) => {
  //   vm.room = data;
  //   vm.authorizedUsers = data.authorized_users
  //   console.log('room', vm.room)
  //   checkUser();
  //   // showUsers();
  //   getPlaylist();
  // });
  //
  //
  // function getPlaylist(){
  //   $http
  //   .get(`https://api.spotify.com/v1/users/${vm.room.owner_id}/playlists/${vm.room.playlist_id}`,  { headers: {Authorization: `Bearer ${vm.token}`}
  //   })
  //   .then(response => {
  //     console.log(response);
  //     vm.uri = response.data.uri;
  //     vm.fullPlaylist = response.data.tracks.items;
  //   });
  // }
  //
  // function checkUser(){
  //   if (CurrentUserService.currentUser.id === vm.room.user.id){
  //     vm.currentUserPlaylist = true;
  //   } else {
  //     vm.currentUserPlaylist = false;
  //   }
  // }
  //
  // // function showUsers() {
  // //   console.log('authorized users', vm.authorizedUsers)
  // //   User
  // //   .get()
  // //   .$promise
  // //   .then(response => {
  // //     const user = response.data;
  // //     vm.resultArray = [];
  // //
  // //     searchItem.forEach(function(user){
  // //       if (vm.searchText == user.id){
  // //         console.log(user)
  // //         vm.resultArray.push(user);
  // //       } else if (vm.searchText === user.email){
  // //         vm.resultArray.push(user);
  // //       } else if (vm.searchText === user.first_name){
  // //         vm.resultArray.push(user);
  // //       } else if (vm.searchText === user.last_name){
  // //         vm.resultArray.push(user);
  // //       } else if (vm.searchText === user.spotify_id){
  // //         vm.resultArray.push(user);
  // //       }
  // //     });
  // //   });
  // // }
  //
  // function authorized(){
  //   vm.addToAuthorizedUsers.forEach(function(user){
  //     console.log(user)
  //   })
  // }
  //
  // function searchArtists() {
  //   console.log('getting here')
  //   vm.searchstatusArtists = false;
  //   const text = vm.searchArtistsText;
  //   console.log('text', text)
  //
  //   $http
  //   .get('https://api.spotify.com/v1/search?q='+text+'&type=artist')
  //   .then(response => {
  //     console.log('getting here also', response)
  //     vm.results = response.data.artists.items;
  //     console.log('artists', vm.results)
  //
  //     vm.searchstatusArtists = true;
  //     vm.searchstatusTracks = false;
  //     vm.searchArtistAlbums = false;
  //     vm.searchArtistsText = '';
  //   });
  // }
  //



  //
  // function playlistShow(){
  //   vm.showPlaylist = true;
  // }
  //
  // function findArtistsSongs(artist){
  //   vm.searchstatusArtists = false;
  //   vm.searchstatusTracks = false;
  //   vm.searchArtistAlbums = true;
  //   const clickedArtist = artist;
  //
  //   $http
  //   .get(`https://api.spotify.com/v1/artists/${clickedArtist}/albums`)
  //   .then(response => {
  //
  //     vm.artistAlbums = response.data.items
  //     const albumId = response.data.items[0].id
  //     // $http
  //     //   .get(`https://api.spotify.com/v1/albums/${albumId}/tracks`)
  //     //   .then(response => {
  //     //     console.log('album tracks', response)
  //     //   });
  //   });
  // }
  //
  // function fetchTracks(id){
  //   const albumId = id;
  //   $http
  //   .get(`https://api.spotify.com/v1/albums/${albumId}/tracks`)
  //   .then(response => {
  //     vm.albumTracks = response.data.items;
  //   });
  // }
  //
  // function roomsDelete(room) {
  //   Room
  //   .delete({id: room.id})
  //   .$promise
  //   .then(() => {
  //     $state.go('roomsIndex');
  //   });
  // }
  //
  // function inviteFriends(id){
  //   vm.currentRoomId = id;
  //   // console.log('id', id)
  //   vm.inviteFriendsShow = true;
  //   vm.search = search;
  //
  //   User
  //   .query().$promise
  //   .then(response => {
  //     vm.users = response;
  //     console.log(vm.users);
  //   });
  //   console.log('inviting friends')
  // }
  //
  // function search(id){
  //   console.log('id', id)
  //   $http
  //   .get('http://localhost:3000/users')
  //   .then(response => {
  //     const searchItem = response.data;
  //     vm.resultArray = [];
  //     // const text = vm.searchText;
  //
  //     searchItem.forEach(function(user){
  //       if (vm.searchText == user.id){
  //         console.log(user)
  //         vm.resultArray.push(user);
  //       } else if (vm.searchText === user.email){
  //         vm.resultArray.push(user);
  //       } else if (vm.searchText === user.first_name){
  //         vm.resultArray.push(user);
  //       } else if (vm.searchText === user.last_name){
  //         vm.resultArray.push(user);
  //       } else if (vm.searchText === user.spotify_id){
  //         vm.resultArray.push(user);
  //       }
  //     });
  //   });
  // }
  //
  // function sendRequest(roomId, userId){
  //   console.log('roomId', roomId, 'userId', userId)
  //   Invite
  //   .request({
  //     receiver_id: userId.toString(),
  //     message: 'This is a test',
  //     status: 1,
  //     user_id: CurrentUserService.currentUser.id.toString(),
  //     room_id: roomId.toString()
  //   })
  //   .$promise
  //   .then(response => {
  //     console.log('new request', response)
  //   });
  // }
}
