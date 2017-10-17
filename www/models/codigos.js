app.factory('Codigo', function ($resource) {
    return $resource('http://localhost:8080/WSCodigos.svc/:item',{item: "@item"});
    /*return $resource('http://172.16.5.78:8080/WSUsuarios.svc/usuarios/:item',
    	{item: "@item"},
    	{
	    	query: {
	            isArray: true,
	            method: 'GET',
	            params: {},
	            transformResponse: function (data,headers) {
	              return angular.fromJson(data);
	            }
	          },
	          get: {method: 'GET', params: {id: '@id'}},
	          save: {method: 'POST'},
	          update: {method: 'PUT', params: {id: '@id'}},
	          delete: { method: 'DELETE', params: {} }
	    });*/
});