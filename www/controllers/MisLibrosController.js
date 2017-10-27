app.controller('MisLibrosController', function($scope,$ionicPopup,$state,$ionicPlatform,$ionicLoading,Codigo,$cordovaSQLite,mislibros) {
    $scope.data = {};
    $scope.Libros={};
 
    $scope.BtnCodigo = function() {
        try{
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
});