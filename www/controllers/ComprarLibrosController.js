app.controller('ComprarLibrosController', function($scope,$ionicPopup,$state,$ionicPlatform,$stateParams,Libros,$ionicLoading,$ionicModal,Variables,mislibros,$cordovaFileTransfer,$q,$cordovaDevice,$cordovaToast,$rootScope,movimientos) {
    $scope.data = {};
    $scope.libros=[];
    $scope.getlibro={};
    $scope.InfiniteScroll=false;

    $scope.CategoriaLibros = function() {
        try{
            $ionicLoading.show({
                noBackdrop :false,
                template: '<ion-spinner icon="spiral"></ion-spinner><br>Monstrando Libros'
            });
            console.log($stateParams.IdCategoria);
            Libros.query({search:'getXcategoria',categoria:$stateParams.IdCategoria}, function(respuesta) {
            
                    $ionicLoading.hide();   
                    respuesta.data.forEach(function(libro) {
                        libro.libros.RutaThumbnails="http://"+Variables.IpServidor+"/cover/"+libro.libros.RutaThumbnails;
                        libro.libros.RutaImgResena="http://"+Variables.IpServidor+"/cover/resena/"+libro.libros.RutaImgResena;
                        $scope.libros.push(libro);
                    });
                    
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
            
            /*$ionicLoading.show({
                noBackdrop :false,
                template: '<ion-spinner icon="spiral"></ion-spinner><br>Monstrando Libros',
                //duration :20000//Optional
            });*/
            console.log("libro a buscar "+$stateParams.LibroaBuscar);
            Libros.query({search:'getXlike',librolike:$stateParams.LibroaBuscar,index:$scope.libros.length}, function(respuesta) {

                    if(respuesta.data.length==0)
                        $scope.InfiniteScroll=false;

                    respuesta.data.forEach(function(libro) {
                        libro.RutaThumbnails="http://"+Variables.IpServidor+"/cover/"+libro.RutaThumbnails;
                        libro.RutaImgResena="http://"+Variables.IpServidor+"/cover/resena/"+libro.RutaImgResena;
                        $scope.libros.push(libro);
                    });
                    $scope.$broadcast('scroll.infiniteScrollComplete');
            
                    //$ionicLoading.hide();   
                    console.log($scope.libros);

            }, function(error) {
                //$ionicLoading.hide(); 
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

    $scope.mymelody = function() {
        try{
            
         console.log("djletahl");
        
        }
        catch(err){
            console.log(err);
        }
    }
    $scope.showToast = function(message, duration, location) {
        $ionicPlatform.ready(function () {
                $cordovaToast.show(message, duration, location).then(function(success) {
                    console.log("The toast was shown");
                }, function (error) {
                    console.log("The toast was not shown due to " + error);
                });
        });
    }
          
    $ionicModal.fromTemplateUrl('templates/comprarLibrosVistaModal.html', function(modal) {
        $scope.taskModal = modal;
      }, {
        scope: $scope,
        animation: 'slide-in-up'
      });
    
      // Called when the form is submitted
      $scope.createTask = function(task) {
        $scope.tasks.push({
          title: task.title
        });
        $scope.taskModal.hide();
        task.title = "";
      };
    
      // Open our new task modal
      $scope.newTask = function(libro) {
        $scope.getlibro=libro;
        $scope.taskModal.show();
      };


    
      // Close the new task modal
      $scope.closeNewTask = function() {
        $scope.taskModal.hide();
      };

      $scope.anadiraMisLibros = function(libro) {
        var promesa = $q.defer();
        var promises =[];  
        $scope.getlibro=libro;
        var url =libro.RutaThumbnails;

        console.log(libro);
      
        $ionicLoading.show({
            noBackdrop :false,
            template: '<ion-spinner icon="spiral"></ion-spinner><br>Adquiriendo el libro'
        });

        $ionicPlatform.ready(function () {
                var uuid=$rootScope.uuid;
           
                Libros.query({search:'VerificarCodigo',libroId:libro.Id,uuid:uuid}, function(respuesta) {
                if(!respuesta.data.length==0){

                    console.log(respuesta);
                    var platform =$cordovaDevice.getPlatform();
              
                    if(platform=="Android"){
                        var targetPath = cordova.file.externalDataDirectory+libro.RutaThumbnails;
                    }
                    else{
                        var targetPath = cordova.file.documentsDirectory+libro.RutaThumbnails;
                    }
                  
                    promises.push($cordovaFileTransfer.download(url,targetPath, {}, true));

                    $q.all(promises).then(function(res) {
                            var Insertlibro = {
                                id     : libro.Id, 
                                nombre : libro.Nombre, 
                                ruta   : libro.RutaThumbnails,
                                width  : libro.Width,
                                height : libro.Height,
                                codigo : respuesta.data[0].codigos.Codigo
                            };
                            mislibros.add(Insertlibro);
                            promesa.resolve("fin");
                            $ionicLoading.hide();
                            $scope.taskModal.hide();
                           
                            $cordovaToast.show("Felicidades has adquirido un libro", 'long', 'center');
                            $rootScope.showTab=false;  //Muestra la venta de mis libros

                             //hace un movimiento de salida para decrementar los creditos
                            var movimiento={
                                codigo  :"0",
                                entrada : 0,
                                salida  : 1
                            }
                    
                            movimientos.add(movimiento);

                              //variable para la notificacion del tab 4 tipoglobe
                            movimientos.SaldoLibros().then(function(saldo){
                                $rootScope.notificacionglobo=saldo.Total==null ? "0" :saldo.Total;
                            });

                              
                    },function(err){
                    $ionicLoading.hide();
                    
                    console.log(err);
                    });
            } else{
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: "No cuentas con creditos para comprar libros"
                    
                });
            }
            }, function(error) {
                $ionicLoading.hide(); 
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: error.headers("Error")
                    
                });
                
            });
        });
}
      $scope.BtnAtras = function() {
        $state.go('tab.categorias');
      } 

      $scope.LibrosModal = function(imagen) {
            try{
                
            console.log("modal "+imagen);
            
            }
            catch(err){
                console.log(err);
            }
        }

       $scope.moreDataCanBeLoaded = function() {
        return $scope.InfiniteScroll;
    
        }

        $scope.IniciarBusqueda=function(searchQuery){
            //Verficio si se inicio una busqueda nueva
            $scope.InfiniteScroll=true;
            //$scope.searchQueryTemp=searchQuery;
            $scope.libros=[];
            //$scope.$broadcast('scroll.infiniteScrollComplete');
        }
        
   
})