angular
  .module('MuSync')
  .factory('Request', requestFactory);

requestFactory.$inject = ['API', '$resource'];
function requestFactory(API, $resource) {
  return $resource(`${API}/requests/:id`, { id: '@id' }, {
    accept: {
      method: 'PUT',
      params: { id: '@id' },
      url: `${API}/requests/:id/accept`
    },
    reject: {
      method: 'PUT',
      params: { id: '@id' },
      url: `${API}/requests/:id/reject`
    }
  });
}
