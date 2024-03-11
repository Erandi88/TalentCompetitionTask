import React from 'react';
import Cookies from 'js-cookie';
import { Container, Pagination, Label, Card, Popup, Button, Icon } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
   constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)

    }

    //Request for closing a job
    selectJob(id) {
        try {
            const cookies = Cookies.get('talentAuthToken');
            //const link = 'http://localhost:51689/listing/listing/closeJob';
            const link = 'https://talentservicetalentlistingcompetitions.azurewebsites.net/listing/listing/closeJob';
            $.ajax({
                url: link,
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(id),
                success: (res) => {
                    console.log(res.message);
                    window.location.reload(false);
                },
                error: (res) => {
                    console.error(res.message);
                }
            });
        } catch (error) {
            console.error('An error occurred while selecting job:', error);
        }
    }

   

    renderJobCards() {
        const { jobs } = this.props;
        return jobs.map((job, id) => (
            <Card key={id}
                header={
                    <React.Fragment>
                        <Card.Header>{job.title}</Card.Header>
                        <Label as='a' color='black' ribbon='right'>
                            <Icon name="user" /> {job.noOfSuggestions}
                        </Label>
                    </React.Fragment>
                }

                meta={`${job.location.city}, ${job.location.country}`}
                description={job.summary}
                extra={
                    <React.Fragment>
                        <Button floated='left' size='mini' color='red'>Expired</Button>
                        <Button.Group floated='right' size='mini'>
                            <Button basic color='blue' onClick={() => this.selectJob(job.id)}><Icon name='ban' />Close</Button>
                            <Button basic color='blue' href={`/EditJob/${job.id}`}><Icon name='edit' />Edit</Button>
                            <Button basic color='blue' ><Icon name='copy' />Copy</Button>
                        </Button.Group>
                    </React.Fragment>
                }
            />
        ));
    }

    renderEmptyContent() {
        return <p>No Jobs Found</p>;
    }

    render() {
        const { jobs } = this.props;

        return (
            <React.Fragment>
                <div className="ui container">
                    {jobs.length > 0 ? (
                        <Card.Group itemsPerRow={3} doubling={true}>
                            {this.renderJobCards()}
                        </Card.Group>
                    ) : (
                        this.renderEmptyContent()
                    )}
                </div>
            </React.Fragment>
        );
    }

}