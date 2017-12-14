app.controller('MisLibrosController', function($scope,$ionicPopup,$timeout,$state,$ionicPlatform,$ionicLoading,$cordovaFileTransfer,Codigo,$cordovaSQLite,mislibros,$cordovaDevice,Variables,$cordovaToast) {
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
                    }
                    else{
                        libro.ruta=cordova.file.documentsDirectory + libro.ruta;
                    }
                    
                });

                $scope.Libros = libros;

                console.log($scope.Libros);
                console.log("despues");
            });
        }
        catch(err){
            console.log(err);
        }
    }
    $scope.DescargarLibro=function(libro){
        try{
            //$scope.current=0;
            libro.current=0;
            $ionicPlatform.ready(function () {
                var uuid = $cordovaDevice.getUUID();

                var url = "http://"+Variables.IpServidor+"/FileUploadServ.svc/Libro?identificador="+libro.id+"&UUID="+uuid+"&Codigo="+libro.codigo;
                console.log(url);

                var platform =$cordovaDevice.getPlatform();
                console.log(platform);
                if(platform=="Android"){
                    var targetPath = cordova.file.externalDataDirectory+"Libro"+libro.id+".rar";
                }
                else{
                    var targetPath = cordova.file.documentsDirectory+"Libro"+libro.id+".rar";
                }
        
                var trustHosts = true;

                $cordovaFileTransfer.download(url, targetPath, {}, trustHosts).then(function(result) {
                  // Success!
                  console.log(result);
                }, function(err) {
                  // Error
                  console.log(err);
                }, function (progress) {
                  $timeout(function () {
                    var downloadProgress = (progress.loaded / progress.total) * 100;
                    libro.current +=downloadProgress-libro.current;
                    if(libro.current >99.98)
                        $cordovaToast.show("Libro descargado", 'long', 'center');
                    /*var downloadProgress = (progress.loaded / progress.total) * 100;
                    $scope.current +=downloadProgress-$scope.current;
                    if($scope.current>99.98)
                        $cordovaToast.show("Libro descargado", 'long', 'center');*/
                  });
                });
            });
        }
        catch(err){
            console.log(err);
        }
    }
});