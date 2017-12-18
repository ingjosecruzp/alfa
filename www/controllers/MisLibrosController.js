app.controller('MisLibrosController', function($scope,$ionicPopup,$timeout,$state,$ionicPlatform,$ionicLoading,$cordovaFileTransfer,Codigo,$cordovaSQLite,mislibros,$cordovaDevice,Variables,$cordovaToast,$cordovaZip,$ionicModal) {
    $scope.data = {};
    $scope.Libros={};
    $scope.current=0;
 
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
                    console.log(libro.descargado)
                    if(libro.descargado=="NO")
                    {
                        libro.FlechaVisible=true;
                        libro.Spinner=false;
                        libro.Descarga=true;
                    }
                    else
                    {
                        libro.FlechaVisible=false;
                        libro.Spinner=false;
                        libro.Descarga=false;
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
    $scope.DescargarLibro=function(libro){
        try{
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
                console.log(platform);
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
                    console.log(result);
                    //Manda descomprir el libro
                    $cordovaZip.unzip(targetPath,targetunzip).then(function () {
                        console.log('success');
                        console.log(libro);
                        var libroActualizacion = {
                            id         : libro.id, 
                            nombre     : libro.nombre, 
                            ruta       : libro.ruta,
                            width      : libro.width,
                            height     : libro.height,
                            codigo     : libro.codigo,
                            descargado : "SI"
                        };

                        //Actualiza el campo de descargado cuando el libros esta totalmente en el cliente
                        mislibros.update(libro,libroActualizacion)
                        //location.href = targetunzip+'/index.html';
                    }, function () {
                        console.log('error');
                    }, function (progressEvent) {
                        console.log(progressEvent);
                    });

                }, function(err) {
                    // Error
                    console.log(err);
                }, function (progress) {
                    $timeout(function () {
                        //Oculta el spinner al iniciar la descarga
                        libro.Spinner=false;
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