app.controller('ComprarLibrosController', function($scope,$ionicPopup,$state,$ionicPlatform,$stateParams,Libros) {
    $scope.data = {};
    $scope.libros={};
 
        $scope.CategoriaLibros = function() {
        try{
            console.log("si entro"+$stateParams.IdCategoria);
            Libros.query({categoria:$stateParams.IdCategoria}, function(respuesta) {   
             console.log(respuesta);
                $scope.libros=respuesta.data;
            }, function(error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: error.headers("Error")
                });
            });
        
        }
        catch(err){
            console.log(err);
        }
    }

        
   
})