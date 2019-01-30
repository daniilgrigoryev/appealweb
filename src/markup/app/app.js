import './app.scss'
import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom'
import {logoutRequest} from '../../actions/common.js'

export default function App(){
  return (
    <BrowserRouter>
      <LayoutConnected>
        <Switch>          
          <Route path='/tophergates' component={Home} />
          <Route path='/_display/' component={Home} />
          
          <Route path='/about' component={AboutUs} />
          <Route path='/contact' component={ContactUs} />
          <Route path='*' component={NotFoundPage} />
        </Switch>
      </LayoutConnected>
    </BrowserRouter>
  ); //
};

// Home page component
const Home = () => {
  return <h1>Here we are at the home page.</h1>;
}; //

// AboutUs page component
const AboutUs = () => {
  return <h1>Now we're here at the about us page.</h1>;
}; //

// ContactUs page component
const ContactUs = () => {
  // Prevent form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    return false;
  };
  
  return (
    <div>
      <h1>Contact Us</h1>
      <form onClick={handleSubmit}>
        <input type='text' placeholder='name' />
        <input type='text' placeholder='email' />
        <textarea />
        <button>Submit</button>
      </form>
    </div>
  ); //
};

// NotFoundPage component
// props.match.url contains the current url route
const NotFoundPage = ({ match }) => {
  const {url} = match;
  
  return (
    <div>
      <h1>Whoops!</h1>
      <p><strong>{url.replace('/','')}</strong> could not be located.</p>
    </div>
  );//
};


// Out layout component which switches content based on the route
class Layout  extends React.Component  {

  render(){
    const {children,dispatch,sessionId} = this.props;
    const logout = ()=>dispatch(logoutRequest(sessionId));
    const stLogout={color:'white','cursor': 'pointer'}
    return (
      <div>
        <header>
        <h1 onClick={logout} style={stLogout}>Logout</h1>
        <nav>
          <ul className='navLinks'>
            {/* Your home route path would generally just be '/'' */}
            <li><NavLink to="/tophergates">Home</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
            <li><NavLink to="/random-page">404 Page</NavLink></li>
          </ul>
        </nav>
      </header>
        <main>{children}</main>
        <footer>
          <p>Made with <span className='heart'>&lt;3</span> by tophergates</p>
        </footer>
      </div>
    ); //
  }

}

const LayoutConnected = connect((state,props) => {
  const sessionId = state.getIn(['user','sessionID']);
  return {...props,sessionId};
})(Layout);