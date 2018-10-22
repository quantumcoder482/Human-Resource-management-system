var app = angular.module('App').controller('StockAddDeductController',
    function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services) {
      if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
        $scope.Expire_Session();
      }

      $rootScope.pagetitle = 'Stock Addtion And Deduction';
      var self = $scope;
      var root = $rootScope;
      root.toolbar_menu = null;

      
      self.types = [
        { id: 0, type_name: 'ALL' },
        { id: 1, type_name: 'Addition' },
        { id: 2, type_name: 'Subtraction' }
      ];

      self.loading = true;
      self.stock_histories = [];
      self.search_data = [];

      services.getStockHistory().then(function (data) {
        self.stock_histories = data.data;
        self.search_data = data.data;
        self.loading = false;
        // console.log(data.data);
      });

      services.getIngredients().then(function(data){
        self.ingredients = data.data;
      })
      $scope.numberOfPages = function () {
        return Math.ceil(self.stock_histories.length / $scope.pageSize);
      }

      services.get_ordertype().then(function (data) {
        self.ordertype = data.data;
      });


      self.getSearchResult = function(data){
        // self.loader = true;
        var type = data.type == 'Addition' ? 'Addition':( data.type == 'Subtraction' ? 'Subtraction' : null);
        var start_date = data.start_date ? new Date(data.start_date).getTime()-43200000: new Date('1970-01-01').getTime();
        var end_date = data.end_date ? new Date(data.end_date).getTime() + 43200000 : new Date('2900-01-01').getTime();
        // console.log(start_date);
        // console.log(end_date);
        self.stock_histories = self.search_data.filter((f_data)=>{
          if(type){
            if (f_data.type == type && new Date(f_data.datetime).getTime() >= start_date && new Date(f_data.datetime).getTime() <= end_date ){
              return true;
            }
          }else if (new Date(f_data.datetime).getTime() >= start_date && new Date(f_data.datetime).getTime() <= end_date) {
            return true;
          }

        });
     
      }

      $scope.sort = function (keyname) {
        $scope.sortKey = keyname; //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
      }

      self.Addition = function(data){
        self.loader = true;
        $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
        data.type = "Addition";
        
        services.insertStock(data).then(function(resp){
         
          // ingredient add
          services.getIngredientsByID(data.ingredient).then(function(resp){
            current_ingredient = resp.data;
            current_ingredient[0].stock = Number(current_ingredient[0].stock) + Number(data.quantity);
            services.updateIngredient(data.ingredient, current_ingredient[0]).then(function(resp){
              self.afterSubmit(resp);
            });

          });
        });

      }
      self.Subtraction =  function(data){
        self.loader = true;
        $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
        data.type = "Subtraction";
        services.insertStock(data).then(function (resp) {
          // ingredient reduce
          services.getIngredientsByID(data.ingredient).then(function (resp) {
            current_ingredient = resp.data;
            current_ingredient[0].stock = Number(current_ingredient[0].stock) - Number(data.quantity);
            services.updateIngredient(data.ingredient, current_ingredient[0]).then(function (resp) {
              self.afterSubmit(resp);
            });
          });
        });
      }


      self.submit = function (c) {
        self.loader = true;

        $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
        if (isNew) {
          services.insertCategory(c).then(function (resp) {
            self.afterSubmit(resp);
          });
        } else {
          services.updateCategory(c.id, c).then(function (resp) {
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
    });
  