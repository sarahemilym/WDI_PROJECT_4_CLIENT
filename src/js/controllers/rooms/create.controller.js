angular
.module('MuSync')
.controller('RoomsCreateCtrl', RoomsCreateCtrl);

RoomsCreateCtrl.$inject = ['API', 'Room', '$stateParams', 'CurrentUserService'];
function RoomsCreateCtrl(API, Room, $stateParams, CurrentUserService){
  const vm = this;

  vm.room = {};
  // CurrentUserService.getUser();
  vm.create = roomsCreate;

  function roomsCreate(){
    CurrentUserService.getUser();
    vm.room.user_id = CurrentUserService.currentUser.id
    return Room
    .save({ room: vm.room })
    .$promise
    .then((response) => {
      console.log('roomsCreate', response);
    });
  }

}
