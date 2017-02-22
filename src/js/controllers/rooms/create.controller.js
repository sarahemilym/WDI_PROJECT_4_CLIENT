angular
.module('MuSync')
.controller('RoomsCreateCtrl', RoomsCreateCtrl);

RoomsCreateCtrl.$inject = ['API', 'Room', '$stateParams', 'CurrentUserService', '$state', '$auth', '$window', '$http'];
function RoomsCreateCtrl(API, Room, $stateParams, CurrentUserService, $state, $auth, $window, $http){
  const vm = this;

  vm.create = roomsCreate;
  vm.authorize = authorize;
  vm.createPlaylist = createPlaylist;

  function roomsCreate(){
    CurrentUserService.getUser();
    vm.room.user_id = CurrentUserService.currentUser.id;
    vm.room.playlist_id = vm.playlistId;
    vm.room.owner_id = vm.user_id;

    return Room
    .save({ room: vm.room })
    .$promise
    .then((response) => {
      $state.go('roomsShow', {id: response.id});
      console.log('roomsCreate', response);
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
    const url = `https://api.spotify.com/v1/users/${vm.user_id}/playlists`;
    const parameter = JSON.stringify({'name': vm.playlist.name, 'public': false, 'collaborative': true});

    $http
      .post(url, parameter, vm.token)
      .then(function(data) {
        vm.playlistId = data.data.id;
      })
      .catch(err => {
        console.log(err);
      });
  }

}
