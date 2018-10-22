var app = angular.module('App').controller('EmployeeAddController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services, $routeParams) {
    if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
      $scope.Expire_Session();
    }

    var self = $scope;
    var root = $rootScope;
    self.loading = true;

    self.add = $routeParams.add;
    $rootScope.pagetitle = 'Add Employee Catagory';

    services.getEmployee_position().then(function (data) {
      //console.log(data.data);
      self.position = data.data;
      self.loading = false;
    });

    self.submit = function (s) {
      $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
      self.loader = true;

      //alert(JSON.stringify(s, null, 4));
      services.insertEmployee(s).then(function (resp) {
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