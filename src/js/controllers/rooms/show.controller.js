angular
.module('MuSync')
.controller('RoomsShowCtrl', RoomsShowCtrl);

RoomsShowCtrl.$inject = ['API', '$stateParams', 'User', 'Room', 'CurrentUserService', '$state'];
function RoomsShowCtrl(API, $stateParams, User, Room, CurrentUserService, $state){
  const vm = this;

  vm.room = Room.get($stateParams);
  vm.delete = roomsDelete;
  vm.createPlaylist = createPlaylist;
  vm.playlistCreated = false;

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

  function createPlaylist(){
    vm.playlistCreated = true;

    console.log('clicked')
    // e.target.setAttribute('disabled', true);
    // angular.element(document.querySelector('#createPlaylist')).isDisabled = true;
  }

}
