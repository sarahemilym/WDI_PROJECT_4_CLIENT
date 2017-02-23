angular
.module('MuSync')
.controller('RoomsIndexCtrl', RoomsIndexCtrl);

RoomsIndexCtrl.$inject = ['Room', 'CurrentUserService'];
function RoomsIndexCtrl(Room, CurrentUserService) {
  const vm  = this;
  vm.myRoomsArray = [];
  vm.myRooms = false;
  const roomArray = [];
  const authorizedRooms = CurrentUserService.currentUser.authorized_rooms;
  vm.authorizedRoomIds = [];

  Room
  .query()
  .$promise
  .then(response => {
    response.forEach(function(room){
      if (room.user.id == CurrentUserService.currentUser.id){
        vm.myRoomsArray.push(room)
      }
    
    });
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

    for (var i = 0; i < a.length; i++) {
      for (var j = 0; j < b.length; j++) {
        if(a[i] == b[j]){
          if (vm.authorizedRoomIds.indexOf(a[i]) === -1) {
            vm.authorizedRoomIds.push(a[i]);
          }
        }
      }

      // vm.authorizedRooms = vm.authorizedRoomIds.map(function(room) {
      //   Room
      //     .get(room)
      //     .$promise
      //     .then(data => {
      //       return data;
      //     });
      // });
      //
      // console.log(vm.authorizedRooms);
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
