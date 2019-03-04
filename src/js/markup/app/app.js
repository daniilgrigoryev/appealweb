import './app.scss'
import React from 'react'
import {connect} from 'react-redux'
import {BrowserRouter, HashRouter, Route, Switch, NavLink, Link, withRouter} from 'react-router-dom'
import {Menu, Layout, Button} from 'element-react'
import {logoutRequest} from '../../actions/common.js'
import {getSessionId} from '../../selectors/common.js'
import AppealWizard from '../appeal/appealWizard.js'
import AppealExplorer from '../table/appealExplorer.js'
import FabulasList from '../editable/fabulasList.js'
import DecisionsList from '../editable/decisionsList.js'
import CategoriesList from '../editable/categoriesList.js'
import AppealCauseList from '../editable/appealCauseList.js'
import TipDocList from '../editable/tipDocList.js'
import Outgoing from '../outgoing/outgoing.js'
import OutcomingLetter from '../letter/out/outcomingLetter.js'
import IncomingLetter from '../letter/inc/incomingLetter.js'

import burger from '../../../images/burger.svg'

const relocate = (newPath) => {
    window.location.hash = ('#/' + newPath);
}

export default function App() {
    return (
        <HashRouter>
            <LayoutConnected>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route path='/appeal_incoming' component={AppealWizard}/>
                    <Route path='/appeal_outgoing' component={Outgoing}/>
                    <Route path='/explore' component={AppealExplorer}/>
                    <Route path='/letter_incoming' component={IncomingLetter}/>
                    <Route path='/letter_outgoing' component={OutcomingLetter}/>
                    <Route path='/settings/fabulas' component={FabulasList}/>
                    <Route path='/settings/decisions' component={DecisionsList}/>
                    <Route path='/settings/categories' component={CategoriesList}/>
                    <Route path='/settings/appeal_causes' component={AppealCauseList}/>
                    <Route path='/settings/doc_types' component={TipDocList}/>
                    <Route path='*' component={NotFoundPage}/>
                </Switch>
            </LayoutConnected>
        </HashRouter>
    ); //
};


const Home = () => {
    return <h1>Главная страница. Тут может быть что-то. А может не быть.</h1>;
}; //


const NotFoundPage = ({match}) => {
    const {url} = match;
    return (
        <div>
            <h1>Неудача.</h1>
            <p>Такой страницы тут нет</p>
        </div>
    );//
};

class LayoutMain extends React.Component {

    render() {
        const {children, dispatch, sessionId} = this.props;

        const onSelect = (newVal) => {
            if (newVal == 'LOGOUT') {
                relocate('');
                dispatch(logoutRequest(sessionId));
            } else {
                relocate(newVal);
            }
        }

        const stLogout = {'cursor': 'pointer'}
        return (
            <div className='w-full'>
                <header className='ap-header'>
                    <Layout.Row align='middle'>
                        <Layout.Col span="4" className='flex-parent flex-parent--center-main flex-parent--center-cross mt3'>
                            <Button type="text">
                                <img src={burger} className='px12' alt="Переключение между модулями" />
                            </Button>

                            <h2 className='ap-h2 txt-uppercase color-dark-light'>Обращения</h2>
                        </Layout.Col>

                        <Layout.Col span="20">
                            <nav>
                                <Menu defaultActive="1" className="el-menu-demo" mode="horizontal" onSelect={onSelect}>
                                    <Menu.Item index="">Главная</Menu.Item>
                                  
                                    <Menu.SubMenu index="1" title="Обращения">
                                        <Menu.Item index="appeal_incoming">Новое входящее</Menu.Item>
                                        <Menu.Item index="appeal_outgoing">Новое исходящее</Menu.Item>
                                        <Menu.Item index="explore">Поиск</Menu.Item>
                                    </Menu.SubMenu>


                                    <Menu.SubMenu index="2" title="Служебные письма">
                                        <Menu.Item index="letter_incoming">Новое входящее</Menu.Item>
                                        <Menu.Item index="letter_outgoing">Новое исходящее</Menu.Item>
                                        <Menu.Item index="explore">Поиск</Menu.Item>
                                    </Menu.SubMenu>

                                    <Menu.SubMenu index="3" title="Справочники">
                                        <Menu.Item index="settings/fabulas">Фабулы</Menu.Item>
                                        <Menu.Item index="settings/decisions">Решения</Menu.Item>
                                        <Menu.Item index="settings/categories">Категории</Menu.Item>
                                        <Menu.Item index="settings/appeal_causes">Причины жалоб</Menu.Item>
                                        <Menu.Item index="settings/doc_types">Типы документов</Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.Item index="LOGOUT">Выход</Menu.Item>
                                </Menu>
                            </nav>
                        </Layout.Col>
                    </Layout.Row>
                </header>

                <main className='px18 py18'>{children}</main>
            </div>
        ); //
    }
}

const LayoutConnected = withRouter(connect((state, props) => {
    const sessionId = getSessionId(state);
    return {...props, sessionId};
})(LayoutMain));