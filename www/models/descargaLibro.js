app.factory('DescargaLibro', function ($resource,resourceInterceptor,Variables) {
    return $resource('http://'+ Variables.IpServidor+'/FileUploadServ.svc/Libro/:item',
                                        {item: "@item"},
                                        {
                                            'get':    			{method:'GET',interceptor: resourceInterceptor},
                                            'save':   			{method:'POST',interceptor: resourceInterceptor},
                                            'query': 			{method:'GET', isArray:true,interceptor: resourceInterceptor,url:'http://'+ Variables.IpServidor+'/FileUploadServ.svc/Libro/?identificador=:id',params:"@id"},
                                            'remove': 			{method:'DELETE',interceptor: resourceInterceptor},
                                            'delete': 			{method:'DELETE',interceptor: resourceInterceptor}
                                        }
                                    );
});