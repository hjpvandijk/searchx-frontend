# SearchX Front End for use with LogUI expansion
This is a fork of the [SearchX front end](https://github.com/searchx-framework/searchx-frontend). This repository contains information about setup and configuration. It contains code required for optimal usage of the [LogUI server expansion](https://github.com/hjpvandijk/server) and the [LogUI client expansion](https://github.com/hjpvandijk/client). These expansions add screen capture functionality and a dashboard for data analysis and visualization. 
  
## Code for screen recording and dashboard metrics.
[src/js/app/tasks/example-group-async/Session.js](src/js/app/tasks/example-group-async/Session.js) is an example of how to  initialize LogUI and start screen capturing when the last introductory pop-up is clicked away. It also includes code required additional metrics in the [LogUI server expansion](https://github.com/hjpvandijk/server) dashboard. The code is shown below. This should be included in the `componentDidMount()` method of the SearchX [task](https://github.com/searchx-framework/searchx-frontend#tasks) you want to use, so it gets called when the page loads.

```javascript
document.querySelector(".introjs-skipbutton").addEventListener("click", () => { //Required for starting screen capturing when the study intro is finished.

	window.LogUI.init(configurationObject);

	//Required for calculating dwell time.

	var prev = 0;

	var observer = new MutationObserver(function (mutationRecords) {

		if(document.getElementsByClassName("modal").length === 1 && prev === 0){

			window.LogUI.logCustomMessage({

				name: 'MODAL_DIALOG_SHOW'

			});

			prev = 1;

		} else if(document.getElementsByClassName("modal").length === 0 && prev === 1){

			window.LogUI.logCustomMessage({

				name: 'MODAL_DIALOG_HIDE'

			});

			prev = 0;

		};

	});

	observer.observe(document.querySelector(".SearchResultsContainer").firstElementChild, {subTree: true, childList: true});

	//Required for tracking total clicks on the page.

	document.onclick = function(){

		window.LogUI.logCustomMessage({

			name: 'click'

		});

	};

	window.LogUI.startScreenCapture()

});
```

For the dashboard to be able to calculate the time between queries. The following should be added to the [LogUI configuration object](https://github.com/logui-framework/client/wiki/Configuration-Object), under `trackingConfiguration`. The Mapping Name, event name, and properties can by anything. The dashboard will just look for `formSubmission` events.
```javascript
'query-submission': { //Required for calculating time between queries

	selector: '.form',

	event: 'formSubmission',

	name: 'QUERY_SUBMITTED',

	properties: {

		includeValues: [

			{

				nameForLog: 'completeQuery',

				sourcer: 'elementAttribute',

				selector: '.form-control',

				lookFor: 'value',

			}

		]

	}

}
```