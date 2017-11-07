app.factory('Codigo', function ($resource,resourceInterceptor) {
		return $resource('http://localhost:8080/WSCodigos.svc/codigos/:item',
		//return $resource('http://172.16.5.78:8080/WSCodigos.svc/codigos/:item',
											{item: "@item"},
											{
												'get':    {method:'GET',interceptor: resourceInterceptor},
												'save':   {method:'POST',interceptor: resourceInterceptor},
												'query':  {method:'GET', isArray:true,interceptor: resourceInterceptor,params:'search'},
												'remove': {method:'DELETE',interceptor: resourceInterceptor},
												'delete': {method:'DELETE',interceptor: resourceInterceptor}
											}
										);
});