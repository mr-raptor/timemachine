angular.module('timeMachine')
	.directive('jqdatepicker', function () {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attrs, ctrl) {
				var datePickerOptions = {
					separator : ' to ',
					getValue: function()
					{
						if ($('#daterange-picker-start').val() && $('#daterange-picker-end').val() )
							return $('#daterange-picker-start').val() + ' to ' + $('#daterange-picker-end').val();
						else
							return '';
					},
					setValue: function(s,s1,s2)
					{
						var date = new Date(s1);
						$('#start1').val(date.getFullYear());
						$('#daterange-picker-start').val(s1);
						$('#daterange-picker-end').val(s2);
					},
					inline:true,
					alwaysOpen:true,
					container:'#daterange-picker-container',
					hoveringTooltip: false
				};
				scope.$watch(attrs.year, function(value){
					$(element).data('dateRangePicker').setDateRange('2017-11-20','2013-11-25');
					console.log(value);
				});
				$(element).dateRangePicker(datePickerOptions)
					.bind('datepicker-change', function (event, obj) {
						ctrl.$setViewValue(obj.value);
						ctrl.$render();
						scope.$apply();
					});
			}
		};
});