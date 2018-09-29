var app= angular.module('App').controller('ProductEditController', 
function($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services,$routeParams){
  if($cookies.session_uid == 'null' || $cookies.session_uid == null){ $scope.Expire_Session(); }

   $rootScope.pagetitle = 'Product Edit Mode';
   var root             = $rootScope;
	
  var self = $scope;
  var original ;
  
  self.title      =  'Edit Product';
  self.buttonText = 'UPDATE';
  
    
  services.ProductById($routeParams.id).then(function(data){
  original = data.data[0];
  self.product = angular.copy(original);
  
  	
  self.isClean = function() {
    return angular.equals(original, self.product);
  }
      
    services.getCategories().then(function(data){
	  $scope.items = data.data;
	
	    cat1=self.product.category.split(',');
 	    cat=[];
	    for (i = 0; i < cat1.length-1; i++) {
            cat.push( parseInt(cat1[i]));     
         }
	   
	    self.selected = cat;
		
      $scope.toggle = function (item, list, selected_subcategory) {
          
        var idx = list.indexOf(item);
        if (idx > -1) {
			
          list.splice(idx, 1);
           
             services.getSubcategory_by_cat_multiple(item).then(function(data){
			   rmv_subcat = data.data;
			     for (k = 0; k < rmv_subcat.length; k++) {
 					     var idx1 = selected_subcategory.indexOf(rmv_subcat[k].id);
                         if (idx1 > -1) {
					        $scope.toggle1(rmv_subcat[k].id, selected_subcategory); 
					      }
                       }
	              });
          } else {
            list.push(item);
           }  
		     if (list.length == 0) {
			    self.invalid=true;
               }else{
				  self.invalid=false;
			   }
			  
		     self.product.category=list.join() + ',';
		    // getSubcat(list);
			
			 if(list.length==0){
				self.items1 = '';
			}else{
	         services.getSubcategory_by_cat_multiple(list.join()).then(function(data){
	    	  self.items1 = data.data;
			   
			    //alert(JSON.stringify(self.items1, null, 4));
			 });
	       }
			
		  };
	 });    
	 
      $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
      };
	  
	  
	  	 services.getSubcategory_by_cat_multiple(self.product.category.replace(/,\s*$/, "")).then(function(data){
	         $scope.items1 = data.data;
		 
	         sub1=self.product.subcat.split(',');
		      sub=[];
	           for (j = 0; j < sub1.length-1; j++) {
                  sub.push( parseInt(sub1[j]));     
                } 
				 self.selected1 = sub;
	     });    
		
		
	   $scope.toggle1 = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
			
          list.splice(idx, 1);
        } else {
            list.push(item);
        }  
			 
			  if (list.length == 0) {
			    self.invalid1=true;
               }else{
				   self.invalid1=false;
			   }
			   
			   self.selected1=list;
			 self.product.subcat=list.join() + ',';
			
          };
		  
      $scope.exists1 = function (item, list) {
        return list.indexOf(item) > -1;
      };
	
    })
  	
   
   self.submit = function(p) {
	self.loader = true;
    $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
	
		 p.gst_price=(p.price*100)/(100+p.cgst+p.sgst);
		 p.gst_price=p.gst_price.toFixed(2);
	 
	   
        services.updateProduct(p.id, p).then(function(resp){
			  if(resp.status == 'success'){
				   self.afterSubmit(resp);
               }
        });        
  };

  self.afterSubmit = function(resp,page) {
    if(resp.status == 'success'){
      $mdToast.show($mdToast.simple().hideDelay(1000).content(resp.msg).position('bottom right'))
      .then(function() {
        $mdDialog.hide();
        window.location.href = '#product/0';
      });  
    }else{
      $mdToast.show($mdToast.simple().hideDelay(3000).content(resp.msg).position('bottom right'))
     }    
   };

});
