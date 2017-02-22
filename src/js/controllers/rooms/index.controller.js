angular
.module('MuSync')
.controller('RoomsIndexCtrl', RoomsIndexCtrl);

RoomsIndexCtrl.$inject = ['Room', 'CurrentUserService'];
function RoomsIndexCtrl(Room, CurrentUserService) {
  const vm  = this;
  const roomArray = [];
  const authorizedRooms = CurrentUserService.currentUser.authorized_rooms;
  vm.authorizedRooms = [];

  Room
  .query().$promise
  .then(response => {
    createRoomArray(response);

    // const rooms = response;
    // findMatches(authorizedRooms, roomArray);
    // console.log('rooms', rooms);
  });

  function createRoomArray(room) {
    room.forEach(function(room){
      // console.log('room', room.id)
      roomArray.push(room.id);
      findMatches(authorizedRooms, roomArray);
    });
  }

  function findMatches(a, b){
    console.log('a', a, 'b', b)

    for (var i = 0; i < a.length; i++) {
      for (var j = 0; j < b.length; j++) {
        if(a[i] == b[j]){
          if (vm.authorizedRooms.indexOf(a[i]) === -1) {
            vm.authorizedRooms.push(a[i]);
          }
        }
      }
      console.log('authorized rooms', vm.authorizedRooms);
      // return vm.showRooms;
    }
  }
}
