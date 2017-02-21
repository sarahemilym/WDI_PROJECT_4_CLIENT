angular
.module('MuSync')
.controller('RoomsEditCtrl', RoomsEditCtrl);

RoomsEditCtrl.$inject = ['API', '$stateParams', 'Room'];
function RoomsEditCtrl(API, $stateParams, Room) {

  const vm = this;

  vm.room = Room.get($stateParams);
  vm.update = roomsUpdate;

  function roomsUpdate() {
    Room 
    .update({ id: $stateParams.id}, vm.room)
    .$promise
    .then((data) => {
      console.log('update room', data);
    });

  }

}
