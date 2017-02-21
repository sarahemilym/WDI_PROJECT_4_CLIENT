angular
.module('MuSync')
.controller('RoomsIndexCtrl', RoomsIndexCtrl);

RoomsIndexCtrl.$inject = ['Room'];
function RoomsIndexCtrl(Room) {
  const vm  = this;
  Room
    .query().$promise
    .then(response => {
      vm.rooms = response;
      console.log(vm.rooms);
    });
}
