app.controller('ComprarLibrosController', function($scope,$ionicPopup,$state,$ionicPlatform,Libros) {
    $scope.data = {};
    $scope.categoriaid={};
 
        $scope.CategoriaLibros = function() {
        try{
           var acceso = Libros.query($scope.categoriaid, function() {   
                        var alertPopup = $ionicPopup.alert({
                        title: 'Felicidades',
                        subTitle: 'Codigo correcto',
                        }); 
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