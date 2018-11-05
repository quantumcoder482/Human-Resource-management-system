angular.module('App').controller('RootCtrl',
  function ($scope, $mdSidenav, $mdToast, $mdDialog, services, $cookies, $interval) {

    var self = $scope;

    $scope.bgColor = '#d9d9d9';
    $scope.black = '#000000';

    self.currentPage = 0;
    self.pageSize = 20;
    self.view = false;

    self.data = {
      user: {
        name: $cookies.session_name,
        email: $cookies.session_email,
        token: $cookies.session_token,
        icon: 'account_circle'
      }
    };

    self.pages = new Array();
    self.pages = ["EMPLOYEE","STOCK","MENU","POS","BOOKING","CUSTOMER","VENDER","SALES","SMS","TEMPORARY"];
    if ($cookies.session_permission){
      self.pages = $cookies.session_permission.split(',');
    }
    

    self.toggleSidenav = function () {
      $mdSidenav('left').toggle();
    };

    self.doLogout = function (ev) {
      var confirm = $mdDialog.confirm().title('Logout Confirmation')
        .content('Are you sure want to logout from user : ' + $cookies.session_name + ' ?')
        .targetEvent(ev)
        .ok('OK').cancel('CANCEL');
      $mdDialog.show(confirm).then(function () {
        // clear session
        $cookies.session_uid = null;
        $cookies.session_name = null;
        $cookies.session_email = null;
        $cookies.session_type = null;
        $cookies.session_permission = null;
        window.location.href = '#login';
        $mdToast.show($mdToast.simple().content('Logout Success').position('bottom right'));
      });
    };


    self.Expire_Session = function (ev) {
      // clear session
      $cookies.session_uid = null;
      $cookies.session_name = null;
      $cookies.session_email = null;
      $cookies.session_type = null;
      $cookies.session_permission = null;
      window.location.href = '#login';
      $mdToast.show($mdToast.simple().content('Session Expired Please Login').position('bottom right'));
    };

    self.toast_click = function (message) {
      var toast = $mdToast.simple().content('You clicked ' + message).position('bottom right');
      $mdToast.show(toast);
    };

    self.toast = function (message) {
      var toast = $mdToast.simple().content(message).position('bottom right');
      $mdToast.show(toast);
    };

    self.toastList = function (message) {
      var toast = $mdToast.simple().content('You clicked ' + message + ' having selected ' + $scope.selected.length + ' item(s)').position('bottom right');
      $mdToast.show(toast);
    };

    self.selected = [];
    self.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) list.splice(idx, 1);
      else list.push(item);
    };

    self.directHref = function (href) {
      self.toggleSidenav();
      window.location.href = href;
    };

    // services.getAllPages().then(function(data){
    //   var pages = data.data;
    //   for(p of pages){
    //     self.pages.push(p.page_name);
    //   }
    // });

    self.sidenav = {
      actions: [{
        name: 'DASHBOARD',
        icon: 'assessment',
        link: '#home',
        root: false,
        item: ''
      }],
      menuname: 'Main Menu'
    }

   self.menulist = [{
      name: 'EMPLOYEE',
      icon: 'account_circle',
      link: '',
      root: true,
      item: [{
        name: 'ADD NEW EMPLOYEE',
        icon: 'control_point',
        link: '#employee_add'
      }, {
        name: 'ALL EMPLOYEE',
        icon: 'looks',
        link: '#employee'
      }, {
        name: 'EMPLOYEE CATAGORY',
        icon: 'view_comfy',
        link: '#employee_catagory'
      }, {
        name: 'ATTENDANCE',
        icon: 'check_circle',
        link: '#employee_attendance'
      }, {
        name: 'SALARY',
        icon: 'attach_money',
        link: '#employee_salary'
      }]
    }, {
      name: 'STOCK',
      icon: 'account_balance_wallet',
      link: '',
      root: true,
      item: [{
          name: 'REPORT',
          icon: 'note_add',
          link: '#report'
        }, {
          name: 'CATEGORY',
          icon: 'dns',
          link: '#category'
        }, {
          name: 'SUB-CATEGORY',
          icon: 'toc',
          link: '#subcategory/0'
        }, {
          name: 'PRODUCTS',
          icon: 'restaurant_menu',
          link: '#product/0'
        }, {
          name: 'INGREDIENTS',
          icon: 'dns',
          link: '#ingredient'
        }, {
          name: 'STOCK-VALUE',
          icon: 'dns',
          link: '#stock_value'
        }, {
          name: 'STOCK ADD/DEDUCT',
          icon: 'dns',
          link: '#stock_add_deduct'
        }
        /*, {
                   name: 'STOCK HISTORY',
                   icon: 'storage',
                   link: '#stockhistory'
                   },{
                   name: 'PROFILE',
                   icon: 'settings',
                   link: '#setting'
                   },{
                   name: 'USERS',
                   icon: 'group',
                   link: '#user'
                   },*/
      ]
    }, {
      name: 'MENU',
      icon: 'menu',
      link: '',
      root: true,
      item: [{
        name: 'MAKE MENU',
        icon: 'add_to_photos',
        link: '#menu'
      }, {
        name: 'ALL MENU',
        icon: 'layers',
        link: '#menulist'
      }]
    }, {
      name: 'POS',
      icon: 'chrome_reader_mode',
      link: '',
      root: true,
      item: [{
        name: 'POS',
        icon: 'view_array',
        link: '#pos'
      }, {
        name: 'CALCULATE',
        icon: 'donut_small',
        link: '#cal_ingredient'
      }, {
        name: 'ORDERS',
        icon: 'shopping_cart',
        link: '#myorder'
      }]
    }, {
      name: 'BOOKING',
      icon: 'book',
      link: '',
      root: true,
      item: [{
        name: 'BOOKING',
        icon: 'library_books',
        link: '#booking'
      }, {
        name: 'PAYMENT',
        icon: 'payment',
        link: '#booking_list'
      }, {
        name: 'REPORT',
        icon: 'description',
        link: '#booking_report'
      }]
    }, {
      name: 'CUSTOMER',
      icon: 'account_box',
      link: '',
      root: true,
      item: [{
        name: 'ALL CUSTOMER',
        icon: 'favorite_border',
        link: '#customer'
      }, {
        name: 'CUSTOMER PAYMENT',
        icon: 'attach_money',
        link: '#customer_pay'
      }]
    }, {
      name: 'VENDER',
      icon: 'airport_shuttle',
      link: '',
      root: true,
      item: [{
          name: 'ALL VENDER',
          icon: 'event',
          link: '#vendor'
        }, {
          name: 'VENDER STOCK UPDT',
          icon: 'dns',
          link: '#vendor_stock'
        },
        /*{
                  name: 'ADD VENDER',
                  icon: 'control_point',
                  link: '#employee'
                  },*/
        {
          name: 'VENDER PAYMENT',
          icon: 'attach_money',
          link: '#vendor_pay'
        }
      ]
    }, {
      name: 'SALES',
      icon: 'description',
      link: '#report_sale',
      root: false,
      item: ''
    }, {
      name: 'SMS',
      icon: 'textsms',
      link: '',
      root: true,
      item: [{
        name: 'CUSTOMER',
        icon: 'phonelink_ring',
        link: '#sms_cus'
      }, {
        name: 'EMPLOYEE',
        icon: 'stay_current_portrait',
        link: '#sms_emp'
      }]
    }, {
      name: 'TEMPORARY',
      icon: 'people_outline',
      link: '',
      root: true,
      item: [{
          name: 'ALL TEMPORARY',
          icon: 'group',
          link: '#temporary'
        },
        /*{
                  name: 'ADD TEMPORARY',
                  icon: 'group_add',
                  link: '#employee'
                  },*/
        {
          name: 'TEMPORARY PAYMENT',
          icon: 'attach_money',
          link: '#temp_pay'
        }
      ]
    }];

    if ($cookies.session_type != 'admin'){
      self.menulist = self.menulist.filter((item) => {
        return self.pages.some(pagename=> pagename === item.name);
      });
         
    }

    for(m of self.menulist){
      self.sidenav.actions.push(m);
    }

    if ($cookies.session_type == 'admin') {
      self.sidenav.actions.push({
        name: 'PROFILE',
        icon: 'contact_mail',
        link: '',
        root: true,
        item: [{
          name: 'MY PROFILE',
          icon: 'perm_identity',
          link: '#setting'
        }, {
          name: 'ADD PROFILE',
          icon: 'account_box',
          link: '#profile_add'
        }, {
          name: 'ALL PROFILES',
          icon: 'supervisor_account',
          link: '#profile_list'
        }]
      });
      self.sidenav.menuname += ' (ADMIN)';
      $scope.bgColor = '#d9d9d9';
    }
  });