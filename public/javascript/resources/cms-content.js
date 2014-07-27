angular.module('cmsContent', ['ngResource'])
  .factory('CMSContent', [
    '$resource',
    function($resource, $http, $rootScope) {

    return $resource('/duffel-cms/api/cmscontents/:id:command', {
      id : '@id'
    }, {
      query: { method: 'GET' },
      save: { method: 'PUT' },
      create: { method: 'POST' },
      destroy: { method: 'DELETE' }
    });
}]);

