var app = angular.module('App').controller('EmployeeSalaryController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services, $routeParams) {
    if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
      $scope.Expire_Session();
    }

    var self = $scope;
    var root = $rootScope;
    self.loading = true;
    self.month = toISOLocal(new Date()).split("T")[0].slice(0, 7); //new Date().toISOString().split("T")[0]
    self.month = self.month.split('-').reverse().join('-');

    self.add = $routeParams.add;
    $rootScope.pagetitle = 'Employee Salary';

    services.getEmployeeSalary().then(function (data) {
      var month = self.month.split('-').reverse().join('-');
      services.getMonthAttendance(month).then(function (resp) {
        for (var j = 0; j < data.data.length; j++) {
          var absent = 0;
          for (var i = 0; i < resp.data.length; i++) {
            if (resp.data[i].attendance.search(',' + data.data[j].id + ',') > -1) {
              absent++;
            }
          }
          data.data[j].absent = absent;
          data.data[j].first = false;
          data.data[j].second = false;
          data.data[j].third = false;
        }
        services.getMonthSalary(month).then(function (rep) {
          if (rep.data != '') {
            var att = rep.data[0].due.split(",");
            for (var k = 0; k < att.length; k++) {
              var index = data.data.map((o) => o.id).indexOf(Number(att[k]));
              if (index > -1) {
                data.data[index].first = true;
              }
            }
            var res = rep.data[0].paid.split(",");
            for (var k = 0; k < res.length; k++) {
              var index = data.data.map((o) => o.id).indexOf(Number(res[k]));
              if (index > -1) {
                data.data[index].second = true;
              }
            }
            var att = rep.data[0].dispute.split(",");
            for (var k = 0; k < att.length; k++) {
              var index = data.data.map((o) => o.id).indexOf(Number(att[k]));
              if (index > -1) {
                data.data[index].third = true;
              }
            }
          }
          self.emp_catagory = data.data;
          $scope.numberOfPages = function () {
            return Math.ceil(self.emp_catagory.length / $scope.pageSize);
          }
          self.loading = false;
        });
      });
    });

    self.loadmonthsalary = function (m) {
      $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
      self.loader = true;
      m = m.split('-').reverse().join('-'); 

      services.getEmployeeSalary().then(function (data) {
        services.getMonthAttendance(m).then(function (resp) {
          for (var j = 0; j < data.data.length; j++) {
            var absent = 0;
            for (var i = 0; i < resp.data.length; i++) {
              if (resp.data[i].attendance.search(',' + data.data[j].id + ',') > -1) {
                absent++;
              }
            }
            data.data[j].absent = absent;
            data.data[j].first = false;
            data.data[j].second = false;
            data.data[j].third = false;
          }
          services.getMonthSalary(m).then(function (rep) {
            if (rep.data != '') {
              var att = rep.data[0].due.split(",");
              for (var k = 0; k < att.length; k++) {
                var index = data.data.map((o) => o.id).indexOf(Number(att[k]));
                if (index > -1) {
                  data.data[index].first = true;
                }
              }
              var res = rep.data[0].paid.split(",");
              for (var k = 0; k < res.length; k++) {
                var index = data.data.map((o) => o.id).indexOf(Number(res[k]));
                if (index > -1) {
                  data.data[index].second = true;
                }
              }
              var att = rep.data[0].dispute.split(",");
              for (var k = 0; k < att.length; k++) {
                var index = data.data.map((o) => o.id).indexOf(Number(att[k]));
                if (index > -1) {
                  data.data[index].third = true;
                }
              }
            }
            self.emp_catagory = data.data;

            $scope.numberOfPages = function () {
              return Math.ceil(self.emp_catagory.length / $scope.pageSize);
            }
            self.loading = false;
          });
        });
      });
    }

    $scope.sort = function (keyname) {
      $scope.sortKey = keyname; //set the sortKey to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    self.Updatesalarydue = function (ev, x, month) {
      month = month.split('-').reverse().join('-');
      console.log(x);
      if (x.first) {
        services.getMonthSalary(month).then(function (resp) {
          var att = resp.data[0].due.replace(',' + x.id + ',', ',');
          services.updateMonthSalary(resp.data[0].id, att, 'due').then(function (res) {
            $mdToast.show($mdToast.simple().content("Updated.").position('bottom right'));
          });
        });

      } else {
        services.getMonthSalary(month).then(function (resp) {
          if (resp.data == '') {
            services.insertMonthSalary(month, x.id, 'due').then(function (data) {
              $mdToast.show($mdToast.simple().content("Updated.").position('bottom right'));
            });
          } else {
            var fir = resp.data[0].due += x.id + ',';
            var sec = resp.data[0].paid.replace(',' + x.id + ',', ',');
            var thi = resp.data[0].dispute.replace(',' + x.id + ',', ',');
            services.updateMonthSalaryAll(resp.data[0].id, fir, sec, thi, 'due').then(function (res) {
              $mdToast.show($mdToast.simple().content("Updated.").position('bottom right'));
            });
          }
        });
      }
    }

    self.Updatesalarypaid = function (ev, x, month) {
      month = month.split('-').reverse().join('-');
      if (x.second) {
        services.getMonthSalary(month).then(function (resp) {
          var att = resp.data[0].paid.replace(',' + x.id + ',', ',');
          services.updateMonthSalary(resp.data[0].id, att, 'paid').then(function (res) {
            $mdToast.show($mdToast.simple().content("Updated.").position('bottom right'));
          });
        });

      } else {
        services.getMonthSalary(month).then(function (resp) {
          if (resp.data == '') {
            services.insertMonthSalary(month, x.id, 'paid').then(function (data) {
              $mdToast.show($mdToast.simple().content("Updated.").position('bottom right'));
            });
          } else {
            var sec = resp.data[0].paid += x.id + ',';
            var fir = resp.data[0].due.replace(',' + x.id + ',', ',');
            var thi = resp.data[0].dispute.replace(',' + x.id + ',', ',');
            services.updateMonthSalaryAll(resp.data[0].id, fir, sec, thi, 'paid').then(function (res) {
              $mdToast.show($mdToast.simple().content("Updated.").position('bottom right'));
            });
          }
        });
      }
    }

    self.Updatesalarydispute = function (ev, x, month) {
      month = month.split('-').reverse().join('-');
      if (x.third) {
        services.getMonthSalary(month).then(function (resp) {
          var att = resp.data[0].dispute.replace(',' + x.id + ',', ',');
          services.updateMonthSalary(resp.data[0].id, att, 'dispute').then(function (res) {
            $mdToast.show($mdToast.simple().content("Updated.").position('bottom right'));
          });
        });

      } else {
        services.getMonthSalary(month).then(function (resp) {
          if (resp.data == '') {
            services.insertMonthSalary(month, x.id, 'dispute').then(function (data) {
              $mdToast.show($mdToast.simple().content("Updated.").position('bottom right'));
            });
          } else {
            var thi = resp.data[0].dispute += x.id + ',';
            var sec = resp.data[0].paid.replace(',' + x.id + ',', ',');
            var fir = resp.data[0].due.replace(',' + x.id + ',', ',');
            services.updateMonthSalaryAll(resp.data[0].id, fir, sec, thi, 'dispute').then(function (res) {
              $mdToast.show($mdToast.simple().content("Updated.").position('bottom right'));
            });
          }
        });
      }
    }
  });

/*function getCheckValue(salaryData, ite, targetData){                      
  var att = salaryData[ite].split(",");
  for (var k=0; k<att.length; k++){
      var index = targetData.map((o) => o.id).indexOf(Number(att[k]));
      if (index > -1){
        return index;
      }
  }
  return -1;
}*/