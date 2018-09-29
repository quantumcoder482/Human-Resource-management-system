var app=angular.module('App').controller('SmsCustomerController', 
function($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services){
  if($cookies.session_uid == 'null' || $cookies.session_uid == null){ $scope.Expire_Session(); }

    $rootScope.pagetitle = 'SMS To Customer';
    var self             = $scope;
    var root             = $rootScope;
    self.loading         = true;
    self.name            = 'To';
    self.address         = 'Address';
    self.allbool         = false;
	
    
    services.getCustomers().then(function(data){
      self.customer = data.data;
      self.loading = false;
      $scope.numberOfPages=function(){
          return Math.ceil(self.customer.length/$scope.pageSize);            
      }
    });

   self.selectCus = function(u) {
      self.name = u.name;
      self.address = u.address;
      self.sms = {to:u.contact, text:''};
    };

    self.allcustomerSMS = function(e){
      //console.log(self.allbool);
      if(self.allbool){
        self.name = "All Customer";
        self.address = 'All';
        self.sms = {to:'All Contact', text:''};
      } else {
        self.name = "To";
        self.address = 'Address';
        self.sms = {to:'', text:''};        
      }
    }

   self.sms_send = function(sms) {
      $mdToast.show($mdToast.simple().content("Sending...").position('bottom right'));
      self.loader = true;

      services.sendSMS(sms.to, sms.text).then(function(resp){
          self.afterSubmit(resp);
      });
    };

    self.afterSubmit = function(resp) {
      console.log(resp);
      if(resp.status == 'success'){
        $mdToast.show($mdToast.simple().hideDelay(1000).content('Success').position('bottom right'))
        .then(function() {
          $mdDialog.hide();
          window.location.reload();    
        });  
      }else{
        $mdToast.show($mdToast.simple().hideDelay(3000).content('Failed').position('bottom right'))
      }    
    };     
});
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        if(input)
        return input.slice(start);
    }
});
 