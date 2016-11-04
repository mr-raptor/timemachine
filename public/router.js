function router($routerProvider) {
	$routerProvider
	.when('/hello', {
		templateUrl: '/hello.html',
		controller: 'HelloController',
		controllerAs: 'helloController'
	});
});
