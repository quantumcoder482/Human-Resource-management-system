var app=angular.module('App').controller('StockController', 
function($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services,$routeParams){
  if($cookies.session_uid == 'null' || $cookies.session_uid == null){ $scope.Expire_Session(); }
   
  var self             = $scope;
	var root             = $rootScope;
  self.loading         = true;

  $rootScope.pagetitle = 'Stock';
	
	root.toolbar_menu = { title: 'Add Stock' }
	root.barAction =  function(ev) {
    self.addStock(ev);
  }

	self.ingredient=$routeParams.id;

    services.getIngredientStockHistory(self.ingredient).then(function(data){
    self.stocks = data.data;
    console.log(self.ingredient);
	   self.loading = false;
	if(self.ingredient!=0){
	  $rootScope.pagetitle = 'Stock History' + ' ( ' + self.stocks[0].title + ' - ' + self.stocks[0].stock + ' ' + self.stocks[0].unit + ' ) ';
  } else {
    $rootScope.pagetitle = 'Stock History';
  }
    });
	
    $scope.numberOfPages=function(){
        return Math.ceil(self.stocks.length/$scope.pageSize);                
    }
    
     $scope.sort = function(keyname){
		$scope.sortKey = keyname;   //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
	} 
	

	self.addStock = function(ev) {
    $mdDialog.show({
      controller          : StockControllerDialog,
      templateUrl         : 'templates/page/stock/create.html',
      parent              : angular.element(document.body),
      targetEvent         : ev,
      clickOutsideToClose : false,
      stock              : null
    })
  };

  self.editStock = function(ev, s) {
    $mdDialog.show({
      controller          : StockControllerDialog,
      templateUrl         : 'templates/page/stock/create.html',
      parent              : angular.element(document.body),
      targetEvent         : ev,
      clickOutsideToClose : false,
      stock            	: s
    })
  };
  
});

function StockControllerDialog($scope, $mdDialog, services, $mdToast, $route, stock) {
  var self = $scope;
  var isNew = (stock == null) ? true : false;
  var original ;
 
  self.title      = (isNew) ? 'Add Stock' : 'Edit Stock';
  self.buttonText = (isNew) ? 'SAVE' : '';
  
  if (isNew) {
    original = { ingridient : null, quantity:1, stock_previous:0, remarks:null };
    self.stock = angular.copy(original);
	
   } else {
    original = stock;
    self.stock = angular.copy(original);
   }
   
    services.getIngredients().then(function(data){
     self.ingredients = data.data;
	 //  alert(JSON.stringify(data, null, 4));
    });
	
	
	$scope.GetIngredientStock = function (id) {
     services.getIngredientsByID(id).then(function(data){
        myingredient = data.data;
	    self.stock.stock_previous=myingredient[0].stock;
     });
   }

  self.isClean = function() {
    return angular.equals(original, self.stock);
  }

  self.hide = function() {
    $mdDialog.hide();
  };

  self.cancel = function() {
    $mdDialog.cancel();
  };

   self.submit = function(s) {
    $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
	self.loader = true;
	  
    if(isNew){
		 services.insertStock(s).then(function(resp){
			 if(resp.status == 'success'){
				 
                 services.getIngredientsByID(resp.data.ingredient).then(function(data){
					 ingredient=data.data;
					  ingredient[0].stock=ingredient[0].stock+resp.data.quantity+resp.data.stock_actual-resp.data.stock_previous;
					    //alert(JSON.stringify(ingredient[0].stock, null, 4));
					 
					         services.updateIngredient(ingredient[0].id, ingredient[0]).then(function(resp1){
								  
								   if(resp1.status == 'success'){
									   
									      self.afterSubmit(resp);
								   }else{
									  $mdToast.show($mdToast.simple().content("some error occured...").position('bottom right'));
	      					      }
			                 });        
                        });
        
			   }else{
				   
				   $mdToast.show($mdToast.simple().content("some error occured...").position('bottom right'));
			   }
            //self.afterSubmit(resp);
        });
    } else {
        services.updateStock(s.id, s).then(function(resp){
	      self.afterSubmit(resp);
        });        
     }
  };

  self.afterSubmit = function(resp) {
    if(resp.status == 'success'){
      $mdToast.show($mdToast.simple().hideDelay(1000).content(resp.msg).position('bottom right'))
      .then(function() {
        $mdDialog.hide();
        window.location.reload();    
      });  
    }else{
      $mdToast.show($mdToast.simple().hideDelay(3000).content(resp.msg).position('bottom right'))
    }    
  };
}