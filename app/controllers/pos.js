angular.module('App').controller('PosController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services) {
    if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
      $scope.Expire_Session();
    }

    var self = $scope;
    var root = $rootScope;
    var newUser = false;
    root.toolbar_menu = null;
    var original;
    self.stitle = 'Customer Amount';

    $rootScope.pagetitle = 'Build Order';
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
      type: 1,
      gst_price: [],
      totalpaid: 1,
      dispute: 0
    };
    self.build = angular.copy(original);
    self.b1g1 = true;
    self.showCategory = true;
    self.showSubcate = false;
    self.showProduct = false;

    services.ActiveCategories().then(function (data) {
      self.active_categories = data.data;
      // alert(JSON.stringify(self.active_categories, null, 4));
    });

    services.getMenulist().then(function (data) {
      console.log(data.data);

      var list = [];
      for (var i = 0; i < data.data.length; i++) {
        var item = data.data[i].item_names.split(",%,%");
        var quan = data.data[i].quantity.split(",");
        var info = '';
        for (var j = 0; j < quan.length - 1; j++) {
          info += item[j] + ':' + quan[j] + ', ';
        }
        list.push({
          id: data.data[i].id,
          name: data.data[i].name,
          info: info,
          price: data.data[i].payable_amount,
          item_ids: data.data[i].items,
          item_counts: data.data[i].quantity
        });
        info = '';
      }
      self.menulist = list;
      self.loading = false;

      $scope.numberOfPages = function () {
        return Math.ceil(self.menulist.length / $scope.pageSize);
      }

    });

    $scope.sort_menu = function (keyname) {
      $scope.sortKey = keyname; //set the sortKey to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    self.AddMenuToBooking = function (ev, j) {
      //console.log(j);
      services.getOrderProduct(j.item_ids.replace(/,\s*$/, "")).then(function (data) {
        products = data.data;
        var item_counts = j.item_counts.split(",");
        for (var i = 0; i < products.length; i++) {
          for (var t = 0; t < Number(item_counts[i]); t++) {
            self.AddProduct('', products[i]);
          }
        }
        //console.log(products);
      });
    }

    self.ShowMyCategory = function () {
      self.showCategory = false;
      self.showSubcate = false;
      self.showProduct = false;

      services.ActiveCategories().then(function (data) {
        self.active_categories = data.data;
        self.showCategory = true;

      });
    };

    self.addUser = function ($event) {
      self.newUser = true;
    }

    services.get_ordertype().then(function (data) {
      self.ordertype = data.data;
    });

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

    self.SgstEmpty = function () { // myone

      if (self.build.order_sgst != 0) {

        self.build.payable_amount = Number(self.build.payable_amount) - Number(self.build.order_sgst);
        self.build.discount = Number(self.build.order_sgst);
        self.build.order_sgst = 0;
        $mdToast.show($mdToast.simple().content("Small pizza Cost is Free.").position('bottom right'));

      }

    };

    self.AddProduct = function (ev, p) {

      if (self.build.items.indexOf(p.id) >= 0) {
        pid = self.build.items.indexOf(p.id);
        self.build.quantity[pid] = self.build.quantity[pid] + 1; //myone
      } else {
        self.build.items.push(p.id);
        self.build.quantity.push(1); //myone
        self.build.prices.push(Math.round(p.price));
        self.build.cgst.push(p.cgst);
        self.build.sgst.push(p.sgst);
        self.build.item_names.push(p.title);
      }

      current_amount = p.price * 1; //myone
      self.build.bill_amount = Number(self.build.bill_amount) + current_amount;
      self.build.bill_amount = self.build.bill_amount.toFixed(2);

      current_cgst = current_amount * (p.cgst / 100);
      //current_cgst=current_cgst.toFixed(2);
      self.build.order_cgst = Number(self.build.order_cgst) + current_cgst;
      self.build.order_cgst = self.build.order_cgst.toFixed(2)

      current_sgst = current_amount * (p.sgst / 100);
      //current_sgst=current_sgst.toFixed(2);
      self.build.order_sgst = Number(self.build.order_sgst) + current_sgst;
      self.build.order_sgst = self.build.order_sgst.toFixed(2)

      self.build.payable_amount = Number(self.build.payable_amount) + Number(current_amount) + Number(current_cgst) + Number(current_sgst);
      self.build.payable_amount = self.build.payable_amount.toFixed(2);

      services.getOrderProduct(self.build.items.join()).then(function (data) {
        self.particulars = data.data;
        var flag_m = 0,
          flag_s = 0;
        for (var a = 0; a < self.particulars.length; a++) {
          if (self.particulars[a].title.indexOf("Medium") >= 0) {
            flag_m = 1;
          }
          if (self.particulars[a].title.indexOf("Small") >= 0) {
            flag_s = 1;
          }
        }
        if (flag_m == 1 && flag_s == 1) self.b1g1 = false;
      });

      $mdToast.show($mdToast.simple().content(p.title + " -" + 1 + " Unit" + " " + "added").position('bottom right'));
    };

    self.RemoveProductcount = function (ev, p) {

      if (self.build.items.indexOf(p.id) >= 0) {
        pid = self.build.items.indexOf(p.id);
        self.build.quantity[pid] = self.build.quantity[pid] - 1; //myone

        current_amount = p.price * 1; //myone
        self.build.bill_amount = Number(self.build.bill_amount) - current_amount;
        self.build.bill_amount = self.build.bill_amount.toFixed(2);

        current_cgst = current_amount * (p.cgst / 100);
        //current_cgst=current_cgst.toFixed(2);
        self.build.order_cgst = Number(self.build.order_cgst) - current_cgst;
        self.build.order_cgst = self.build.order_cgst.toFixed(2)

        current_sgst = current_amount * (p.sgst / 100);
        //current_sgst=current_sgst.toFixed(2);
        self.build.order_sgst = Number(self.build.order_sgst) - current_sgst;
        self.build.order_sgst = self.build.order_sgst.toFixed(2)

        self.build.payable_amount = Number(self.build.payable_amount) - Number(current_amount) - Number(current_cgst) - Number(current_sgst);
        self.build.payable_amount = self.build.payable_amount.toFixed(2);

        services.getOrderProduct(self.build.items.join()).then(function (data) {
          self.particulars = data.data;

        });

        $mdToast.show($mdToast.simple().content(p.title + " -" + 1 + " Unit" + " " + "removed").position('bottom right'));
      }
    };

    self.RemoveProduct = function (ev, p) {

      pid = self.build.items.indexOf(p.id);
      self.qnt = self.build.quantity[pid];
      self.prc = self.build.prices[pid];
      self.cgst = self.build.cgst[pid];
      self.sgst = self.build.sgst[pid];
      self.build.items.splice(pid, 1);
      self.build.quantity.splice(pid, 1);
      self.build.prices.splice(pid, 1);
      self.build.item_names.splice(pid, 1);
      self.build.cgst.splice(pid, 1);
      self.build.sgst.splice(pid, 1);

      current_amount = self.prc * self.qnt;
      bill_amount = self.build.bill_amount - current_amount;
      self.build.bill_amount = bill_amount.toFixed(2);
      //self.build.payable_amount=bill_amount;		

      current_cgst = current_amount * (p.cgst / 100);
      //current_cgst=current_cgst.toFixed(2);
      self.build.order_cgst = Number(self.build.order_cgst) - current_cgst;
      self.build.order_cgst = self.build.order_cgst.toFixed(2)
      if (self.build.order_cgst < 0) {
        self.build.order_cgst = 0;
      }

      current_sgst = current_amount * (p.sgst / 100);
      //current_sgst=current_sgst.toFixed(2);
      self.build.order_sgst = Number(self.build.order_sgst) - current_sgst;
      self.build.order_sgst = self.build.order_sgst.toFixed(2)
      if (self.build.order_sgst < 0) {
        self.build.order_sgst = 0;
      }

      self.build.payable_amount = Number(self.build.payable_amount) - Number(current_amount) - Number(current_cgst) - Number(current_sgst);
      self.build.payable_amount = self.build.payable_amount.toFixed(2);
      if (self.build.payable_amount < 0) {
        self.build.payable_amount = 0;
      }

      if (self.build.items.join() == '') {
        self.particulars = '';
      } else {
        services.getOrderProduct(self.build.items.join()).then(function (data) {
          self.particulars = data.data;
        });
      }
      $mdToast.show($mdToast.simple().content(p.title + " -" + self.qnt + " Unit" + " " + "Removed").position('bottom right'));
    };

    services.getCustomers().then(function (data) {
      self.cust = data.data;
      self.loading = false;
      //console.log(JSON.stringify(self.cust));
    });


    self.getUserDetails = function (id) {
      services.getCustomer_by_id(id).then(function (data) {
        cust = data.data;

        self.build.contact_name = cust[0].name;
        self.build.contact_number = cust[0].contact;
        self.build.contact_address = cust[0].address;
        //self.delivery_area=cust[0].area_title;
      });
    };


    self.ChangeDiscount = function (discount) {
      //alert(self.build.bill_amount);
      self.build.discount = discount;
      self.build.payable_amount = Number(self.build.bill_amount) + Number(self.build.order_cgst) + Number(self.build.order_sgst) - discount;
    };

    self.smallServe = function (b) {
      console.log(b);
      var small_id = [];
      for (var i = 0; i < b.item_names.length; i++) {
        if (b.item_names[i].indexOf("Small") >= 0) {
          small_id.push(i);
        }
      }
      console.log(small_id);
      for (var i = 0; i < small_id.length; i++) {
        self.build.bill_amount = Number(self.build.bill_amount) - b.prices[small_id[i]] * b.quantity[small_id[i]];
        self.build.bill_amount = self.build.bill_amount.toFixed(2);
        self.build.order_cgst = Number(self.build.order_cgst) - b.cgst[small_id[i]] * b.quantity[small_id[i]];
        self.build.order_sgst = Number(self.build.order_sgst) - b.sgst[small_id[i]] * b.quantity[small_id[i]];
        self.build.payable_amount = Number(self.build.payable_amount) - b.prices[small_id[i]] * b.quantity[small_id[i]] - b.sgst[small_id[i]] * b.quantity[small_id[i]] - b.cgst[small_id[i]] * b.quantity[small_id[i]];
        self.build.payable_amount = self.build.payable_amount.toFixed(2);

        self.build.prices[small_id[i]] = 0;
        self.build.cgst[small_id[i]] = 0;
        self.build.sgst[small_id[i]] = 0;
      }
    };

    self.calculated = function () {
      if (self.build.customer_amount >= Number(self.build.payable_amount)) {
        self.stitle = 'Left Amount';
        self.build.customer_amount = self.build.customer_amount - self.build.payable_amount;
        self.caled = true;
      } else alert('Must pay Payable amount.');
    }

    self.submit = function (b) {
      self.wait = true;
      $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
      b.totalpaid = b.customer_amount > 0 ? 0 : 1;
      //if(Number(b.custom_amount) <= Number(b.payable_amount)) b.custom_amount = null;
      if (b.user_id == 0) {

        var person = {
          name: b.contact_name,
          contact: b.contact_number,
          address: b.contact_address,
          email: ''
        };

        services.insertCustomer(person).then(function (resp) {
          b.user_id = resp.insert_id;
          b.items = b.items.join() + ',';
          b.quantity = b.quantity.join() + ',';
          b.prices = b.prices.join() + ',';
          b.item_names = b.item_names.join(',%,%') + ',%,%';
          b.cgst = b.cgst.join() + ',';
          b.sgst = b.sgst.join() + ',';

          services.insertOrder(b).then(function (resp) {
            //console.log(resp);
            if (resp.status == "success") {
              //console.log("success:"+resp);
              services.getOrderProduct(resp.data.items.replace(/,\s*$/, "")).then(function (data) {
                products = data.data;
                //alert(products.length);             	
                for (i = 0; i < products.length; i++) {

                  services.ActiveProductIngredientConsumption(products[i].id, resp.data.quantity, i).then(function (data1) {
                    ingredients = data1.data;
                    quantity = ingredients[0].quantity.split(",");
                    myquantity = quantity[ingredients[0].iteration];
                    //alert(myquantity);

                    for (j = 0; j < ingredients.length; j++) {
                      newstock = ingredients[j].consumption * myquantity;
                      services.StockUpdate(ingredients[j].id, newstock).then(function (mydata) {
                        alert(JSON.stringify(mydata, null, 4));
                      });
                    }
                  });
                }
              });

              self.afterSubmit(resp);
            }

            services.generateInvoice(resp.data);

          });
        });
      } else {
        console.log(b);
        b.items = b.items.join() + ',';
        b.quantity = b.quantity.join() + ',';
        b.prices = b.prices.join() + ',';
        b.item_names = b.item_names.join(',%,%') + ',%,%';
        b.cgst = b.cgst.join() + ',';
        b.sgst = b.sgst.join() + ',';

        services.insertOrder(b).then(function (resp) {
          //console.log(resp);
          if (resp.status == "success") {
            //console.log("success:"+resp);
            services.getOrderProduct(resp.data.items.replace(/,\s*$/, "")).then(function (data) {
              products = data.data;
              //alert(products.length);             	
              for (i = 0; i < products.length; i++) {

                services.ActiveProductIngredientConsumption(products[i].id, resp.data.quantity, i).then(function (data1) {
                  ingredients = data1.data;
                  quantity = ingredients[0].quantity.split(",");
                  myquantity = quantity[ingredients[0].iteration];
                  //alert(myquantity);

                  for (j = 0; j < ingredients.length; j++) {
                    newstock = ingredients[j].consumption * myquantity;
                    services.StockUpdate(ingredients[j].id, newstock).then(function (mydata) {
                      alert(JSON.stringify(mydata, null, 4));
                    });
                  }
                });
              }
            });

            self.afterSubmit(resp);
          }

          services.generateInvoice(resp.data);

        });
      }
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