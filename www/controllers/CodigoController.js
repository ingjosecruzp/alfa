app.controller('CodigoController', function($scope,$ionicPopup,$state,$ionicPlatform,$ionicLoading,Codigo,$state) {
    $scope.data = {};
    $scope.codigos={};
 
    $scope.BtnCodigo = function() {
        try{
            $ionicLoading.show({
                noBackdrop :false,
                template: ' <ion-spinner icon="spiral"></ion-spinner>',
                //duration :20000//Optional
            });
           var acceso = Codigo.query({codigo:$scope.codigos.codigo}, function(response) {   
                var alertPopup = $ionicPopup.alert({
                    title: 'Felicidades',
                    subTitle: 'Felicidades has adquirido '+ response.data.length + ' libro.',
                }); 

                //Este evento entra hasta que se preciona el boton ok
                alertPopup.then(function(res) {
                    $state.go('tab.mislibros');
                });

                $ionicLoading.hide();
            }, function(error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: error.headers("Error")
                });
                $ionicLoading.hide();
            });
        }
        catch(err){
            console.log(err);
        }
    }
});