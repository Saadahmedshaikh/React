import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom'
import LoadingScreen from 'react-loading-screen';
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
    Table,
    Modal, 
    ModalBody,
      ModalHeader
  } from 'reactstrap';
import './../RigStatus/spinner.css';
class RigStatus extends Component{
    constructor(props) {
        super(props);
    this.basestate = this.state;
        this.toggle = this.toggle.bind(this);
        this.toggleFade = this.toggleFade.bind(this);
        this.state = {
          collapse: true,
          fadeIn: true,
          timeout: 300,
          laststatus:'',
          date:'',
          items: [],
          rigs:[],
          orgunit:'',
          updatestatus:'',
          lastsecondarystatus:'',
          flag:false,
          small: false,
          redirect:false,
          spinner:true,
          reset:false
        };
        this.toggleSmall = this.toggleSmall.bind(this);
      }
      toggleSmall(){
        this.setState({
          small: !this.state.small,
        });
        
      }
     
      toggle() {
        this.setState({ collapse: !this.state.collapse });
      }
    
      toggleFade() {
        this.setState((prevState) => { return { fadeIn: !prevState }});
      }
      resetForm = () =>{
        this.setState({ flag:false });
        document.getElementById("form1").reset();
      }
      componentDidMount() {
        axios.get('http://localhost:37329/RigStatusLog/allrigs')
          .then(response => {
              const A =JSON.parse(response.data)  
              this.setState({
                  items:A
              });
          }); 
          this.hideSpinner();
      
      }

hideSpinner(){
  setTimeout(
    function(){
      this.setState({spinner:false})
    }
    .bind(this),
    1500
  )
  
}
showSpinner(){
  this.setState({
    spinner:true
  })

this.hideSpinner();
}

reload=(rig)=> {
  this.showSpinner();
  axios.get('http://localhost:37329/RigStatusLog/GetRigStatusLog/'+ rig)
  .then(response => {
      const B =JSON.parse(response.data); 
      this.setState({
        rigs:B,
        laststatus:B[0].Rig_Status,
        date:B[0].Rig_Status_Change_Date,
        orgunit:rig,
        lastsecondarystatus:B[0].Secondary_Status,
        flag:true
        
       });

       const formattedDate =this.state.date.toString().substring(0,10);
       document.getElementById("statusdate").value=formattedDate;
       
      if(this.state.laststatus=="Active"){
          document.getElementById("active").checked=true;
      }else{
         document.getElementById("inactive").checked=true;
      }
  });
}



      handleChange=(event)=> {
        this.showSpinner();
        const rig=event.target.value;
        axios.get('http://localhost:37329/RigStatusLog/GetRigStatusLog/'+ rig)
        .then(response => {
            const B =JSON.parse(response.data); 
            this.setState({
              rigs:B,
              laststatus:B[0].Rig_Status,
              date:B[0].Rig_Status_Change_Date,
              orgunit:rig,
              lastsecondarystatus:B[0].Secondary_Status,
              flag:true
              
             });
    
             const formattedDate =this.state.date.toString().substring(0,10);
             document.getElementById("statusdate").value=formattedDate;
             
            if(this.state.laststatus=="Active"){
                document.getElementById("active").checked=true;
            }else{
               document.getElementById("inactive").checked=true;
            }
        });
      }

