app.factory('Libros', function ($resource,resourceInterceptor) {
		return $resource('http://200.52.220.238:8080/WSLibros.svc/libros/:item',
		//return $resource('http://localhost:8080/WSLibros.svc/libros/:item',
											{item: "@item"},
											{
												'get':    {method:'GET',interceptor: resourceInterceptor},
												'save':   {method:'POST',interceptor: resourceInterceptor},
												'query':  {method:'GET', isArray:true,interceptor: resourceInterceptor,url:'http://localhost:8080/WSLibros.svc/libros/?searchBy=:search',params:"@search"},
												'remove': {method:'DELETE',interceptor: resourceInterceptor},
												'delete': {method:'DELETE',interceptor: resourceInterceptor}
											}
										);
});