angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$cordovaToast, Variables) {
  $scope.CambioIp= function(){
    if(Variables.IpServidor=='192.168.0.103:8080'){
        Variables.IpServidor = '200.52.220.238:8091';           
    }
    else{
        Variables.IpServidor = '192.168.0.103:8080';
    }
    $cordovaToast.show("Cambio de ip a:"+Variables.IpServidor, 'long', 'center');
  }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
