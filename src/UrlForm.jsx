import React, { Component } from 'react';
import axios from 'axios';
import {
    Alert, Form, Button, Col, Row, Jumbotron,
} from 'react-bootstrap';

export default class UrlForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: null,
            shortenedUrl: null,
            isValid: null,
            serverError: null,
        };
    }

    onChangeHandler = (evt) => this.setState({ url: evt.target.value });

    onSubmitHandler = async (evt) => {
        evt.preventDefault();
        let { url } = this.state;
        if (url === null) {
            this.setState({ isValid: false });
            return;
        }
        if (url.trim() !== '' && !url.trim().startsWith('http://') && !url.trim().startsWith('https://')) {
            url = `http://${url}`;
        }
        try {
            const response = await axios.post('http://shortly.heanzyzabala.com/api/shorten', { url });
            this.setState({ shortenedUrl: `http://hzab.me/${response.data.code}`, isValid: true });
        } catch (e) {
            const { status } = e.response;
            if (status === 422) {
                this.setState({ isValid: false });
            } else {
                this.setState({ serverError: true });
            }
        }
    }

    render() {
        let alert = null;
        const { shortenedUrl: url, isValid, serverError } = this.state;
        if (isValid != null && !isValid) {
            alert = (
                <Alert variant="danger" className="fixed">
                    <Alert.Heading>Uh-oh!</Alert.Heading>
                    You entered an invalid link.
                </Alert>
            );
        } else if (serverError != null && serverError) {
            alert = (
                <Alert variant="warning">
                    <Alert.Heading>Hmmm.</Alert.Heading>
                    Something seems to be wrong. Try again later!
                </Alert>
            );
        } else if (url) {
            alert = (
                <Alert variant="success">
                    <Alert.Heading>Success!</Alert.Heading>
                    <div>Here is your link: </div>
                    <Alert.Link href={url}>
                        {url}
                    </Alert.Link>
                </Alert>
            );
        }
        return (
            <div>
                <Jumbotron>
                    <div
                        className="text-center"
                    >
                        <h1 className="display-3"> Shortly </h1>
                        <p className="mt-2">
                            A free, fast and simple link shortener.
                        </p>
                    </div>
                    <div
                        className="ml-5 mr-5 pt-3"
                    >
                        <Form
                            onSubmit={this.onSubmitHandler}
                        >
                            <Form.Row
                                className="mb-4"
                            >
                                <Col sm={2} />
                                <Col
                                    sm={6}
                                    className="mb-2"
                                >
                                    <Form.Control
                                        onChange={this.onChangeHandler}
                                        type="text"
                                        placeholder="Enter URL here"
                                        size="lg"
                                    />
                                </Col>
                                <Col
                                    sm={2}
                                >
                                    <Button
                                        type="submit"
                                        size="lg"
                                        block
                                        variant="primary"
                                    >
                                        Shorten
                                    </Button>
                                </Col>
                                <Col sm={2} />
                            </Form.Row>
                            <Row>
                                <Col sm={2} />
                                <Col sm={8}>
                                    {alert}
                                </Col>
                                <Col sm={2} />
                            </Row>
                        </Form>
                    </div>
                </Jumbotron>
            </div>
        );
    }
}
