app.controller('CategoriasController', function($scope,$ionicPopup,$state,$ionicPlatform,$ionicLoading,Libros) {
    $scope.data = {};
    $scope.libros={};
    
    $scope.listacategorias=
      [
          {'id':1,'name':'Anatomina','img':'323232323'},
          {'id':2,'name':'Diseño','img':'323232323'},
          {'id':3,'name':'Arte','img':'323232323'},
          {'id':4,'name':'Fisioterapia','img':'323232323'},
          {'id':5,'name':'Programacion','img':'323232323'}
      ];
      
      $scope.BtnBuscar= function(){
       /*  $state.go('tab.chat-detail/1');*/
       
         $state.go('tab.comprarLibrosBuscar', {LibroaBuscar:$scope.libros.searchQuery});
      }

});