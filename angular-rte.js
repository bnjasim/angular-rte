angular.module('main', [])

.directive('angularRte', function() {
  return {
	restrict: 'E',
	replace: true,
	scope: {content: '=textContent'},
	templateUrl: 'rte.html',
	controller: ['$scope', function($scope) {
	
		
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

		text_area.on('keydown', function(e) {
		    var TABKEY = 9;
		    if(e.keyCode == TABKEY) {
		        if(e.preventDefault) {
		            e.preventDefault();
		        }

		        var selection = window.getSelection();
				range = selection.getRangeAt(0);
				range.collapse();
				var node_span = document.createElement('span');
				node_span.innerHTML = '&nbsp;&nbsp;';
				range.insertNode(node_span);
				range.setStartAfter(node_span);
				range.collapse();
		        return false;
		    }
		});

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

			if (command === 'code') {
				//command = 'formatBlock';
				//value = 'pre';
				var selection = window.getSelection();
				range = selection.getRangeAt(0);
				// the text-area shouldn't be empty, otherwise endContainer is content-editable
				// nodeType = 1 for ELEMENT_NODE, = 3 for TEXT_NODE etc.	
				if (!(range.endContainer.nodeType===1 && range.endContainer.getAttribute('class') === 'textarea-div')) 
					// insert code area not in the middle of some text, but next line may be
					range.setStartAfter(range.endContainer);
					
				var code_node = document.createElement('pre');
				//code_node.setAttribute('class', 'code');
				var code_node_inner = document.createElement('div');
				code_node_inner.innerHTML = '<br/>';
				code_node.appendChild(code_node_inner);
				range.insertNode(code_node);

				
				var code_node_after = document.createElement('br');
				range.setStartAfter(code_node);
				range.collapse();
				range.insertNode(code_node_after);

				//range.setStart(code_node_inner, 0);
				//range.setEnd(code_node_inner, 0);
				//range.selectNode(code_node_inner);
				//range.collapse();
				//selection.removeAllRanges();
				//selection.addRange(range);
				//document.execCommand('defaultParagraphSeparator', false, 'p');
				
			}

			// Extra br at the end
			if (command === 'br') {
				text_area[0].appendChild(document.createElement('br'));
				var range = document.createRange();
				var sel = window.getSelection();
				var last_child = text_area[0].childNodes;
				range.setStart(last_child[last_child.length-1], 0);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
			}

			if (command === 'link') {
				var sel = window.getSelection();
				if (sel.getRangeAt && sel.rangeCount) {
					range = sel.getRangeAt(0);
					if (range.startContainer === range.endContainer) {
						command = 'createLink';
						value = range.toString();
						// add http if not present
						if (value.indexOf('http') !== 0)
							value = 'http://' + value;
						if (value.search(/(?:www.)?[a-z0-9A-Z]+\.[a-zA-Z]+/) < 0)
							value = '';
					}
				}
			}

			document.execCommand(command, false, value);
			text_area[0].focus();
		}

	}
  }
})