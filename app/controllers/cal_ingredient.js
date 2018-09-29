angular.module('App').controller('CalingredientController', 
function($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services){
  if($cookies.session_uid == 'null' || $cookies.session_uid == null){ $scope.Expire_Session(); }

    var self = $scope;
	var root = $rootScope;
  	var newUser = false;
     root.toolbar_menu = null;
	 var original;
	 self.guestnumber = 1;

	$rootScope.pagetitle = 'Calculate Ingredient';
	
     original = { items : [], quantity:[], prices:[],item_names:[],cgst:[],sgst:[],user_id:0 ,contact_name:null,contact_number:null,contact_address:null,bill_amount:0,payable_amount:0,customer_amount:null,order_cgst:0,order_sgst:0,order_comment:null,discount:0,type:0, gst_price:[]};
     self.build = angular.copy(original);
       self.b1g1 = true;
	  self.showCategory=true;
	  self.showSubcate=false;
	  self.showProduct=false;
	  
	services.ActiveCategories().then(function(data){
		self.active_categories = data.data;
		// alert(JSON.stringify(self.active_categories, null, 4));
	});

	 self.ShowMyCategory = function(){
		 self.showCategory=true;
	          self.showSubcate=false;
	          self.showProduct=false;
	  
		 services.ActiveCategories().then(function(data){
			 self.active_categories = data.data;
			 
			  
		 });
	 };

	 self.addUser = function($event) {
		self.newUser = true;
	} 
	 
	 self.ShowSubcategory = function(category){
		 self.showCategory=false;
	          self.showSubcate=true;
	          self.showProduct=false;
	  
		 services.getSubcategory_by_cat(category).then(function(data){
			 self.active_categories = data.data;
			 
			  
		 });
	 };
	 
	self.myfilter = function (item) { 
		return item.price > 0; 
	};	 
	
	 self.GetProductBySubcat = function(subcat){
		  self.showCategory=false;
	          self.showSubcate=false;
	          self.showProduct=true;
	  
		   services.getProduct_by_subcat(subcat).then(function(data){
			 self.active_categories = data.data;
			 
		 });
	 };
	
	
	  self.GetProducts = function(keyword){
	  if(keyword.length<=0){
		    self.products = "";
	   }else{
 	    services.Get_Stock_Products_by_keyword(keyword).then(function(data){
			 self.products = data.data;
	    });
	   }
     };

	  self.SgstEmpty = function(){// myone

	  	if(self.build.order_sgst != 0){

	  		self.build.payable_amount = Number(self.build.payable_amount) - Number(self.build.order_sgst);
	  		self.build.discount = Number(self.build.order_sgst);
		  	self.build.order_sgst= 0;
		    $mdToast.show($mdToast.simple().content("Small pizza Cost is Free.").position('bottom right'));

	    }

     };	

	  services.getIngredients().then(function(data){
			self.ingredients = data.data;
			self.loading = false;
	  }); 

      self.AddProduct = function(ev, p) {
		  
		  if(self.build.items.indexOf(p.id) >=0){
			   pid=self.build.items.indexOf(p.id);
			   self.build.quantity[pid] = self.build.quantity[pid]+1;//myone
		  }else{
                self.build.items.push(p.id);
	            self.build.quantity.push(1);//myone
			    self.build.prices.push(Math.round(p.price));
				self.build.cgst.push(p.cgst);
				self.build.sgst.push(p.sgst);
				self.build.item_names.push(p.title);				
		  }

		  services.getconsumptionByproduct(p.id).then(function(data){
			  if (data.data == '') alert("Not defined consumption of product");
			  var result = self.ingredients;
			  for(var i=0; i<data.data.length; i++){
				  var kid = find_array_id(result, 'id', data.data[i].ingredient);
				  if (kid > -1){
				  	result[kid].price = Number(result[kid].price);
				  	result[kid].price += data.data[i].consumption*self.guestnumber;
				  }
			  }
			  self.ingredients = result;
		  });

		  services.getOrderProduct(self.build.items.join()).then(function(data){
          	self.particulars = data.data;		   
		});  
	   
	   	$mdToast.show($mdToast.simple().content(p.title + " -"+1+" Unit" +" " +"added").position('bottom right'));
      }; 

      self.RemoveProductcount = function(ev, p) {
		  
		  if(self.build.items.indexOf(p.id) >= 0){
			   pid=self.build.items.indexOf(p.id);
			   self.build.quantity[pid] = self.build.quantity[pid]-1;//myone
			  
			  services.getOrderProduct(self.build.items.join()).then(function(data){
	          	self.particulars = data.data;
			   
		    });  
		   
		   $mdToast.show($mdToast.simple().content(p.title + " -"+1+" Unit" +" " +"removed").position('bottom right'));
	    }
      };    
     
	 self.RemoveProduct = function(ev, p) {
		 
		 	
		        pid=self.build.items.indexOf(p.id);
			 
			    self.qnt=self.build.quantity[pid];
				self.prc=self.build.prices[pid];
			    self.cgst=self.build.cgst[pid];
			    self.sgst=self.build.sgst[pid];
			 
			    self.build.items.splice(pid, 1);
	            self.build.quantity.splice(pid, 1);
			    self.build.prices.splice(pid, 1);
			    self.build.item_names.splice(pid,1);
				self.build.cgst.splice(pid,1);
				self.build.sgst.splice(pid,1);
				
			if(self.build.items.join()==''){
				   self.particulars = '';
			}else{
		         services.getOrderProduct(self.build.items.join()).then(function(data){
                 self.particulars = data.data;
	            });  
			}
	   
	   $mdToast.show($mdToast.simple().content(p.title + " -"+self.qnt+" Unit" +" " +"Removed").position('bottom right'));
      };  
	 
	 services.getCustomers().then(function(data){
     self.cust = data.data;
     self.loading = false;
      //console.log(JSON.stringify(self.cust));
     });	 
  
  	self.refresh = function() {
		  window.location.reload();
	}

  	self.afterSubmit = function(resp) {
    	if(resp.status == "success"){
			$mdToast.show($mdToast.simple().hideDelay(1000).content(resp.msg).position('bottom right'))
			.then(function() {			
				window.location.reload();		
      		});  
    }else{
      $mdToast.show($mdToast.simple().hideDelay(3000).content(resp.msg).position('bottom right'))
    }    
  };
 });

function find_array_id(array, key, value){
	for(var j=0; j<array.length; j++){
		if(array[j][key]== value) return j;
	}
	return -1;
}