app.factory('Libros', function ($resource,resourceInterceptor,Variables) {
		return $resource('http://'+ Variables.IpServidor+'/WSLibros.svc/libros/:item',
											{item: "@item"},
											{
												'get':    {method:'GET',interceptor: resourceInterceptor},
												'save':   {method:'POST',interceptor: resourceInterceptor},
												'query':  {method:'GET', isArray:true,interceptor: resourceInterceptor,url:'http://'+ Variables.IpServidor+'/WSLibros.svc/libros/?searchBy=:search',params:"@search"},
												'remove': {method:'DELETE',interceptor: resourceInterceptor},
												'delete': {method:'DELETE',interceptor: resourceInterceptor}
											}
										);
});