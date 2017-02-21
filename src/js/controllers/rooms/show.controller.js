angular
.module('MuSync')
.controller('RoomsShowCtrl', RoomsShowCtrl);

RoomsShowCtrl.$inject = ['API', '$stateParams', 'User', 'Room', 'CurrentUserService', '$state'];
function RoomsShowCtrl(API, $stateParams, User, Room, CurrentUserService, $state){
  const vm = this;

  vm.room = Room.get($stateParams);
  vm.delete = roomsDelete;
  console.log('roomsShow', vm.room);

  CurrentUserService.getUser();

  Room.get($stateParams, (data) => {
    vm.room = data;
    console.log('room data', vm.room);
  });

  function roomsDelete(room) {
    Room
      .delete({id: room.id})
      .$promise
      .then(() => {
        $state.go('roomsIndex');
      });
  }

}
