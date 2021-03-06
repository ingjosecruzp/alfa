// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var db = null;

var app=angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngResource','ngCordova','ngProgressbar','angular-svg-round-progressbar','ion-floating-menu'])

app.run(function($ionicPlatform,$cordovaSQLite,$rootScope,mislibros,movimientos) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.overlaysWebView(false);
    }
    console.log("linea 25 if window.cordova") ;
    if(window.cordova) {
      // App syntax
      db = $cordovaSQLite.openDB({ name: "alfabooks.db", iosDatabaseLocation:'default'}); 
      console.log("linea 25 if window.cordova") ;
    }
 
    //Condición para tamaño de fuentes en tablet
    if(window.isTablet){
      console.log("Es tablet");
      $rootScope.fuente = 1.5;
      $rootScope.fuenteCategoria = 30;
    } else {
      console.log("Es telefono");
        $rootScope.fuente = 1;
        $rootScope.fuenteCategoria = 20;
    }
    
    //$cordovaSQLite.execute(db, 'DROP TABLE IF EXISTS libros;');
    //$cordovaSQLite.execute(db, 'DROP TABLE IF EXISTS movimientos;');
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS libros (id PRIMARY KEY,nombre,ruta,width,height,codigo,descargado DEFAULT "NO",pathlibro,version)');
    $cordovaSQLite.execute(db,"CREATE TABLE  IF NOT EXISTS movimientos (id INTEGER PRIMARY KEY AUTOINCREMENT,codigo VARCHAR (40) NOT NULL,entrada INTEGER,salida INTEGER);")

    //variable para la notificacion del tab 4 tipoglobe
    movimientos.SaldoLibros().then(function(saldo){
        $rootScope.notificacionglobo=saldo.Total==null ? "0" :saldo.Total;
    });

    mislibros.all().then(function(libros){
      //Si el usuario no cuenta con ningun libro lo manda a la ventana de ingresar codigo
      console.log("numero del libros="+ libros.length)
      if(libros.length==0)
        $rootScope.showTab=true; //Muestra la ventana de codigos
      else
        $rootScope.showTab=false;  //Muestra la venta de mis libros
        
    });

    movimientos.all().then(function(mov){
      //Si el usuario no cuenta con ningun libro lo manda a la ventana de ingresar codigo
      console.log(mov)
    });

    //Obtiene el uuid
    window.plugins.uniqueDeviceID.get(function(uuid){
      $rootScope.uuid=uuid;
    },function(error){
      console.log(error);
    });

    //Este metodo siempre debe de ir al final de todo
    if (device.platform == "iOS") {
      console.log("platform: " +device.platform) ;
      ionic.Platform.fullScreen();
      if (window.StatusBar) {
        return StatusBar.hide();
      }
    }

  });
});

