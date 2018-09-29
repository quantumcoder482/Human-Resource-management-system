var app=angular.module('App').controller('TempPayController', 
function($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services){
  if($cookies.session_uid == 'null' || $cookies.session_uid == null){ $scope.Expire_Session(); }

  $rootScope.pagetitle = 'Temporary Payment';
  var self             = $scope;
  var root             = $rootScope;
  self.loading         = true;

  // Treat check-boxes like radio buttons in AngularJS
  $scope.first = false;
  $scope.second = false;
  $scope.third = false;
  // End
	
	root.toolbar_menu = { title: 'Transaction Payment' }
	root.barAction =  function(ev) {
    self.addTempPay(ev);
  }
      
  services.getTempPayments().then(function(data){
    for(var i=0; i<data.data.length; i++) {
      switch(data.data[i].state) {
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
    self.emp_pay = data.data;
    self.loading = false;
  });   
  
  $scope.numberOfPages=function(){
        return Math.ceil(self.emp_pay.length/$scope.pageSize);                
    }
  
  $scope.sort = function(keyname){
		$scope.sortKey = keyname;   //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
	}

  self.UpdateTempPayState = function(ev, u) {
    var confirm = $mdDialog.confirm().title('Confirmation?')
      .content('Are you sure want to update Payment State?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

    $mdDialog.show(confirm).then(function() {
        $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
        if(u.first) {
          u.state = 1;
        } else if(u.second) {
          u.state = 2;
        } else if(u.third) {
          u.state = 3;
        } else {
          u.state = 0;
        }
        console.log(u.id, u.state);
        services.updateTempPayState(u.id, u.state).then(function(resp) {
          self.afterSubmit(resp);
        });
       }, function() {
     });
  }

  self.deleteTempPayment = function(ev, u) {
    var confirm = $mdDialog.confirm().title('Delete Confirmation')
      .content('Are you sure want to delete payment : '+u.name+' ?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

    $mdDialog.show(confirm).then(function() {
      services.deleteTempPayment(u.id).then(function(res){
        //console.log(JSON.stringify(res));
        if(res.status == 'success'){
          $mdToast.show($mdToast.simple().hideDelay(1000).content('Delete payment '+u.name+' Success!').position('bottom right'))
          .then(function() {
            window.location.reload();
          });
        }else{
          $mdToast.show(
            $mdToast.simple().hideDelay(6000).action('CLOSE').content('Opps , Failed delete payment '+ u.name).position('bottom right')
          ).then(function(response){

          });
        }        
      });
      }, function() {
    });
  };  
  
   self.BanTempPayment = function(ev, u) {
    var confirm = $mdDialog.confirm().title('Ban Confirmation')
      .content('Are you sure want to Ban payment : '+u.temporary_id+' ?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

    $mdDialog.show(confirm).then(function() {
		 u.is_banned=1;
	     u.session_token='';
       services.updateTempPayment(u.id, u).then(function(resp){
      
        if(resp.status == 'success'){
          $mdToast.show($mdToast.simple().hideDelay(1000).content('Ban user '+u.temporary_id+' Success!').position('bottom right'))
        
        }else{
          $mdToast.show(
            $mdToast.simple().hideDelay(6000).action('CLOSE').content('Opps , Failed to Ban User '+ u.temporary_id).position('bottom right')
          ).then(function(response){

          });
        }        
      });
      }, function() {
    });
  };  
  
    self.ActivateTempPayment = function(ev, u) {
    var confirm = $mdDialog.confirm().title('Activate Confirmation')
      .content('Are you sure want to Activate user : '+u.temporary_id+' ?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

    $mdDialog.show(confirm).then(function() {
		 u.is_banned=0;
	     u.session_token='';
       services.updateTempPayment(u.id, u).then(function(resp){
      
        if(resp.status == 'success'){
          $mdToast.show($mdToast.simple().hideDelay(1000).content('Activate user '+u.temporary_id+' Success!').position('bottom right'))
        
        }else{
          $mdToast.show(
            $mdToast.simple().hideDelay(6000).action('CLOSE').content('Opps , Failed to Activate User '+ u.temporary_id).position('bottom right')
          ).then(function(response){

          });
        }        
      });
      }, function() {
    });
  };  
 
	self.addTempPay = function(ev) {
    $mdDialog.show({
      controller          : TempPayControllerDialog,
      templateUrl         : 'templates/page/temporary/create1.html',
      parent              : angular.element(document.body),
      targetEvent         : ev,
      clickOutsideToClose : false,
      emp_pay             : null
    })
  }; 
  
  self.editTempPayment = function(ev, u) {
    $mdDialog.show({
      controller          : TempPayControllerDialog,
      templateUrl         : 'templates/page/temporary/create1.html',
      parent              : angular.element(document.body),
      targetEvent         : ev,
      clickOutsideToClose : false,
      emp_pay             : u
    })
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
   
});

  
function TempPayControllerDialog($scope, $mdDialog, services, $mdToast, $route, emp_pay) {
  var self = $scope;
  var original ;
   var isNew = (emp_pay == null) ? true : false;

  self.title      = (isNew) ? 'Create Transaction' : 'Edit Transaction';
  self.buttonText = (isNew) ? 'SAVE' : 'UPDATE';

	if (isNew) {
    original = { temporary_id: null, pay_amount: null, date: null, state: null, isFullPay: 1, isRemain: 1, isDispute: 1 };
    self.emp_pay = angular.copy(original);
  } else {
    original = emp_pay;
    self.emp_pay = angular.copy(original);
  }
	
 
  self.isClean = function() {
    return angular.equals(original, self.emp_pay);
  }
 
  self.hide = function() {
    $mdDialog.hide();
  };

  self.cancel = function() {
    $mdDialog.cancel();
  };

  self.submit = function(t) {
	 $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
	
     if(isNew){
       console.log('isnew', t);
	     services.insertTempPayment(t).then(function(resp){
          self.afterSubmit(resp);
         });
    } else {
      console.log('isold');
       services.insertTempPayment(t.id, t).then(function(resp){
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