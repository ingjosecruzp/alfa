app.controller('MisLibrosController', function($scope,$ionicPopup,$timeout,$state,$ionicPlatform,$ionicLoading,$cordovaFileTransfer,Codigo,$cordovaSQLite,mislibros,$cordovaDevice,Variables,$cordovaToast,$cordovaZip,$ionicModal) {
    $scope.data = {};
    $scope.Libros={};
    $scope.current=0;
    $scope.Descargando=false;
 
    $scope.BtnCodigo = function() {
        try{
            $scope.current=0;
            mislibros.all().then(function(libros){
                
                libros.forEach(function(libro) {

                    var platform =$cordovaDevice.getPlatform();
                    console.log(platform);
                    if(platform=="Android"){
                       libro.ruta=cordova.file.externalDataDirectory + libro.ruta;
                       $scope.pixeles = 0;
                    }
                    else{
                        libro.ruta=cordova.file.documentsDirectory + libro.ruta;
                       $scope.pixeles = 20;
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
        }
        catch(err){
            console.log(err);
        }
    }
    $scope.VisualizarLibro=function(libro){
        try{
            console.log("entro a visualizar libro");
            console.log(libro);
            location.href = libro.pathlibro+'/index.html';
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
                    libro.Descarga=false;
                    $cordovaToast.show("Libro descargado", 'long', 'center');
                    //console.log(result);
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

                        var DescargasActuales=$scope.Libros.find(x => x.disabled === true);
                        console.log(DescargasActuales);
                        if(DescargasActuales == undefined)
                        {
                                console.log("entro false cache");
                                $scope.Descargando=false;
                        }

                        //Manda visualizar el libro
                        //location.href = targetunzip+'/index.html';
                    }, function () {
                        console.log('error');
                        $cordovaToast.show('Error al descomprimir el libro', 'long', 'center');
                    }, function (progressEvent) {
                        //console.log(progressEvent);
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

                        //if($scope.current>99.98)
                           
                    });
                });
            });
        }
        catch(err){
            console.log(err);
        }
    }
});