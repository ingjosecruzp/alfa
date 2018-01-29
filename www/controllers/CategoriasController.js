app.controller('CategoriasController', function($scope,$ionicPopup,$state,$ionicPlatform,$ionicLoading,$cordovaDevice,Libros,Variables) {
    $scope.data = {};
    $scope.libros={};
    
    $scope.listacategorias=
      [
        {'id':1,'name':'Administración','img':'323232323'},
        {'id':2,'name':'Arquitectura','img':'323232323'},
        {'id':3,'name':'Criminología','img':'323232323'},
        {'id':4,'name':'Derecho','img':'323232323'},
        {'id':5,'name':'Fisioterapia','img':'323232323'},
        {'id':6,'name':'Nutrición','img':'323232323'},
        {'id':7,'name':'Psicología','img':'323232323'}
      ];
      
      $scope.BtnBuscar= function(){
       /*  $state.go('tab.chat-detail/1');*/
       
         $state.go('tab.comprarLibrosBuscar', {LibroaBuscar:$scope.libros.searchQuery});
      }

      $scope.DvPlataforma= function(){
        
        var platform =$cordovaDevice.getPlatform();
        if(platform=="Android"){
            $scope.pixeles = 0; 
        }
        else{
            $scope.pixeles = 50;
        }
      }

});