angular
.module('MuSync')
.controller('RoomsShowCtrl', RoomsShowCtrl);

RoomsShowCtrl.$inject = ['API', '$stateParams', 'User', 'Room', 'CurrentUserService'];
function RoomsShowCtrl(API, $stateParams, User, Room, CurrentUserService){
  const vm = this;

  vm.room = Room.get($stateParams);
  console.log('roomsShow', vm.room);

  CurrentUserService.getUser();

  Room.get($stateParams, (data) => {
    vm.room = data;
    console.log('room data', vm.room);
  });

}
