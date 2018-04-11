app.controller('VisorController', function($scope,$q,$compile,$timeout,$ionicPopup,$state,$ionicPlatform,$ionicLoading,$ionicScrollDelegate,$http,mislibros,$rootScope,StorageLibro,$ionicGesture) {
    $scope.data = {};
    $scope.Libros={};
    $scope.Hojas={ HojaActual: "# 1",Hoja: 1};
    $scope.HojasLibro=[];
    var LimitesHojas=[];
    var TotalHojas=0;
    var heightHoja=500;
    var TempTopScroll=0;
    var Paginacion=5;
    var UltimaPaginaCargada=1;
    var Pages=[];
    var PagesInner=[];
    var TempZoom=false;
    var MainZoom;
    
   /*var CargarPagina = function(i,pagina){
        $http.get('file:///storage/emulated/0/Android/data/io.ionic.starter/files/Libro2/'+ i +'.html')
          .success(function(data) {
              console.log(pagina);
            pagina.innerHTML=data;
            //$compile(pagina)($scope);
            //pagina.appendChild($compile(data)($scope)[0]);
            //pagina.append(data);
            //data = $compile(data)($scope);
            //var elementToAdd = angular.element(data);
            //$compile(elementToAdd)($scope);
            //pagina.appendChild(elementToAdd[0]);
            //$scope.$digest()
            pagina.style.transform="translateX(0px) translateY(0px) scale(0.384953233)";
            if(i==3){
                //$ionicLoading.hide();
                ProgressIndicator.hide();
            }
        }).error(function(data){console.log("The request isn't working");}); 
   }*/
    $scope.CargarHojas=function(hoja){
        $http.get(hoja.Path)
        .success(function(data) {
          document.getElementById("page-inner"+hoja.NumHoja).innerHTML=data;
          return data;
          //pagina.style.transform="translateX(0px) translateY(0px) scale(0.384953233)";
      }).error(function(data){console.log("The request isn't working");}); 
    }
    $scope.$on('$ionicView.beforeLeave', function(){
        alert("beforeLeave");
    });
    /*$scope.$on('$ionicView.loaded', function(){
        // Anything you can think of
        console.log(document.getElementById("page-inner15"));
    });*/
    var CargarPaginas=function(){
        var promesa = $q.defer();

        var promises =[];
        var Fin=UltimaPaginaCargada+Paginacion;

        for(i=UltimaPaginaCargada;i<Fin;i++){
            promises.push(CargarPagina(i,document.getElementById("page-inner"+i)));
        }

        $q.all(promises).then(function(res) {
            $ionicLoading.hide();
            UltimaPaginaCargada=Fin;
            console.log("termino promesas");
            promesa.resolve("fin");
        },function(err){
            console.log(err);
        });

        return promesa.promise;
    }
    /*$scope.$watchCollection('Hojas.HojaActual',function() {
        console.log("Cambio Hoja Actual");
        if($scope.Hojas.Hoja >= UltimaPaginaCargada)
        {
            console.log("cargando hojas");
            CargarPaginas().then(function(rsp){
                console.log("final de todo");
            });
        }
    });*/
    $scope.Inicio = function() {
        TotalHojas=61;
        //$scope.ScaleObjetos();
        for(i=1;i<=TotalHojas;i++){
            var hoja={
                NumHoja: i,
                Path   : "file:///storage/emulated/0/Android/data/io.ionic.starter/files/Libro2/"+i+".html"
            };
            $scope.HojasLibro.push(hoja);
            $scope.CargarHojas(hoja);
        }
    }
    $scope.ScaleObjetos=function(){
        //Obtengo el total de hojas en el libro
        TotalHojas=61;
        var LimiteHeight=heightHoja;

         //Busco elemento principal donde se insertaran las hojas
        //var contenedor = document.getElementById('contenedorLibro');
        var contenedor = document.querySelector("ion-scroll > div");

        //Cargo primero los div "page" para poder respetar el scroll
        for(i=1;i<=TotalHojas;i++){
            var paginaContenedor = document.createElement('div');
            paginaContenedor.id="page"+i;
            paginaContenedor.className ="page";
            paginaContenedor.style.width="350px";
            paginaContenedor.style.height=heightHoja + "px";
            contenedor.appendChild(paginaContenedor);

            Pages.push(paginaContenedor);

            var pagina=document.createElement('div');
            pagina.className="page-inner";
            pagina.id="page-inner"+i;
            pagina.style.width="909px";
            pagina.style.height="1299px";
            pagina.onclick=doubletap;
            pagina.setAttribute("on-double-tap", "DoubleTap('"+i+"')");
            paginaContenedor.appendChild(pagina);

            PagesInner.push(pagina);

            var Limite={
                Hoja     : i, 
                Superior : i==1 ? 0 : ((i * heightHoja) - heightHoja)+1 ,  
                Inferior : i * heightHoja
            };
            LimitesHojas.push(Limite);
        }
        ProgressIndicator.hide();

        CargarPaginas().then(function(rsp){
            console.log("final de todo");
        });
    }
    $scope.ScaleObjetos2=function(){
        console.log("scale objectos");
        console.log(heightHoja);

        //Obtengo el total de hojas en el libro
        var TotalHojas=3;
        var LimiteHeight=heightHoja;

        //Busco elemento principal donde se insertaran las hojas
        //var contenedor = document.getElementById('contenedorLibro');
        var contenedor = document.querySelector("ion-scroll > div");
        for(i=1;i<=TotalHojas;i++){
            //Crea el div que contiene la pagina
            var paginaContenedor = document.createElement('div');
            paginaContenedor.id="page"+i;
            paginaContenedor.className ="page";
            paginaContenedor.style.width="350px";
            paginaContenedor.style.height=heightHoja + "px";
            contenedor.appendChild(paginaContenedor);

            /*var zoom=document.createElement('ion-scroll');
            zoom.id="zoom"+i;
            zoom.setAttribute("zooming", "true");
            zoom.setAttribute("direction", "x");
            zoom.setAttribute("min-zoom", "1");
            zoom.setAttribute("overflow-scroll", "false");
            zoom.style.width="100%";
            zoom.style.height="100%";
            paginaContenedor.appendChild(zoom);*/

            //Crea la pagina que se visualiza en el documento
            //paginaContenedor.insertAdjacentHTML("afterbegin",'<ion-scroll id="zoom'+i+'" zooming="true" direction="xy" min-zoom="1" overflow-scroll="false" style="width: 100%; height: 100%"></ion-scroll>');
            //var zoom = document.getElementById('zoom'+i);

            var pagina=document.createElement('div');
            pagina.className="page-inner";
            pagina.id="page-inner"+i;
            pagina.style.width="909px";
            pagina.style.height="1299px";
            paginaContenedor.appendChild(pagina);
            //pagina.style.transform="translateX(0px) translateY(0px) scale(0.384953233)";
            //zoom.appendChild(pagina);

            var Limite={
                Hoja     : i, 
                Superior : i==1 ? 0 : ((i * heightHoja) - heightHoja)+1 ,  
                Inferior : i * heightHoja
            };

            LimitesHojas.push(Limite);
            CargarPagina(i,pagina);
        }
        console.log(LimitesHojas);
        
    }

    $scope.BtnSeparador=function(){
        CargarPaginas().then(function(rsp){
            console.log("final de todo");
        });
    }
    $scope.DoubleTap=function(id){
        /*document.getElementById('zoom'+id).getElementsByClassName("scroll")[0].appendChild(document.getElementById('page-inner'+id));
        document.getElementById('zoom'+id).style.zIndex=0;*/
        /*var zoomHoja=document.getElementById('zoom');
        zoomHoja.getElementsByClassName("scroll")[0].appendChild(document.getElementById('page-inner'+id));
        document.getElementById('page'+id).appendChild(zoomHoja);
        document.getElementById('zoom').style.zIndex=0;

        $ionicScrollDelegate.$getByHandle('handlerZoom').zoomTo(1.32014,false,0,0);*/
        //$ionicScrollDelegate.zoomTo(1.32014,false,0,0);
        var position = $scope.getTouchposition(event,id);
        console.log(position);
        //document.getElementById('page-inner'+id).style.transform="translate3d("+position.x+"px,"+position.y+"px,0) scale(0.484953233)";
        //document.getElementById('page-inner'+id).style.transform="translateX("+position.x+"px) translateY("+position.y+"px) scale(0.484953233)";
        //transition: [property] [duration] [timing-function] [delay];
        if(TempZoom==false)
        {
            TempZoom=true;
            document.getElementById('contenedorLibro').style.transition="transform 0.5s";
            document.getElementById('contenedorLibro').style.transform="translateX(0px) translateY(0px) scale(1.75)";
        }
        else
        {
            TempZoom=false;
            document.getElementById('contenedorLibro').style.transform="translateX(0px) translateY(0px) scale(1)";
        }
    }
    //$scope.DoubleTap=function(id){        
    var DoubleTap2=function(){   
        var id=1;
        //if(document.getElementById("zoom"+id)==null){ //Content para zoom no exise
        if(TempZoom==false){
            TempZoom=true;
            console.log("activar zoom");
            //var page=document.getElementById('page'+id);

            var zoom=document.createElement('ion-scroll');
            zoom.id="zoom"+id;
            zoom.setAttribute("zooming", "true");
            zoom.setAttribute("direction", "xy");
            zoom.setAttribute("min-zoom", "1");
            zoom.setAttribute("overflow-scroll", "false");
            zoom.setAttribute("on-scroll","ScrollZoom("+id+")")
            zoom.setAttribute("delegate-handle","handler"+id)
            zoom.style.width="100%";
            zoom.style.height="100%";
            Pages[id-1].appendChild(zoom);
            //page.appendChild(zoom);

            //var pageinner=document.getElementById('page-inner'+id);
            PagesInner[id-1].removeAttribute("on-double-tap");
            zoom.appendChild(PagesInner[id-1]);
            MainZoom=zoom;

            $compile(zoom)($scope);

            //$ionicScrollDelegate.zoomTo(1.32014, false, 0, 0);
            //var position = $scope.getTouchposition(event,id);
            //$ionicScrollDelegate.$getByHandle('handler'+id).zoomTo(1.32014, true, position.x,position.y);
            //$ionicScrollDelegate.$getByHandle('handler'+id).zoomTo(1.32014, true, position.x,position.y);
            //$ionicScrollDelegate.zoomTo(1.32014, true, position.x,position.y);
            $ionicScrollDelegate.zoomTo(1.32014, true,0,0);
        }   
        else{
            TempZoom=false;
            //console.log(PagesInner[id-1]);
            //var page=document.getElementById('page'+id);
            //var pageinner=document.getElementById('page-inner'+id);
            //document.getElementById('page'+id).appendChild(document.getElementById('page-inner'+id));
            Pages[id-1].appendChild(PagesInner[id-1]);
            //document.getElementById("zoom"+id).style.display="none";
            //document.getElementById('page'+id).removeChild(document.getElementById("zoom"+id));
            Pages[id-1].removeChild(document.getElementById("zoom"+id))
            //Pages[id-1].removeChild(MainZoom);
            console.log("desactivar zoom");
            //$compile(document.getElementById('page-inner'+id))($scope);
        }
        $scope.$apply();
        //document.getElementById("zoom1").zooming="false";
        //document.getElementById("zoom1").setAttribute("max-zoom", "1");
        //document.getElementById("zoom1").getElementsByClassName("scroll")[0].style.transform="translate3d(0px, 0px, 0px) scale(1)";
        //$ionicScrollDelegate.zoomTo(1, false, 0, 0);
        //$ionicScrollDelegate.zoomTo(2, false, 0, 0);
        //document.getElementById("zoom1").setAttribute("overflow-scroll", "false");
        //document.getElementById("zoom1").zooming="false";
        //obj.setAttribute("overflow-scroll", "true");
        //document.getElementById("zoom1").setAttribute("overflow-scroll", "false");
        //obj.zooming="true";
        /*if($ionicScrollDelegate.$getByHandle(NombreObjeto).getScrollPosition().zoom==1)
            $ionicScrollDelegate.$getByHandle(NombreObjeto).zoomTo(2, false, 0, 0);
        else
            $ionicScrollDelegate.$getByHandle(NombreObjeto).zoomTo(1, false, 0, 0);*/
    }
    $scope.test=function(){
        //console.log($ionicScrollDelegate.getScrollPosition().top);
        /*var scroll=$ionicScrollDelegate.$getByHandle('handler').getScrollPosition();
        var posicion=(scroll.top)/scroll.zoom;
        var HojaIndex=-1;
        if(posicion-TempTopScroll > 0) //Se le dio para abajo con el dedo
        {
            HojaIndex=LimitesHojas.findIndex(x => x.Superior < posicion && x.Inferior > posicion);
        }
        else if(posicion-TempTopScroll < 0) //Se le dio para arriba con el dedo
        {
            var PosicionAlterada=posicion+100;
            HojaIndex=LimitesHojas.findIndex(x => x.Superior < PosicionAlterada && x.Inferior > PosicionAlterada);
           
        }
        if(HojaIndex==-1) return;
        $scope.Hojas.HojaActual="# "+LimitesHojas[HojaIndex].Hoja;
        $scope.Hojas.Hoja=LimitesHojas[HojaIndex].Hoja;

        $scope.$apply();
        TempTopScroll=posicion;*/
    }
    $scope.ScrollZoom=function(id){
        /*var scroll=$ionicScrollDelegate.$getByHandle('handler'+id).getScrollPosition();
        //Desactiva zoom
        if(scroll.zoom==1){
            console.log("desactivar ScrollZoom");
            document.getElementById('page'+id).appendChild(document.getElementById('page-inner'+id));
            document.getElementById('page'+id).removeChild(document.getElementById("zoom"+id));
        }*/
    }   
    $scope.BtnModal=function(estado){
        document.getElementById("modal1").style.display=estado;
        //document.getElementById("modal1").style.display= modo=="none" ? "inline" : "none";
    }
    $scope.getTouchposition = function(event,id){
        //console.log(event.gesture.touches[0].target);
        //var canvasPosition = getPosition(event.gesture.touches[0].target);
        var canvasPosition = getPosition( document.getElementById("pg"+id+"Overlay"));
        //var canvasPosition = getPosition( document.getElementById("page-inner1"));
        
        var tap = { x:0, y:0 };
                if(event.gesture.touches.length>0){
                tt = event.gesture.touches[0];
                tap.x = tt.clientX || tt.pageX || tt.screenX ||0;
                tap.y = tt.clientY || tt.pageY || tt.screenY ||0;  
                }
         tap.x = tap.x - canvasPosition.x;
         tap.y = tap.y - canvasPosition.y;
        
         return {x: tap.x, y: tap.y};
    }
    function getPosition(element) {
        var xPosition = 0;
        var yPosition = 0;
    
        while(element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
        return { x: xPosition, y: yPosition };
    }
    var mylatesttap;
    function doubletap() {

    var now = new Date().getTime();
    var timesince = now - mylatesttap;
    if((timesince < 600) && (timesince > 0)){
        DoubleTap();        

    }else{
                // too much time to be a doubletap
            }

    mylatesttap = new Date().getTime();

    }
});