var app = angular.module('App').controller('StockhistoryController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services) {
    if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
      $scope.Expire_Session();
    }

    var self = $scope;
    var root = $rootScope;
    self.loading = true;

    $rootScope.pagetitle = 'Stock';

    root.toolbar_menu = {
      title: 'Add Stock'
    }
    root.barAction = function (ev) {
      self.addStock(ev);
    }

    services.getIngredientmyoneStockHistory().then(function (data) {
      var stock = data.data;
      console.log(data.data);

      services.getIdealStockHistory().then(function (data) {
        var total_order = [];
        var ingredient_ideal;
        for (var i = 0; i < data.data.length; i++) {
          var id_list = data.data[i].product_id.slice(0, -1);
          var amount_list = data.data[i].quantity.slice(0, -1);

          var spilt_id_list = id_list.split(',');
          var spilt_amount_list = amount_list.split(',');

          for (var j = 0; j < spilt_id_list.length; j++) {
            total_order.push([parseInt(spilt_id_list[j]), parseInt(spilt_amount_list[j])]);
          }
        }
        services.getconsumption().then(function (data) {
          var consum = data.data;
          ingredient_ideal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          for (var i = 0; i < total_order.length; i++) {
            for (var j = 0; j < consum.length; j++) {

              if (total_order[i][0] == Number(consum[j].product)) {
                ingredient_ideal[consum[j].ingredient] += Number(consum[j].consumption) * total_order[i][1];
              }

            }
          }
          for (var i = 0; i < stock.length; i++) {
            stock[i].ideal = ingredient_ideal[i + 1];
          }
        });
      });
      console.log(stock);
      self.stocks = stock;
      self.loading = false;
      $rootScope.pagetitle = 'Stock History';
    });



    $scope.numberOfPages = function () {
      return Math.ceil(self.stocks.length / $scope.pageSize);
    }

    $scope.sort = function (keyname) {
      $scope.sortKey = keyname; //set the sortKey to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }


    self.addStock = function (ev) {
      $mdDialog.show({
        controller: StockControllerDialog,
        templateUrl: 'templates/page/stock/create.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        stock: null
      })
    };

    self.editStock = function (ev, s) {
      $mdDialog.show({
        controller: StockControllerDialog,
        templateUrl: 'templates/page/stock/create.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        stock: s
      })
    };

    self.EndofDay = function (b) {
      var check = confirm("Would you finish today pos?");
      var update_count = 0;
      b.forEach(function (element) {
        //console.log(element);
        if (element.hasOwnProperty('deliver') || element.hasOwnProperty('ending')) {
          update_count++;
        }
      });
      if (update_count > 0) {
        self.wait = true;
        $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));

        services.insertStockhistory(b).then(function (resp) {
          self.afterSubmit(resp);
          services.generateInvoice(resp.data);
        });
      } else {
        $mdToast.show($mdToast.simple().content("Nothing updated.").position('bottom right'));
      }
      if (check) {
        services.updateopening().then(function (data) {
          $mdToast.show($mdToast.simple().hideDelay(1000).content("Opening updated successfully").position('bottom right'));
        });
      }
    };
    self.submit = function (b) {
      var update_count = 0;
      b.forEach(function (element) {
        //console.log(element);
        if (element.hasOwnProperty('deliver') || element.hasOwnProperty('ending')) {
          update_count++;
        }
      });
      if (update_count > 0) {
        self.wait = true;
        $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));

        services.insertStockhistory(b).then(function (resp) {

          self.afterSubmit(resp);

          services.generateInvoice(resp.data);

        });
      } else {
        $mdToast.show($mdToast.simple().content("Nothing updated.").position('bottom right'));
      }
    }
    self.afterSubmit = function (resp) {
      if (resp.status == 'success') {
        $mdToast.show($mdToast.simple().hideDelay(1000).content(resp.msg).position('bottom right'))
          .then(function () {
            $mdDialog.hide();
            window.location.reload();
          });
      } else {
        $mdToast.show($mdToast.simple().hideDelay(3000).content('Failed.').position('bottom right'))
          .then(function () {
            $mdDialog.hide();
            window.location.reload();
          });
      }
    };
  });

function StockControllerDialog($scope, $mdDialog, services, $mdToast, $route, stock) {
  var self = $scope;
  var isNew = (stock == null) ? true : false;
  var original;

  self.title = (isNew) ? 'Add Stock' : 'Edit Stock';
  self.buttonText = (isNew) ? 'SAVE' : '';

  if (isNew) {
    original = {
      ingridient: null,
      quantity: 1,
      stock_previous: 0,
      remarks: null
    };
    self.stock = angular.copy(original);

  } else {
    original = stock;
    self.stock = angular.copy(original);
  }

  services.getIngredients().then(function (data) {
    self.ingredients = data.data;
    //  alert(JSON.stringify(data, null, 4));
  });

  $scope.GetIngredientStock = function (id) {
    services.getIngredientsByID(id).then(function (data) {
      myingredient = data.data;
      self.stock.stock_previous = myingredient[0].stock;
    });
  }

  self.isClean = function () {
    return angular.equals(original, self.stock);
  }

  self.hide = function () {
    $mdDialog.hide();
  };

  self.cancel = function () {
    $mdDialog.cancel();
  };

  self.submit = function (s) {
    $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
    self.loader = true;
    console.log(s);
    if (isNew) {
      services.insertStock(s).then(function (resp) {
        if (resp.status == 'success') {

          services.getIngredientsByID(resp.data.ingredient).then(function (data) {
            ingredient = data.data;
            ingredient[0].stock = ingredient[0].stock + resp.data.quantity + resp.data.stock_actual - resp.data.stock_previous;
            //alert(JSON.stringify(ingredient[0].stock, null, 4));

            services.updateIngredient(ingredient[0].id, ingredient[0]).then(function (resp1) {

              if (resp1.status == 'success') {

                self.afterSubmit(resp);
              } else {
                $mdToast.show($mdToast.simple().content("some error occured...").position('bottom right'));
              }
            });
          });

        } else {

          $mdToast.show($mdToast.simple().content("some error occured...").position('bottom right'));
        }
        //self.afterSubmit(resp);
      });
    } else {
      services.updateStock(s.id, s).then(function (resp) {
        //self.afterSubmit(resp);
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