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
  vm.playlistCreated = false;
  vm.authorized = false;

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
        // console.log('playlist', data)
        vm.playlist = data.data;
      });
      // .err(err => {
      //   console.log(err);
      // });
    }
    //   console.log('working', response);
    // })
    // .catch(function(response) {
    //   console.log('something went wrong', response);
    // });
  // }



    // e.target.setAttribute('disabled', true);
    // angular.element(document.querySelector('#createPlaylist')).isDisabled = true;


}
