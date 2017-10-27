// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var db = null;

var app=angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngResource','ngCordova'])

app.run(function($ionicPlatform,$cordovaSQLite,$rootScope,mislibros) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if(window.cordova) {
      // App syntax
      db = $cordovaSQLite.openDB({ name: "alfabooks.db", iosDatabaseLocation:'default'}); 
    }
    
    //$cordovaSQLite.execute(db, 'DROP TABLE IF EXISTS libros;');
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS libros (id integer primary key, nombre,ruta,width,height)');

    mislibros.all().then(function(libros){
      //Si el usuario no cuenta con ningun libro lo manda a la ventana de ingresar codigo
      if(libros.length==0)
        $rootScope.showTab=true; //Muestra la ventana de codigos
      else
        $rootScope.showTab=false;  //Muestra la venta de mis libros
        
    });

  });
});

app.config(function($stateProvider, $urlRouterProvider,$httpProvider,$ionicConfigProvider,$compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob):|data:image\/)/);
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
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
          templateUrl: 'templates/mislibros.html',
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
      url: '/categorias/:chatId',
      views: {
        'tab-categorias': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
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

