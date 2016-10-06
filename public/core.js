angular.module('timeMachine', ['ngMaterial', 'ngMessages'])
	.controller("mainController", function($scope, $http) {
	$scope.formData = {};
	$scope.timeLineData = {};
	

	$http.get('/api/events')
		.success(function(data) {
			$scope.events = data;
			console.log("Data from API:")
			console.dir(data);
			$scope.timeLineData = mapEvents(data);
			console.log("Parsed events:");
			console.dir($scope.timeLineData);
			window.timeline = new TL.Timeline('timeline-embed', $scope.timeLineData, {
				timenav_position: "top",
				debug:true
			});
			
			/*window.timeline = new Proxy(window.timeline, {
				set: function(target, prop, value) {
					console.log(`Change ${prop} = ${value}`);
					target[prop] = value;
					return true;
				}
			});*/
		})
		.error(function(data) {
			console.log('Error:'+data);
		});
		
	$scope.createEvent = function() {
		$http.post('/api/events', $scope.formData)
			.success(function(data) {			
				$scope.formData = {};
				$scope.timeLineData = mapEvents(data);
				//var timeLineData = mapEvents(data);
				//window.timeline = new TL.Timeline('timeline-embed', timeLineData);
			})
			.error(function(data) {
				console.log('Error:'+data);
			});
	};
	
	$scope.deleteEvent = function() {
		var id = timeline.current_id;
		$http.delete('/api/events/'+id)
			.success(function(data) {
				var timeLineData = mapEvents(data);
				window.timeline = new TL.Timeline('timeline-embed', timeLineData);
			})
			.error(function(data) {
				console.log('Error:'+data);
			});
	};
	
	function mapEvents(data) {
		return {
			events: data.map(event => {
				var date = new Date(event.startDate);
				return {
					unique_id: event._id,
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
			month:date.getMonth()+1,
			day:date.getDate()
		};
	}
});