angular.module('App').controller('SettingController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services) {
    if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
      $scope.Expire_Session();
    }
    var vendor_id = $cookies.session_uid;

    var self = $scope;
    var root = $rootScope;

    root.toolbar_menu = null;
    var original;

    $rootScope.pagetitle = 'My Profile';

    services.getUsers(vendor_id).then(function (data) {
      self.userdata = data.data;
      self.userdata.password = '*****';
      original = angular.copy(self.userdata);
    });

    self.isClean = function () {
      return angular.equals(original, self.userdata);
    }

    self.isPasswordMatch = function () {
      if (self.re_password == null || self.re_password == '') {
        return true;
      } else {
        if (self.re_password == self.userdata.password) {
          return true;
        } else {
          return false;
        }
      }
    }

    self.submit = function (userdata) {

      $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
      services.updateUsers(vendor_id, self.userdata).then(function (resp) {
        if (resp.status == 'success') {
          // saving session
          $cookies.session_uid = resp.data.user.id;
          $cookies.session_name = resp.data.user.username;
          $cookies.session_email = resp.data.user.email;
        }
        self.afterSubmit(resp);
      });
    }

    self.afterSubmit = function (resp) {
      if (resp.status == 'success') {
        $mdToast.show($mdToast.simple().hideDelay(1000).content(resp.msg).position('bottom right'))
          .then(function () {
            window.location.reload();
          });
      } else {
        $mdToast.show($mdToast.simple().hideDelay(3000).content(resp.msg).position('bottom right'))
      }
    };

  });