var app=angular.module('App').controller('EmployeeCatagoryController', 
function($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services,$routeParams){
  if($cookies.session_uid == 'null' || $cookies.session_uid == null){ $scope.Expire_Session(); }
   
    var self             = $scope;
	  var root             = $rootScope;
    self.loading         = true;

    self.add = $routeParams.add;
	  $rootScope.pagetitle = 'Add Employee Catagory';
	
    services.getEmployeeCatagory().then(function(data){
        self.emp_catagory = data.data;
        self.loading = false;
    });  
  
	
    $scope.numberOfPages=function(){
        return Math.ceil(self.emp_catagory.length/$scope.pageSize);                
    }
    
     $scope.sort = function(keyname){
		$scope.sortKey = keyname;   //set the sortKey to the param passed
		$scope.reverse = !$scope.reverse; //if true make it false and vice versa
	} 
	
	
	self.UpdateEmployeeCatagory = function(ev, s) {
	   var confirm = $mdDialog.confirm().title('Confirmation?')
      .content('Are you sure want to update Status?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

      $mdDialog.show(confirm).then(function() {
      //  $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
      if(s.status==1){
        s.status=0;
      } else {
        s.status=1;	 
      }
  
      $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
         services.updateEmployee(s.id, s).then(function(resp){
			 self.afterSubmit(resp);
         });
       }, function() {
     });
  };  


  
  self.deleteEmployeeCategory  = function(ev, s) {
    var confirm = $mdDialog.confirm().title('Delete Confirmation')
      .content('sorry delete employee not allowed?')
      .targetEvent(ev)
      .ok('OK').cancel('CANCEL');

    $mdDialog.show(confirm).then(function() {
      }, function() {
    });
  };  

   self.empcata_add = function(s) {
    $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
	self.loader = true;
	  
		 //alert(JSON.stringify(s, null, 4));
    services.insertEmployeeCatagory(s).then(function(resp){
      self.afterSubmit(resp);
    });
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