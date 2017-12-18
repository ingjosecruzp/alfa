var app=angular.module('libro', ['ionic','ngCordova']);


app.controller('LibroController', function ($scope,$location,LibrosModel,$ionicModal) {
    $scope.Libros=[];
    $scope.IndexLibro;

    // Create our modal
    $ionicModal.fromTemplateUrl('nota.html', function (modal) {
        $scope.taskModal = modal;
    }, {
        scope: $scope
    });

    // Called to create a new project
    $scope.Inicio=function(NombreLibro){
        $scope.Libros=LibrosModel.all();

        $scope.IndexLibro=$scope.Libros.findIndex(x => x.Titulo==NombreLibro);
        
        //Si no existe storage para el libro lo crea
        if($scope.IndexLibro===-1){
              $scope.Libros.push(LibrosModel.nuevoLibro(NombreLibro));
              $scope.IndexLibro=$scope.Libros.length-1;
        }
        else{
            //Dibuja los separadores que ya se encuentra guardados
            $scope.Libros[$scope.IndexLibro].Separadores.forEach(function(Pagina) {
                $scope.dibujarSeparador(Pagina);
            });
        }
    }
    $scope.TestBoton = function () {
        console.log("entro controller click");
        alert("entro el boton");
    };
    $scope.addSeparador=function(){

        PaginaActual=document.getElementById('goBtn').value;

        //Busca si ya exsteb yb separador en la hoja si es asi lo elimina
        if(document.getElementById('separador_'+PaginaActual) != null)
        {
            var pagina = document.getElementById("page"+PaginaActual);
            var separador = document.getElementById('separador_'+PaginaActual);
            pagina.removeChild(separador);
            
            //actualiza el storage de libros
            var index=$scope.Libros[$scope.IndexLibro].Separadores.indexOf(PaginaActual);
            $scope.Libros[$scope.IndexLibro].Separadores.splice(index, 1);
            LibrosModel.save($scope.Libros);

            return;
        }

        this.dibujarSeparador(PaginaActual);

        $scope.Libros[$scope.IndexLibro].Separadores.push(PaginaActual);
        LibrosModel.save($scope.Libros);
    };
    $scope.addNota=function(){
        $scope.taskModal.show();
    };
    $scope.closeNewTask = function () {
        $scope.taskModal.hide();
    }
    $scope.dibujarSeparador=function(Pagina){
        var div = document.getElementById('page'+Pagina);
        div.insertAdjacentHTML("afterbegin",'<div id="separador_'+Pagina+'" class="nota-tablet nota-cel"></div>');
        //div.insertAdjacentHTML("afterbegin",'<div id="separador_'+Pagina+'" class="nota-cel nota-tablet"><p class="verticaltext">Notas</p></div>');
    };
});

app.factory('LibrosModel', function () {
    return {
        all: function () {
            var projectString = window.localStorage['libros'];
            if (projectString) {
                return angular.fromJson(projectString);
            }
            return [];
        },
        save: function (libros) {
            window.localStorage['libros'] = angular.toJson(libros);
        },
        nuevoLibro: function (NombreLibro) {
            // Add a new project
            return {
                Titulo: NombreLibro,
                Separadores: []
            };
        }
    }
});