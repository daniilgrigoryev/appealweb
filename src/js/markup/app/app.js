import './app.scss'
import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch, NavLink, Link,withRouter } from 'react-router-dom'
import {logoutRequest} from '../../actions/common.js'
import {getSessionId} from '../../selectors/common.js'
import AppealWizard from '../appeal/appealWizard.js'
import AppealExplorer from '../table/appealExplorer.js'
import ListTest from '../fabulas/listTest.js'

export default function App(){
  return (
    <BrowserRouter>
      <LayoutConnected>
        <Switch>          
          <Route exact path='/'  component={Home} />
          <Route path='/appeal'  component={AppealWizard} />
          <Route path='/explore' component={AppealExplorer} />
          <Route path='/fabulas' component={ListTest} />
          <Route path='*' component={NotFoundPage} />
        </Switch>        
      </LayoutConnected>
    </BrowserRouter>
  ); //
};

const Home = () => {
  return <h1>Here we are at the home page.</h1>;
}; //


const NotFoundPage = ({ match }) => {
  const {url} = match;
  return (
    <div>
      <h1>Whoops!</h1>
      <p>could not be located.</p>
    </div>
  );//
};

class Layout  extends React.Component  {
  render(){
    const {children,dispatch,sessionId} = this.props;
    const logout = ()=>dispatch(logoutRequest(sessionId));
    const stLogout={'cursor': 'pointer'}
    return (
      <div>
        <header>
        <h1 onClick={logout} style={stLogout}>Logout</h1>
        <nav>
          <ul className='navLinks'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/explore">Поиск</Link></li>
            <li><Link to="/appeal">Жалоба</Link></li>
            <li><Link to="/fabulas">Фабулы</Link></li>
          </ul>
        </nav>
      </header>
        <main>{children}</main>
      </div>
    ); //
  }
}

const LayoutConnected = withRouter(connect((state,props) => {
  const sessionId = getSessionId(state);
  return {...props,sessionId};
})(Layout));