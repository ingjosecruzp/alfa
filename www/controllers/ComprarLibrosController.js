app.controller('ComprarLibrosController', function($scope,$ionicPopup,$state,$ionicPlatform,$stateParams,Libros,$ionicLoading) {
    $scope.data = {};
    $scope.libros={};
 
        $scope.CategoriaLibros = function() {
        try{
            
            $ionicLoading.show({
                noBackdrop :false,
                template: '<ion-spinner icon="spiral"></ion-spinner><br>Monstrando Libros',
                //duration :20000//Optional
            });
            console.log($stateParams.IdCategoria);
            Libros.query({search:'getXcategoria',categoria:$stateParams.IdCategoria}, function(respuesta) {
            
                    $ionicLoading.hide();   
                    $scope.libros=respuesta.data;
            }, function(error) {
                $ionicLoading.hide(); 
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
    $scope.BuscarLibros = function() {
        try{
            
            $ionicLoading.show({
                noBackdrop :false,
                template: '<ion-spinner icon="spiral"></ion-spinner><br>Monstrando Libros',
                //duration :20000//Optional
            });
            console.log("libro a buscar "+$stateParams.LibroaBuscar);
            Libros.query({search:'getXlike',librolike:$stateParams.LibroaBuscar}, function(respuesta) {
            
                    $ionicLoading.hide();   
                    $scope.libros=respuesta.data;
            }, function(error) {
                $ionicLoading.hide(); 
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