angular.module('App').controller('EditController', 
function($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services,$routeParams){
  if($cookies.session_uid == 'null' || $cookies.session_uid == null){ $scope.Expire_Session(); }

    var self = $scope;
	var root = $rootScope;
  
     root.toolbar_menu = null;
     var original;

	 $rootScope.pagetitle = 'Edit Order';
	
     original = { items : [], quantity:[], prices:[],item_names:[],user_id:0 ,contact_name:null,contact_number:null,contact_address:null,bill_amount:0,payable_amount:0,order_comment:null,discount:0};
     self.build = angular.copy(original);
	 
	 self.order_id = parseInt($routeParams.id);	 
	
	 services.getOrderByID(self.order_id).then(function(data){
     current_order = data.data;
	 
     self.build.items=current_order[0].items;
	 self.build.quantity=current_order[0].quantity;
	 self.build.prices=current_order[0].prices;
	 self.build.item_names=current_order[0].item_names;

	 self.build.user_id=current_order[0].user_id;
	 self.build.contact_name=current_order[0].contact_name;
	 self.build.contact_number=current_order[0].contact_number;
	 self.build.contact_address=current_order[0].contact_address;
	 
	 self.build.bill_amount=current_order[0].bill_amount;
	 self.build.payable_amount=current_order[0].payable_amount;
	 self.build.order_comment=current_order[0].order_comment;
	 
	 self.build.discount=current_order[0].discount;
	 
	  self.build.quantity=current_order[0].quantity.split(",").map(Number);
	  self.build.quantity.pop(-1);
	  
	  self.build.items=current_order[0].items.split(",").map(Number);
	  self.build.items.pop(-1);
	 
	  self.build.prices=current_order[0].prices.split(",");
	  self.build.prices.pop(-1);
	  
	  self.build.item_names=current_order[0].item_names.split(",%,%");
	  self.build.item_names.pop(-1);
     	  
	   	  
		services.getOrderProduct(self.build.items.join()).then(function(data){
           self.particulars = data.data;
	    });  
	 
	  });
     
	  
	  self.GetProducts = function(keyword){
	  if(keyword.length<=0){
		    self.products = "";
	   }else{
 	    services.GetProducts_by_keyword(keyword).then(function(data){
			 self.products = data.data;
	    });
	   }
     };
	 
   
      self.AddProduct = function(ev, p) {
		  
		  if(self.build.items.indexOf(p.id) >=0){
			   pid=self.build.items.indexOf(p.id);
			   self.build.quantity[pid] = self.build.quantity[pid]+p.quantity;
		  }else{
                self.build.items.push(p.id);
	            self.build.quantity.push(p.quantity);
			    self.build.prices.push(p.price);
				self.build.item_names.push(p.title);
		  }
		  
		   
	      bill_amount=self.build.bill_amount+(p.price*p.quantity);
		  self.build.bill_amount=bill_amount;
		  self.build.payable_amount=bill_amount;
		  
		 
		  services.getOrderProduct(self.build.items.join()).then(function(data){
           self.particulars = data.data;
	    });  
	   
	   $mdToast.show($mdToast.simple().content(p.title + " -"+p.quantity+" Unit" +" " +"added").position('bottom right'));
      };  
   
     
	 self.RemoveProduct = function(ev, p) {
		 
		 	
		        pid=self.build.items.indexOf(p.id);
			 
			    self.qnt=self.build.quantity[pid];
				self.prc=self.build.prices[pid];
			 
			    self.build.items.splice(pid, 1);
	            self.build.quantity.splice(pid, 1);
			    self.build.prices.splice(pid, 1);
			    self.build.item_names.splice(pid,1);
			
			   
		  bill_amount=self.build.bill_amount-(self.prc*self.qnt);
		  self.build.bill_amount=bill_amount;
		  self.build.payable_amount=bill_amount;
		 
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
  
	 
	 self.getUserDetails = function(id){
	    services.getCustomer_by_id(id).then(function(data){
			cust = data.data;
			
			self.build.contact_name=cust[0].name;
			self.build.contact_number=cust[0].contact;
			self.build.contact_address=cust[0].address;
			//self.delivery_area=cust[0].area_title;
  	    });
     };
	 
	
	 self.ChangeDiscount = function(discount){
		 self.build.discount=discount;
		 self.build.payable_amount=self.build.bill_amount-discount;
 	 };
  
     self.submit = function(b) {
	 
			
     $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
	  
	  
	  b.items=b.items.join() +',';
	  b.quantity=b.quantity.join()+',';
 	  b.prices=b.prices.join() +',';
	  b.item_names=b.item_names.join(',%,%')+',%,%';
	  
	 	
	     services.insertOrder(b).then(function(resp){
			  if(resp.status == "success"){
	
				  services.generateInvoice(resp.data);
				  quantity=resp.data.quantity.split(',');
				
			     services.getOrderProduct(resp.data.items.replace(/,\s*$/, "")).then(function(data){
                  products = data.data;
			        for (i = 0; i < products.length; i++) {
					   products[i].stock=products[i].stock-quantity[i];
					    services.updateProduct(products[i].id, products[i]).then(function(resp1){
			            }); 
                    }
 
	             });  
			   }
			   self.afterSubmit(resp);
			   services.getLastOrderId().then(function(data){
		       last_id = data.data;
		       window.open('invoice/'+last_id[0].id +'.pdf', '_blank');
		     });
		
  	    });      
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
 
