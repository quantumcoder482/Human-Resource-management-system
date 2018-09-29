var app= angular.module('App').controller('ProductController', 
function($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services,$routeParams){
  if($cookies.session_uid == 'null' || $cookies.session_uid == null){ $scope.Expire_Session(); }

   $rootScope.pagetitle = 'Product';
	var self             = $scope;
	var root             = $rootScope;
   self.loading         = true;

	root.toolbar_menu = { title: 'Add Product' }
	root.barAction =  function(ev) {
    self.AddNewProduct(ev);
  }

    self.category=$cookies.category;
    self.subcategory=$cookies.subcategory;
  

    services.getProducts().then(function(data){
    self.products = data.data;
    self.loading = false;
    //console.log(JSON.stringify(self.products));
  });   
  
    if(self.subcategory >=1){ 
	         
	          services.getProduct_by_subcat(self.subcategory).then(function(data){
               self.products = data.data;
              });   
			  
			   services.getSubcategory_by_cat(self.category).then(function(data){
                self.subcategories = data.data;
              });  
			 
			
	   }else if(self.category >=1){
		   
		     services.getProduct_by_Category(self.category).then(function(data){
               self.products = data.data;
              });   
			  
			  services.getSubcategory_by_cat(self.category).then(function(data){
                self.subcategories = data.data;
              });  
			    
		   
	   }else{
		   
		   services.getProducts().then(function(data){
            self.products = data.data;
            self.loading = false;
            });   
			
			services.getSubcategory().then(function(data){
              self.subcategories = data.data;
            });  
     
  
	   }

  
     services.getCategories().then(function(data){
          self.categories = data.data;
        });  
		
		
	
	  self.filterProductByCategory = function(id) {
		 
		 if(id==0){
			 
			  services.getProducts().then(function(data){
               self.products = data.data;
              });   
			  
			  services.getSubcategory().then(function(data){
                self.subcategories = data.data;
              });  
			  
			  $cookies.category='';
			  $cookies.subcategory='';
			  self.category='';
			  self.subcategory='';
			  
		 }else{
			 
			   services.getProduct_by_Category(id).then(function(data){
               self.products = data.data;
              });   
			  
			   services.getSubcategory_by_cat(id).then(function(data){
                self.subcategories = data.data;
              });  
			  
			    $cookies.category=id;
	     
		    }
			
	     }
	 
		 
      self.filterProductBySubcategory = function(id) {
		 
		 if(id==0){
			 
			  services.getProducts().then(function(data){
               self.products = data.data;
              });   
			  
			  self.subcategory='';
			  $cookies.subcategory='';
			
			
		 }else{
			   services.getProduct_by_subcat(id).then(function(data){
               self.products = data.data;
              });   
			  $cookies.subcategory=id;
			 
		    }
			
	     }
	
	
    self.currentPage = parseInt($routeParams.page);
	
	  $scope.GetNextPage=function(currentPage){
        self.currentPage=currentPage+1;
      }
	   
	  $scope.GetPreviousPage=function(currentPage){
        self.currentPage=currentPage-1;
      }
       
     $scope.numberOfPages=function(){
        return Math.ceil(self.products.length/$scope.pageSize);                
     }
       
     $scope.sort = function(keyname){
		$scope.sortKey = keyname;   //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
	 }  
	 
	 
	  
	  
	 self.saveToDatabase = function(ev, table, column, id, myid) {
		
	   var value_to_update= document.getElementById(myid).innerHTML;
		
       var confirm = $mdDialog.confirm().title('Update Confirmation')
      .content('Are you sure want to update ?' + value_to_update)
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');
         $mdDialog.show(confirm).then(function() {
		   services.Inline_Update(table, column, value_to_update, id).then(function(resp){
			 $mdToast.show($mdToast.simple().content("Success.").position('bottom right'));
         });
         }, function() {
      });
    };  
      
      
     self.UpdateStock = function(ev, p) {
	   var confirm = $mdDialog.confirm().title('Confirmation?')
      .content('Are you sure want to update Stock?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

      $mdDialog.show(confirm).then(function() {
        $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
        if(p.stock==1){
		  p.stock=0;
		 } else {
		 p.stock=1;	 
		 }
         $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
          services.updateProduct(p.id, p).then(function(resp){
			  self.afterSubmit(resp);
         });
       }, function() {
     });
   };  
	
	
    self.UpdateStatus  = function(ev, p) {
	   var confirm = $mdDialog.confirm().title('Confirmation?')
      .content('Are you sure want to update Status?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

      $mdDialog.show(confirm).then(function() {
        $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
        if(p.status==1){
		  p.status=0;
		 } else {
		 p.status=1;	 
		 }
        $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
          services.updateProduct(p.id, p).then(function(resp){
			 self.afterSubmit(resp);
         });
       }, function() {
     });
  };
  
	
  self.deleteProduct = function(ev, p) {
    var confirm = $mdDialog.confirm().title('Delete Confirmation')
      .content('Are you sure want to delete Product : '+p.title+' ?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

    $mdDialog.show(confirm).then(function() {
      services.deleteProduct(p.id).then(function(res){
       // console.log(JSON.stringify(res));
        if(res.status == 'success'){
          $mdToast.show($mdToast.simple().hideDelay(1000).content('Delete product '+p.title+' Success!').position('bottom right'))
          .then(function() {
            window.location.reload();
          });
		  
        }else{
          $mdToast.show(
            $mdToast.simple().hideDelay(6000).action('CLOSE').content('Opps , Failed delete Product '+p.title).position('bottom right')
          ).then(function(response){

          });
        }        
      });
    }, function() {

    });
  };  
  
    self.AddNewProduct = function(ev) {
	   window.location.href = '#product_add/';
	 }
	 
     self.EditExistingProduct = function(ev, id) {
	   window.location.href = '#product_edit/' + id;
	 }
	 
    self.ViewProductIngredients = function(ev, id) {
	   window.location.href = '#consumption/' + id;
	 }

   self.detailsProduct = function(ev, p) {
    $mdDialog.show({
      controller          : DetailsProductControllerDialog,
      templateUrl         : 'templates/page/product/details.html',
      parent              : angular.element(document.body),
      targetEvent         : ev,
      clickOutsideToClose : true,
      product              : p
    })
  };       	
   
   
   self.viewBanner = function(ev, p){
    $mdDialog.show({
      controller          : ProductViewBannerControllerDialog,
      template            : '<md-dialog ng-cloak >' +
                            '  <md-dialog-content style="max-width:800px;max-height:810px;" >' +
                            '   <img style="margin: auto; max-width: 100%; max-height= 100%;" ng-src="uploads/product/{{product.icon}}">' +
                            '  </md-dialog-content>' +
                            '</md-dialog>',
      parent              : angular.element(document.body),
      targetEvent         : ev,
      clickOutsideToClose : true,
      product             : p
    })
  };   

});

  function ProductViewBannerControllerDialog($scope, $mdDialog, $mdToast, product) {
  var self = $scope;
  self.product = product;
 }
 
 function DetailsProductControllerDialog($scope, $mdDialog, services, $mdToast, $route, product) {
  var self = $scope;
  self.product = product;

  self.hide = function() {
    $mdDialog.hide();
  };

  self.cancel = function() {
    $mdDialog.cancel();
  };
}



