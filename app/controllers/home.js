angular.module('App').controller('HomeController',
  function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services) {
    if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
      $scope.Expire_Session();
    }

    $rootScope.pagetitle = 'Home';
    var self = $scope;
    var root = $rootScope;
    self.loading = true;

    services.getIngredients().then(function (data) {
      var stock_chart_data = [];
      for (var i = 0; i < data.data.length; i++) {
        stock_chart_data.push([data.data[i].title, data.data[i].stock]);
      }
      Highcharts.chart('product', {
        chart: {
          type: 'pie',
          options3d: {
            enabled: true,
            alpha: 45
          }
        },
        title: {
          text: 'Current Stock'
        },
        subtitle: {
          text: 'unit: ' + data.data[0].unit
        },
        plotOptions: {
          pie: {
            innerSize: 100,
            depth: 45
          }
        },
        series: [{
          name: 'current amount',
          data: stock_chart_data
        }]
      });
    });

    services.getCustomerOrders().then(function (data) {
      //console.log(data.data);
      var custom_chart_data = [];
      var xaixe = [];
      var tata = [];
      var fdata = [];
      for (var i = 0; i < data.data.length; i++) {
        if (xaixe.indexOf(data.data[i].date.slice(0, 11)) < 0) {
          xaixe.push(data.data[i].date.slice(0, 11));
          fdata[data.data[i].date.slice(0, 11)] = [];
        }
        if (!fdata[data.data[i].date.slice(0, 11)].hasOwnProperty('payable')) {
          fdata[data.data[i].date.slice(0, 11)]['payable'] = data.data[i].payable_amount;
          fdata[data.data[i].date.slice(0, 11)]['left'] = data.data[i].customer_amount;
        } else {
          fdata[data.data[i].date.slice(0, 11)]['payable'] += data.data[i].payable_amount;
          fdata[data.data[i].date.slice(0, 11)]['left'] += data.data[i].customer_amount;
        }
      }
      tata = ['left', 'payable'];
      //console.log(xaixe, fdata, tata);
      if (fdata.hasOwnProperty(toISOLocal(new Date()).split("T")[0] + ' '))
        self.todaysales = parseInt(fdata[toISOLocal(new Date()).split("T")[0] + ' '].payable);
      else self.todaysales = 0;
      for (var k = 0; k < tata.length; k++) {
        chart_data = [];
        for (var i = 0; i < xaixe.length; i++) {
          if (fdata[xaixe[i]][tata[k]])
            chart_data.push(fdata[xaixe[i]][tata[k]]);
          else
            chart_data.push(0);
        }
        custom_chart_data.push({
          name: tata[k],
          data: chart_data
        });
      }
      //console.log(custom_chart_data);
      Highcharts.chart('price', {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Customer Payment'
        },
        xAxis: {
          categories: xaixe
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        legend: {
          reversed: false
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
        series: custom_chart_data
      });
    });

    services.getVendorPays().then(function (data) {
      //console.log(data.data);
      var vender_chart_data = [];
      var xaixe = [];
      var tata = [];
      var fdata = [];
      for (var i = 0; i < data.data.length; i++) {
        if (xaixe.indexOf(data.data[i].in_date) < 0) {
          xaixe.push(data.data[i].in_date);
          fdata[data.data[i].in_date] = [];
        }
        if (tata.indexOf(data.data[i].title) < 0) {
          tata.push(data.data[i].title);
        }
        if (!fdata[data.data[i].in_date].hasOwnProperty(data.data[i].title)) {
          fdata[data.data[i].in_date][data.data[i].title] = data.data[i].amount * data.data[i].price;
        } else {
          fdata[data.data[i].in_date][data.data[i].title] += data.data[i].amount * data.data[i].price;
        }
      }
      //console.log(xaixe, fdata, tata);
      for (var k = 0; k < tata.length; k++) {
        chart_data = [];
        for (var i = 0; i < xaixe.length; i++) {
          if (fdata[xaixe[i]][tata[k]])
            chart_data.push(fdata[xaixe[i]][tata[k]]);
          else
            chart_data.push(0);
        }
        vender_chart_data.push({
          name: tata[k],
          data: chart_data
        });
      }
      //console.log(vender_chart_data);
      Highcharts.chart('stock', {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Vender Payment'
        },
        xAxis: {
          categories: xaixe
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        legend: {
          reversed: false
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
        series: vender_chart_data
      });
    });

    services.GetCounter().then(function (data) {
      self.cspucount = data.data;
    });

    services.getEmployee_active_withAtt().then(function (data) {
      services.getDateAttendance(toISOLocal(new Date()).split("T")[0]).then(function (resp) {
        //console.log(resp.data);
        if (resp.data == '') self.absent = 0;
        else self.absent = parseInt(100 - (resp.data[0].attendance.split(',').length - 2) / data.data.length * 100);
      });
    });

    services.getCustomerOrders().then(function (data) {
      //console.log(data.data);
      var profit_chart_data = [];
      var xaixe = [];
      var tata = [];
      var fdata = [];
      for (var i = 0; i < data.data.length; i++) {
        if (xaixe.indexOf(data.data[i].date.slice(0, 11)) < 0) {
          xaixe.push(data.data[i].date.slice(0, 11));
          fdata[data.data[i].date.slice(0, 11)] = [];
        }
        if (!fdata[data.data[i].date.slice(0, 11)].hasOwnProperty('profit')) {
          fdata[data.data[i].date.slice(0, 11)]['profit'] = data.data[i].payable_amount - data.data[i].bill_amount;
        } else {
          fdata[data.data[i].date.slice(0, 11)]['profit'] += data.data[i].payable_amount - data.data[i].bill_amount;
        }
      }
      tata = ['profit'];
      //console.log(xaixe, fdata, tata);
      if (fdata.hasOwnProperty(toISOLocal(new Date()).split("T")[0] + ' '))
        self.todayprofit = parseInt(fdata[toISOLocal(new Date()).split("T")[0] + ' '].profit);
      else self.todayprofit = 0;
      for (var k = 0; k < tata.length; k++) {
        chart_data = [];
        for (var i = 0; i < xaixe.length; i++) {
          if (fdata[xaixe[i]][tata[k]])
            chart_data.push(Number(fdata[xaixe[i]][tata[k]].toFixed(2)));
          else
            chart_data.push(0);
        }
        profit_chart_data = chart_data;
      }
      //console.log(profit_chart_data);
      Highcharts.chart('attendance', {
        title: {
          text: 'Profit'
        },
        xAxis: {
          categories: xaixe
        },
        labels: {
          items: [{
            html: 'profit',
            style: {
              left: '50px',
              top: '18px',
              color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
            }
          }]
        },
        yAxis: {
          title: false
        },
        series: [{
            type: 'column',
            name: 'Profit',
            data: profit_chart_data
          }
          /*, {
                          type: 'column',
                          name: 'John',
                          data: [2, 3, 5, 7, 6]
                      }, {
                          type: 'column',
                          name: 'Joe',
                          data: [4, 3, 3, 9, 0]
                      }*/
          , {
            type: 'spline',
            name: 'spline',
            data: profit_chart_data,
            marker: {
              lineWidth: 2,
              lineColor: Highcharts.getOptions().colors[3],
              fillColor: 'white'
            }
          }
          /*, {
                          type: 'pie',
                          name: 'Catagory Rate',
                          data: self.employeecatarate,
                          center: [100, 80],
                          size: 100,
                          showInLegend: false,
                          dataLabels: {
                              enabled: false
                          }
                      }*/
        ]
      });
    });
    //window.location.reload(); 
  });

function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[i] = arr[i];
  return rv;
}