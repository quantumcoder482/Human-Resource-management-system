var application = angular.module('App', [ 'ngMaterial', 'ngRoute', 'ngMessages', 'ngCookies', 'ngSanitize','textAngular', 'angularjs-datetime-picker']);

angular.module('App').config( 
  function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('deep-orange')
    .accentPalette('orange');
  }
);

angular.module('App').config(['$routeProvider', function($routeProvider) {
    $routeProvider.
	
	   when('/home', {
        templateUrl : 'templates/page/home/home.html',
        controller  : 'HomeController'
      }).
	   when('/pos', {
        templateUrl : 'templates/page/pos/pos.html',
        controller  : 'PosController'
      }).
     when('/booking', {
        templateUrl : 'templates/page/booking/index.html',
        controller  : 'BookingController'
      }).
     when('/booking_list', {
        templateUrl : 'templates/page/booking/payment.html',
        controller  : 'BookingListController'
      }).
     when('/booking_report', {
        templateUrl : 'templates/page/booking/report.html',
        controller  : 'BookingReportController'
      }).
     when('/menu', {
        templateUrl : 'templates/page/menu/menu.html',
        controller  : 'MenuController'
      }).
     when('/menulist', {
        templateUrl : 'templates/page/menu/menulist.html',
        controller  : 'MenulistController'
      }).
	   when('/cal_ingredient', {
        templateUrl : 'templates/page/pos/cal_ingredient.html',
        controller  : 'CalingredientController'
      }).
	   when('/report', {
        templateUrl : 'templates/page/report/report.html',
        controller  : 'ReportController'
      }).
	   when('/report_sale', {
        templateUrl : 'templates/page/report/report_sale.html',
        controller  : 'ReportSaleController'
      }).
	  when('/product/:page', {
        templateUrl : 'templates/page/product/product.html',
        controller  : 'ProductController'
      }).
	   
	   when('/product_add/', {
        templateUrl : 'templates/page/product/product_new.html',
        controller  : 'ProductAddController'
      }).
	 
	  when('/product_edit/:id', {
        templateUrl : 'templates/page/product/product_edit.html',
        controller  : 'ProductEditController'
      }).
      
     when('/consumption/:id', {
        templateUrl : 'templates/page/consumption/consumption.html',
        controller  : 'ConsumptionController'
      }).
	  
	  when('/category', {
        templateUrl : 'templates/page/category/category.html',
        controller  : 'CategoryController'
      }).
	  
	  when('/ingredient', {
        templateUrl : 'templates/page/ingredients/ingredients.html',
        controller  : 'IngredientController'
      }).
	  
    when('/subcategory', {
      templateUrl : 'templates/page/subcategory/subcategory.html',
      controller  : 'SubcategoryController'
      }).
    when('/stock/:id', {
      templateUrl : 'templates/page/stock/stock.html',
      controller  : 'StockController'
      }).
    when('/stockhistory', {
      templateUrl : 'templates/page/stock/stockhistory.html',
      controller  : 'StockhistoryController'
      }).
    when('/subcategory/:cat', {
      templateUrl : 'templates/page/subcategory/subcategory.html',
      controller  : 'SubcategoryController'
      }).
	  when('/stock_value', {
      templateUrl : 'templates/page/stock/stock_value.html',
      controller : 'StockValueController'
      }).
    when('/stock_add_deduct',{
      templateUrl : 'templates/page/stock/stock_add_deduct.html',
      controller : 'StockAddDeductController'
    }).
	  when('/setting', {
        templateUrl : 'templates/page/setting/setting.html',
        controller  : 'SettingController'
      }). 
	  
	  when('/profile_add', {
        templateUrl : 'templates/page/setting/profile_add.html',
        controller  : 'ProfileAddController'
      }). 
	  
	  when('/profile_list', {
        templateUrl : 'templates/page/setting/profile_list.html',
        controller  : 'ProfileListController'
      }). 
	   
	  when('/user', {
        templateUrl : 'templates/page/user/user.html',
        controller  : 'UserController'
      }).  
	  
	  when('/login', {
        templateUrl : 'templates/page/login/login.html',
        controller  : 'LoginController'
      }).
	    when('/myorder', {
        templateUrl : 'templates/page/myorder/myorder.html',
        controller  : 'RorderController'
      }).
	    when('/employee', {
        templateUrl : 'templates/page/employee/employee.html',
        controller  : 'EmployeeController'
      }).
	    when('/employee_add', {
        templateUrl : 'templates/page/employee/employee_add.html',
        controller  : 'EmployeeAddController'
      }).
	    when('/employee_attendance', {
        templateUrl : 'templates/page/employee/employee_attendance.html',
        controller  : 'EmployeeAttendanceController'
      }).
	    when('/employee_catagory', {
        templateUrl : 'templates/page/employee/employee_catagory.html',
        controller  : 'EmployeeCatagoryController'
      }). 
	    when('/employee_salary', {
        templateUrl : 'templates/page/employee/employee_salary.html',
        controller  : 'EmployeeSalaryController'
      }). 

    when('/temporary', {
        templateUrl : 'templates/page/temporary/temporary.html',
        controller  : 'TemporaryController'
      }). 

    when('/temp_pay', {
        templateUrl : 'templates/page/temporary/temp_pay.html',
        controller  : 'TempPayController'
      }). 

	  when('/customer', {
        templateUrl : 'templates/page/user/user.html',
        controller  : 'UserController'
      }).

	  when('/customer_pay', {
        templateUrl : 'templates/page/user/user_pay.html',
        controller  : 'UserPayController'
      }).
    
    when('/vendor', {
        templateUrl : 'templates/page/vendor/vendor.html',
        controller  : 'VendorController'
      }).
    
    when('/vendor_stock', {
        templateUrl : 'templates/page/vendor/vendor_stock.html',
        controller : 'VendorStockController'
    }).

    when('/vendor_pay', {
        templateUrl : 'templates/page/vendor/vendor_pay.html',
        controller  : 'VendorPayController'
      }).    

    when('/sms_cus', {
        templateUrl : 'templates/page/sms/sms_cus.html',
        controller  : 'SmsCustomerController'
      }).   

    when('/sms_emp', {
        templateUrl : 'templates/page/sms/sms_emp.html',
        controller  : 'SmsEmployeeController'
      }).
	 
	  otherwise({
        redirectTo  : '/login'
      });
}]);

angular.module('App').run(function($location, $rootScope) {
  $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
    $rootScope.title = current.$$route.title;
  });
});