import React from "react";
import {Link} from "react-router-dom";
import TaskedSession from "../components/session/TaskedSession";

import AccountStore from "../../../stores/AccountStore";
import IntroStore from "../../../stores/IntroStore";

class Session extends React.PureComponent {
    componentDidMount() {
        IntroStore.startIntro(introSteps, () => {});

        document.querySelector(".introjs-skipbutton").addEventListener("click", 
        () => {
                window.LogUI.startScreenCapture();
                if (window.hasOwnProperty('LogUI')) {
                    this.startLogUI();
                };
            }
        );


       
    }

    startLogUI(){
        let configurationObject = {
            logUIConfiguration: {
            endpoint: 'ws://localhost/ws/endpoint/',
            authorisationToken: 'eyJ0eXBlIjoibG9nVUktYXV0aG9yaXNhdGlvbi1vYmplY3QiLCJhcHBsaWNhdGlvbklEIjoiYzRhOTVkYTItYjNjOS00OGMyLWJlMDMtYmQ4ZGZkMzUxY2ZiIiwiZmxpZ2h0SUQiOiI3YzllMzhhOS0wOTY0LTQ0MmYtYThjNy1jNmQ4YzhmMWQ0YTcifQ:1lg5HA:ySmnMRxx4LODDBcRRQgDWqZn8M8d_hEFW_9EoT3diSE',  // The authentication token.
            verbose: true,
            browserEvents: {
                // See the Browser Events Wiki page.
                eventsWhileScrolling: false,
                URLChanges: false,
                contextMenu: false,
                pageFocus: false,
                trackCursor: false,
                pageResize: false
            }
            },
            applicationSpecificData: {
            },
            trackingConfiguration: {
            // 'querybox-focus': {
            //     selector: '#input-box',
            //     event: 'focus',
            //     name: 'QUERYBOX_FOCUS',
            // },
            // 'querybox-losefocus': {
            //     selector: '#input-box',
            //     event: 'blur',
            //     name: 'QUERYBOX_BLUR',
            // },
            // 'left-rail-item-mousemovements': {
            //     selector: '#left-rail-results li',
            //     event: 'mouseHover',
            //     properties: {
            //         mouseenter: {
            //             name: 'LEFT_RAIL_RESULT_HOVER_IN',
            //         },
            //         mouseleave: {
            //             name: 'LEFT_RAIL_RESULT_HOVER_OUT',
            //         }
            //     },
            //     metadata: [
            //         {
            //             nameForLog: 'resultRank',
            //             sourcer: 'elementAttribute',
            //             lookFor: 'data-rank',
            //         }
            //     ]
            // },
                // 'querybox' : {
                // 	selector: '.form-control',
                // 	event: 'input',
                // 	name: 'inputgrouptest',
                // 	metadata: [
                // 		{
                // 			nameForLog: 'input value',
                // 			sourcer: 'elementAttribute',
                // 			lookFor: 'value',
                // 		}
                // 	]
                // },
                'mouseclick' : {
                    selector: '#header',
                    event: 'click',
                    name: 'click-test',
                    // properties: {
                    // 	primary: {
                    // 		name: 'MOUSE_CLICK',
                    // 	},
                    // 	secondary: {
                    // 		name: 'MOUSE_CLICK',
                    // 	},
                    // },
                },
                'query-submission': {
                    selector: '.form',
                    event: 'formSubmission',
                    name: 'QUERY_SUBMITTED2',
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
            
            },
        };


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

        document.onclick = function(){
            window.LogUI.logCustomMessage({
                    name: 'click'
                });
        };

        window.LogUI.init(configurationObject);
    };

    render() {
        const task = AccountStore.getTask();

        return (
            <TaskedSession disableCopy={true}>
                <div className="box" style={{marginBottom: '20px', textAlign: 'center'}}>
                    <Link className={"btn btn-primary"} to="/async/feedback" role="button">
                        To Feedback
                    </Link>
                </div>

                <div className="box" style={{flexGrow: '1'}}>
                    <h3 style={{textAlign: 'center'}}>{task.data.title}</h3>
                    <hr/>
                    <p>{task.data.description}</p>
                </div>
            </TaskedSession>
        )
    }
}

const introSteps = [
    {
        element: '.Task',
        intro: 'Please take a minute to read your task description.',
        position: 'left'
    },
    {
        element: '.SearchHeader',
        intro: 'We want you to use our custom web search system SearchX.',
        position: 'bottom-middle-aligned'
    },
    {
        element: '.SearchHeader .form',
        intro: 'Use SearchX to search for webpages, publications, and other online sources about the topic.'
    },
    {
        element: '.QueryHistory',
        intro: 'The query history shows your and your group\'s past search queries. In this manner you see what the others are doing.',
        position: 'top'
    },
    {
        element: '.SearchResults',
        intro: 'To save a resource that is useful, bookmark it. You also see your group\'s bookmarks here.',
        position: 'top'
    },
    {
        element: '.Bookmarks',
        intro: 'The documents you and your group bookmarked will appear here. You can revisit them before completing the session.',
        position: 'top'
    },
    {
        element: '.Search .Content',
        intro: 'The query history and bookmarks are color-coded to show who initiated the action.',
        position: 'top'
    },
    {
        intro: 'Please use the provided chat window to collaborate with your group during the session.',
        position: 'auto'
    }
];

export default Session;