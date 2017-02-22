angular
.module('MuSync')
.controller('UsersInvitesCtrl', UsersInvitesCtrl);

UsersInvitesCtrl.$inject = ['$stateParams', 'Invite', 'CurrentUserService', 'User'];
function UsersInvitesCtrl($stateParams, Invite, CurrentUserService, User) {
  const vm = this;

  findInvites();

  vm.addToAuthorizedRooms = addToAuthorizedRooms;
  vm.deleteAccepted = deleteAccepted;

  function findInvites() {

    Invite
    .query()
    .$promise
    .then(response => {
      const invites = response;

      vm.messagesArray = [];


      invites.forEach(function(invite){
        if (invite.receiver_id == CurrentUserService.currentUser.id) {
          console.log('invite', invite)
          vm.messagesArray.push(invite)
          console.log('array', vm.messagesArray)
          // const url = 'http://localhost:3000/register';
          // const parameter = JSON.stringify({'authorized_rooms': invite.room_id});
          // $http
          // .post(url, parameter)
          // .then(function(data) {
          //   console.log('this should be the user register I think', data)
          // });
        }
      });
    });
  }

  function addToAuthorizedRooms(id){
    console.log('id', id);
    const room = id;
    const user = CurrentUserService.currentUser;
    // console.log('current user', CurrentUserService.currentUser);
    CurrentUserService.currentUser.authorized_rooms.push(room);

    console.log('id', CurrentUserService.currentUser)
    const currentUser = CurrentUserService.currentUser
    User
    .update({ id: currentUser.id }, currentUser)
    .$promise
    .then((data) => {
      console.log('getting here', data)
      const tempUser = data;
      User
      .get({ id: tempUser.id })
      .$promise
      .then((data) => {
        console.log('fetching user', data)
        // deleteAccepted(invite);
      })
    });
  }
  
  function deleteAccepted(id) {
    console.log('delete', id)
    Invite
    .delete({id: id})
    .$promise
    .then(() => {
      findInvites();
    });
  }
}
