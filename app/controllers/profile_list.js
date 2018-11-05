var app = angular.module('App').controller('ProfileListController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services, $routeParams) {
    if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
      $scope.Expire_Session();
    }

    var self = $scope;
    var root = $rootScope;
    self.loading = true;

    self.add = $routeParams.add;
    $rootScope.pagetitle = 'All Profiles';

    root.toolbar_menu = null;
    //root.toolbar_menu = { title: 'Add Profile' }
    root.barAction = function (ev) {
      self.addEmployee(ev);
    }

    services.getAllProfile().then(function (data) {
      self.profile = data.data;
      self.loading = false;
      $scope.numberOfPages = function () {
        return Math.ceil(self.profile.length / $scope.pageSize);
      }
    });

    $scope.sort = function (keyname) {
      $scope.sortKey = keyname; //set the sortKey to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    self.editProfile = function(ev,user){
      var id = user.id;
      location.href = "#profile_edit/" + id;  
    }

    self.deleteProfile = function (ev, user) {
      var id = user.id;
      var confirm = $mdDialog.confirm().title('Delete Confirmation')
        .content('sorry delete user not allowed?')
        .targetEvent(ev)
        .ok('OK').cancel('CANCEL');

      $mdDialog.show(confirm).then(function () {
        $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
        services.deleteProfile(id).then(function(){
          location.reload();
        });
      }, function () {});
    };


    /*
     *  Update Profile   .....
     */

    self.UpdateEmployee = function (ev, s) {
      var confirm = $mdDialog.confirm().title('Confirmation?')
        .content('Are you sure want to update Status?')
        .targetEvent(ev)
        .ok('OK').cancel('CANCEL');

      $mdDialog.show(confirm).then(function () {
        //  $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
        if (s.status == 1) {
          s.status = 0;
        } else {
          s.status = 1;
        }

        $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
        services.updateEmployee(s.id, s).then(function (resp) {
          self.afterSubmit(resp);
        });
      }, function () {});
    };

    self.deleteEmployee = function (ev, s) {
      var confirm = $mdDialog.confirm().title('Delete Confirmation')
        .content('sorry delete employee not allowed?')
        .targetEvent(ev)
        .ok('OK').cancel('CANCEL');

      $mdDialog.show(confirm).then(function () {
        /*  services.deleteSubcat(s.id).then(function(res){
        console.log(JSON.stringify(res));
        if(res.status == 'success'){
		  services.decreaseCategoryCounter(s.category_id);//decrement subcat counter in category
          $mdToast.show($mdToast.simple().hideDelay(1000).content('Delete Subcategory '+s.s_title+' Success!').position('bottom right'))
          .then(function() {
            window.location.reload();
          });
        }else{
          $mdToast.show(
            $mdToast.simple().hideDelay(6000).action('CLOSE').content('Opps , Failed delete Sub-category '+s.s_title).position('bottom right')
          ).then(function(response){
          });
        }        
      });*/
      }, function () {});
    };

    self.addEmployee = function (ev) {
      $mdDialog.show({
        controller: EmployeeControllerDialog,
        templateUrl: 'templates/page/employee/create.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        employee: null
      })
    };

    self.editEmployee = function (ev, s) {
      $mdDialog.show({
        controller: EmployeeControllerDialog,
        templateUrl: 'templates/page/employee/create.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        employee: s
      })
    };

  });

function EmployeeControllerDialog($scope, $mdDialog, services, $mdToast, $route, employee) {
  var self = $scope;
  var isNew = (employee == null) ? true : false;
  var original;

  self.title = (isNew) ? 'Add Employee' : 'Edit Employee';
  self.buttonText = (isNew) ? 'SAVE' : 'UPDATE';

  self.status = [{
      id: 1,
      name: 'Active'
    },
    {
      id: 0,
      name: 'In-active'
    },
  ];



  if (isNew) {
    original = {
      name: null,
      sex: null,
      contact: '',
      email: '',
      address: '',
      aadhaar: '',
      parent_f: '',
      parent_m: '',
      position: '',
      join: '',
      salary: '',
      incentives: '',
      blood: '',
      active: '',
      leave: ''
    };
    self.employee = angular.copy(original);

    services.getCategories().then(function (data) {
      self.categories = data.data;
    });

  } else {
    original = employee;
    self.employee = angular.copy(original);

    services.CategoryTitleById(self.employee.category).then(function (data) {
      self.categories = data.data;
    });

  }

  self.isClean = function () {
    return angular.equals(original, self.employee);
  }

  self.hide = function () {
    $mdDialog.hide();
  };

  self.cancel = function () {
    $mdDialog.cancel();
  };

  self.submit = function (s) {
    $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
    self.loader = true;

    if (isNew) {
      services.insertEmployee(s).then(function (resp) {
        self.afterSubmit(resp);
      });
    } else {
      services.updateEmployee(s.id, s).then(function (resp) {
        self.afterSubmit(resp);
      });
    }
  };

  self.afterSubmit = function (resp) {
    if (resp.status == 'success') {
      $mdToast.show($mdToast.simple().hideDelay(1000).content(resp.msg).position('bottom right'))
        .then(function () {
          $mdDialog.hide();
          window.location.reload();
        });
    } else {
      $mdToast.show($mdToast.simple().hideDelay(3000).content(resp.msg).position('bottom right'))
    }
  };
}