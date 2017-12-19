app.controller('IngresarCodigosController', function($scope,$ionicPopup,$state,$ionicPlatform,$ionicLoading,Codigo,$state,$cordovaDevice,$cordovaFileTransfer,$q,$cordovaSQLite,$rootScope,mislibros,Variables,GestionLibros,movimientos) {
    $scope.data = {};
    $scope.codigos={};
    $scope.TotalLibros=0;
 
    $scope.Inicio=function(){
        movimientos.SaldoLibros().then(function(saldo){
            $scope.TotalLibros=saldo.Total==null ? 0 : saldo.Total;
        });
    }
    $scope.BtnCodigo = function() {
        try{
            $ionicLoading.show({
                noBackdrop :false,
                template: '<ion-spinner icon="spiral"></ion-spinner><br>Verificando codigo'
            });
            $ionicPlatform.ready(function () {
                var uuid = $cordovaDevice.getUUID();
                var acceso = Codigo.query({search:'VerificarCodigo',codigo:$scope.codigos.codigo,uuid:uuid}, function(response) {
                    var codigo=response.data[0];
                    
                    switch(codigo.Tipo) {
                        case "Paquete":
                            GestionLibros.CodigoPaquete(codigo).then(function(rsp){
                                console.log("final de todo");
                                //Muestra la venta de mis libros
                                $scope.codigos={};
                                $rootScope.showTab=false;
                                $state.go('tab.mislibros');
                            });
                            break;
                        case "Libre":
                            GestionLibros.CodigoLibre(codigo).then(function(rsp){
                                console.log(rsp);
                                $scope.TotalLibros=rsp.Total;
                                $scope.codigos={};
                            });
                              //variable para la notificacion del tab 4 tipoglobe
                                movimientos.SaldoLibros().then(function(saldo){
                                    $rootScope.notificacionglobo=saldo.Total==null ? "0" :saldo.Total;
                                });
                            break;
                        case "Combinado":
                            GestionLibros.CodigoCombinado();
                    }
                    
                }, function(error) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: error.headers("Error")
                    });
                    $ionicLoading.hide();
                });
            });  
        }
        catch(err){
            console.log(err);
        }
    }
});