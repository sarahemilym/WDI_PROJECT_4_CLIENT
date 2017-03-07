angular
.module('MuSync')
.controller('UsersIndexCtrl', UsersIndexCtrl);

UsersIndexCtrl.$inject = ['User', '$http'];
function UsersIndexCtrl(User, $http) {
  const vm  = this;

  vm.search = search;

  User
  .query().$promise
  .then(response => {
    vm.users = response;
    console.log(vm.users);
  });

  // function searchId() {
  //   console.log('clicked')
  //   let search = vm.searchUserId;
  //   $http
  //   .get(`http://localhost:3000/users/${search}`)
  //   .then(response => {
  //     console.log(response)
  //   });
  // }
  //
  // function searchEmail() {
  //   console.log('clicked')
  //   // let search = vm.searchUserEmail;
  //   $http
  //   .get(`http://localhost:3000/users`)
  //   .then(response => {
  //     const email = response.data;
  //     email.forEach(function(user) {
  //       if (vm.searchUserEmail === user.email){
  //         vm.emailMatch = user;
  //       }
  //     });
  //   });
  // }

  function search(){
    $http
      .get('https://musync-api.herokuapp.com/users')
      .then(response => {
        const searchItem = response.data;
        vm.resultArray = [];

        searchItem.forEach(function(user){
          if (vm.searchText == user.id){
            console.log(user);
            vm.resultArray.push(user);
          } else if (vm.searchText === user.email){
            vm.resultArray.push(user);
          } else if (vm.searchText === user.first_name){
            vm.resultArray.push(user);
          } else if (vm.searchText === user.last_name){
            vm.resultArray.push(user);
          } else if (vm.searchText === user.spotify_id){
            vm.resultArray.push(user);
          }
        });

      });
  }

}
