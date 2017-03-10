angular
.module('MuSync')
.controller('RequestsIndexCtrl', RequestsIndexCtrl);

RequestsIndexCtrl.$inject = [
  'Request'
];
function RequestsIndexCtrl(Request) {
  const vm = this;
  vm.requests = Request.query();

  console.log(vm.requests)

  vm.accept = (request) => {
    Request
    .accept({ id: request.id }).$promise
    .then(() => {
      vm.requests = Request.query();
    }, err => {
      console.error(err);
    });
  };

  vm.reject = (request) => {
    Request
    .reject({ id: request.id }).$promise
    .then(() => {
      vm.requests = Request.query();
    }, err => {
      console.error(err);
    });
  };
}
