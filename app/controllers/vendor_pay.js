var app=angular.module('App').controller('VendorPayController', 
function($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services){
  if($cookies.session_uid == 'null' || $cookies.session_uid == null){ $scope.Expire_Session(); }

  $rootScope.pagetitle = 'Vendor Payment';
  var self             = $scope;
  var root             = $rootScope;
  self.loading         = true;
 
	root.toolbar_menu = { title: 'Add Vender Payment' }
	root.barAction =  function(ev) {
    self.addVendorPay(ev);
  }
      
  services.getVendorPays().then(function(data){
    for(var i=0; i<data.data.length; i++) {
      switch(data.data[i].pay_state) {
        case 0:
          data.data[i].first = false;
          data.data[i].second = false;
          data.data[i].third = false;
          break;
        case 1:
          data.data[i].first = true;
          data.data[i].second = false;
          data.data[i].third = false;
          break;
        case 2:
          data.data[i].first = false;
          data.data[i].second = true;
          data.data[i].third = false;
          break;
        case 3:
          data.data[i].first = false;
          data.data[i].second = false;
          data.data[i].third = true;
          break;
      }
    }
    self.vend_pay = data.data;  
    $scope.numberOfPages=function(){
          return Math.ceil(self.vend_pay.length/$scope.pageSize);                
    }
    self.loading = false;
  });   

  
  $scope.sort = function(keyname){
		$scope.sortKey = keyname;   //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
  }
  
  self.UpdateVendPayState = function(ev, u, typ) {
    /*var confirm = $mdDialog.confirm().title('Confirmation?')
      .content('Are you sure want to update Payment State?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

    $mdDialog.show(confirm).then(function() {
        $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));*/
        console.log(ev);
        if(typ == 'first') {
          u.pay_state = 1;
          u.pay_date = '';
        } else if(typ == 'second'){
          u.pay_state = 2;
          u.pay_date = toISOLocal(new Date()).split("T")[0];
        } else if(typ == 'third'){
          u.pay_state = 3;
          u.pay_date = '';
        } else {
          u.pay_state = 0;
          u.pay_date = '';
        }
        services.updateVendPayState(u.id, u.pay_state, u.pay_date).then(function(resp) {
          self.afterSubmit(resp);
        });
       /*}, function() {
     });*/
  }

  self.deleteVendorPay = function(ev, u) {
    var confirm = $mdDialog.confirm().title('Delete Confirmation')
      .content('Are you sure want to delete Vendor Payment : '+u.name+' ?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

    $mdDialog.show(confirm).then(function() {
      services.deleteVendorPay(u.id).then(function(res){
        //console.log(JSON.stringify(res));
        if(res.status == 'success'){
          $mdToast.show($mdToast.simple().hideDelay(1000).content('Delete Vendor Payment '+u.name+' Success!').position('bottom right'))
          .then(function() {
            window.location.reload();
          });
        }else{
          $mdToast.show(
            $mdToast.simple().hideDelay(6000).action('CLOSE').content('Opps , Failed delete Vendor Payment '+ u.name).position('bottom right')
          ).then(function(response){

          });
        }        
      });
      }, function() {
    });
  };  
  
  
   self.BanVendorPay = function(ev, u) {
    var confirm = $mdDialog.confirm().title('Ban Confirmation')
      .content('Are you sure want to Ban Vendor Payment : '+u.name+' ?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

    $mdDialog.show(confirm).then(function() {
		 u.is_banned=1;
	     u.session_token='';
       services.updateVendorPay(u.id, u).then(function(resp){
      
        if(resp.status == 'success'){
          $mdToast.show($mdToast.simple().hideDelay(1000).content('Ban user '+u.name+' Success!').position('bottom right'))
        
        }else{
          $mdToast.show(
            $mdToast.simple().hideDelay(6000).action('CLOSE').content('Opps , Failed to Ban User '+ u.name).position('bottom right')
          ).then(function(response){

          });
        }        
      });
      }, function() {
    });
  };  
  
  
    self.ActivateVendor = function(ev, u) {
    var confirm = $mdDialog.confirm().title('Activate Confirmation')
      .content('Are you sure want to Activate user : '+u.name+' ?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

    $mdDialog.show(confirm).then(function() {
		 u.is_banned=0;
	     u.session_token='';
       services.updateVendorPay(u.id, u).then(function(resp){
      
        if(resp.status == 'success'){
          $mdToast.show($mdToast.simple().hideDelay(1000).content('Activate user '+u.name+' Success!').position('bottom right'))
        
        }else{
          $mdToast.show(
            $mdToast.simple().hideDelay(6000).action('CLOSE').content('Opps , Failed to Activate User '+ u.name).position('bottom right')
          ).then(function(response){

          });
        }        
      });
      }, function() {
    });
  };  
  
  
  
	self.addVendorPay = function(ev) {
    $mdDialog.show({
      controller          : VendorPayControllerDialog,
      templateUrl         : 'templates/page/vendor/create_pay.html',
      parent              : angular.element(document.body),
      targetEvent         : ev,
      clickOutsideToClose : false,
      vend_pay            : null
    })
  }; 
  
 
  self.editVendorPay = function(ev, v) {
    $mdDialog.show({
      controller          : VendorPayControllerDialog,
      templateUrl         : 'templates/page/vendor/create_pay.html',
      parent              : angular.element(document.body),
      targetEvent         : ev,
      clickOutsideToClose : false,
      vend_pay            : v
    })
  };

  self.afterSubmit = function(resp) {
    if(resp.status == 'success'){
      $mdToast.show($mdToast.simple().hideDelay(1000).content(resp.msg).position('bottom right'))
      .then(function() {
        $mdDialog.hide();
        //window.location.reload();    
      });  
    }else{
      $mdToast.show($mdToast.simple().hideDelay(3000).content(resp.msg).position('bottom right'))
    }    
  };
   
});

  
function VendorPayControllerDialog($scope, $mdDialog, services, $mdToast, $route, vend_pay) {
  var self = $scope;
  var original ;
   var isNew = (vend_pay == null) ? true : false;

  self.title      = (isNew) ? 'Create Vender Payment' : 'Edit Vender Payment';
  self.buttonText = (isNew) ? 'SAVE' : 'UPDATE';

	if (isNew) {
    original = { vendor_id: null, ingredient_id: null, amount: null, in_date: null, pay_date: null, price: null, unit: 'Kg', paid_amount: null};
    self.vend_pay = angular.copy(original);
  } else {
    original = vend_pay;
    self.vend_pay = angular.copy(original);
  } 

  services.getVendors().then(function(data){
    self.venders = data.data;
  });

  services.getIngredients().then(function(data){
    self.ingredients = data.data;
  });  

  self.isClean = function() {
    return angular.equals(original, self.vend_pay);
  }
 
  self.hide = function() {
    $mdDialog.hide();
  };

  self.cancel = function() {
    $mdDialog.cancel();
  };

  self.submit = function(v) {
	 $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
	
     if(isNew){
       console.log('isnew', v);
	     services.insertVendorPay(v).then(function(resp){
          self.afterSubmit(resp);
         });
    } else {
      console.log('isold', v);
       services.updateVendorPay(v.id, v).then(function(resp){
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

// app.filter('startFrom', function() {
//     return function(input, start) {
//         start = +start; //parse to int
//         return input.slice(start);
//     }
// });