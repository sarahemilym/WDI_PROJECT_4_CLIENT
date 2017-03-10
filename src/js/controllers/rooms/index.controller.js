angular
.module('MuSync')
.controller('RoomsIndexCtrl', RoomsIndexCtrl);

RoomsIndexCtrl.$inject = ['Room', 'CurrentUserService'];
function RoomsIndexCtrl(Room, CurrentUserService) {
  const vm = this;
  vm.yourRooms = [];
  vm.otherRooms = [];
  // vm.rooms = Room.query();

  Room
  .query()
  .$promise
  .then(response => {

    response.forEach(room => {
      if (room.user.id === CurrentUserService.currentUser.id){
        vm.yourRooms.push(room);
      } else if (room.user.id !== CurrentUserService.currentUser.id) {
        vm.otherRooms.push(room);
      }
    });
  });

}
