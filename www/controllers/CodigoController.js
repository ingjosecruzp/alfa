app.controller('CodigoController', function($scope,$ionicPopup,$state,$ionicPlatform,$ionicLoading,Codigo,$state,$cordovaDevice,$cordovaFileTransfer,$q,$cordovaSQLite,$rootScope,mislibros,Variables,GestionLibros) {
    $scope.data = {};
    $scope.codigos={};

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
                                /*$scope.TotalLibros=rsp.Total;*/
                                $scope.codigos={};
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
 
    /*$scope.BtnCodigo = function() {
        try{
            $ionicLoading.show({
                noBackdrop :false,
                template: '<ion-spinner icon="spiral"></ion-spinner><br>Verificando codigo',
                //duration :20000//Optional
            });
            $ionicPlatform.ready(function () {
                var uuid = $cordovaDevice.getUUID();
                var acceso = Codigo.query({searchBy:'getXCodigo',codigo:$scope.codigos.codigo,uuid:uuid}, function(response) {   
                    var uuid;  
                    $ionicLoading.hide();

                    var alertPopup = $ionicPopup.alert({
                        title: 'Felicidades',
                        subTitle: 'Felicidades has adquirido '+ response.data.length + ' libro.',
                    }); 
    
                    //Este evento entra hasta que se preciona el boton ok
                    alertPopup.then(function(res) {
                        var promises =[];
                    
                        console.log(response.data);

                        response.data.forEach(function(libro) {
                            var url = "http://"+Variables.IpServidor+"/cover/"+libro.libros.RutaThumbnails;
                            var targetPath = cordova.file.externalDataDirectory+libro.libros.RutaThumbnails;
                            promises.push($cordovaFileTransfer.download(url,targetPath, {}, true));
                        });
                        
                        $ionicLoading.show({
                            noBackdrop :false,
                            template: '<ion-spinner icon="spiral"></ion-spinner><br>Descargando Libros',
                            //duration :20000//Optional
                        });

                        $q.all(promises).then(function(res) {
                            $ionicLoading.hide();
                            console.log("entro");
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
                        },function(err){
                            console.log("error");
                            console.log(err);
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
    }*/
});