angular.module('App').factory("services", function ($http) {
  var serviceBase = 'app/services/'
  var obj = {};

  // Admin Login
  obj.doLogin = function (userdata) {
    return $http.post(serviceBase + 'login', userdata).then(function (results) {

      return results;
    });
  };

  obj.getUsers = function (id) {
    return $http.get(serviceBase + 'users?id=' + id);
  }

  obj.updateUsers = function (id, user) {
    return $http.post(serviceBase + 'updateUsers', {
      id: id,
      user: user
    }).then(function (status) {
      return status.data;
    });
  };

  // profiles

  obj.insertUser = function(user){
    // console.log(user);
     return $http.post(serviceBase + 'insert_user', user).then(function (status) {
       return status;
     });
  }
  obj.deleteProfile = function(user_id){
    return $http.delete(serviceBase + 'delete_profile?id=' + user_id).then(function (status){
      return status;
    });
  }

  obj.getAllProfile = function () {
    return $http.get(serviceBase + 'get_all_profile');
  }

  obj.getAllPages = function () {
    return $http.get(serviceBase + 'get_all_pages');
  }


  // SMS //

  obj.sendSMS = function (to, text) {
    return $http.get('api/sms_api.php?to=' + to + '&text=' + text).then(function (status) { //{to:to, text:text}
      return status;
    });
  };

  //////// COMMOM TRANSACTION /////////////

  obj.Inline_Update = function (table, col, value, id) {
    return $http.get(serviceBase + 'inline_update?table=' + table + ' && col=' + col + ' && value=' + value + ' && id=' + id);
  }

  obj.StockUpdate = function (id, value) {
    return $http.get(serviceBase + 'Stock_Update?value=' + value + ' && id=' + id);
  }

  obj.GetLastPriority = function (table) {
    return $http.get(serviceBase + 'get_last_priority?table=' + table);
  }

  obj.GetCounter = function () {
    return $http.get(serviceBase + 'GetCounter');
  }

  obj.generateInvoice = function (build) {
    return $http.post('api/build_order.php', build).then(function (status) {
      return status.data;
    });
  };

  obj.generateQuotation = function (build) {
    return $http.post('api/build_quotation.php', build).then(function (status) {
      alert(JSON.stringify(status, null, 4));

      return status.data;
    });
  };
  //order type 

  obj.get_ordertype = function () {
    return $http.get(serviceBase + 'get_ordertype');
  }

  //menu 

  obj.insertMenu = function (menu) {
    return $http.post(serviceBase + 'insert_menu', menu).then(function (status) {
      //alert(JSON.stringify(status, null, 4));

      return status.data;
    });
  };

  obj.getMenulist = function () {
    return $http.get(serviceBase + 'get_menulist');
  }

  obj.deleteMenu = function (id) {
    return $http.delete(serviceBase + 'deleteMenu?id=' + id).then(function (status) {
      return status.data;
    });
  };

  // Stock Transaction

  obj.getSalesReport = function (sdate, edate, type) {
    // alert(JSON.stringify(sdate, null, 4));
    return $http.get(serviceBase + 'get_Sales_Report?sdate=' + sdate + ' && edate=' + edate + '&& type=' + type);
  }

  obj.getDaySalesReport = function (theday) {
    // alert(JSON.stringify(sdate, null, 4));
    return $http.get(serviceBase + 'get_Day_Sales_Report?theday=' + theday);
  }

  obj.getIngredientStockHistory = function (id) {
    return $http.get(serviceBase + 'get_ingredient_stock_history?id=' + id);
  }

  obj.getIdealStockHistory = function () {
    return $http.get(serviceBase + 'get_ideal_stockhistory');
  }

  obj.getconsumption = function () {
    return $http.get(serviceBase + 'get_consumption');
  }

  obj.getconsumptionByproduct = function (id) {
    return $http.get(serviceBase + 'get_consumption_byproduct?id=' + id);
  }

  obj.updateopening = function () {
    return $http.get(serviceBase + 'updateopening');
  }

  obj.getIngredientmyoneStockHistory = function () {
    return $http.get(serviceBase + 'get_ingredient_myone_stock_history');
  }

  obj.insertStock = function (stock) {
    return $http.post(serviceBase + 'insert_stock', stock).then(function (status) {
      return status.data;
    });
  };

  obj.updateStock = function (id, stock) {
    return $http.post(serviceBase + 'update_stock', {
      id: id,
      stock: stock
    }).then(function (status) {
      return status.data;
    });
  };

  obj.getStockHistory = function () {
    return $http.get(serviceBase + 'get_stockhistory');
  }

  obj.BookingStockSumById = function (id) {
    return $http.get(serviceBase + 'get_booking_sum_byid?id=' + id);
  }



  // Order Transaction

  obj.getMyorders = function () {
    return $http.get(serviceBase + 'my_orders');
  }

  obj.getLastOrderId = function () {
    return $http.get(serviceBase + 'last_order_id');
  }

  obj.getOrderByID = function (id) {
    return $http.get(serviceBase + 'order_by_id?id=' + id);
  }

  obj.Updatetotalpaid_order = function (id, totalpaid) {
    return $http.get(serviceBase + 'update_order_totalpaid?id=' + id + '&totalpaid=' + totalpaid);
  }

  obj.Updatedispute_order = function (id, totalpaid) {
    return $http.get(serviceBase + 'update_order_dispute?id=' + id + '&totalpaid=' + totalpaid);
  }

  obj.insertOrder = function (myorder) {
    return $http.post(serviceBase + 'insert_order', myorder).then(function (status) {
      //alert(JSON.stringify(status, null, 4));

      return status.data;
    });
  }

  obj.insertStockhistory = function (stock) {
    return $http.post(serviceBase + 'insert_stockhistory', stock).then(function (status) {
      //alert(JSON.stringify(status, null, 4));

      return status.data;
    });
  }

  // booking

  obj.insertBooking = function (booking) {
    return $http.post(serviceBase + 'insert_booking', booking).then(function (status) {
      //alert(JSON.stringify(status, null, 4));

      return status.data;
    });
  }

  obj.getBookingProduct = function (id) {
    return $http.get(serviceBase + 'getBookingProduct?id=' + id);
  }

  obj.getBookings = function () {
    return $http.get(serviceBase + 'getBookings');
  }

  obj.Update_BookingInfo = function (u) {
    return $http.get(serviceBase + 'Update_BookingInfo?discount=' + u.discount + '&customer_amount=' + u.customer_amount + '&customer_amount_1=' + u.customer_amount_1 + '&customer_amount_2=' + u.customer_amount_2 + '&customer_amount_3=' + u.customer_amount_3 + '&discount_1=' + u.discount_1 + '&discount_2=' + u.discount_2 + '&discount_3=' + u.discount_3 + '&dispute=' + u.dispute + '&dispute_1=' + u.dispute_1 + '&id=' + u.id + '&totalpaid=' + u.totalpaid);
  }

  obj.getSalesReportBooking = function (sdate, edate, type) {
    // alert(JSON.stringify(sdate, null, 4));
    return $http.get(serviceBase + 'get_Sales_Report?sdate=' + sdate + ' && edate=' + edate + '&& type=' + type);
  }

  obj.getDaySalesReportBooking = function (theday) {
    // alert(JSON.stringify(sdate, null, 4));
    return $http.get(serviceBase + 'get_Day_Sales_Report?theday=' + theday);
  }

  obj.delete_Booking = function (id) {
    return $http.delete(serviceBase + 'delete_Booking?id=' + id).then(function (status) {
      return status.data;
    });
  }

  obj.printBooking = function(id){
     return $http.post('api/build_booking.php', id).then(function (status) {
       return status.data;
     });
  }

  obj.printBooking1 = function (id) {
    return $http.post('api/build_booking1.php', id).then(function (status) {
      return status.data;
    });
  }

  // Ingredient Transaction

  obj.getIngredients = function () {
    return $http.get(serviceBase + 'ingredients');
  }

  obj.getIngredientsByID = function (id) {
    return $http.get(serviceBase + 'ingredients_by_id?id=' + id);
  }

  obj.insertIngredient = function (ingredients) {
    return $http.post(serviceBase + 'insert_ingredients', ingredients).then(function (status) {
      //alert(JSON.stringify(status, null, 4));
      return status.data;
    });
  };

  obj.updateIngredient = function (id, ingredients) {
    return $http.post(serviceBase + 'update_ingredients', {
      id: id,
      ingredients: ingredients
    }).then(function (status) {
      return status.data;
    });
  };


  // Product Ingredient Consumption Transaction

  obj.ProductIngredientConsumption = function (product) {
    return $http.get(serviceBase + 'ingredient_consumption_by_product?product=' + product);
  }

  obj.ActiveProductIngredientConsumption = function (product, quantity, iteration) {
    return $http.get(serviceBase + 'active_ingredient_consumption_by_product?product=' + product + '&quantity=' + quantity + '&iteration=' + iteration);
  }


  obj.insertConsumption = function (consumption) {
    return $http.post(serviceBase + 'insert_consumption', consumption).then(function (status) {
      return status.data;
    });
  };

  obj.updateConsumption = function (id, consumption) {
    return $http.post(serviceBase + 'update_consumption', {
      id: id,
      consumption: consumption
    }).then(function (status) {
      return status.data;
    });
  };

  // Category Transaction

  obj.getCategories = function () {
    return $http.get(serviceBase + 'categories');
  }

  obj.CategoryTitleById = function (id) {
    return $http.get(serviceBase + 'category_title?id=' + id);
  }

  obj.ActiveCategories = function () {
    return $http.get(serviceBase + 'active_categories');
  }

  obj.ProductCategories = function (id) {
    return $http.get(serviceBase + 'ProductCategories?id=' + id);
  }


  obj.insertCategory = function (category) {
    return $http.post(serviceBase + 'insertCategory', category).then(function (status) {
      return status.data;
    });
  };

  obj.updateCategory = function (id, category) {
    return $http.post(serviceBase + 'updateCategory', {
      id: id,
      category: category
    }).then(function (status) {
      return status.data;
    });
  };

  obj.deleteCategory = function (id) {
    return $http.delete(serviceBase + 'deleteCategory?id=' + id).then(function (status) {
      return status.data;
    });
  };


  // Subcategory Transaction

  obj.getSubcategory = function () {
    return $http.get(serviceBase + 'subcategory');
  }

  obj.SubCategoryTitleById = function (id) {
    return $http.get(serviceBase + 'subcategory_title?id=' + id);
  }

  obj.getSubcategory_by_cat = function (cat) {
    return $http.get(serviceBase + 'subcat_by_cat?cat=' + cat);
  }

  obj.getSubcategory_by_cat_multiple = function (cat) {
    return $http.get(serviceBase + 'subcat_by_cat_mul?cat=' + cat);
  }

  obj.getSubcategory_by_id = function (ids) {
    return $http.get(serviceBase + 'subcat_by_ids?ids=' + ids);
  }


  obj.insertSubcat = function (subcat) {
    console.log(subcat);
    return $http.post(serviceBase + 'insertSubcat', subcat).then(function (results) {
      return results.data;
    });
  };

  obj.updateSubcat = function (id, subcategory) {
    return $http.post(serviceBase + 'updateSubcat', {
      id: id,
      subcategory: subcategory
    }).then(function (status) {
      //	alert(JSON.stringify(status.data, null, 4));
      return status.data;

    });
  };

  obj.deleteSubcat = function (id) {
    return $http.delete(serviceBase + 'deleteSubcat?id=' + id).then(function (status) {
      return status.data;
    });
  };


  // Product transaction 

  obj.getProducts = function () {
    return $http.get(serviceBase + 'products');
  }

  obj.ProductTitleById = function (id) {
    return $http.get(serviceBase + 'product_title?id=' + id);
  }

  obj.ProductById = function (id) {
    return $http.get(serviceBase + 'product_by_id?id=' + id);
  }

  obj.GetProducts_by_keyword = function (keyword) {
    return $http.get(serviceBase + 'Product_by_key?key=' + keyword);
  }

  obj.Get_Stock_Products_by_keyword = function (keyword) {
    return $http.get(serviceBase + 'available_Product_by_key?key=' + keyword);
  }

  obj.getProduct_by_Category = function (category) {
    return $http.get(serviceBase + 'Product_by_category?category=' + category);
  }

  obj.getProduct_by_subcat = function (subcat) {
    return $http.get(serviceBase + 'Product_by_subcat?subcat=' + subcat);
  }

  obj.getOrderProduct = function (id) {
    // alert(JSON.stringify(id, null, 4));
    return $http.get(serviceBase + 'getOrderProduct?id=' + id);
  }

  obj.insertProduct = function (product) {
    return $http.post(serviceBase + 'insertProduct', product).then(function (results) {
      return results.data;
    });
  };

  obj.updateProduct = function (id, product) {
    return $http.post(serviceBase + 'updateProduct', {
      id: id,
      product: product
    }).then(function (status) {
      return status.data;
    });
  };

  obj.deleteProduct = function (id) {
    return $http.delete(serviceBase + 'deleteProduct?id=' + id).then(function (status) {
      return status.data;
    });
  };


  // Users
  obj.getCustomers = function () {
    return $http.get(serviceBase + 'customers');
  }

  obj.getCustomerOrders = function () {
    return $http.get(serviceBase + 'customer_orders');
  }

  obj.getCustomer_by_id = function (id) {
    return $http.get(serviceBase + 'customer_by_id?id=' + id);
  }

  obj.insertCustomer = function (u) {
    return $http.post(serviceBase + 'insertCustomer', u).then(function (results) {
      return results.data;
    });
  };

  obj.updateCustomer = function (id, user) {
    // alert(JSON.stringify(user, null, 4));
    return $http.post(serviceBase + 'updateCustomer', {
      id: id,
      user: user
    }).then(function (status) {
      return status.data;
    });
  };

  obj.deleteCustomer = function (id) {
    return $http.delete(serviceBase + 'deleteCustomer?id=' + id).then(function (status) {
      return status.data;
    });
  };

  //Employee

  obj.getEmployee = function () {
    return $http.get(serviceBase + 'get_employee');
  }

  obj.getEmployee_active_withAtt = function () {
    return $http.get(serviceBase + 'get_employee_active_withatt');
  }

  obj.getEmployee_active_catagorycount = function () {
    return $http.get(serviceBase + 'getEmployee_active_catagorycount');
  }

  obj.getEmployeeCatagory = function () {
    return $http.get(serviceBase + 'get_employee_catagory');
  }

  obj.getEmployeeSalary = function () {
    return $http.get(serviceBase + 'get_employee_active_withatt');
  }

  obj.getEmployee_position = function () {
    return $http.get(serviceBase + 'get_employee_catagory');
  }

  obj.insertEmployee = function (empl) {
    //console.log(empl);
    return $http.post(serviceBase + 'insert_employee', empl).then(function (status) {
      return status.data;
    });
  };

  obj.insertEmployeeCatagory = function (cata) {
    //console.log(cata);
    return $http.post(serviceBase + 'insert_employee_catagory', cata).then(function (status) {
      return status.data;
    });
  };

  obj.getMonthSalary = function (e) {
    return $http.get(serviceBase + 'get_month_salary?month=' + e);
  }

  obj.getDateAttendance = function (e) {
    return $http.get(serviceBase + 'get_date_attendance?date=' + e);
  }

  obj.getMonthAttendance = function (e) {
    return $http.get(serviceBase + 'get_month_attendance?month=' + e);
  }

  obj.getAllDateAttendance = function () {
    return $http.get(serviceBase + 'get_alldate_attendance');
  }

  obj.insertMonthSalary = function (e, id, ite) {
    return $http.get(serviceBase + 'insert_month_salary?month=' + e + '&id=' + id + '&ite=' + ite).then(function (status) {
      return status.data;
    });
  }

  obj.updateMonthSalary = function (id, att, ite) {
    return $http.get(serviceBase + 'update_month_salary?id=' + id + '&att=' + att + '&ite=' + ite).then(function (status) {
      return status.data;
    });
  };

  obj.updateMonthSalaryAll = function (id, fir, sec, thi, ite) {
    return $http.get(serviceBase + 'update_month_salary_all?id=' + id + '&fir=' + fir + '&sec=' + sec + '&thi=' + thi + '&ite=' + ite).then(function (status) {
      return status.data;
    });
  };

  obj.insertDateAttendance = function (e, id, ite) {
    return $http.get(serviceBase + 'insert_date_attendance?date=' + e + '&id=' + id + '&ite=' + ite).then(function (status) {
      return status.data;
    });
  }

  obj.updateDateAttendance = function (id, att, ite) {
    return $http.get(serviceBase + 'update_date_attendance?id=' + id + '&att=' + att + '&ite=' + ite).then(function (status) {
      return status.data;
    });
  };

  // Temporary Employee Transaction

  obj.getTemporarys = function () {
    return $http.get(serviceBase + 'temporarys');
  }

  obj.getTemporaryById = function (id) {
    return $http.get(serviceBase + 'temporary_by_id?id=' + id);
  }

  obj.insertTemporary = function (emp) {
    return $http.post(serviceBase + 'insertTemporary', emp).then(function (status) {
      return status.data;
    });
  };

  obj.updateTemporary = function (id, emp) {
    return $http.post(serviceBase + 'updateTemporary', {
      id: id,
      emp: emp
    }).then(function (status) {
      return status.data;
    });
  };

  obj.deleteTemporary = function (id) {
    return $http.delete(serviceBase + 'deleteTemporary?id=' + id).then(function (status) {
      return status.data;
    });
  };

  // Temporary Payment Transaction

  obj.getTempPayments = function () {
    return $http.get(serviceBase + 'get_temp_pays');
  }

  obj.getTemporaryNameById = function (id) {
    return $http.get(serviceBase + 'temporary_name_by_id?id=' + id);
  }

  obj.insertTempPayment = function (emp) {
    return $http.post(serviceBase + 'insertTempPayment', emp).then(function (status) {
      return status.data;
    });
  };

  obj.updateTempPayment = function (id, emp) {
    return $http.post(serviceBase + 'updateTempPayment', {
      id: id,
      emp: emp
    }).then(function (status) {
      return status.data;
    });
  };

  obj.updateTempPayState = function (id, state) {
    return $http.post(serviceBase + 'updateTempPayState', {
      id: id,
      state: state
    }).then(function (status) {
      return status.data;
    });
  };

  obj.deleteTempPayment = function (id) {
    return $http.delete(serviceBase + 'deleteTempPayment?id=' + id).then(function (status) {
      return status.data;
    });
  };


  // Vendor Transaction

  obj.getVendors = function () {
    return $http.get(serviceBase + 'get_vendors');
  }

  obj.getVendorById = function (id) {
    return $http.get(serviceBase + 'vendor_by_id?id=' + id);
  }

  obj.insertVendor = function (vend) {
    return $http.post(serviceBase + 'insertVendor', vend).then(function (status) {
      return status.data;
    });
  };

  obj.updateVendor = function (id, vend) {
    return $http.post(serviceBase + 'updateVendor', {
      id: id,
      vend: vend
    }).then(function (status) {
      return status.data;
    });
  };

  obj.deleteVendor = function (id) {
    return $http.delete(serviceBase + 'deleteVendor?id=' + id).then(function (status) {
      return status.data;
    });
  };

  obj.getVendorPays = function () {
    return $http.get(serviceBase + 'get_vendor_pays');
  }

  obj.getVendorPayById = function (id) {
    return $http.get(serviceBase + 'vendor_pay_by_id?id=' + id);
  }

  obj.insertVendorPay = function (vend) {
    return $http.post(serviceBase + 'insertVendorPay', vend).then(function (status) {
      return status.data;
    });
  };

  obj.updateVendPayState = function (id, state, pay_date) {
    return $http.post(serviceBase + 'updateVendPayState', {
      id: id,
      state: state,
      pay_date: pay_date
    }).then(function (status) {
      return status.data;
    });
  };

  obj.updateVendorPay = function (id, vend) {
    return $http.post(serviceBase + 'updateVendorPay', {
      id: id,
      vend: vend
    }).then(function (status) {
      return status.data;
    });
  };

  obj.deleteVendorPay = function (id) {
    return $http.delete(serviceBase + 'deleteVendorPay?id=' + id).then(function (status) {
      return status.data;
    });
  };

  obj.getVendorStockHistory = function () {
    return $http.get(serviceBase + 'get_vendor_stock_history');
  }

  // file upload

  obj.uploadFileToUrl = function (f, dir, name) {
    var fd = new FormData();
    fd.append("file", f);
    fd.append("target_dir", dir);
    fd.append("file_name", name);
    var request = {
      method: 'POST',
      url: 'app/uploader/uploader.php',
      data: fd,
      headers: {
        'Content-Type': undefined
      }
    };

    // SEND THE FILES.
    return $http(request).then(function (resp) {
      //console.log(JSON.stringify(resp.data));
      return resp.data;
    });
  };

  obj.getBase64 = function (f) {
    return $http.post(serviceBase + 'getBase64', f).then(function (status) {
      //console.log(JSON.stringify(status.data));
      return status.data;
    });
  };

  return obj;
});