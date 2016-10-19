angular.module('timeMachine', ['ngMaterial', 'ngMessages', 'ngMask'])
	.controller("mainController", function($scope, $http) {
	$scope.formData = {};
	

	$http.get('/api/events')
		.success(function(data) {
			$scope.events = data;
			console.log("Data from API:")
			console.dir(data);
			updateTimeLine(data);
			
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
				updateTimeLine(data);
			})
			.error(function(data) {
				console.log('Error:'+data);
			});
	};
	
	$scope.deleteEvent = function() {
		var id = timeline.current_id;
		$http.delete('/api/events/'+id)
			.success(function(data) {
				updateTimeLine(data);
			})
			.error(function(data) {
				console.log('Error:'+data);
			});
	};
	
	$scope.log = function() {
		console.log($scope.formData.startDate);
	}
	
	function updateTimeLine(data)
	{
		var timeLineData = mapEvents(data);
		console.log("Parsed events:");
		console.dir(timeLineData);
		window.timeline = new TL.Timeline('timeline-embed', timeLineData, {
			timenav_position: "top",
			debug:true
		});
	}
	
	function mapEvents(data) {
		return {
			events: data.map(item => {
				var startDate = new Date(item.startDate);
				
				var event = {
					unique_id: item._id,
					start_date: mapDate(item.startDate),
					end_date: mapDate(item.endDate),
					text: {
						headline: item.title
					}
				}
				return event;
			})
		};
	}
	
	function mapDate(date) {
		if(date === undefined)
			return;
		
		let dateObj;
		if(typeof(date) === 'string' || date instanceof String) {
			dateObj = new Date(date);
		} else if (date instanceof Date) {
			dateObj = date;
		} else {
			return console.error("Invalid type of date!");			
		}
		
		return {
			year:dateObj.getFullYear(),
			month:dateObj.getMonth()+1,
			day:dateObj.getDate()
		};
	}
});