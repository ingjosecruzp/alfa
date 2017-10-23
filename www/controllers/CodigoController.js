app.controller('CodigoController', function($scope,$ionicPopup,$state,$ionicPlatform,$ionicLoading,Codigo,$state,$cordovaDevice,$cordovaFileTransfer,$q,$cordovaSQLite) {
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

                        console.log(response.data);
                        
                        response.data.forEach(function(libro) {
                            var url = "http://200.52.220.238:8080/cover/"+libro.libros.RutaThumbnails;
                            var targetPath = cordova.file.externalDataDirectory +libro.libros.RutaThumbnails;
                            promises.push($cordovaFileTransfer.download(url, targetPath, {}, true));
                        });
                        
                        
                        $q.all(promises).then(function(res) {
                            /*for(var i=0; i<res.length; i++) {
                                //$scope.images.push(res[i].nativeURL);
                                console.log(res[i]);
                            }*/
                            $ionicLoading.hide();
                            db = $cordovaSQLite.openDB({ name: "alfabooks.db", iosDatabaseLocation:'default'}); 
                            
                            db.transaction(function(tx) {
                                tx.executeSql('CREATE TABLE IF NOT EXISTS libros (id, nombre,ruta)');
                                response.data.forEach(function(libro) {
                                    var id=libro.libros.Id;
                                    var nombre=libro.libros.Nombre;
                                    var ruta=libro.libros.Id.RutaThumbnails;
                                    tx.executeSql('INSERT INTO libros VALUES (?,?,?)', [id, nombre,ruta]);
                                });
                              }, function(error) {
                                console.log('Transaction ERROR: ' + error.message);
                              }, function() {
                                console.log('Populated database OK');
                              });

                            //$state.go('tab.mislibros');
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