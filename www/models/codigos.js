app.factory('Codigo', function ($resource,resourceInterceptor,Variables) {
		return $resource('http://'+ Variables.IpServidor+'/WSCodigos.svc/codigos/:item',
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