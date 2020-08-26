import './SearchResults.pcss';

import React from 'react';
import config from "../../../../config";
import Loader from 'react-loader';

import SearchResultContainer from "../SearchResultContainer";
import SearchResultsPagination from "./SearchResultsPagination";
import SearchFilters from "./filters/SearchFilters";
import CollapsedResultsButton from "./CollapsedSearchResults";
import {Button} from "react-bootstrap";
import $ from 'jquery';
import CenteredMessage from "../../../common/CenteredMessage";
import Helpers from "../../../../utils/Helpers";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col";

const SearchResults = function ({
                                    searchState, progress, serpId, results, matches, elapsedTime, activeUrl, provider,
                                    distributionOfLabour, activeDoctext, tutorial, collapsed, autoHide,
                                    pageChangeHandler, isCollapsible, showCollapsedResults, hideCollapsedResults,
                                    showAllCollapsedResults, hideAllCollapsedResults, selectedFilters, filterChangeHandler, filterHandler
                                }) {
    const getCollapsibleResultsLength = function () {
        return results.filter(result => isCollapsible(result)).length;
    };

    const resultsAreCollapsed = function (results) {
        let output = false;
        results.forEach((result) => {
            if (collapsed[Helpers.getId(result)]) {
                output = true;
            }
        });
        return output;
    };

    const style = {
        color: "darkgray"
    };

    if (searchState.query === '' && results.length === 0) {
        return <CenteredMessage height="800px" style={style}>
            <h3> Your search results will appear here :) </h3>
        </CenteredMessage>
    }

    if (progress.resultsNotFound) {
        return <CenteredMessage height="800px" style={style}>
            <h3> Sorry! :`( </h3>
            <h4> We have not found results for you! Try to shorten your query! </h4>
        </CenteredMessage>
    }

    if (!tutorial && !progress.finished) {
        return <CenteredMessage height="800px">
            <Loader/>
        </CenteredMessage>
    }

    ////


    // Trick to remove last page from pagination;
    $(".pagination").find("a").last().hide();
    
    const pagination = <SearchResultsPagination
        searchState={searchState}
        finished={results.length > 0 || progress.finished}
        matches={matches}
        changeHandler={pageChangeHandler}
    />;

    const filters = <SearchFilters provider={provider} selectedFilters={selectedFilters} filterChangeHandler={filterChangeHandler} filterHandler={filterHandler}/>
    const prefix = (matches < config.aboutPrefixAt) ? "" : "About ";
    const timeIndicator = prefix + Helpers.numberWithCommas(matches) + " results (" + elapsedTime + " seconds)";
    let visitedUrls = JSON.parse(localStorage.getItem('visited-urls'));
    if (!visitedUrls) {
        visitedUrls = {}
    }
    let list = [];
    let lastCollapsedResults = [];
    let lastCollapsedResultsComponents = [];
    for (const [index, result] of results.entries()) {
        const collapsedResult = distributionOfLabour && collapsed[Helpers.getId(result)];

        const resultProps = {
            searchState: searchState,
            serpId: serpId,
            result: result,
            bookmark: 0,
            provider: provider,
            collapsed: collapsedResult,
            hideCollapsedResultsHandler: hideCollapsedResults,
            autoHide: autoHide,
            isCollapsible: isCollapsible(result),
            visited: visitedUrls[Helpers.getId(result)] === true
        };
        
        if (distributionOfLabour === 'unbookmarkedSoft') {
            if (collapsed[Helpers.getId(result)]) {
                lastCollapsedResults.push(result);
                lastCollapsedResultsComponents.push(<SearchResultContainer {...resultProps} key={index}
                                                                           index={index}/>);
            } else {
                if (lastCollapsedResults.length > 0) {
                    list.push(<CollapsedResultsButton results={lastCollapsedResults}
                                                      resultsAreCollapsed={resultsAreCollapsed(lastCollapsedResults)}
                                                      showCollapsedResultsHandler={showCollapsedResults}
                                                      hideCollapsedResultsHandler={hideCollapsedResults}
                                                      searchState={searchState} serpId={serpId} index={index}/>);
                    list = list.concat(lastCollapsedResultsComponents);
                    list.push(<SearchResultContainer {...resultProps} key={Helpers.getId(result)} index={index}/>);
                    lastCollapsedResults = [];
                    lastCollapsedResultsComponents = [];
                } else {
                    list.push(<SearchResultContainer {...resultProps} key={Helpers.getId(result)} index={index}/>);
                }
            }
        } else {
            list.push(<SearchResultContainer {...resultProps} key={Helpers.getId(result)} index={index}/>);
        }


    }
    if (lastCollapsedResults.length > 0) {
        list = list.concat(lastCollapsedResultsComponents);
        list.push(<CollapsedResultsButton key={Helpers.getResultIds(lastCollapsedResults)}
                                          results={lastCollapsedResults}
                                          resultsAreCollapsed={resultsAreCollapsed(lastCollapsedResults)}
                                          showCollapsedResultsHandler={showCollapsedResults}
                                          hideCollapsedResultsHandler={hideCollapsedResults} searchState={searchState}
                                          serpId={serpId}/>);
    }
    const currentCollapsedResultsLength = Object.values(collapsed).filter(value => value).length;
    const allBookmarkedResultsHidden = currentCollapsedResultsLength === getCollapsibleResultsLength();


    return (
        <Container>
            <Row>
            {filters}
            <Col className="SearchResults"sm={9} id="intro-search-results">

                {config.interface.timeIndicator && results.length > 0 &&
                <div className="time"> {timeIndicator}</div>
                }
                {distributionOfLabour === "unbookmarkedSoft" &&
                <div className="collapsedText">
                    {/* <Button className="allCollapsedResultsButton" onClick={showAllCollapsedResults}
                            disabled={allBookmarkedResultsShown}>
                        Show all hidden results
                    </Button> */}
                    <Button variant="light" className="allCollapsedResultsButton" onClick={hideAllCollapsedResults}
                            disabled={allBookmarkedResultsHidden}>
                        Hide all saved results
                    </Button>
                </div>
                }
                <Row>
                    {list}
                </Row>
                {pagination}
            </Col>
            </Row>

            
        </Container>
    )
};

export default SearchResults;