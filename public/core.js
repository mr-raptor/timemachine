angular.module('timeMachine', ['ngMaterial', 'ngMessages'])
	.controller("mainController", function($scope, $http) {
	$scope.formData = {};
	
	$http.get('/api/events')
		.success(function(data) {
			$scope.events = data;
			console.log("Data from API:")
			console.dir(data);
			var timeLineData = mapEvents(data);
			console.log("Parsed events:");
			console.dir(timeLineData);
			window.timeline = new TL.Timeline('timeline-embed', timeLineData);
		})
		.error(function(data) {
			console.log('Error:'+data);
		});
		
	$scope.createEvent = function() {
		$http.post('/api/events', $scope.formData)
			.success(function(data) {			
				$scope.formData = {};
				var timeLineData = mapEvents(data);
				window.timeline = new TL.Timeline('timeline-embed', timeLineData);
			})
			.error(function(data) {
				console.log('Error:'+data);
			});
	}
	
	function mapEvents(data) {
		return {
			events: data.map(event => {
				var date = new Date(event.startDate);
				return {
					start_date: mapDate(date),
					text: {
						headline: event.title
					}
				}
			})
		};
	}
	
	function mapDate(date) {
		return {
			year:date.getFullYear(),
			mouth:date.getMonth(),
			day:date.getDate()
		};
	}
});