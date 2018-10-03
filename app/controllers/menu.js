angular.module('App').controller('MenuController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services) {
    if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
      $scope.Expire_Session();
    }

    var self = $scope;
    var root = $rootScope;
    root.toolbar_menu = null;
    var original;

    $rootScope.pagetitle = 'Make Menu';

    original = {
      items: [],
      quantity: [],
      item_names: [],
      bill_amount: 0,
      payable_amount: 0,
    };
    self.menu = angular.copy(original);
    self.menu.total_price=0.00;

    self.showCategory = true;
    self.showSubcate = false;
    self.showProduct = false;

    services.ActiveCategories().then(function (data) {
      self.active_categories = data.data;
      // alert(JSON.stringify(self.active_categories, null, 4));
    });

    self.ShowMyCategory = function () {
      self.showCategory = false;
      self.showSubcate = false;
      self.showProduct = false;

      services.ActiveCategories().then(function (data) {
        self.active_categories = data.data;
        self.showCategory = true;
      });
    };

    self.ShowSubcategory = function (category) {
      self.showCategory = false;
      self.showSubcate = false;
      self.showProduct = false;

      services.getSubcategory_by_cat(category).then(function (data) {
        self.active_categories = data.data;
        self.showSubcate = true;
      });
    };


    self.GetProductBySubcat = function (subcat) {
      self.showCategory = false;
      self.showSubcate = false;
      self.showProduct = false;

      services.getProduct_by_subcat(subcat).then(function (data) {
        self.active_categories = data.data;
        self.showProduct = true;
      });
    };


    self.GetProducts = function (keyword) {
      if (keyword.length <= 0) {
        self.products = "";
      } else {
        services.Get_Stock_Products_by_keyword(keyword).then(function (data) {
          self.products = data.data;
        });
      }
    };


    self.AddProduct = function (ev, p) {

      if (self.menu.items.indexOf(p.id) >= 0) {
        pid = self.menu.items.indexOf(p.id);
        self.menu.quantity[pid] = self.menu.quantity[pid] + 1; //myone
      } else {
        self.menu.items.push(p.id);
        self.menu.quantity.push(1); //myone
        self.menu.item_names.push(p.title);
      }

      services.ProductIngredientConsumption(p.id).then(function (data) {
        ingredients = data.data;
        product_price = 0;
        for (i of ingredients) {
          product_price += Number(i.price) * Number(i.consumption);
        }
        self.menu.total_price = Number(self.menu.total_price) + Number(product_price);
        self.menu.total_price = self.menu.total_price.toFixed(2);
        console.log(self.menu.total_price);

      });

      
      services.getOrderProduct(self.menu.items.join()).then(function (data) {
        self.particulars = data.data;
      });

      $mdToast.show($mdToast.simple().content(p.title + " -" + 1 + " Unit" + " " + "added in this menu").position('bottom right'));
    };

    self.RemoveProductcount = function (ev, p) {

      if (self.menu.items.indexOf(p.id) >= 0) {
        pid = self.menu.items.indexOf(p.id);
        self.menu.quantity[pid] = self.menu.quantity[pid] - 1; //myone

        services.ProductIngredientConsumption(p.id).then(function (data) {
          ingredients = data.data;
          product_price = 0;
          for (i of ingredients) {
            product_price += Number(i.price) * Number(i.consumption);
          }
          self.menu.total_price = Number(self.menu.total_price)-Number(product_price);
          self.menu.total_price = self.menu.total_price.toFixed(2);
          console.log(self.menu.total_price);

        });


        services.getOrderProduct(self.menu.items.join()).then(function (data) {
          self.particulars = data.data;

        });

        $mdToast.show($mdToast.simple().content(p.title + " -" + 1 + " Unit" + " " + "removed in this menu").position('bottom right'));
      }
    };

    self.RemoveProduct = function (ev, p) {

      pid = self.menu.items.indexOf(p.id);
      self.qnt = self.menu.quantity[pid];
      self.menu.items.splice(pid, 1);
      self.menu.quantity.splice(pid, 1);
      self.menu.item_names.splice(pid, 1);

      current_amount = self.prc * self.qnt;

      services.ProductIngredientConsumption(p.id).then(function (data) {
        ingredients = data.data;
        product_price = 0;
        for (i of ingredients) {
          product_price += Number(i.price) * Number(i.consumption);
        }
       self.menu.total_price = Number(self.menu.total_price) - Number(product_price) * self.qnt;
        self.menu.total_price = self.menu.total_price.toFixed(2);
        console.log(self.menu.total_price);

      });

      if (self.menu.items.join() == '') {
        self.particulars = '';
      } else {
        services.getOrderProduct(self.menu.items.join()).then(function (data) {
          self.particulars = data.data;
        });
      }
      $mdToast.show($mdToast.simple().content(p.title + " -" + self.qnt + " unit" + " " + "removed in this menu").position('bottom right'));
    };

    self.submit = function (b) {
      self.wait = true;
      $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
      console.log(b);
      b.items = b.items.join() + ',';
      b.quantity = b.quantity.join() + ',';
      b.item_names = b.item_names.join(',%,%') + ',%,%';

      services.insertMenu(b).then(function (resp) { 
        //console.log(resp);
        if (resp.status == "success") {
          self.afterSubmit(resp);
        }

        //services.generateInvoice(resp.data);

      });

    }

    self.afterSubmit = function (resp) {
      if (resp.status == "success") {
        $mdToast.show($mdToast.simple().hideDelay(1000).content(resp.msg).position('bottom right'))
          .then(function () {

            window.location.reload();

          });
      } else {
        $mdToast.show($mdToast.simple().hideDelay(3000).content(resp.msg).position('bottom right'))
      }
    };
  });