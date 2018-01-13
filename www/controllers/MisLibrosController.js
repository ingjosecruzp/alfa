app.controller('MisLibrosController', function($scope,$ionicPopup,$rootScope,$timeout,$state,$ionicPlatform,$ionicLoading,$cordovaInAppBrowser,$cordovaFileTransfer,Codigo,$cordovaSQLite,mislibros,$cordovaDevice,Variables,$cordovaToast,$cordovaZip,$ionicModal) {
    $scope.data = {};
    $scope.Libros={};
    $scope.current=0;
    $scope.Descargando=false;
 
    $scope.BtnCodigo = function() {
        try{
            console.log("Muesta libros");
            $scope.current=0;
            mislibros.all().then(function(libros){
                libros.forEach(function(libro) {

                    var platform =$cordovaDevice.getPlatform();
                    console.log(platform);
                    if(platform=="Android"){
                       libro.ruta=cordova.file.externalDataDirectory + libro.ruta;
                    }
                    else{
                        libro.ruta=cordova.file.documentsDirectory + libro.ruta;
                    }
                    //Valida si ya se encuntra descargado el libro o no
                    if(libro.descargado=="NO")
                    {
                        libro.FlechaVisible=true;
                        libro.Spinner=false;
                        libro.Descarga=true;
                        libro.disabled=false;
                    }
                    else
                    {
                        libro.FlechaVisible=false;
                        libro.Spinner=false;
                        libro.Descarga=false;
                        libro.disabled=false;
                    }
                });

                $scope.Libros = libros;

                console.log($scope.Libros);
            });
            console.log("entro despues");
        }
        catch(err){
            console.log(err);
            $cordovaToast.show(err, 'long', 'center');
        }
        console.log("despues de los libros");
    }
    $scope.VisualizarLibro=function(libro){
        try{
            console.log("entro a visualizar libro");
            console.log(libro);
            console.log(libro.pathlibro+'/index.html');
            //location.href = libro.pathlibro+'/index.html';

            console.log("entro app browser");
            var options = {
                location           : 'no',
                clearcache         : 'yes',
                toolbar            : 'no',
                zoom               : 'yes',
                EnableViewPortScale: 'yes'
            };
            

            document.addEventListener("deviceready", function () {
                $cordovaInAppBrowser.open(libro.pathlibro+'/index.html', '_blank', options)
                //$cordovaInAppBrowser.open('/Documents/Libro2/index.html', '_blank', options)
                .then(function(event) {
                    // success
                    console.log(event);
                })
                .catch(function(event) {
                    // error
                    console.log(event);
                });
        
        
                //$cordovaInAppBrowser.close();
        
            }, false);

        
            $rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, event){
                if (event.url.match("mobile/close")) {
                    $cordovaInAppBrowser.close();
                }
              });

            $rootScope.$on('$cordovaInAppBrowser:loaderror', function(e, event){
                console.log(e);
            });
          
        }
        catch(err){
            console.log(err);
            $cordovaToast.show(err, 'long', 'center');
        }
    }
    $scope.DescargarLibro=function(libro){
        try{          
            //Si el libro ya se encuentra descargado lo manda a visualizar
            if(libro.descargado=="SI")
            {
                $scope.VisualizarLibro(libro);
                return;
            }

            libro.current=0;
            $ionicPlatform.ready(function () {
                //Oculta la flecha de descarga
                libro.FlechaVisible=false;
                //Muestra el spinner antes de iniciar la descarga
                libro.Spinner=true;

                var uuid = $cordovaDevice.getUUID();

                var url = "http://"+Variables.IpServidor+"/FileUploadServ.svc/Libro?identificador="+libro.id+"&UUID="+uuid+"&Codigo="+libro.codigo;
                console.log(url);

                var platform =$cordovaDevice.getPlatform();
              
                if(platform=="Android"){
                    var targetPath = cordova.file.externalDataDirectory+"Libro"+libro.id+".zip";
                    var targetunzip= cordova.file.externalDataDirectory+"Libro"+libro.id;
                }
                else{
                    var targetPath = cordova.file.documentsDirectory+"Libro"+libro.id+".zip";
                    var targetunzip= cordova.file.documentsDirectory+"Libro"+libro.id;
                }
        
                var trustHosts = true;

                $cordovaFileTransfer.download(url, targetPath, {}, trustHosts).then(function(result) {
                    // Success!
                    $cordovaToast.show("Espere un momento....", 'long', 'center');
                    libro.current={};
                    //libro.Descarga=false;

                    //Manda descomprir el libro
                    $cordovaZip.unzip(targetPath,targetunzip).then(function () {
                        console.log('descomprimido');

                        var libroActualizacion = {
                            id         : libro.id, 
                            nombre     : libro.nombre, 
                            ruta       : libro.ruta,
                            width      : libro.width,
                            height     : libro.height,
                            codigo     : libro.codigo,
                            pathlibro  : targetunzip,
                            descargado : "SI"
                        };

                        //Actualiza el campo de descargado cuando el libro esta totalmente en el cliente
                        mislibros.update(libro,libroActualizacion)
                        libro.descargado="SI";
                        libro.pathlibro=targetunzip;
                        libro.disabled=false;
                        libro.Spinner=false;
                        libro.Descarga=false;

                        var DescargasActuales=$scope.Libros.find(x => x.disabled === true);
                        console.log(DescargasActuales);
                        if(DescargasActuales == undefined)
                        {
                                console.log("entro false cache");
                                $scope.Descargando=false;
                        }
                        
                        $cordovaToast.show("Libro descargado", 'long', 'center');
                        //Manda visualizar el libro
                        //location.href = targetunzip+'/index.html';
                    }, function () {
                        $cordovaToast.show('Error al descomprimir el libro', 'long', 'center');
                    }, function (progressEvent) {
                        //console.log(progressEvent);
                        //Muestra el spinner antes de descomprimir
                        libro.Spinner=true;
                    });

                }, function(err) {
                    // Error
                    console.log(err);
                    $cordovaToast.show(err, 'long', 'center');
                }, function (progress) {
                    $timeout(function () {
                        //Oculta el spinner al iniciar la descarga
                        $scope.Descargando=true;
                        libro.Spinner=false;
                        libro.disabled=true;
                        var downloadProgress = (progress.loaded / progress.total) * 100;
                        libro.current +=downloadProgress-libro.current;
                    });
                });
            });
        }
        catch(err){
            console.log(err);
        }
    }
});