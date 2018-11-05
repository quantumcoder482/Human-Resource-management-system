angular.module('App').controller('CalingredientController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services) {
    if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
      $scope.Expire_Session();
    }

    var self = $scope;
    var root = $rootScope;
    var newUser = false;
    root.toolbar_menu = null;
    var original;
    self.guestnumber = 1;
    self.reduce_percent = 0;

    $rootScope.pagetitle = 'Calculate Ingredient';

    original = {
      items: [],
      quantity: [],
      prices: [],
      item_names: [],
      cgst: [],
      sgst: [],
      user_id: 0,
      contact_name: null,
      contact_number: null,
      contact_address: null,
      bill_amount: 0,
      payable_amount: 0,
      customer_amount: null,
      order_cgst: 0,
      order_sgst: 0,
      order_comment: null,
      discount: 0,
      type: 0,
      gst_price: []
    };

    self.build = angular.copy(original);
    self.product_price = [];


    // Calculate products price
    // services.getProducts().then(function (data) {
    // 	products = data.data;
    // 	console.log(products);
    // 	for (p of products) {
    // 		services.ProductIngredientConsumption(p.id).then(function (data) {
    // 			ingredients = data.data;
    // 			product_price = 0.00;
    // 			for (i of ingredients) {
    // 				product_price = Number(product_price) + Number(i.price) * Number(i.consumption);
    // 			}
    // 			product_price = Number(product_price).toFixed(2);
    // 			p.price = product_price;

    // 			// self.product_price[p.id] = self.product_price[p.id]+Number(product_price);
    // 			// if (Number(p.id) === 1){console.log(self.product_price[p.id]);}
    // 		});
    // 	}
    // });

    self.b1g1 = true;
    self.showCategory = true;
    self.showSubcate = false;
    self.showProduct = false;

    services.ActiveCategories().then(function (data) {
      self.active_categories = data.data;
    });

    self.ShowMyCategory = function () {
      self.showCategory = true;
      self.showSubcate = false;
      self.showProduct = false;

      services.ActiveCategories().then(function (data) {
        self.active_categories = data.data;


      });
    };

    self.addUser = function ($event) {
      self.newUser = true;
    }

    self.ShowSubcategory = function (category) {
      self.showCategory = false;
      self.showSubcate = true;
      self.showProduct = false;

      services.getSubcategory_by_cat(category).then(function (data) {
        self.active_categories = data.data;


      });
    };

    self.myfilter = function (item) {
      return item.price > 0;
    };

    self.GetProductBySubcat = function (subcat) {
      self.showCategory = false;
      self.showSubcate = false;
      self.showProduct = true;

      services.getProduct_by_subcat(subcat).then(function (data) {
        self.active_categories = data.data;

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


    services.getIngredients().then(function (data) {
      self.ingredients = data.data;
      for (i = 0; i < self.ingredients.length; i++) {
        self.ingredients[i].consumption = 0;
      }
      self.loading = false;
    });


    self.AddProduct = function (ev, p) {

      self.price_f = 0; // add or push price flag, 1: add  0:push

      if (self.build.items.indexOf(p.id) >= 0) {
        pid = self.build.items.indexOf(p.id);
        self.build.quantity[pid] = self.build.quantity[pid] + 1; //myone
        self.price_f = 1;
      } else {
        self.build.items.push(p.id);
        self.build.quantity.push(1); //myone
        self.build.item_names.push(p.title);
      }

      // Calculate product price
      services.ProductIngredientConsumption(p.id).then(function (data) {
        ingredients = data.data;
        product_price = 0.00;
        for (i of ingredients) {
          product_price = Number(product_price) + Number(i.price) * Number(i.consumption);
        }
        product_price = Number(product_price).toFixed(2);
        if (self.price_f) {
          pid = self.build.items.indexOf(p.id);
          self.build.prices[pid] = self.build.prices[pid] + Number(product_price);
        } else {
          self.build.prices.push(Math.round(product_price));
        }

      });

      // Calculate consumption
      services.getconsumptionByproduct(p.id).then(function (data) {
        if (data.data == '') alert("Not defined consumption of product");
        var result = self.ingredients;
        for (var i = 0; i < data.data.length; i++) {
          var kid = find_array_id(result, 'id', data.data[i].ingredient);
          if (kid > -1) {
            result[kid].consumption = Number(result[kid].consumption);
            result[kid].consumption += Number(data.data[i].consumption);
          }
        }
        self.ingredients = result;
      });

      services.getOrderProduct(self.build.items.join()).then(function (data) {
        self.particulars = data.data;
      });

      $mdToast.show($mdToast.simple().content(p.title + " -" + 1 + " Unit" + " " + "added").position('bottom right'));
    };

    self.RemoveProductcount = function (ev, p) {

      if (self.build.items.indexOf(p.id) >= 0) {
        pid = self.build.items.indexOf(p.id);
        self.build.quantity[pid] = self.build.quantity[pid] - 1; //myone

        services.getOrderProduct(self.build.items.join()).then(function (data) {
          self.particulars = data.data;

          services.ProductIngredientConsumption(p.id).then(function (data) {
            ingredients = data.data;
            product_price = 0.00;
            for (i of ingredients) {
              product_price = Number(product_price) + Number(i.price) * Number(i.consumption);
            }
            product_price = Number(product_price).toFixed(2);

            self.build.prices[pid] = self.build.prices[pid] - Number(product_price);

          });

        });

        services.getconsumptionByproduct(p.id).then(function (data) {
          if (data.data == '') alert("Not defined consumption of product");
          var result = self.ingredients;
          for (var i = 0; i < data.data.length; i++) {
            var kid = find_array_id(result, 'id', data.data[i].ingredient);
            if (kid > -1) {
              result[kid].consumption = Number(result[kid].consumption);
              result[kid].consumption -= Number(data.data[i].consumption);
            }
          }
          self.ingredients = result;
        });

        $mdToast.show($mdToast.simple().content(p.title + " -" + 1 + " Unit" + " " + "removed").position('bottom right'));
      }
    };

    self.RemoveProduct = function (ev, p) {


      pid = self.build.items.indexOf(p.id);

      self.qnt = self.build.quantity[pid];
      self.prc = self.build.prices[pid];
      
      self.build.items.splice(pid, 1);
      self.build.quantity.splice(pid, 1);
      self.build.prices.splice(pid, 1);
      self.build.item_names.splice(pid, 1);
      

      if (self.build.items.join() == '') {
        self.particulars = '';
      } else {
        services.getOrderProduct(self.build.items.join()).then(function (data) {
          self.particulars = data.data;
        });
      }

      services.getconsumptionByproduct(p.id).then(function (data) {
        if (data.data == '') alert("Not defined consumption of product");
        var result = self.ingredients;
        for (var i = 0; i < data.data.length; i++) {
          var kid = find_array_id(result, 'id', data.data[i].ingredient);
          if (kid > -1) {
            result[kid].consumption = Number(result[kid].consumption);
            result[kid].consumption -= Number(data.data[i].consumption) * self.qnt;
          }
        }
        self.ingredients = result;
      });

      $mdToast.show($mdToast.simple().content(p.title + " -" + self.qnt + " Unit" + " " + "Removed").position('bottom right'));
    };

    services.getCustomers().then(function (data) {
      self.cust = data.data;
      self.loading = false;
      //console.log(JSON.stringify(self.cust));
    });

    self.refresh = function () {
      window.location.reload();
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

function find_array_id(array, key, value) {
  for (var j = 0; j < array.length; j++) {
    if (array[j][key] == value) return j;
  }
  return -1;
}