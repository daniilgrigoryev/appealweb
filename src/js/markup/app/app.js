import './app.scss'
import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter,HashRouter, Route, Switch, NavLink, Link,withRouter } from 'react-router-dom'
import {Menu}  from 'element-react'
import {logoutRequest} from '../../actions/common.js'
import {getSessionId} from '../../selectors/common.js'
import AppealWizard from '../appeal/appealWizard.js'
import AppealExplorer from '../table/appealExplorer.js'
import FabulasList from '../editable/fabulasList.js'

const relocate = (newPath)=>{
  window.location.hash=('#/'+newPath);
}

const onSelect = (newVal)=>{ debugger;
  //relocate(newVal);
}

export default function App(){
  return (
    <HashRouter>
      <LayoutConnected>
        <Switch>          
          <Route exact path='/'  component={Home} />
          <Route path='/appeal'  component={AppealWizard} />
          <Route path='/explore' component={AppealExplorer} />
          <Route path='/settings/fabulas' component={FabulasList} />
          <Route path='*' component={NotFoundPage} />
        </Switch>        
      </LayoutConnected>
    </HashRouter>
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
        <nav>

          <Menu defaultActive="1" className="el-menu-demo" mode="horizontal" onSelect={onSelect}>
            <Menu.Item index="">Главная</Menu.Item>
            <Menu.Item index="explore">Входящие обращения</Menu.Item>
            <Menu.Item index="appeal">Новое входящее</Menu.Item>
            <Menu.SubMenu index="" title="Справочники">
              <Menu.Item index="settings/fabulas">Фабулы</Menu.Item>
              <Menu.Item index="2-2">Решения</Menu.Item>
              <Menu.Item index="2-3">Категории</Menu.Item>

              <Menu.Item index="2-4">Причины жалоб</Menu.Item>
              <Menu.Item index="2-5">Типы документов</Menu.Item>
            </Menu.SubMenu>
            <Menu.Item index="" onClick={logout}>Выход</Menu.Item>
          </Menu>


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


/*
        <h1 onClick={logout} style={stLogout}>Logout</h1>


          <ul className='navLinks'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/explore">Поиск</Link></li>
            <li><Link to="/appeal">Жалоба</Link></li>
            <li><Link to="/settings/fabulas">Фабулы</Link></li>
          </ul>

*/