angular
.module('MuSync')
.controller('UsersInvitesCtrl', UsersInvitesCtrl);

UsersInvitesCtrl.$inject = ['$stateParams', 'Invite', 'CurrentUserService', 'User', 'Room'];
function UsersInvitesCtrl($stateParams, Invite, CurrentUserService, User, Room) {
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
    const roomId = id;
    const user = CurrentUserService.currentUser;
    // console.log('current user', CurrentUserService.currentUser);
    CurrentUserService.currentUser.authorized_rooms.push(roomId);

    console.log('id', CurrentUserService.currentUser)
    const currentUser = CurrentUserService.currentUser
    User
    .update({ id: currentUser.id }, currentUser)
    .$promise
    .then((data) => {
      console.log('getting here', data)
      addToAuthorizedUsers(roomId);
      // const tempUser = data;
      // User
      // .get({ id: tempUser.id })
      // .$promise
      // .then((data) => {
      //   console.log('fetching user', data)
      // deleteAccepted(invite);
      // })
    });
  }

  function addToAuthorizedUsers(id){
    const roomId = id;
    const user = CurrentUserService.currentUser;
    console.log('room id', id)
    console.log('current user', user)
    Room
    .get({ id: roomId })
    .$promise
    .then((room) => {
      room.authorized_users.push(roomId);
      Room
      .update({ id: roomId }, room)
      .$promise
      .then(data => {
        console.log('room data', data)
      })
    })
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
