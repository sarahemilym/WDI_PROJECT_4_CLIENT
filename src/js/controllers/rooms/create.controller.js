angular
.module('MuSync')
.controller('RoomsCreateCtrl', RoomsCreateCtrl);

RoomsCreateCtrl.$inject = [
  'Room',
  '$stateParams',
  '$state',
  '$http',
  'TokenService'
];
function RoomsCreateCtrl(
  Room,
  $stateParams,
  $state,
  $http,
  TokenService
){
  const vm = this;
  const spotifyId = TokenService.getItem('spotify_id');

  vm.create = (room) => {
    const url = `https://api.spotify.com/v1/users/${spotifyId}/playlists`;

    const parameter = JSON.stringify({
      'name': room.name,
      'public': false,
      'collaborative': false
    });

    $http
      .post(url, parameter)
      .then(function(response) {
        room.playlist_id = response.data.id;
        room.uri = response.data.uri;

        Room
        .save({ room: room })
        .$promise
        .then((response) => {
          $state.go('roomsShow', {id: response.id});
        }, err => {
          console.log(err);
        });
      }, err => {
        console.log(err);
      });
  };
}
