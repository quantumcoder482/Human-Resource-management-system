var app = angular.module('App').controller('UserPayController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services) {
    if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
      $scope.Expire_Session();
    }

    $rootScope.pagetitle = 'Customers Payment';
    var self = $scope;
    var root = $rootScope;
    self.loading = true;
    root.toolbar_menu = null;

    //root.toolbar_menu = { title: 'Add Customer Payment' } 
    //root.barAction =  function(ev) {
    //self.addCustomerPay(ev);
    //}

    services.getCustomerOrders().then(function (data) {
      console.log(data.data);
      for (var i = 0; i < data.data.length; i++) {
        data.data[i].customer_amount = data.data[i].customer_amount == 0 ? '' : data.data[i].customer_amount;
      }
      self.customerorder = data.data;
      $scope.numberOfPages = function () {
        return Math.ceil(self.customerorder.length / $scope.pageSize);
      }
      self.loading = false;
    });

    $scope.sort = function (keyname) {
      $scope.sortKey = keyname; //set the sortKey to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
    self.Updatetotalpaid = function (ev, c) {
      console.log(c);
      if (!c.totalpaid)
        services.Updatetotalpaid_order(c.id, 1).then(function (data) {
          console.log(data.data);
          c.totalpaid = 1;
          c.customer_amount = '';
          c.dispute = 0;
        });
    }
    self.Updatedispute = function (ev, c) {
      console.log(c);
      if (!c.totalpaid)
        services.Updatedispute_order(c.id, 1).then(function (data) {
          console.log(data.data);
          c.dispute = 1;
        });
    }

    self.addCustomerPay = function (ev) {
      $mdDialog.show({
        controller: CustomerPayControllerDialog,
        templateUrl: 'templates/page/user/create_pay.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        cust: null
      })
    };


    self.editCustomerPay = function (ev, u) {
      $mdDialog.show({
        controller: CustomerPayControllerDialog,
        templateUrl: 'templates/page/user/create_pay.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        cust: u
      })
    };
  });


function CustomerPayControllerDialog($scope, $mdDialog, services, $mdToast, $route, cust) {
  var self = $scope;
  var original;
  var isNew = (cust == null) ? true : false;

  self.title = (isNew) ? 'Add Customer Payment' : 'Edit Customer Payment';
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
      services.insertCustomerPay(u).then(function (resp) {
        self.afterSubmit(resp);
      });
    } else {
      services.updateCustomerPay(u.id, u).then(function (resp) {
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