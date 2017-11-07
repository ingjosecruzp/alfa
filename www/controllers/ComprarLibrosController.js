app.controller('ComprarLibrosController', function($scope,$ionicPopup,$state,$ionicPlatform,$stateParams,Libros,$ionicLoading,$ionicModal,$timeout) {
    $scope.data = {};
    $scope.libros=[];
    $scope.getlibro={};
    $scope.InfiniteScroll=false;
 
        $scope.CategoriaLibros = function() {
        try{
            
            $ionicLoading.show({
                noBackdrop :false,
                template: '<ion-spinner icon="spiral"></ion-spinner><br>Monstrando Libros',
                //duration :20000//Optional
            });
            console.log($stateParams.IdCategoria);
            Libros.query({search:'getXcategoria',categoria:$stateParams.IdCategoria}, function(respuesta) {
            
                    $ionicLoading.hide();   
                    $scope.libros=respuesta.data;
                    
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
          console.log("arreglo libro "+libro)
        $scope.taskModal.show();
      };


    
      // Close the new task modal
      $scope.closeNewTask = function() {
        $scope.taskModal.hide();
      };

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