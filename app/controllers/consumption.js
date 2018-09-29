var app=angular.module('App').controller('ConsumptionController', 
function($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services,$routeParams){
  if($cookies.session_uid == 'null' || $cookies.session_uid == null){ $scope.Expire_Session(); }

	$rootScope.pagetitle = 'Product Ingredient Consumptions';
	var self             = $scope;
	var root             = $rootScope;	
  self.loading         = true;
  
  self.product=$routeParams.id;
 
 

	root.toolbar_menu = { title: 'Add Consumption' }
	root.barAction =  function(ev) {
  self.addConsumption(ev,self.product);
  }

  services.ProductIngredientConsumption(self.product).then(function(data){
    self.consumptions = data.data;
	  self.loading = false;
   // alert(JSON.stringify(self.consumptions, null, 4));
  });  
  
  
  
  services.ProductTitleById(self.product).then(function(data){
    self.thisproduct = data.data;
    $rootScope.pagetitle = 'Product Ingredient Consumptions ' + ' ( ' + self.thisproduct[0].title + ' ) ';
	
	 });  
  
  
   $scope.numberOfPages=function(){
        return Math.ceil(self.consumptions.length/$scope.pageSize);                
    }
    
  $scope.sort = function(keyname){
	  	$scope.sortKey = keyname;   //set the sortKey to the param passed
		  $scope.reverse = !$scope.reverse; //if true make it false and vice versa
	} 
	
   
 self.UpdateStatus = function(ev, c) {
	   var confirm = $mdDialog.confirm().title('Confirmation?')
      .content('Are you sure want to update Status?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

      $mdDialog.show(confirm).then(function() {
        $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
        if(c.status==1){
    		  c.status=0;
		    } else {
		      c.status=1;	 
		    }
        $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
         services.updateConsumption(c.id, c).then(function(resp){
			    self.afterSubmit(resp);
         });
        }, function() {
     });
  };  
  
	
  self.deleteCategory = function(ev, c) {
    var confirm = $mdDialog.confirm().title('Delete Confirmation')
      .content('Deleting category not allowed?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');
      $mdDialog.show(confirm).then(function() {
     /*services.deleteCategory(c.id).then(function(res){
        if(res.status == 'success'){
          $mdToast.show($mdToast.simple().hideDelay(1000).content('Delete Category '+c.title+' Success!').position('bottom right'))
          .then(function() {
            window.location.reload();
          });
        }else{
          $mdToast.show(
            $mdToast.simple().hideDelay(6000).action('CLOSE').content('Opps , Failed delete category '+c.title).position('bottom right')
          ).then(function(response){

          });
        }
       });*/ 
      }, function() {
    });
  };  
  
  
  
  self.addConsumption = function(ev,product) {
    $mdDialog.show({
      controller          : ConsumptionControllerDialog,
      templateUrl         : 'templates/page/consumption/create.html',
      parent              : angular.element(document.body),
      targetEvent         : ev,
      clickOutsideToClose : false,
      consumption         : null,
      myproduct           :product
    })
  };

  self.editConsumption = function(ev, c,product) {
    $mdDialog.show({
      controller          : ConsumptionControllerDialog,
      templateUrl         : 'templates/page/consumption/create.html',
      parent              : angular.element(document.body),
      targetEvent         : ev,
      clickOutsideToClose : false,
      consumption         : c,
      myproduct           : product
    })
  };   

  self.viewBanner = function(ev, c){
    $mdDialog.show({
      controller          : CategoryViewBannerControllerDialog,
      template            : '<md-dialog ng-cloak >' +
                            '  <md-dialog-content style="max-width:800px;max-height:810px;" >' +
                            '   <img style="margin: auto; max-width: 100%; max-height= 100%;" ng-src="uploads/category/{{category.icon}}">' +
                            '  </md-dialog-content>' +
                            '</md-dialog>',
      parent              : angular.element(document.body),
      targetEvent         : ev,
      clickOutsideToClose : true,
      category            : c
    })
  };   
});

function CategoryViewBannerControllerDialog($scope, $mdDialog, $mdToast, category) {
  var self = $scope;
  self.category = category;
 }

function ConsumptionControllerDialog($scope, $mdDialog, services, $mdToast, $route, consumption,myproduct) {
  var self = $scope;
  var isNew = (consumption == null) ? true : false;
  var original ;
  //self.dir    = "../../uploads/category/";
  
  self.title      = (isNew) ? 'Add Ingredient Consumption' : 'Edit Ingredient Consumption';
  self.buttonText = (isNew) ? 'SAVE' : 'UPDATE';
 
  if (isNew) {
    //self.bannerInvalid = true;
    original = { ingredient :null, consumption:null, status:1, product:myproduct };
    self.consumption = angular.copy(original);
  } else {
    //self.bannerInvalid = false;
    original = consumption;
    self.consumption = angular.copy(original);
  }
  
 
    services.getIngredients().then(function(data){
    self.ingredients = data.data;
  });  
 
    
  self.isClean = function() {
    return angular.equals(original, self.consumption);
  }

  self.hide = function() {
    $mdDialog.hide();
  };

  self.cancel = function() {
    $mdDialog.cancel();
  };


   self.submit = function(c) {
	  self.loader = true;
	  
	 $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
     if(isNew){
           services.insertConsumption(c).then(function(resp){
              self.afterSubmit(resp);
          });
    }else {
        services.updateConsumption(c.id, c).then(function(resp){
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
