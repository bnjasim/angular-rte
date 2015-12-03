angular.module('main', [])

.directive('angularRte', function() {
  return {
	restrict: 'E',
	replace: true,
	scope: {content: '=textContent'},
	templateUrl: 'rte.html',
	controller: ['$scope', function($scope) {
		$scope.content = 'Controller!';
		console.log($scope.content);
	}],

	link: function(scope, element, attrs) {
		var text_area = element.children().eq(1);
		var icon_area = element.children().eq(0);
		// copy the passed content to the text-area
		text_area.html(scope.content);


	}
  }
})