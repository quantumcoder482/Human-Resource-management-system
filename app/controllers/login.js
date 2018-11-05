angular.module('App').controller('LoginController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $route, services) {

    if ($cookies.session_uid != 'null' && $cookies.session_uid != null) {
      $rootScope.isLogin = false;
      window.location.href = '#home';
      $mdToast.show($mdToast.simple().content('Login Success').position('bottom right'));
      window.location.reload();
    }

    var self = $scope;
    var root = $rootScope;
    $rootScope.isLogin = true;
    root.toolbar_menu = null;
    $rootScope.pagetitle = 'Login';

    self.doLogin = function () {
      services.doLogin(self.userdata).then(function (result) {
        if (result.data != "") {
          // saving session
          $cookies.session_uid = result.data.id;
          $cookies.session_name = result.data.username;
          $cookies.session_email = result.data.email;
          $cookies.session_type = result.data.type;
          $cookies.session_permission = result.data.permission;
          $mdToast.show($mdToast.simple().content('Login Success').position('bottom right'));
          window.location.href = '#login';

        } else {
          $mdToast.show($mdToast.simple().content('Login Failed').position('bottom right'));
        }

      });
    };
  });