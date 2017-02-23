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
  'Request',
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
  Request,
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
        vm.results = false;
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
    Request
    .save({
      receiver_id: userId,
      message: 'This is a test',
      room_id: $stateParams.id
    })
    .$promise
    .then(() => {
      vm.resultArray = false;
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
}
