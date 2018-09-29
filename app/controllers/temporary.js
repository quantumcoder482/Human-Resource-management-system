var app=angular.module('App').controller('TemporaryController', 
function($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services){
  if($cookies.session_uid == 'null' || $cookies.session_uid == null){ $scope.Expire_Session(); }

  $rootScope.pagetitle = 'Temporary';
  var self             = $scope;
  var root             = $rootScope;
  self.loading         = true;
	
	root.toolbar_menu = { title: 'Add Temporary' }
	root.barAction =  function(ev) {
    self.addTemporary(ev);
  }
      
  services.getTemporarys().then(function(data){
    self.emp = data.data;
    $scope.numberOfPages=function(){
        return Math.ceil(self.emp.length/$scope.pageSize);                
    }
    self.loading = false;
  });
  
  $scope.sort = function(keyname){
		$scope.sortKey = keyname;   //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
	}

  self.deleteTemporary = function(ev, u) {
    var confirm = $mdDialog.confirm().title('Delete Confirmation')
      .content('Are you sure want to delete temporary : '+u.name+' ?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

    $mdDialog.show(confirm).then(function() {
      services.deleteTemporary(u.id).then(function(res){
        //console.log(JSON.stringify(res));
        if(res.status == 'success'){
          $mdToast.show($mdToast.simple().hideDelay(1000).content('Delete temporary '+u.name+' Success!').position('bottom right'))
          .then(function() {
            window.location.reload();
          });
        }else{
          $mdToast.show(
            $mdToast.simple().hideDelay(6000).action('CLOSE').content('Opps , Failed delete temporary '+ u.name).position('bottom right')
          ).then(function(response){

          });
        }        
      });
      }, function() {
    });
  };  
  
  
   self.BanTemporary = function(ev, u) {
    var confirm = $mdDialog.confirm().title('Ban Confirmation')
      .content('Are you sure want to Ban temporary employee : '+u.fname+' ?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

    $mdDialog.show(confirm).then(function() {
		 u.is_banned=1;
	     u.session_token='';
       services.updateTemporary(u.id, u).then(function(resp){
      
        if(resp.status == 'success'){
          $mdToast.show($mdToast.simple().hideDelay(1000).content('Ban user '+u.fname+' Success!').position('bottom right'))
        
        }else{
          $mdToast.show(
            $mdToast.simple().hideDelay(6000).action('CLOSE').content('Opps , Failed to Ban User '+ u.fname).position('bottom right')
          ).then(function(response){

          });
        }        
      });
      }, function() {
    });
  };  
  
  
  self.ActivateTemporary = function(ev, u) {
    var confirm = $mdDialog.confirm().title('Activate Confirmation')
      .content('Are you sure want to Activate user : '+u.fname+' ?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

    $mdDialog.show(confirm).then(function() {
		 u.is_banned=0;
	     u.session_token='';
       services.updateTemporary(u.id, u).then(function(resp){
      
        if(resp.status == 'success'){
          $mdToast.show($mdToast.simple().hideDelay(1000).content('Activate user '+u.fname+' Success!').position('bottom right'))
        
        }else{
          $mdToast.show(
            $mdToast.simple().hideDelay(6000).action('CLOSE').content('Opps , Failed to Activate User '+ u.fname).position('bottom right')
          ).then(function(response){

          });
        }        
      });
      }, function() {
    });
  };  
  
  
  
	self.addTemporary = function(ev) {
    $mdDialog.show({
      controller          : TemporaryControllerDialog,
      templateUrl         : 'templates/page/temporary/create.html',
      parent              : angular.element(document.body),
      targetEvent         : ev,
      clickOutsideToClose : false,
      emp                 : null
    })
  }; 
  
 
  self.editTemporary = function(ev, u) {
    $mdDialog.show({
      controller          : TemporaryControllerDialog,
      templateUrl         : 'templates/page/temporary/create.html',
      parent              : angular.element(document.body),
      targetEvent         : ev,
      clickOutsideToClose : false,
      emp                	: u
    })
  };
   
});

  
function TemporaryControllerDialog($scope, $mdDialog, services, $mdToast, $route, emp) {
  var self = $scope;
  var original ;
   var isNew = (emp == null) ? true : false;

  self.title      = (isNew) ? 'Add Temporary Employee' : 'Edit Temporary Employee';
  self.buttonText = (isNew) ? 'SAVE' : 'UPDATE';

	if (isNew) {
    original = { name: null, contact: null, alternate: null, aadhaar: null, address: null, worktype_id: null, rate: null, join: null, leave: null };
    self.emp = angular.copy(original);
  } else {
    original = emp;
    self.emp = angular.copy(original);
  }
	
 
  self.isClean = function() {
    return angular.equals(original, self.emp);
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
	     services.insertTemporary(t).then(function(resp){
          self.afterSubmit(resp);
         });
    } else {
      console.log('isold');
       services.updateTemporary(t.id, t).then(function(resp){
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

 app.filter('startFrom', function() {
     return function(input, start) {
         start = +start; //parse to int
         if(input)
         return input.slice(start);
     }
 });