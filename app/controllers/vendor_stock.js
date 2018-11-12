var app = angular.module('App').controller('VendorStockController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services) {
    if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
      $scope.Expire_Session();
    }

    $rootScope.pagetitle = 'Vendor Stock Updation';
    var self = $scope;
    var root = $rootScope;
    self.loading = true;
    root.toolbar_menu = null;

    // initialize
    self.vendorStockHistories = [];
    self.search_data = [];

    services.getIngredients().then(function (data) {
      self.ingredients = data.data;
      self.loading = false;
    });

    services.getVendors().then(function (data) {
      self.vendors = data.data;
    });

    services.getVendorStockHistory().then(function (data) {
      self.vendorStockHistories = data.data;
      self.search_data = data.data;
    });

    $scope.numberOfPages = function () {
      return Math.ceil(self.vendorStockHistories.length / $scope.pageSize);
    }

    $scope.sort = function (keyname) {
      $scope.sortKey = keyname; //set the sortKey to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    self.getSearchResult = function (data) {
      // self.loader = true;
      data.start_date = data.start_date.split('-').reverse().join('-');
      data.end_date = data.end_date.split('-').reverse().join('-');

      var start_date = data.start_date ? new Date(data.start_date).getTime() - 43200000 : new Date('1970-01-01').getTime();
      var end_date = data.end_date ? new Date(data.end_date).getTime() + 43200000 : new Date('2900-01-01').getTime();
      // console.log(start_date);
      // console.log(end_date);
      self.vendorStockHistories = self.search_data.filter((f_data) => {
        if (new Date(f_data.datetime).getTime() >= start_date && new Date(f_data.datetime).getTime() <= end_date) {
          return true;
        }
      });

      data.start_date = data.start_date.split('-').reverse().join('-');
      data.end_date = data.end_date.split('-').reverse().join('-');

    }
    self.Update = function (data) {
      self.loader = true;
      $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
      data.type = "Addition";
   
      services.insertStock(data).then(function (resp) {
        console.log(resp);
        // ingredient add
        services.getIngredientsByID(data.ingredient).then(function (resp) {
          current_ingredient = resp.data;
          current_ingredient[0].stock = Number(current_ingredient[0].stock) + Number(data.quantity);
          services.updateIngredient(data.ingredient, current_ingredient[0]).then(function (resp) {
            self.afterSubmit(resp);
          });
        });
      });

    }

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