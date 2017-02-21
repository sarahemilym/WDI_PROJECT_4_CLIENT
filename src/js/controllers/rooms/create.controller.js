angular
.module('MuSync')
.controller('RoomsCreateCtrl', RoomsCreateCtrl);

RoomsCreateCtrl.$inject = ['API', 'Room', '$stateParams', 'CurrentUserService', '$state'];
function RoomsCreateCtrl(API, Room, $stateParams, CurrentUserService, $state){
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
      $state.go('roomsShow', {id: response.id})
      console.log('roomsCreate', response);
    });
  }

}
