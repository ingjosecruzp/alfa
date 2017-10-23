app.controller('CategoriasController', function($scope,$ionicPopup,$state,$ionicPlatform,$ionicLoading,Codigo,$state) {
    $scope.data = {};
    $scope.codigos={};
    
    $scope.listacategorias=
      [
          {'id':1,'name':'Anatomina','img':'323232323'},
          {'id':2,'name':'Diseño','img':'323232323'},
          {'id':3,'name':'Arte','img':'323232323'},
          {'id':4,'name':'Fisioterapia','img':'323232323'},
          {'id':5,'name':'Programacion','img':'323232323'}
      ];

});