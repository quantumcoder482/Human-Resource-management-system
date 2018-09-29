angular.module('App').controller('MenuController', 
function($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services){
  if($cookies.session_uid == 'null' || $cookies.session_uid == null){ $scope.Expire_Session(); }

  var self = $scope;
  var root = $rootScope;
  root.toolbar_menu = null;
  var original;

  $rootScope.pagetitle = 'Make Menu';

  
  original = { items : [], quantity:[], prices:[],item_names:[],cgst:[],sgst:[],bill_amount:0,payable_amount:0,order_cgst:0,order_sgst:0,gst_price:[]};
  self.menu = angular.copy(original);
  
  self.showCategory=true;
  self.showSubcate=false;
  self.showProduct=false;
    
  services.ActiveCategories().then(function(data){
      self.active_categories = data.data;
    // alert(JSON.stringify(self.active_categories, null, 4));
  });   
   
  self.ShowMyCategory = function(){
    self.showCategory=false;
      self.showSubcate=false;
      self.showProduct=false;
  
    services.ActiveCategories().then(function(data){
      self.active_categories = data.data;  
        self.showCategory=true;    
    });
  };
   
  self.ShowSubcategory = function(category){
    self.showCategory=false;
    self.showSubcate=false;
    self.showProduct=false;
    
    services.getSubcategory_by_cat(category).then(function(data){
       self.active_categories = data.data; 
        self.showSubcate=true;     
    });
   };
   
   
  self.GetProductBySubcat = function(subcat){
    self.showCategory=false;
    self.showSubcate=false;
    self.showProduct=false;
    
    services.getProduct_by_subcat(subcat).then(function(data){
        self.active_categories = data.data;
        self.showProduct=true;      
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

      if(self.menu.order_sgst != 0){

        self.menu.payable_amount = Number(self.menu.payable_amount) - Number(self.menu.order_sgst);
        self.menu.discount = Number(self.menu.order_sgst);
        self.menu.order_sgst= 0;
        $mdToast.show($mdToast.simple().content("Small pizza Cost is Free.").position('bottom right'));

      }

  };  
   
  self.AddProduct = function(ev, p) {
      
      if(self.menu.items.indexOf(p.id) >=0){
         pid=self.menu.items.indexOf(p.id);
         self.menu.quantity[pid] = self.menu.quantity[pid]+1;//myone
      }else{
        self.menu.items.push(p.id);
        self.menu.quantity.push(1);//myone
        self.menu.prices.push(Math.round(p.price));
        self.menu.cgst.push(p.cgst);
        self.menu.sgst.push(p.sgst);
        self.menu.item_names.push(p.title);        
      }
      
      current_amount=p.price*1;//myone
      self.menu.bill_amount=Number(self.menu.bill_amount)+current_amount;
      self.menu.bill_amount=self.menu.bill_amount.toFixed(2);
     
      current_cgst=current_amount*(p.cgst/100);
      //current_cgst=current_cgst.toFixed(2);
      self.menu.order_cgst= Number(self.menu.order_cgst) + current_cgst;
      self.menu.order_cgst=self.menu.order_cgst.toFixed(2)
      
      current_sgst=current_amount*(p.sgst/100);
      //current_sgst=current_sgst.toFixed(2);
      self.menu.order_sgst= Number(self.menu.order_sgst) + current_sgst;
      self.menu.order_sgst=self.menu.order_sgst.toFixed(2)
      
      self.menu.payable_amount = Number(self.menu.payable_amount)+ Number(current_amount)+ Number(current_cgst) +Number(current_sgst);
      self.menu.payable_amount=self.menu.payable_amount.toFixed(2);
      
      services.getOrderProduct(self.menu.items.join()).then(function(data){
          self.particulars = data.data;     
      });  
     
      $mdToast.show($mdToast.simple().content(p.title + " -"+1+" Unit" +" " +"added in this menu").position('bottom right'));
  }; 

  self.RemoveProductcount = function(ev, p) {
      
      if(self.menu.items.indexOf(p.id) >= 0){
         pid=self.menu.items.indexOf(p.id);
         self.menu.quantity[pid] = self.menu.quantity[pid]-1;//myone
    
        current_amount=p.price*1;//myone
        self.menu.bill_amount=Number(self.menu.bill_amount)-current_amount;
        self.menu.bill_amount=self.menu.bill_amount.toFixed(2);
       
        current_cgst=current_amount*(p.cgst/100);
        //current_cgst=current_cgst.toFixed(2);
        self.menu.order_cgst= Number(self.menu.order_cgst) - current_cgst;
        self.menu.order_cgst=self.menu.order_cgst.toFixed(2)
        
        current_sgst=current_amount*(p.sgst/100);
        //current_sgst=current_sgst.toFixed(2);
        self.menu.order_sgst= Number(self.menu.order_sgst) - current_sgst;
        self.menu.order_sgst=self.menu.order_sgst.toFixed(2)
        
        self.menu.payable_amount = Number(self.menu.payable_amount)- Number(current_amount)- Number(current_cgst) -Number(current_sgst);
        self.menu.payable_amount=self.menu.payable_amount.toFixed(2);
        
        services.getOrderProduct(self.menu.items.join()).then(function(data){
            self.particulars = data.data;
         
        });  
       
       $mdToast.show($mdToast.simple().content(p.title + " -"+1+" Unit" +" " +"removed in this menu").position('bottom right'));
      }
  };    
     
  self.RemoveProduct = function(ev, p) {     
      
    pid=self.menu.items.indexOf(p.id);      
    self.qnt=self.menu.quantity[pid];
    self.prc=self.menu.prices[pid];
    self.cgst=self.menu.cgst[pid];
    self.sgst=self.menu.sgst[pid];      
    self.menu.items.splice(pid, 1);
    self.menu.quantity.splice(pid, 1);
    self.menu.prices.splice(pid, 1);
    self.menu.item_names.splice(pid,1);
    self.menu.cgst.splice(pid,1);
    self.menu.sgst.splice(pid,1);        
         
    current_amount=self.prc*self.qnt;
    bill_amount=self.menu.bill_amount-current_amount;
    self.menu.bill_amount=bill_amount.toFixed(2);
    //self.menu.payable_amount=bill_amount;    
    
    current_cgst=current_amount*(p.cgst/100);
    //current_cgst=current_cgst.toFixed(2);
    self.menu.order_cgst= Number(self.menu.order_cgst) - current_cgst;
    self.menu.order_cgst=self.menu.order_cgst.toFixed(2)
    if(self.menu.order_cgst<0){
      self.menu.order_cgst= 0;  
    }
      
    current_sgst=current_amount*(p.sgst/100);
    //current_sgst=current_sgst.toFixed(2);
    self.menu.order_sgst= Number(self.menu.order_sgst) - current_sgst;
    self.menu.order_sgst=self.menu.order_sgst.toFixed(2)
    if(self.menu.order_sgst<0){
    self.menu.order_sgst= 0;  
    }   
    
    self.menu.payable_amount = Number(self.menu.payable_amount)- Number(current_amount)- Number(current_cgst) - Number(current_sgst);
    self.menu.payable_amount=self.menu.payable_amount.toFixed(2);
    if(self.menu.payable_amount<0){
      self.menu.payable_amount= 0;  
    }     
     
    if(self.menu.items.join()==''){
        self.particulars = '';
    }else{
        services.getOrderProduct(self.menu.items.join()).then(function(data){
        self.particulars = data.data;
      });  
    }    
      $mdToast.show($mdToast.simple().content(p.title + " -"+self.qnt+" unit" +" " +"removed in this menu").position('bottom right'));
  };

    self.submit = function(b) {
        self.wait=true;
        $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
        console.log(b);
        b.items=b.items.join() +',';
        b.quantity=b.quantity.join()+',';
        b.prices=b.prices.join() +',';
        b.item_names=b.item_names.join(',%,%')+',%,%';
        b.cgst=b.cgst.join() +',';
        b.sgst=b.sgst.join() +',';
        
        services.insertMenu(b).then(function(resp){
            //console.log(resp);
            if(resp.status == "success"){
              self.afterSubmit(resp); 
            }
             
            //services.generateInvoice(resp.data);
             
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
 
