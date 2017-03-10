angular
.module('MuSync')
.controller('RequestsIndexCtrl', RequestsIndexCtrl);

RequestsIndexCtrl.$inject = [
  'Request'
];
function RequestsIndexCtrl(Request) {
  const vm = this;
  // vm.requests = Request.query().then(() => console.log('requests', vm.requests));


  // Request.query({}, function(response) {
  //     vm.requests = response;
  //     console.log('requests', vm.requests, 'length', vm.requests.length)
  //     // Do stuff that depends on $scope.regions here
  // });

  Request.query()
  .$promise
  .then(response => {
    vm.requests = response;

    if (vm.requests.length === 0) {
      vm.noRequests = true;
    } else {
      vm.noRequests = false;
    }
  });




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
