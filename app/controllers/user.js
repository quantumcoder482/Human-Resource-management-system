var app = angular.module('App').controller('UserController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services) {
    if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
      $scope.Expire_Session();
    }

    $rootScope.pagetitle = 'Customers';
    var self = $scope;
    var root = $rootScope;
    self.loading = true;

    root.toolbar_menu = {
      title: 'Add Customer'
    }
    root.barAction = function (ev) {
      self.addCustomer(ev);
    }

    services.getCustomers().then(function (data) {
      self.cust = data.data;
      // if(self.cust){
      //   for(i=0;i<=self.cust.length-1;i++){
      //     self.cust.last_seen = new Date(self.cust.last_seen).toISOString();
      //   }
      // }
      // console.log(self.cust);

      $scope.numberOfPages = function () {
        return Math.ceil(self.cust.length / $scope.pageSize);
      }
      self.loading = false;
    });

    $scope.sort = function (keyname) {
      $scope.sortKey = keyname; //set the sortKey to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    self.deleteCustomer = function (ev, u) {
      var confirm = $mdDialog.confirm().title('Delete Confirmation')
        .content('Are you sure want to delete user : ' + u.name + ' ?')
        .targetEvent(ev)
        .ok('OK').cancel('CANCEL');

      $mdDialog.show(confirm).then(function () {
        services.deleteCustomer(u.id).then(function (res) {
          //console.log(JSON.stringify(res));
          if (res.status == 'success') {
            $mdToast.show($mdToast.simple().hideDelay(1000).content('Delete user ' + u.name + ' Success!').position('bottom right'))
              .then(function () {
                window.location.reload();
              });
          } else {
            $mdToast.show(
              $mdToast.simple().hideDelay(6000).action('CLOSE').content('Opps , Failed delete User ' + u.name).position('bottom right')
            ).then(function (response) {

            });
          }
        });
      }, function () {});
    };


    self.BanUser = function (ev, u) {
      var confirm = $mdDialog.confirm().title('Ban Confirmation')
        .content('Are you sure want to Ban user : ' + u.name + ' ?')
        .targetEvent(ev)
        .ok('OK').cancel('CANCEL');

      $mdDialog.show(confirm).then(function () {
        u.is_banned = 1;
        u.session_token = '';
        services.updateCustomer(u.id, u).then(function (resp) {

          if (resp.status == 'success') {
            $mdToast.show($mdToast.simple().hideDelay(1000).content('Ban user ' + u.name + ' Success!').position('bottom right'))

          } else {
            $mdToast.show(
              $mdToast.simple().hideDelay(6000).action('CLOSE').content('Opps , Failed to Ban User ' + u.name).position('bottom right')
            ).then(function (response) {

            });
          }
        });
      }, function () {});
    };


    self.ActivateUser = function (ev, u) {
      var confirm = $mdDialog.confirm().title('Activate Confirmation')
        .content('Are you sure want to Activate user : ' + u.name + ' ?')
        .targetEvent(ev)
        .ok('OK').cancel('CANCEL');

      $mdDialog.show(confirm).then(function () {
        u.is_banned = 0;
        u.session_token = '';
        services.updateCustomer(u.id, u).then(function (resp) {

          if (resp.status == 'success') {
            $mdToast.show($mdToast.simple().hideDelay(1000).content('Activate user ' + u.name + ' Success!').position('bottom right'))

          } else {
            $mdToast.show(
              $mdToast.simple().hideDelay(6000).action('CLOSE').content('Opps , Failed to Activate User ' + u.name).position('bottom right')
            ).then(function (response) {

            });
          }
        });
      }, function () {});
    };



    self.addCustomer = function (ev) {
      $mdDialog.show({
        controller: CustomerControllerDialog,
        templateUrl: 'templates/page/user/create.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        cust: null
      })
    };


    self.editCustomer = function (ev, u) {
      $mdDialog.show({
        controller: CustomerControllerDialog,
        templateUrl: 'templates/page/user/create.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        cust: u
      })
    };

  });


function CustomerControllerDialog($scope, $mdDialog, services, $mdToast, $route, cust) {
  var self = $scope;
  var original;
  var isNew = (cust == null) ? true : false;

  self.title = (isNew) ? 'Add Customer' : 'Edit Customer';
  self.buttonText = (isNew) ? 'SAVE' : 'UPDATE';

  if (isNew) {
    original = {
      name: null,
      contact: null,
      email: null,
      fcm: null,
      address: null,
      last_seen: null
    };
    self.cust = angular.copy(original);
  } else {
    original = cust;
    self.cust = angular.copy(original);
  }

  self.isClean = function () {
    return angular.equals(original, self.cust);
  }

  self.hide = function () {
    $mdDialog.hide();
  };

  self.cancel = function () {
    $mdDialog.cancel();
  };

  self.submit = function (u) {
    $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));

    if (isNew) {
      services.insertCustomer(u).then(function (resp) {
        self.afterSubmit(resp);
      });
    } else {
      services.updateCustomer(u.id, u).then(function (resp) {
        self.afterSubmit(resp);
      });
    }
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
}

app.filter('mysqlToJS', function () {
  return function (mysqlStr) {
    var t, result = null;
    if (typeof mysqlStr === 'string') {
      t = mysqlStr.split(/[- :]/);
      //when t[3], t[4] and t[5] are missing they defaults to zero
      result = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
    }
    return result;
  };
});