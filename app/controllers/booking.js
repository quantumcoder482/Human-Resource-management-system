angular.module('App').controller('BookingController',
	function ($rootScope, $scope, $http, $mdToast, $cookies, $mdDialog, $route, services) {
		if ($cookies.session_uid == 'null' || $cookies.session_uid == null) {
			$scope.Expire_Session();
		}

		var self = $scope;
		var root = $rootScope;
		var newUser = false;
		root.toolbar_menu = null;
		var original;
		self.stitle = 'Customer Amount';

		$rootScope.pagetitle = 'Booking';

		original = {
			items: [],
			booking_date: toISOLocal(new Date()).split("T")[0],
			guest_num: 1,
			reduce: 0,
			quantity: [],
			item_names: [],
			user_id: 0,
			contact_name: null,
			contact_number: null,
			contact_address: null,
			order_comment: null,
			discount: 0,
			type: 1,
		};
		self.build = angular.copy(original);
		self.product_status = true;
		self.ingredients = [];
		self.stocks = [];

		self.b1g1 = true;
		self.showCategory = true;
		self.showSubcate = false;
		self.showProduct = false;

		self.bookingdate1 = false;
		self.bookingdate2 = false;
		self.bookingdate3 = false;
		self.bookingdate4 = false;

		self.AddBookingDate = function () {
			if (!self.bookingdate1) {
				self.bookingdate1 = true;
				return;
			}
			if (self.bookingdate1 && !self.bookingdate2) {
				self.bookingdate2 = true;
				return;
			}
			if (self.bookingdate2 && !self.bookingdate3) {
				self.bookingdate3 = true;
				return;
			}
			if (self.bookingdate3 && !self.bookingdate4) {
				self.bookingdate4 = true;
				return;
			}
		}

		services.ActiveCategories().then(function (data) {
			self.active_categories = data.data;
			// alert(JSON.stringify(self.active_categories, null, 4));
		});

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
					price: data.data[i].payable_amount,
					item_ids: data.data[i].items,
					item_counts: data.data[i].quantity
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

		$scope.sort_menu = function (keyname) {
			$scope.sortKey = keyname; //set the sortKey to the param passed
			$scope.reverse = !$scope.reverse; //if true make it false and vice versa
		}

		self.AddMenuToBooking = function (ev, j) {
			//console.log(j);
			services.getOrderProduct(j.item_ids.replace(/,\s*$/, "")).then(function (data) {
				products = data.data;
				var item_counts = j.item_counts.split(",");
				for (var i = 0; i < products.length; i++) {
					for (var t = 0; t < Number(item_counts[i]); t++) {
						self.AddProduct('', products[i]);
					}
				}
				//console.log(products);
			});
		}

		self.ShowMyCategory = function () {
			self.showCategory = false;
			self.showSubcate = false;
			self.showProduct = false;

			services.ActiveCategories().then(function (data) {
				self.active_categories = data.data;
				self.showCategory = true;

			});
		};

		self.addUser = function ($event) {
			self.newUser = true;
		}

		services.get_ordertype().then(function (data) {
			self.ordertype = data.data;
		});

		self.ShowSubcategory = function (category) {
			self.showCategory = false;
			self.showSubcate = false;
			self.showProduct = false;

			services.getSubcategory_by_cat(category).then(function (data) {
				self.active_categories = data.data;
				self.showSubcate = true;
			});
		};


		self.GetProductBySubcat = function (subcat) {
			self.showCategory = false;
			self.showSubcate = false;
			self.showProduct = false;

			services.getProduct_by_subcat(subcat).then(function (data) {
				self.active_categories = data.data;
				self.showProduct = true;
			});
		};


		self.GetProducts = function (keyword) {
			if (keyword.length <= 0) {
				self.products = "";
			} else {
				services.Get_Stock_Products_by_keyword(keyword).then(function (data) {
					self.products = data.data;
				});
			}
		};

		self.SgstEmpty = function () { // myone

			if (self.build.order_sgst != 0) {

				self.build.payable_amount = Number(self.build.payable_amount) - Number(self.build.order_sgst);
				self.build.discount = Number(self.build.order_sgst);
				self.build.order_sgst = 0;
				$mdToast.show($mdToast.simple().content("Small pizza Cost is Free.").position('bottom right'));

			}

		};

		self.AddProduct = function (ev, p) {

			self.product_status = false;
			if (self.build.items.indexOf(p.id) >= 0) {
				pid = self.build.items.indexOf(p.id);
				self.build.quantity[pid] = self.build.quantity[pid] + 1; //myone
			} else {
				self.build.items.push(p.id);
				self.build.quantity.push(1); //myone
				self.build.item_names.push(p.title);
			}


			services.getOrderProduct(self.build.items.join()).then(function (data) {
				self.particulars = data.data;

			});

			$mdToast.show($mdToast.simple().content(p.title + " -" + 1 + " Unit" + " " + "added").position('bottom right'));
		};

		self.RemoveProductcount = function (ev, p) {

			if (self.build.items.indexOf(p.id) >= 0) {
				pid = self.build.items.indexOf(p.id);
				self.build.quantity[pid] = self.build.quantity[pid] - 1; //myone

				services.getOrderProduct(self.build.items.join()).then(function (data) {
					self.particulars = data.data;

				});
				if (self.particulars == '') {
					self.product_status = true;
				}
				$mdToast.show($mdToast.simple().content(p.title + " -" + 1 + " Unit" + " " + "removed").position('bottom right'));
			}
		};

		self.RemoveProduct = function (ev, p) {

			pid = self.build.items.indexOf(p.id);
			self.qnt = self.build.quantity[pid];
			self.build.items.splice(pid, 1);
			self.build.quantity.splice(pid, 1);
			self.build.item_names.splice(pid, 1);


			if (self.build.items.join() == '') {
				self.particulars = '';
			} else {
				services.getOrderProduct(self.build.items.join()).then(function (data) {
					self.particulars = data.data;
				});
			}
			if (self.particulars == '') {
				self.product_status = true;
			}
			$mdToast.show($mdToast.simple().content(p.title + " -" + self.qnt + " Unit" + " " + "Removed").position('bottom right'));
		};

		services.getCustomers().then(function (data) {
			self.cust = data.data;
			self.loading = false;
			//console.log(JSON.stringify(self.cust));
		});


		self.getUserDetails = function (id) {
			services.getCustomer_by_id(id).then(function (data) {
				cust = data.data;

				self.build.contact_name = cust[0].name;
				self.build.contact_number = cust[0].contact;
				self.build.contact_address = cust[0].address;
				//self.delivery_area=cust[0].area_title;
			});

		};


		self.ChangeDiscount = function (discount) {
			//alert(self.build.bill_amount);
			self.build.discount = discount;
			self.build.payable_amount = Number(self.build.bill_amount) + Number(self.build.order_cgst) + Number(self.build.order_sgst) - discount;
		};

		self.smallServe = function (b) {
			console.log(b);
			var small_id = [];
			for (var i = 0; i < b.item_names.length; i++) {
				if (b.item_names[i].indexOf("Small") >= 0) {
					small_id.push(i);
				}
			}
			console.log(small_id);
			for (var i = 0; i < small_id.length; i++) {
				self.build.bill_amount = Number(self.build.bill_amount) - b.prices[small_id[i]] * b.quantity[small_id[i]];
				self.build.bill_amount = self.build.bill_amount.toFixed(2);
				self.build.order_cgst = Number(self.build.order_cgst) - b.cgst[small_id[i]] * b.quantity[small_id[i]];
				self.build.order_sgst = Number(self.build.order_sgst) - b.sgst[small_id[i]] * b.quantity[small_id[i]];
				self.build.payable_amount = Number(self.build.payable_amount) - b.prices[small_id[i]] * b.quantity[small_id[i]] - b.sgst[small_id[i]] * b.quantity[small_id[i]] - b.cgst[small_id[i]] * b.quantity[small_id[i]];
				self.build.payable_amount = self.build.payable_amount.toFixed(2);

				self.build.prices[small_id[i]] = 0;
				self.build.cgst[small_id[i]] = 0;
				self.build.sgst[small_id[i]] = 0;
			}
		};

		self.calculated = function () {
			if (self.build.customer_amount >= Number(self.build.payable_amount)) {
				self.stitle = 'Left Amount';
				self.build.customer_amount = self.build.customer_amount - self.build.payable_amount;
				self.caled = true;
			} else alert('Must pay Payable amount.');
		}

		services.getIngredients().then(function (data) {
			self.ingredients = data.data;

			for (i = 0; i < self.ingredients.length; i++) {
				var tmp = {
					ingredient: self.ingredients[i].id,
					quantity:0,
					type:"Subtraction",
					function:'',
					remarks:''
				}
				self.stocks.push(tmp);
			}
			// console.log(self.stocks);
			self.loading = false;
		});

		self.submit = function (b) {
			self.wait = true;
			$mdToast.show($mdToast.simple().content("Process...").position('bottom right'));
			b.totalpaid = b.customer_amount > 0 ? 0 : 1;
			//if(Number(b.custom_amount) <= Number(b.payable_amount)) b.custom_amount = null;

			// ingredients calculation

			if (b.items) {
				
				// multiple quantities calculation
				self.p_quantity = [];
				var j = 0;
				for(i of b.items){
					self.p_quantity[i] = b.quantity[j++];
				}

				for (item of b.items) {
					services.getconsumptionByproduct(item).then(function (data) {
						// if (data.data == '') alert("Not defined consumption of product");
						var result = self.stocks;
						for (var i = 0; i < data.data.length; i++) {
							var kid = find_array_id(result, 'ingredient', data.data[i].ingredient);
							if (kid > -1) {
								result[kid].quantity = Number(result[kid].quantity);
								total = Number(data.data[i].consumption) * Number(self.p_quantity[item]) * Number(self.build.guest_num);
								if(self.build.reduce){
									reduce = total*Number(self.build.reduce)/100;
								}else {
									reduce = 0;
								}
								result[kid].quantity += (total-reduce);
							}
						}
						self.stocks = result;
					});
				}

			}

			
			if (b.user_id == 0) {

				var person = {
					name: b.contact_name,
					contact: b.contact_number,
					address: b.contact_address,
					email: ''
				};

				services.insertCustomer(person).then(function (resp) {
					b.user_id = resp.insert_id;
					b.items = b.items.join() + ',';
					b.quantity = b.quantity.join() + ',';
					b.item_names = b.item_names.join(',%,%') + ',%,%';

					services.insertBooking(b).then(function (resp) {
						if (resp.status == "success") {
							console.log("success:" + resp);
							self.stocks = self.stocks.filter((item) => {
								return item.quantity;
							});

							for (st of self.stocks) {
								st.booking_id = resp.insert_id;
								st.function = self.build.booking_name;
								services.insertStock(st).then(function (res) {
									console.log(res);
								})
							}
								//services.getBookingProduct(resp.data.items.replace(/,\s*$/, "")).then(function(data){
								//products = data.data;
								//alert(products.length);
								//});  


							self.afterSubmit(resp);
						}

						//services.generateInvoice(resp.data);

					});
				});
			} else {
				console.log(b);
				b.items = b.items.join() + ',';
				b.quantity = b.quantity.join() + ',';
				b.item_names = b.item_names.join(',%,%') + ',%,%';

				services.insertBooking(b).then(function (resp) {
					if (resp.status == "success") {
						// console.log(resp);
						self.stocks = self.stocks.filter((item)=>{
							return item.quantity;
						});

						for(st of self.stocks){
							st.booking_id = resp.insert_id;
							st.function = self.build.booking_name;
							services.insertStock(st).then(function(res){
								console.log(res);
							})
						}			

							//services.getBookingProduct(resp.data.items.replace(/,\s*$/, "")).then(function(data){
							//    products = data.data;
							//    console.log(products);
							//});

							// $mdDialog.show({
							//   controller          : BookingControllerDialog,
							//   templateUrl         : 'templates/page/booking/detail.html',
							//   parent              : angular.element(document.body),
							//   clickOutsideToClose : false,
							//   vendor              : resp.data
							// });


						self.afterSubmit(resp);

					}

					//services.generateInvoice(resp.data);

				});
			}
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
	});

function BookingControllerDialog($scope, $mdDialog, services, $mdToast, $route, vendor) {

	var self = $scope;
	var original;

	self.title = 'Booking Details';
	self.buttonText = 'Confirm';

	original = vendor;
	self.vendor = angular.copy(original);


	self.isClean = function () {
		return angular.equals(original, self.vendor);
	}

	self.hide = function () {
		$mdDialog.hide();
	};

	self.cancel = function () {
		$mdDialog.cancel();
	};

	self.submit = function (v) {
		$mdToast.show($mdToast.simple().content("Process...").position('bottom right'));

		console.log('isold', v);
		services.updateVendor(v.id, v).then(function (resp) {
			self.afterSubmit(resp);
		});
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