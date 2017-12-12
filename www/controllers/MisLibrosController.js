app.controller('MisLibrosController', function($scope,$ionicPopup,$timeout,$state,$ionicPlatform,$ionicLoading,$cordovaFileTransfer,Codigo,$cordovaSQLite,mislibros,$cordovaDevice,Variables,$cordovaToast) {
    $scope.data = {};
    $scope.Libros={};
    $scope.current=0;
 
    $scope.BtnCodigo = function() {
        try{
            $scope.current=0;
            mislibros.all().then(function(libros){
                
                libros.forEach(function(libro) {
                    libro.ruta=cordova.file.externalDataDirectory + libro.ruta;
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
            //console.log(libro);
            //$scope.current += 1;
            $scope.current=0;
            $ionicPlatform.ready(function () {
                var uuid = $cordovaDevice.getUUID();

                var url = "http://"+Variables.IpServidor+"/FileUploadServ.svc/Libro?identificador="+libro.id+"&UUID="+uuid+"&Codigo="+libro.codigo;
                console.log(url);
                var targetPath = cordova.file.externalDataDirectory+"Libro"+libro.id+".rar";
                var trustHosts = true;

                $cordovaFileTransfer.download(url, targetPath, {}, trustHosts).then(function(result) {
                  // Success!
                  console.log(result);
                  $cordovaToast.show("Libro descargado", 'long', 'center');
                }, function(err) {
                  // Error
                  console.log(err);
                }, function (progress) {
                  $timeout(function () {
                    console.log(progress.loaded);
                    console.log(progress.total);
                    $scope.current += (progress.loaded / progress.total) * 100;
                  });
                });
            });
        }
        catch(err){
            console.log(err);
        }
    }
});