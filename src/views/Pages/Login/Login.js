import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { Redirect } from 'react-router-dom'
import { AppSidebar } from '@coreui/react';
class Login extends Component {
  
  constructor(props){
    super(props);
    this.state={
      username:"",
      password:"",
      flag:false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(key) {
    return function (e) {
      var state = {};
      state[key] = e.target.value;
      this.setState(state);
    }.bind(this);
    
  }
  handleSubmit(event) {
    if(this.state.username=="admin" && this.state.password == "admin"){
    alert('Welcome '+this.state.username);
  this.setState({
    flag:true
  })
    }else{
      alert('Incorrect username or password');
    }
  }
  render() {
    
    if(this.state.flag){
      return <Redirect to="Dashboard"/>
    }
    return (
      <div className="app flex-row align-items-center">
        
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Username" value="admin" value={this.state.username} onChange={this.handleChange('username')} />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" value="admin" value={this.state.password} onChange={this.handleChange('password')} />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                        <Button size="lg" color="primary" onClick={this.handleSubmit}> Submit</Button>
                        </Col>
                        
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <br/><br/><br/>
                      <h2>TRM Solutions</h2>
                     <p>Welcome to our Website</p>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
