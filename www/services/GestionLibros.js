app.service('GestionLibros', function($ionicPlatform,$cordovaFileTransfer,movimientos,$ionicPopup,$q,$ionicLoading,$ionicPopup,Codigo,Variables,mislibros) {
    /**
     * Existen tres formas distintas de códigos
     * Código paquete  : El código ya tiene precargado los libros
     * Código libre    : El cogido le asigna al usuario créditos para adquirir libros a su gusto
     * Código combinado: El código tiene libros precargados y dar la oportunidad de elegir libros a su gusto
     */

    this.CodigoPaquete=function(codigo) {
        console.log(codigo);
        var promesa = $q.defer();
        $ionicPlatform.ready(function () {
            Codigo.query({search:'getXCodigo',idcodigo:codigo.Id}, function(response) {   
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
                          response.data.forEach(function(record) {
                              var libro = {
                                  id     : record.libros.Id, 
                                  nombre : record.libros.Nombre, 
                                  ruta   : record.libros.RutaThumbnails,
                                  width  : record.libros.Width,
                                  height : record.libros.Height,
                                  codigo : codigo.Codigo
                              };

                              mislibros.add(libro);
                          });

                          promesa.resolve("fin");
                    },function(err){
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

      return promesa.promise;
    };
    this.CodigoLibre=function(codigo) {
        var promesa = $q.defer();

        //Cuando el codigo es libre hace un movimiento de entrada para incrementar los creditos
        var movimiento={
          codigo  : codigo.Codigo,
          entrada : codigo.TotalLibros,
          salida  : 0
        }

        movimientos.add(movimiento);
      
        movimientos.SaldoLibros().then(function(saldo){
            $ionicLoading.hide();
            
            var alertPopup = $ionicPopup.alert({
              title: 'Felicidades',
              subTitle: 'Felicidades has adquirido '+ codigo.TotalLibros + ' credito para comprar tus libros.',
            }); 
      
            alertPopup.then(function(res) {
                promesa.resolve(saldo);
            });
        });

        return promesa.promise;
    };
    this.CodigoCombinado=function() {
      console.log("CodigoCombinado");
    };
  });