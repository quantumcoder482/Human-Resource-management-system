var app = angular.module('App').controller('EmployeeAttendanceController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services, $routeParams) {
    if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
      $scope.Expire_Session();
    }

    var self = $scope;
    var root = $rootScope;
    self.loading = true;
    self.value = toISOLocal(new Date()).split("T")[0]; 
    self.value = self.value.split('-').reverse().join('-'); //new Date().toISOString().split("T")[0]

    self.add = $routeParams.add;
    $rootScope.pagetitle = 'Employee Attendance';
    self.allAtt = false;
    self.allLea = false;
    self.allRes = false;

    //self.allAttendanceList();
    services.getEmployee_active_withAtt().then(function (data) {
      //console.log(data.data);
      services.getDateAttendance(self.value).then(function (resp) {
        //console.log(resp.data[0]);
        if (resp.data != '') {
          var att = resp.data[0].attendance.split(",");
          for (var k = 0; k < att.length; k++) {
            var index = data.data.map((o) => o.id).indexOf(Number(att[k]));
            if (index > -1) {
              data.data[index].attendance = true;
            }
          }
          var res = resp.data[0].leaved.split(",");
          for (var k = 0; k < res.length; k++) {
            var index = data.data.map((o) => o.id).indexOf(Number(res[k]));
            if (index > -1) {
              data.data[index].leaved = true;
            }
          }
        }
      });
      self.employee = data.data;
      self.loading = false;
      $scope.numberOfPages = function () {
        return Math.ceil(self.employee.length / $scope.pageSize);
      }
    });


    $scope.sort = function (keyname) {
      $scope.sortKey = keyname; //set the sortKey to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    self.UpdateAttendance = function (ev, s, date) {
      if (s.attendance == null || !s.attendance) {
        services.getDateAttendance(date).then(function (resp) {
          if (resp.data == '') {
            services.insertDateAttendance(date, s.id, 'attendance').then(function (res) {
              //console.log(res);             
              s.attendance = 1;
              $mdToast.show($mdToast.simple().content("Updated.").position('bottom right'));
            });
          } else {
            var att = resp.data[0].rest.replace(',' + s.id + ',', ',');
            services.updateDateAttendance(resp.data[0].id, att, 'rest');
            resp.data[0].attendance += s.id + ',';
            services.updateDateAttendance(resp.data[0].id, resp.data[0].attendance, 'attendance').then(function (res) {
              s.attendance = 1;
            });
          }
        });
      } else {
        services.getDateAttendance(date).then(function (resp) {
          if (resp.data != '') {
            console.log(resp.data[0]);
            var att = resp.data[0].attendance.replace(',' + s.id + ',', ',');
            services.updateDateAttendance(resp.data[0].id, att, 'attendance').then(function (res) {
              s.attendance = 0;
            });
          }
        });
      }
    };

    self.UpdateAllAtt = function (ev, s, date) {
      services.getDateAttendance(date).then(function (resp) {
        if (s) {
          services.updateDateAttendance(resp.data[0].id, ',', 'attendance').then(function (res) {
            for (var i = 0; i < self.employee.length; i++) {
              self.employee[i].attendance = false;
            }
            self.allAtt = false;
          });
        } else {
          var txt = ',';
          for (var i = 0; i < self.employee.length; i++) {
            txt += self.employee[i].id + ',';
          }
          services.updateDateAttendance(resp.data[0].id, txt, 'attendance').then(function (res) {
            services.updateDateAttendance(resp.data[0].id, ',', 'rest').then(function (res) {
              for (var i = 0; i < self.employee.length; i++) {
                self.employee[i].attendance = true;
                self.employee[i].rest = false;
              }
              self.allAtt = true;
              //window.location.reload();
            });
          });
        }
      });
    };

    self.UpdateAllLea = function (ev, s, date) {
      services.getDateAttendance(date).then(function (resp) {
        if (s) {
          services.updateDateAttendance(resp.data[0].id, ',', 'leaved').then(function (res) {
            for (var i = 0; i < self.employee.length; i++) {
              self.employee[i].leaved = false;
            }
            self.allLea = false;
          });
        } else {
          var txt = ',';
          for (var i = 0; i < self.employee.length; i++) {
            txt += self.employee[i].id + ',';
          }
          services.updateDateAttendance(resp.data[0].id, txt, 'leaved').then(function (res) {
            services.updateDateAttendance(resp.data[0].id, ',', 'rest').then(function (res) {
              for (var i = 0; i < self.employee.length; i++) {
                self.employee[i].leaved = true;
                self.employee[i].rest = false;
              }
              self.allLea = true;
              //window.location.reload();
            });
          });
        }
      });
    };

    self.UpdateAllRes = function (ev, s, date) {
      services.getDateAttendance(date).then(function (resp) {
        if (s) {
          services.updateDateAttendance(resp.data[0].id, ',', 'rest').then(function (res) {
            for (var i = 0; i < self.employee.length; i++) {
              self.employee[i].rest = false;
            }
            self.allRes = false;
          });
        } else {
          var txt = ',';
          for (var i = 0; i < self.employee.length; i++) {
            txt += self.employee[i].id + ',';
          }
          services.updateDateAttendance(resp.data[0].id, txt, 'rest').then(function (res) {
            services.updateDateAttendance(resp.data[0].id, ',', 'attendance').then(function (res) {
              services.updateDateAttendance(resp.data[0].id, ',', 'leaved').then(function (res) {
                for (var i = 0; i < self.employee.length; i++) {
                  self.employee[i].rest = true;
                  self.employee[i].attendance = false;
                  self.employee[i].leaved = false;
                }
                self.allLea = false;
                self.allAtt = false;
                self.allRes = true;
                //window.location.reload();
              });
            });
          });
        }
      });
    };

    self.UpdateLeaved = function (ev, s, date) {
      if (s.leaved == null || !s.leaved) {
        services.getDateAttendance(date).then(function (resp) {
          if (resp.data == '') {
            services.insertDateAttendance(date, s.id, 'leaved').then(function (res) {
              s.leaved = 1;
              $mdToast.show($mdToast.simple().content("Updated.").position('bottom right'));
            });
          } else {
            var att = resp.data[0].rest.replace(',' + s.id + ',', ',');
            services.updateDateAttendance(resp.data[0].id, att, 'rest');
            resp.data[0].leaved += s.id + ',';
            services.updateDateAttendance(resp.data[0].id, resp.data[0].leaved, 'leaved').then(function (res) {
              s.leaved = 1;
            });
          }
        });
      } else {
        services.getDateAttendance(date).then(function (resp) {
          if (resp.data != '') {
            var att = resp.data[0].leaved.replace(',' + s.id + ',', ',');
            services.updateDateAttendance(resp.data[0].id, att, 'leaved').then(function (res) {
              s.leaved = 0;
            });
          }
        });
      }
    };

    self.UpdateRest = function (ev, s, date) {
      if (!s.leaved && !s.attendance) {} else {
        services.getDateAttendance(date).then(function (resp) {
          resp.data[0].rest += s.id + ',';
          services.updateDateAttendance(resp.data[0].id, resp.data[0].rest, 'rest');
          if (s.leaved) {
            var att = resp.data[0].leaved.replace(',' + s.id + ',', ',');
            services.updateDateAttendance(resp.data[0].id, att, 'leaved').then(function (res) {
              self.allLea = false;
              self.allAtt = false;
              s.leaved = 0;
            });
          }
          if (s.attendance) {
            var att = resp.data[0].attendance.replace(',' + s.id + ',', ',');
            services.updateDateAttendance(resp.data[0].id, att, 'attendance').then(function (res) {
              self.allLea = false;
              self.allAtt = false;
              s.attendance = 0;
            });
          }
        });
      }
    };

    self.loadnewdate = function (s) {
      $mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
      self.loader = true;
      s = s.split('-').reverse().join('-');

      services.getEmployee_active_withAtt().then(function (data) {
        //console.log(data.data);
        services.getDateAttendance(s).then(function (resp) {
          //console.log(resp.data[0]);
          if (resp.data != '') {
            var att = resp.data[0].attendance.split(",");
            for (var k = 0; k < att.length; k++) {
              var index = data.data.map((o) => o.id).indexOf(Number(att[k]));
              if (index > -1) {
                data.data[index].attendance = true;
              }
            }
            var res = resp.data[0].leaved.split(",");
            for (var k = 0; k < res.length; k++) {
              var index = data.data.map((o) => o.id).indexOf(Number(res[k]));
              if (index > -1) {
                data.data[index].leaved = true;
              }
            }
          }
        });
        self.employee = data.data;
        self.loading = false;
        self.afterSubmit(data);
      });
    };
    self.afterSubmit = function (resp) {
      if (resp.statusText == 'OK') {
        $mdToast.show($mdToast.simple().hideDelay(1000).content('Success!').position('bottom right'))
          .then(function () {
            //$mdDialog.hide();
            //window.location.reload();    
          });
      } else {
        $mdToast.show($mdToast.simple().hideDelay(3000).content('failed!').position('bottom right'))
      }
    };

  });

function toISOLocal(d) {
  var z = n => (n < 10 ? '0' : '') + n;
  var off = d.getTimezoneOffset();
  var sign = off < 0 ? '+' : '-';
  off = Math.abs(off);

  return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' +
    z(d.getDate()) + 'T' + z(d.getHours()) + ':' + z(d.getMinutes()) +
    ':' + z(d.getSeconds()) + sign + z(off / 60 | 0) + z(off % 60);
}