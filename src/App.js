
 import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {People,Organisation} from './tabComponents';
import { Link, Route, BrowserRouter, Switch,Redirect} from "react-router-dom";
import './App.css'
import Storage from './storage';

//

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

function CenteredTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="People"  component ={Link} to="/people"/>
        <Tab label="Organisations" component={Link}  to="/orgs"/>
        
      </Tabs>
    </Paper>
  );
}
  // make data persistent even with a reload
if (window.performance) {
  if (performance.navigation.type === 1) {
     Storage.init()
  } else {
    
  }
}
  

 class App extends Component {
   
  
  componentDidMount () {
    
   
    
 // take use Storage
 
  if(localStorage["addressBook"]) { 
// watch  for
Storage.init()
 
  }
   
   

 
 
  }
     render() {
         return (
             <BrowserRouter>
             
              <div className="container">
           <div  className=''>
           
           <div className="title text-center">
           <hr className="uk-divider-icon"></hr>
			<h1 className='my-4'>Address Book</h1>
            <hr className="uk-divider-icon"></hr>
		</div>
       
      <CenteredTabs/>

<div>

  
</div>

<div>
 
</div>
           </div>

           <Switch>
            <Route path="/people" component={People} />
            <Route path="/orgs" component={Organisation} />
            <Route exact path="/">
    <Redirect to="/people" />
</Route>
           
           
          </Switch>
 
</div>

  
             </BrowserRouter>
           
         );
     }
 }
 
 export default App;
 

 