app.controller('HomeController', function($scope,$ionicPopup,$state,$ionicPlatform,$ionicLoading,$cordovaDevice,$cordovaToast,Libros,Variables) {
    
      $scope.CambioIp= function(){
        if(Variables.IpServidor=='192.168.0.103:8080'){
            Variables.IpServidor = '200.52.220.238:8091';           
        }
        else{
            Variables.IpServidor = '192.168.0.103:8080';
        }
        $cordovaToast.show("Cambio de ip a:"+Variables.IpServidor, 'long', 'center');
      }

});