var app=angular.module('App').controller('VendorController', 
function($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services){
  if($cookies.session_uid == 'null' || $cookies.session_uid == null){ $scope.Expire_Session(); }

  $rootScope.pagetitle = 'Vendor';
  var self             = $scope;
  var root             = $rootScope;
  self.loading         = true;
	
	root.toolbar_menu = { title: 'Create Vendor' }
	root.barAction =  function(ev) {
    self.addVendor(ev);
  }
      
  services.getVendors().then(function(data){
      console.log(data.data);
    self.vendor = data.data;
    self.loading = false;
  }); 

  $scope.numberOfPages=function(){
        return Math.ceil(self.vendor.length/$scope.pageSize);                
    }
  
  $scope.sort = function(keyname){
		$scope.sortKey = keyname;   //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
	}

  self.deleteVendor = function(ev, u) {
    var confirm = $mdDialog.confirm().title('Delete Confirmation')
      .content('Are you sure want to delete Vendor : '+u.name+' ?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

    $mdDialog.show(confirm).then(function() {
      services.deleteVendor(u.id).then(function(res){
        //console.log(JSON.stringify(res));
        if(res.status == 'success'){
          $mdToast.show($mdToast.simple().hideDelay(1000).content('Delete Vendor '+u.name+' Success!').position('bottom right'))
          .then(function() {
            window.location.reload();
          });
        }else{
          $mdToast.show(
            $mdToast.simple().hideDelay(6000).action('CLOSE').content('Opps , Failed delete Vendor '+ u.name).position('bottom right')
          ).then(function(response){

          });
        }        
      });
      }, function() {
    });
  };  
  
  
   self.BanVendor = function(ev, u) {
    var confirm = $mdDialog.confirm().title('Ban Confirmation')
      .content('Are you sure want to Ban Vendor : '+u.name+' ?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

    $mdDialog.show(confirm).then(function() {
		 u.is_banned=1;
	     u.session_token='';
       services.updateVendor(u.id, u).then(function(resp){
      
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
       services.updateVendor(u.id, u).then(function(resp){
      
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
  
	self.addVendor = function(ev) {
    $mdDialog.show({
      controller          : VendorControllerDialog,
      templateUrl         : 'templates/page/vendor/create.html',
      parent              : angular.element(document.body),
      targetEvent         : ev,
      clickOutsideToClose : false,
      vendor              : null
    })
  }; 
  
 
  self.editVendor = function(ev, v) {
    $mdDialog.show({
      controller          : VendorControllerDialog,
      templateUrl         : 'templates/page/vendor/create.html',
      parent              : angular.element(document.body),
      targetEvent         : ev,
      clickOutsideToClose : false,
      vendor              : v
    })
  };
   
});
  
function VendorControllerDialog($scope, $mdDialog, services, $mdToast, $route, vendor) {
  var self = $scope;
  var original ;
   var isNew = (vendor == null) ? true : false;

  self.title      = (isNew) ? 'Create Vendor' : 'Edit Vendor';
  self.buttonText = (isNew) ? 'SAVE' : 'UPDATE';
  
  services.getIngredients().then(function(data){
    self.ingredients = data.data;
  });

	if (isNew) {
    original = { name: null, contact: null, alternate: null, address: null, ingredients_id: null };
    self.vendor = angular.copy(original);
  } else {
    original = vendor;
    self.vendor = angular.copy(original);
  }
	
 
  self.isClean = function() {
    return angular.equals(original, self.vendor);
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
	     services.insertVendor(v).then(function(resp){
          self.afterSubmit(resp);
         });
    } else {
      console.log('isold', v);
       services.updateVendor(v.id, v).then(function(resp){
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