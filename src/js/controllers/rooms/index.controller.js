angular
.module('MuSync')
.controller('RoomsIndexCtrl', RoomsIndexCtrl);

RoomsIndexCtrl.$inject = ['Room', 'CurrentUserService'];
function RoomsIndexCtrl(Room, CurrentUserService) {
  const vm  = this;
  const roomArray = [];
  const authorizedRooms = CurrentUserService.currentUser.authorized_rooms;
  vm.authorizedRoomIds = [];

  Room
  .query()
  .$promise
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
          if (vm.authorizedRoomIds.indexOf(a[i]) === -1) {
            vm.authorizedRoomIds.push(a[i]);
          }
        }
      }
      console.log('authorized rooms', vm.authorizedRoomIds);
    }
  }
  // authorizedMusicRooms();

  // function authorizedMusicRooms(){
  //   Room
  //   .query()
  //   .$promise
  //   .then(response => {
  //     console.log(response)
  //     const musicRooms = response;
  //     musicRooms.forEach(function(room){
  //       console.log('music room', room.id)
  //       if (room.id == roomArray){
  //         console.log('room response', room)
  //       }
  //     });
  //   });
  // }
}
