var app = angular.module('App').controller('ProfileEditController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services, $routeParams) {
    if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
      $scope.Expire_Session();
    }

    var self = $scope;
    var root = $rootScope;
    $rootScope.pagetitle = 'Edit Profile';
    var original;
    var vendor_id = $routeParams.id;
    
    self.loading = true;
    self.permission = [];
    // thisForm.username.$setValidity('validationError', false);

    services.getUsers(vendor_id).then(function (data) {
      self.userdata = data.data;
      self.permission = data.data.permission.split(",");
      self.permission.pop(-1);
      self.userdata.password = '*****';
      original = angular.copy(self.userdata);
    });

    self.isClean = function () {
      return angular.equals(original, self.userdata);
    }

    self.toggle = function(item,list){
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
      self.permission = list;
    }

    $scope.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };

    services.getAllPages().then(function(data){
      self.pages = data.data;
    });

    self.submit = function (user) {
      $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
      self.loader = true;
      user.permission = self.permission.join() +',';
      services.updateUsers(vendor_id,user).then(function (resp) {
        self.afterSubmit(resp);
      });
    };

    self.afterSubmit = function (resp) {
      if (resp.status == 'success') {
        $mdToast.show($mdToast.simple().hideDelay(1000).content(resp.msg).position('bottom right'))
          .then(function () {
            $mdDialog.hide();
            window.location.reload();
          });
      } else {
        $mdToast.show($mdToast.simple().hideDelay(3000).content(resp.msg).position('bottom right'))
      }
    };
  });