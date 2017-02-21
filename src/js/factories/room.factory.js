angular
  .module('MuSync')
  .factory('Room', roomFactory);

roomFactory.$inject = ['API', '$resource'];
function roomFactory(API, $resource) {
  return $resource(`${API}/rooms/:id`, { id: '@_id' }, {
    query: { method: 'GET', url: `${API}/rooms`, isArray: true },
    update: { method: 'PUT', url: `${API}/rooms/:id`},
    new: { method: 'POST', url: `${API}/rooms`}
  });
}
