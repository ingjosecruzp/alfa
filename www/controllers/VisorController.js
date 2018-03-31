app.controller('VisorController', function($scope,$ionicPopup,$state,$ionicPlatform,$ionicLoading,Codigo,$http,mislibros,$rootScope) {
    $scope.data = {};
    $scope.Libros={};
    
    var CargarPagina = function(i,pagina){
        $http.get('file:///storage/emulated/0/Android/data/io.ionic.starter/files/Libro2/'+ i +'.html')
          .success(function(data) {
            pagina.innerHTML=data;
            pagina.style.transform="translateX(0px) translateY(0px) scale(0.384953233)";
        }).error(function(data){console.log("The request isn't working");}); 
    }
    
    $scope.Inicio = function() {
        $scope.ScaleObjetos();
    }
  
    $scope.ScaleObjetos=function(){
        console.log("scale objectos");

        //Obtengo el total de hojas en el libro
        var TotalHojas=20;

        //Busco elemento principal donde se insertaran las hojas
        //var div = document.getElementById('contenedorLibro');
        var contenedor = document.querySelector("ion-scroll > div");
        for(i=1;i<=TotalHojas;i++){
            //Crea el div que contiene la pagina
            var paginaContenedor = document.createElement('div');
            paginaContenedor.id="page"+i;
            paginaContenedor.className ="page";
            paginaContenedor.style.width="350px";
            paginaContenedor.style.height="500px";
            contenedor.appendChild(paginaContenedor);

            //Crea la pagina que se visualiza en el documento
            //paginaContenedor.insertAdjacentHTML("afterbegin",'<div class="page-inner" style="width: 909px; height: 1299px" ng-include="\'file:///storage/emulated/0/Android/data/io.ionic.starter/files/Libro2/2.html\'"></div>');   
            var pagina=document.createElement('div');
            pagina.className="page-inner";
            pagina.style.width="909px";
            pagina.style.height="1299px";
            paginaContenedor.appendChild(pagina);

            CargarPagina(i,pagina);
        }
    }
});