app.config(function($stateProvider, $urlRouterProvider,$httpProvider,$ionicConfigProvider,$compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob):|data:image\/)/);
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  
  //$ionicConfigProvider.scrolling.jsScrolling(false);

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabsController'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/home.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.codigo', {
      url: '/codigo',
      
      views: {
        'tab-Codigo': {
          templateUrl: 'templates/codigo.html',
          controller: 'CodigoController'
        }
      }
    })
    .state('tab.mislibros', {
      url: '/mislibros',
      
      views: {
        'tab-misLibros': {
          templateUrl: 'templates/misLibros.html',
          controller: 'MisLibrosController'
        }
      }
    })
    .state('tab.categorias', {
      url: '/categorias',
      views: {
        'tab-categorias': {
          templateUrl: 'templates/categorias.html',
          controller: 'CategoriasController'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/categorias/:IdCategoria',
      views: {
        'tab-categorias': {
          templateUrl: 'templates/comprarLibrosCategorias.html',
          controller: 'ComprarLibrosController'
        }
      }
    })
    .state('tab.comprarLibrosBuscar', {
      url: '/categorias/:LibroaBuscar',
      views: {
        'tab-categorias': {
          templateUrl: 'templates/comprarLibrosBuscar.html',
          controller: 'ComprarLibrosController'
        }
      }
    })
    .state('tab.comprarLibrosVistaModal', {
      url: '/categorias/VistaModal',
      cache: false,
      views: {
        'tab-VistaModal': {
          templateUrl: 'templates/comprarLibrosVistaModal.html',
          controller: 'ComprarLibrosController'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/ingresarCodigos.html',
        controller: 'IngresarCodigosController'
      }
    }
  })
  
  .state('visor', {
    url: '/visor',
    templateUrl: 'templates/Visor.html',
    controller: 'VisorController'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

  //Obliga a que los tabs siempre salgan en la parte inferior
  $ionicConfigProvider.tabs.position('bottom');

});
//Modifica la referencia cirulares de las peticiones entrantes
app.factory('resourceInterceptor', function(Servicios) {
  return {
    response: function(response) {
      response.data=Servicios.parseAndResolve(JSON.stringify(response.data));
      return response;
    }
  }
});
app.service('Servicios', function() {
  this.parseAndResolve=function(json) {
        var refMap = {};
            return JSON.parse(json, function (key, value) {
                if (key === '$id') { 
                    refMap[value] = this;
                    // return undefined so that the property is deleted
                    return void(0);
                }

                if (value && value.$ref) { return refMap[value.$ref]; }

                return value; 
            });
    };
});
 //Directiva para usar el boton cerrar y go del celular
 app.directive('ngEnter', function() {
  return function(scope, element, attrs) {
      element.bind("keydown keypress", function(event) {
          if(event.which === 13) {
                  scope.$apply(function(){
                          scope.$eval(attrs.ngEnter);
                  });
                  
                  event.preventDefault();
          }
      });
  };
});

app .directive('fabMenu', function($timeout, $ionicGesture) {
  var options = {
      baseAngle: 270,
      rotationAngle: 30,
      distance: 112,
      animateInOut: 'all', // can be slide, rotate, all
    },
    buttons = [],
    buttonContainers = [],
    buttonsContainer = null,
    lastDragTime = 0,
    currentX = 0,
    currentY = 0,
    previousSpeed     = 15,

    init = function() {

      buttons = document.getElementsByClassName('fab-menu-button-item');
      buttonContainers = document.querySelectorAll('.fab-menu-items > li');
      buttonsContainer = document.getElementsByClassName('fab-menu-items');

      for (var i = 0; i < buttonContainers.length; i++) {

        var button = buttonContainers.item(i);
        var angle = (options.baseAngle + (options.rotationAngle * i));
        button.style.transform = "rotate(" + options.baseAngle + "deg) translate(0px) rotate(-" + options.baseAngle + "deg) scale(0)";
        button.style.WebkitTransform = "rotate(" + options.baseAngle + "deg) translate(0px) rotate(-" + options.baseAngle + "deg) scale(0)";
        button.setAttribute('angle', '' + angle);
      }
    },

    animateButtonsIn = function() {
      for (var i = 0; i < buttonContainers.length; i++) {

        var button = buttonContainers.item(i);
        var angle = button.getAttribute('angle');
        button.style.transform = "rotate(" + angle + "deg) translate(" + options.distance + "px) rotate(-" + angle + "deg) scale(1)";
        button.style.WebkitTransform = "rotate(" + angle + "deg) translate(" + options.distance + "px) rotate(-" + angle + "deg) scale(1)";
      }
    },
    animateButtonsOut = function() {
      for (var i = 0; i < buttonContainers.length; i++) {

        var button = buttonContainers.item(i);
        var angle = (options.baseAngle + (options.rotationAngle * i));
        button.setAttribute('angle', '' + angle);
        button.style.transform = "rotate(" + options.baseAngle + "deg) translate(0px) rotate(-" + options.baseAngle + "deg) scale(0)";
        button.style.WebkitTransform = "rotate(" + options.baseAngle + "deg) translate(0px) rotate(-" + options.baseAngle + "deg) scale(0)";
      }
    },

    rotateButtons = function(direction, speed) {

      // still looking for a better solution to handle the rotation speed
      // the direction will be used to define the angle calculation

      // max speed value is 25 // can change this :)
      // used previousSpeed to reduce the speed diff on each tick
      speed = (speed > 15) ? 15 : speed;
      speed = (speed + previousSpeed) / 2;
      previousSpeed = speed; 
      
      var moveAngle = (direction * speed);

      // if first item is on top right or last item on bottom left, move no more
      if ((parseInt(buttonContainers.item(0).getAttribute('angle')) + moveAngle >= 285 && direction > 0) ||
        (parseInt(buttonContainers.item(buttonContainers.length - 1).getAttribute('angle')) + moveAngle <= 345 && direction < 0)
      ) {
        return;
      }

      for (var i = 0; i < buttonContainers.length; i++) {

        var button = buttonContainers.item(i),
          angle = parseInt(button.getAttribute('angle'));

        angle = angle + moveAngle;

        button.setAttribute('angle', '' + angle);

        button.style.transform = "rotate(" + angle + "deg) translate(" + options.distance + "px) rotate(-" + angle + "deg) scale(1)";
        button.style.WebkitTransform = "rotate(" + angle + "deg) translate(" + options.distance + "px) rotate(-" + angle + "deg) scale(1)";
      }
    },

    endRotateButtons = function() {

      for (var i = 0; i < buttonContainers.length; i++) {

        var button = buttonContainers.item(i),
          angle = parseInt(button.getAttribute('angle')),
          diff = angle % options.rotationAngle;
        // Round the angle to realign the elements after rotation ends
        angle = diff > options.rotationAngle / 2 ? angle + options.rotationAngle - diff : angle - diff;

        button.setAttribute('angle', '' + angle);

        button.style.transform = "rotate(" + angle + "deg) translate(" + options.distance + "px) rotate(-" + angle + "deg) scale(1)";
        button.style.WebkitTransform = "rotate(" + angle + "deg) translate(" + options.distance + "px) rotate(-" + angle + "deg) scale(1)";
      }
    };

  return {
    templateUrl: "templates/fab-menu.html",
    link: function(scope) {
      console.info("fab-menu :: link");

      init();

      scope.fabMenu = {
        active: false
      };

      var menuItems = angular.element(buttonsContainer);

      $ionicGesture.on('touch', function(event) {

        console.log('drag starts', event);
        lastDragTime = 0;
        currentX = event.gesture.deltaX;
        currentY = event.gesture.deltaY;
        previousSpeed = 0;

      }, menuItems)

      $ionicGesture.on('release', function(event) {
        console.log('drag ends');
        endRotateButtons();
      }, menuItems);

      $ionicGesture.on('drag', function(event) {

        if (event.gesture.timeStamp - lastDragTime > 100) {

          var direction = 1,
            deltaX = event.gesture.deltaX - currentX,
            deltaY = event.gesture.deltaY - currentY,
            delta = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

          if ((deltaX <= 0 && deltaY <= 0) || (deltaX <= 0 && Math.abs(deltaX) > Math.abs(deltaY))) {
            direction = -1;
          } else if ((deltaX >= 0 && deltaY >= 0) || (deltaY <= 0 && Math.abs(deltaX) < Math.abs(deltaY))) {
            direction = 1;
          }

          rotateButtons(direction, delta);

          lastDragTime = event.gesture.timeStamp;
          currentX = event.gesture.deltaX;
          currentY = event.gesture.deltaY;
        }
      }, menuItems);

      scope.fabMenuToggle = function() {

        if (scope.fabMenu.active) { // Close Menu
          animateButtonsOut();
        } else { // Open Menu
          animateButtonsIn();
        }
        scope.fabMenu.active = !scope.fabMenu.active;
      }

    }
  }
});

//Variables Globales
app.value('Variables',{
  IpServidor: '200.52.220.238:8082'
  //IpServidor: '172.16.5.78:8080'
  //IpServidor: '192.168.0.6:8080'
});