      secondarstatuschanged=(event)=>{
    
        if(event.target.value==0||event.target.value==1||event.target.value==5){
          this.setState({
            laststatus:"Active"
          })
          document.getElementById("active").checked=true;
        }
        else{
          this.setState({
            laststatus:"InActive"
          })
          document.getElementById("inactive").checked=true;
        }

    this.setState({
      updatestatus:event.target.value
    })
}

//Post HTTP Call to save new status
onSave=(event)=>{
  this.showSpinner();
  var rs;
      
      if(this.state.laststatus=="Active"){
        rs=true;
      }else{
        rs=false;
      }
 var today = new Date();
  const status={
    "RigStatusLogiID":"",	
    "RigInactivityStartDate":today,	
    "RigActivityStartDate":today,	
    "RigStatus":rs,
    "OrgUnitID":this.state.orgunit,
    "CreatedOn":today,
    "CreatedBy":"react",
    "UpdatedBy":"react",
    "SecondaryStatus":this.state.updatestatus
  }
  
  axios.post("http://localhost:37329/RigStatusLog/updateStatus",status)
  .then(response=> {
    this.reload(response.data.OrgUnitID);
  /*  const obj={
      
      "Rig_Status":response.data.status?"Active":"In Active",
      "Secondary_Status":this.secstatus(response.data.Secondary_Status),
      "Rig_Status_Change_Date":today,	
      "Changed_On":today,
      "Changed_By":"react"
      
    }
    console.log(response);
    this.setState(prevState => {
      return {
          rigs: [...prevState.rigs,obj]
          
      }
});
console.log(this.state.rigs);
console.log(obj);*/
    this.toggleSmall();
  })
}
render(){
  if(this.state.reset){
    return <Redirect to="RigStatus"/>
  }
 
  if(this.state.lastsecondarystatus=='Operational'){
    var option=<Fragment><option value="1">Operational</option> <option value="2">Demobilizing</option></Fragment> 
    
 }
 else if(this.state.lastsecondarystatus=='Mobilizing'){
  var option=<Fragment><option value="0">Mobilizing</option> <option value="1">Operational</option></Fragment> 
  
}
 else if(this.state.lastsecondarystatus=='Demobilizing'){
  var option=<Fragment><option value="2">Demobilizing</option>
        <option value="3">Cold Stacked</option>
        <option value="4">Hot Stacked</option>
        <option value="0">Mobilizing</option>
        <option value="5">Warm Stacked</option>
        </Fragment> 
}
else if(this.state.lastsecondarystatus=='Cold Stacked'){
  var option=<Fragment>
    <option value="3">Cold Stacked</option>
    <option value="4">Hot Stacked</option>
    <option value="0">Mobilizing</option>
    <option value="5">Warm Stacked</option>
        </Fragment> 
}
else if(this.state.lastsecondarystatus=='Hot Stacked'){
  var option=<Fragment>
    <option value="4">Hot Stacked</option>
    <option value="3">Cold Stacked</option>
    <option value="5">Warm Stacked</option>
    <option value="0">Mobilizing</option>
        </Fragment> 
}
else if(this.state.lastsecondarystatus=='Warm Stacked'){
  var option=<Fragment>
  <option value="5">Warm Stacked</option>
    <option value="4">Hot Stacked</option>
    <option value="3">Cold Stacked</option>
    <option value="0">Mobilizing</option>
        </Fragment> 
}
 else{
  var option= <option value=""></option> 
 }
    return(
      <div>

     <LoadingScreen
    loading={this.state.spinner}
    bgColor='#f1f1f1'
    spinnerColor='#9ee5f8'
    textColor='#676767'
    text='Loading'
  > 
   
  </LoadingScreen>
      
        
      <Row>
      <Col xs="2" md="2"></Col>
        <Col xs="6" md="6">
            <Card>
              <CardHeader>
              
                <h4><strong>Rig Status Management</strong></h4>
              </CardHeader>
              <CardBody>
                <Form className="form-horizontal" id="form1">
                  <FormGroup row>
                    <Col xs="3" md="3">
                      <Label htmlFor="rigs">Rig :</Label>
                    </Col>
                    <Col xs="8" md="8">
                    <Input type="select" id="rigs"  value={this.state.value} onChange={this.handleChange}>
                    <option value="">Please select a rig</option>
                    {
                      this.state.items.map((item)=>{
                        return(
                          <option value={item.OrgUnitId}>{item.OrgNamePrm}</option>
                          
                        )
                        })
                  }
                      </Input>
                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="3" md="3">
                      <Label htmlFor="secondarystatus">Rig Secondary Status :</Label>
                    </Col>
                    <Col xs="8" md="8">
                    <Input type="select" id="secondarystatus" onChange={this.secondarstatuschanged}>
                    {
                     option    
                    }
                      </Input>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label>Status</Label>
                    </Col>
                    <Col md="9">
                      <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="active" name="status" disabled/>
                        <Label className="form-check-label" check htmlFor="active">Active</Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="inactive" name="status" disabled />
                        <Label className="form-check-label" check htmlFor="inactive">Inactive</Label>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                 
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="statusdate">Status Change Date</Label>
                    </Col>
                    <Col xs="8" md="8">
                      <Input type="date" id="statusdate" disabled />
                    </Col>
                  </FormGroup>
                  
                </Form>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="lg" color="primary" onClick={this.onSave}><i className="fa fa-dot-circle-o"></i> Save</Button>{'   '}
                <Button type="reset" size="lg" color="danger" onClick={this.resetForm}><i className="fa fa-ban"></i> Cancel</Button>
              </CardFooter>
            </Card>
            
          </Col>
          </Row>
          {this.state.flag?
          <Row>
            <Col md="12">
            <Card>
              <CardHeader>
                <h5> Rig Status History </h5>
              </CardHeader>
              <CardBody>
                <Table responsive striped>
                  <thead>
                  <tr>
                  <th>Rig Status</th>
                  <th>Secondary Status</th>
                  <th>Rig Status Change Date</th>
                  <th>Change On</th>
                  <th>Change By</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    this.state.rigs.map((item)=>{
                      return(
                          <tr>
                      
                      <td>{item.Rig_Status=='Active'?<Badge color="success">Active</Badge>:<Badge color="danger">Inactive</Badge>}</td>
                      <td>{item.Secondary_Status}</td>
                      <td>{item.Rig_Status_Change_Date.toString().substring(0,10)}</td>
                      <td>{item.Changed_On.toString().substring(0,10)}</td>
                      <td>{item.Changed_By}</td>
                      </tr>
                      )
                        
                    })
                } 
                  </tbody>
                </Table>
                </CardBody>
            </Card>

            </Col>
          </Row>
          :null
          }
 
<Modal isOpen={this.state.small} toggle={this.toggleSmall}
                       className={'modal-sm ' + this.props.className}>
                  <ModalHeader toggle={this.toggleSmall}>Success</ModalHeader>
                  <ModalBody>
                    Status has been updated Successfully!
                  </ModalBody>
                </Modal>


          </div>
    )
}
 

}
export default RigStatus;