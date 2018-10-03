angular.module('App').controller('MenulistController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services) {
    if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
      $scope.Expire_Session();
    }

    var self = $scope;
    var root = $rootScope;
    root.toolbar_menu = null;
    var original;
    self.loading = true;

    $rootScope.pagetitle = 'All Menu';


    original = {
      name: '',
      info: '',
      price: ''
    };
    self.menulist = angular.copy(original);

    services.getMenulist().then(function (data) {
      //console.log(data.data);

      var list = [];
      for (var i = 0; i < data.data.length; i++) {
        var item = data.data[i].item_names.split(",%,%");
        var quan = data.data[i].quantity.split(",");
        var info = '';
        for (var j = 0; j < quan.length - 1; j++) {
          info += item[j] + ':' + quan[j] + ', ';
        }
        list.push({
          id: data.data[i].id,
          name: data.data[i].name,
          info: info,
          price: data.data[i].total_price
        });
        info = '';
      }

      //console.log(list);
      self.menulist = list;
      self.loading = false;

      $scope.numberOfPages = function () {
        return Math.ceil(self.menulist.length / $scope.pageSize);
      }

    });


    $scope.sort = function (keyname) {
      $scope.sortKey = keyname; //set the sortKey to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    self.deleteMenu = function (ev, u) {
      var confirm = $mdDialog.confirm().title('Delete Confirmation')
        .content('Are you sure want to delete Vendor : ' + u.name + ' ?')
        .targetEvent(ev)
        .ok('OK').cancel('CANCEL');

      $mdDialog.show(confirm).then(function () {
        services.deleteMenu(u.id).then(function (res) {
          //console.log(JSON.stringify(res));
          if (res.status == 'success') {
            $mdToast.show($mdToast.simple().hideDelay(1000).content('Delete Menu ' + u.name + ' Success!').position('bottom right'))
              .then(function () {
                window.location.reload();
              });
          } else {
            $mdToast.show(
              $mdToast.simple().hideDelay(6000).action('CLOSE').content('Opps , Failed delete Menu ' + u.name).position('bottom right')
            ).then(function (response) {

            });
          }
        });
      }, function () {});
    };

    self.menuPrint = function (e) {
      services.generateInvoice(e);
    }

  });