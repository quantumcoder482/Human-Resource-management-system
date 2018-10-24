var app = angular.module('App').controller('BookingListController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services) {
    if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
      $scope.Expire_Session();
    }

    $rootScope.pagetitle = 'Booking Payment';
    var self = $scope;
    var root = $rootScope;
    self.loading = true;
    root.toolbar_menu = null;
    self.second_pay = false;

    services.getBookings().then(function (data) {
      console.log(data.data);
      self.bookingdata = data.data;
      $scope.numberOfPages = function () {
        return Math.ceil(self.bookingdata.length / $scope.pageSize);
      }
      self.loading = false;
    });

    $scope.sort = function (keyname) {
      $scope.sortKey = keyname; //set the sortKey to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    self.UpdateBookingInfo = function (ev, u) {
      if (u.customer_amount >= u.total_price) u.totalpaid = 1;
      services.Update_BookingInfo(u).then(function (data) {
        if (data.data.status == 'success')
          $mdToast.show($mdToast.simple().hideDelay(3000).content(data.data.msg).position('bottom right'));
        else $mdToast.show($mdToast.simple().hideDelay(3000).content('failed').position('bottom right'));
      });
    }

    self.deleteBooking = function (ev, u) {
      services.delete_Booking(u.id).then(function (resp) {
        self.afterSubmit(resp);
      });
    }

    self.afterSubmit = function (resp) {
      if (resp.status == "success") {
        $mdToast.show($mdToast.simple().hideDelay(1000).content(resp.msg).position('bottom right'))
          .then(function () {

            window.location.reload();

          });
      } else {
        $mdToast.show($mdToast.simple().hideDelay(3000).content(resp.msg).position('bottom right'))
      }
    };
    self.viewBookingDetail = function (ev, u) {
      $mdDialog.show({
        controller: BookingDetailControllerDialog,
        templateUrl: 'templates/page/booking/detail.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        cust: u
      })
    };
  });

function BookingDetailControllerDialog($scope, $mdDialog, services, $mdToast, $route, cust) {
  var self = $scope;
  var original;

  var item = cust.item_names.split(",%,%");
  var quan = cust.quantity.split(",");
  var info = '';
  for (var j = 0; j < quan.length - 1; j++) {
    info += item[j] + ' : ' + quan[j] + ', ';
  }
  if (cust.totalpaid == 1) cust.paid = 'All Paid';
  else cust.paid = 'Pending...'
  cust.info = info;
  //console.log(cust);

  self.booking_detail = cust;
  self.title = cust.contact_name + '- Booking Details';

  self.hide = function () {
    $mdDialog.hide();
  };

  self.cancel = function () {
    $mdDialog.cancel();
  };
}