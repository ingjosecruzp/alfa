app.controller('CodigoController', function($scope,$ionicPopup,$state,$ionicPlatform,$ionicLoading,Codigo,$state,$cordovaDevice,$cordovaFileTransfer,$q,$cordovaSQLite,$rootScope,mislibros) {
    $scope.data = {};
    $scope.codigos={};
 
    $scope.BtnCodigo = function() {
        try{
            $ionicLoading.show({
                noBackdrop :false,
                template: '<ion-spinner icon="spiral"></ion-spinner><br>Verificando codigo',
                //duration :20000//Optional
            });
            $ionicPlatform.ready(function () {
                var uuid = $cordovaDevice.getUUID();
                var acceso = Codigo.query({codigo:$scope.codigos.codigo,uuid:uuid}, function(response) {   
                    var uuid;  
                    $ionicLoading.hide();

                    var alertPopup = $ionicPopup.alert({
                        title: 'Felicidades',
                        subTitle: 'Felicidades has adquirido '+ response.data.length + ' libro.',
                    }); 
    
                    //Este evento entra hasta que se preciona el boton ok
                    alertPopup.then(function(res) {

                        $ionicLoading.show({
                            noBackdrop :false,
                            template: '<ion-spinner icon="spiral"></ion-spinner><br>Descargando libros',
                            //duration :20000//Optional
                        });

                        //Arreglo con promesas que se van ejecutar todas al mismo tiempo
                        var promises = [];

                        //console.log(response.data);
                        
                        response.data.forEach(function(libro) {
                            var url = "http://200.52.220.238:8080/cover/"+libro.libros.RutaThumbnails;
                            //var url = "http://172.16.5.78:8080/cover/"+libro.libros.RutaThumbnails;
                            var targetPath = cordova.file.externalDataDirectory +libro.libros.RutaThumbnails;
                            promises.push($cordovaFileTransfer.download(url, targetPath, {}, true));
                        });
                        
                        
                        $q.all(promises).then(function(res) {
                            $ionicLoading.hide();
                            
                            response.data.forEach(function(record) {

                                var libro = {
                                    id     : record.libros.Id, 
                                    nombre : record.libros.Nombre, 
                                    ruta   : record.libros.RutaThumbnails,
                                    width  : record.libros.Width,
                                    height : record.libros.Height
                                };

                                mislibros.add(libro);
                            });
                            //Muestra la venta de mis libros
                            $rootScope.showTab=false;
                            $state.go('tab.mislibros');
                        });
                      
                    });
                    
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