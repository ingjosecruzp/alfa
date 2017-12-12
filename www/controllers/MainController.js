app.controller('MainController', function($scope,$ionicPopup,$state,$ionicPlatform,Codigo) {
    $scope.data = {};
    $scope.librocodigo={};
 
        $scope.BtnCodigo = function() {
        try{
            //Comentario Fede
           var acceso = Codigo.query($scope.librocodigo, function() {   
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