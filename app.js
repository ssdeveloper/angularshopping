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
    .controller("productsCtrl", ["$scope", "productService", function($scope, productService) {
        $scope.addToCart = function(id) {
            console.log(id);
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
    .controller("cartCtrl", ["$scope", function($scope) {

    }])
    .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("home", {
                url: "/home",
                templateUrl: "templates/home.html"
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
            });

        $urlRouterProvider
            .otherwise("/home");
    }]);