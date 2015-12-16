angular.module("shopApp", ["ui.router"])
    .service("productService", function($http, $q) {
        this.getAllItems = function() {
            var deferred = $q.defer();
            $http({
                method: "GET",
                url: "items.json"
            }).success(function(data) {
                deferred.resolve(data);
            }, function(response) {
                console.log("An error occurred while retrieving all items.");
                deferred.reject("An error occurred while retrieving all items.");
            });

            return deferred.promise;
        }
    })
    .service("orderService", function() {
        this.submit = function(items) {
            var cnfrmNum = Math.floor(Math.random() * 100000000);

            // Check to see if confirmation number is unique
            // Put code for the REST call to store the order here

            // If success then return the confirmation number otherwise return -1

            return cnfrmNum;
        }
    })
    .controller("productsCtrl", ["$scope", "productService", function($scope, productService) {
        sessionStorage.setItem("confirmationNumber", -1);
        var savedCart = sessionStorage.getItem("cart");
        $scope.cart = (savedCart) ? JSON.parse(savedCart) : [];

        // Push the item to the cart array
        $scope.addToCart = function(id) {
            var item = _.where($scope.items, {id: id});
            var qtyElId = "#" + id + "_order_qty";
            item[0].order_qty = Number($(qtyElId).val());
            $scope.cart.push(item[0]);
            sessionStorage.setItem("cart", JSON.stringify($scope.cart));

            // Let the user know that the product was added to the cart
            $("#toast").fadeIn(200).delay(1000).fadeOut(200);
        }

        // Get the list of products
        productService.getAllItems()
            .then(function(data) {
                var items = [];
                $.each(data.products, function(key, val){
                    items.push(val);
                });
                $scope.items = items;
            });
    }])
    .controller("cartCtrl", ["$scope", "$state", "orderService", function($scope, $state, orderService) {
        sessionStorage.setItem("confirmationNumber", -1);
        $scope.cnfrmNum = -1;
        $scope.grand_total = -1;
        var savedCart = sessionStorage.getItem("cart");
        $scope.cart = (savedCart) ? JSON.parse(savedCart) : [];

        $scope.submitOrder = function() {
            $scope.cnfrmNum = orderService.submit($scope.items);

            if ($scope.cnfrmNum > 0) {
                sessionStorage.setItem("confirmationNumber", $scope.cnfrmNum);
                $state.go("submitted");
            }  else {
                $state.go("error");
            }
        }

        $scope.removeFromCart = function(id) {
            $scope.cart = _.reject($scope.cart, function(item) {
                return item.id === id;
            });
            sessionStorage.setItem("cart", JSON.stringify($scope.cart));
            $scope.calcTotal();
        }

        $scope.calcTotal = function() {
            $scope.grand_total = _.reduce($scope.cart, function(memo, val, key) {
                return (Number(val.order_qty) * Number(val.price)) + memo;
            }, 0);
        }

        // Initial calculation for the grand total
        $scope.calcTotal();
        
    }])
    .controller("submittedCtrl", ["$scope", function($scope) {

        // Set the confirmation number
        var cNum = sessionStorage.getItem("confirmationNumber");
        $scope.confirmationNumber = cNum;

        // Reset the cart
        sessionStorage.setItem("cart", []);

    }])
    .controller("errorCtrl", ["$scope", function($scope) {

        // Set the error message
        $scope.errorMessage = "There were problems.";

    }])
    .controller("homeCtrl", ["$scope", function($scope) {

        // Initialize the data
        sessionStorage.setItem("cart", []);
        sessionStorage.setItem("confirmationNumber", -1);

    }])
    .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("home", {
                url: "/home",
                templateUrl: "templates/home.html",
                controller: "homeCtrl"
            })
            .state("products", {
                url: "/products",
                templateUrl: "templates/products.html",
                controller: "productsCtrl"
            })
            .state("cart", {
                url: "/cart",
                templateUrl: "templates/cart.html",
                controller: "cartCtrl"
            })
            .state("error", {
                url: "/error",
                templateUrl: "templates/error.html",
                controller: "errorCtrl"
            })
            .state("submitted", {
                url: "/submitted",
                templateUrl: "templates/submitted.html",
                controller: "submittedCtrl"
            });

        $urlRouterProvider
            .otherwise("/home");
    }]);