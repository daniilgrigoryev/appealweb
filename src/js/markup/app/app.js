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
import DecisionsList from '../editable/decisionsList.js'
import CategoriesList from '../editable/categoriesList.js'
import AppealCauseList from '../editable/appealCauseList.js'
import TipDocList from '../editable/tipDocList.js'

const relocate = (newPath)=>{
  window.location.hash=('#/'+newPath);
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
          <Route path='/settings/decisions' component={DecisionsList} />
          <Route path='/settings/categories' component={CategoriesList} />
          <Route path='/settings/appeal_causes' component={AppealCauseList} />
          <Route path='/settings/doc_types' component={TipDocList} />
          <Route path='*' component={NotFoundPage} />
        </Switch>        
      </LayoutConnected>
    </HashRouter>
  ); //
};




const Home = () => {
  return <h1>Главная страница. Тут может быть что-то. А может не быть.</h1>;
}; //


const NotFoundPage = ({ match }) => {
  const {url} = match;
  return (
    <div>
      <h1>Неудача.</h1>
      <p>Такой страницы тут нет</p>
    </div>
  );//
};

class Layout  extends React.Component  {

  render(){
    const {children,dispatch,sessionId} = this.props;
    
    const onSelect = (newVal)=>{
      if (newVal=='LOGOUT'){
        relocate('');
        dispatch(logoutRequest(sessionId));
      } else {
        relocate(newVal);
      }
    }

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
              <Menu.Item index="settings/decisions">Решения</Menu.Item>
              <Menu.Item index="settings/categories">Категории</Menu.Item>
              <Menu.Item index="settings/appeal_causes">Причины жалоб</Menu.Item>
              <Menu.Item index="settings/doc_types">Типы документов</Menu.Item>
            </Menu.SubMenu>
            <Menu.Item index="LOGOUT">Выход</Menu.Item>
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