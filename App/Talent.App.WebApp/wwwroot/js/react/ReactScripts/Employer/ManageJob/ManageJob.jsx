﻿import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Container, Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {

    constructor(props) {
        super(props);
        let loader = Object.assign({}, loaderData);
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");

        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        };

        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
    }


    init() {

        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        //loaderData.isLoading = false;
        this.setState({ loaderData });//comment this
        loaderData.isLoading = false;

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )

    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        try {
            //const link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs/';
            const link = 'https://talentservicetalentlistingcompetitions.azurewebsites.net/listing/listing/getSortedEmployerJobs/';
            const cookies = Cookies.get('talentAuthToken');
            // your ajax call and other logic goes here
            $.ajax({
                url: link,
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                type: "GET",
                contentType: "application/json",
                data: {
                    activePage: this.state.activePage,
                    sortbyDate: this.state.sortBy.date,
                    showActive: this.state.filter.showActive,
                    showClosed: this.state.filter.showClosed,
                    showDraft: this.state.filter.showDraft,
                    showExpired: this.state.filter.showExpired,
                    showUnexpired: this.state.filter.showUnexpired,
                },
                dataType: "json",
                success: (res) => {
                    console.log(res);
                    this.setState({ loadJobs: res.myJobs, totalPages: Math.ceil(res.totalCount / 6) });
                    //console.log(res);              
                },
                error: (res) => {
                    console.error(res.message);
                }
            });
        } catch (error) {
            console.error('An error occurred while fetching data:', error);
        }
    }



    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    handlePaginationChange(element, data) {
        let newdata = JSON.parse(JSON.stringify(this.state));
        newdata['activePage'] = data.activePage;
        this.setState({
            activePage: [...this.state.activePage, data.activePage]
        });
        this.loadNewData(newdata);
    }

    render() {
        return (
            <React.Fragment>
                <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                    <div>
                        <div className="ui container"><h1>List of Jobs</h1>
                            <div className="ui container"><Icon name='filter' />
                                Filter: <Dropdown text='Choose filter' inline /> <Icon name='calendar' />Sort by date: <Dropdown text='Newest First' inline />  </div>
                            <JobSummaryCard jobs={this.state.loadJobs} />
                        </div>
                        <div className="talent-pagination">
                            <Container textAlign='center'>
                                <Pagination
                                    activePage={this.state.activePage || 1}
                                    boundaryRange={0}
                                    siblingRange={2}
                                    totalPages={this.state.totalPages || 1}
                                    onPageChange={this.handlePaginationChange}
                                />
                            </Container>

                        </div>
                    </div>
                </BodyWrapper>
            </React.Fragment>
        )
    }
}