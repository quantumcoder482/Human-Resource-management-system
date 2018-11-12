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
    self.pay_option = 0;

    // Default Sort 
    self.sortKey = 'id';
    self.reverse = true;


    services.getBookings().then(function (data) {
      // console.log(data.data);
      self.bookingdata = data.data;
      if(self.bookingdata){
        for(i=0;i<=self.bookingdata.length-1;i++){
          self.bookingdata[i].discount = dateformat(self.bookingdata[i].discount);
          self.bookingdata[i].discount_1 = dateformat(self.bookingdata[i].discount_1);
          self.bookingdata[i].discount_2 = dateformat(self.bookingdata[i].discount_2);
          self.bookingdata[i].discount_3 = dateformat(self.bookingdata[i].discount_3);
          self.bookingdata[i].dispute = dateformat(self.bookingdata[i].dispute);
          self.bookingdata[i].dispute_1 = dateformat(self.bookingdata[i].dispute_1);
          self.bookingdata[i].booking_date = dateformat(self.bookingdata[i].booking_date);
          self.bookingdata[i].booking_date1 = dateformat(self.bookingdata[i].booking_date1);
          self.bookingdata[i].booking_date2 = dateformat(self.bookingdata[i].booking_date2);
          self.bookingdata[i].booking_date3 = dateformat(self.bookingdata[i].booking_date3);
          self.bookingdata[i].booking_date4 = dateformat(self.bookingdata[i].booking_date4);
        }
      }

      self.numberOfPages = function () {
        return Math.ceil(self.bookingdata.length / self.pageSize);
      }
      self.loading = false;
    });

    self.sort = function (keyname) {
      self.sortKey = keyname; //set the sortKey to the param passed
      self.reverse = !self.reverse; //if true make it false and vice versa
    }

    self.UpdateBookingInfo = function (ev, u) {
      if (u.customer_amount >= u.total_price) u.totalpaid = 1;
      // Date formater
       u.discount = dateformat(u.discount);
       u.discount_1 = dateformat(u.discount_1);
       u.discount_2 = dateformat(u.discount_2);
       u.discount_3 = dateformat(u.discount_3);
       u.dispute = dateformat(u.dispute);
       u.dispute_1 = dateformat(u.dispute_1);
       u.booking_date = dateformat(u.booking_date);
       u.booking_date1 = dateformat(u.booking_date1);
       u.booking_date2 = dateformat(u.booking_date2);
       u.booking_date3 = dateformat(u.booking_date3);
       u.booking_date4 = dateformat(u.booking_date4);
       
      services.Update_BookingInfo(u).then(function (data) {
        if (data.data.status == 'success')
          $mdToast.show($mdToast.simple().hideDelay(3000).content(data.data.msg).position('bottom right'));
        else $mdToast.show($mdToast.simple().hideDelay(3000).content('failed').position('bottom right'));
     
        // Date formater
        u.discount = dateformat(u.discount);
        u.discount_1 = dateformat(u.discount_1);
        u.discount_2 = dateformat(u.discount_2);
        u.discount_3 = dateformat(u.discount_3);
        u.dispute = dateformat(u.dispute);
        u.dispute_1 = dateformat(u.dispute_1);
        u.booking_date = dateformat(u.booking_date);
        u.booking_date1 = dateformat(u.booking_date1);
        u.booking_date2 = dateformat(u.booking_date2);
        u.booking_date3 = dateformat(u.booking_date3);
        u.booking_date4 = dateformat(u.booking_date4);

      });    


    }

    self.deleteBooking = function (ev, u) {
      services.delete_Booking(u.id).then(function (resp) {
        self.afterSubmit(resp);
      });
    }

    self.PrintBookingInfo = function (ev, u) {
      var id = u.id;
        services.printBooking1(id).then(function (data) {
          console.log("booking print successed");
          newPopup('info'+id);
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

    function newPopup(url) {
      popupWindow = window.open(
        '../booking/' + url + '.pdf',
        'popUpWindow',
        'height=800,width=600,right=5,top=5,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')
    }

    var dateformat = function(data){
      return data.split('-').reverse().join('-');
    }
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

app.filter('mysqlToJS', function () {
  return function (mysqlStr) {
    var t, result = null;
    if (typeof mysqlStr === 'string') {
      t = mysqlStr.split(/[- :]/);
      //when t[3], t[4] and t[5] are missing they defaults to zero
      result = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
    }
    return result;
  };
});