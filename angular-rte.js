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
		// set initial values
		var value = '';
		var hilite_state = false;
		var headings = ['H1', 'H2', 'H3', 'A'];
		var h_index = 0;
		scope.h = 'H1';
		var last_clicked = new Date().getTime();

		var text_area = element.children().eq(2);
		var icon_area = element.children().eq(0);
		// copy the passed content to the text-area
		text_area.html(scope.content);

		scope.runCommand = function(command, value) {
			text_area[0].focus();
			
			if (command === 'hiliteColor') {
				hilite_state = !hilite_state;

				if (!hilite_state)
					value = '#FFF';

			}

			if (command === 'formatBlock') {
				// increment h_index only if last_clicked is within 2 seconds
				if ( (new Date().getTime() - last_clicked) < 2000 ) {
					h_index = h_index===3?0:h_index+1;	
					// change the button on the icon-group
					scope.h = headings[h_index];
				}

				last_clicked = new Date().getTime();

				// H1 is actually h2, H2 is h3 etc.
				if (h_index === 0)  value = 'h2';
				if (h_index === 1)  value = 'h3';
				if (h_index === 2)  value = 'h4';
				if (h_index === 3)  value = 'div';

			}

			document.execCommand(command, false, value);
			text_area[0].focus();
		}

	}
  }
})