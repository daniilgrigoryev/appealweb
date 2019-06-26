import './app.scss'
import React,{ Suspense, lazy } from 'react'
import {connect} from 'react-redux'
import {BrowserRouter, HashRouter, Route, Switch, NavLink, Link, withRouter} from 'react-router-dom'
import {Menu, Button, Popover} from 'element-react'
import {logoutRequest} from '../../actions/common.js'
import {getSessionId} from '../../selectors/common.js'
import Immutable from 'immutable'

import ComboAppeal from '../appeal/comboAppeal.js'
import SidePanel from '../appeal/sidePanel.js'
import AppealExplorer from '../table/appealExplorer.js'
import AppealOutExplorer from '../table/appealOutExplorer.js'
import LetterExplorer from '../table/letterExplorer.js'
import IDecisExplorer from '../table/iDecisExplorer.js'
import ISignExplorer from '../table/iSignExplorer.js'
import DecisionsList from '../editable/decisionsList.js'
import CategoriesList from '../editable/categoriesList.js'
import AppealCauseList from '../editable/appealCauseList.js'
import TipDocList from '../editable/tipDocList.js'
import Outgoing from '../outgoing/outgoing.js'
import OutcomingLetter from '../letter/out/outcomingLetter.js'
import IncomingLetter from '../letter/inc/incomingLetter.js'
import DialSPI from '../settings/diapSPI.js'
import Postage from '../settings/postage.js'
import FabulaDocViewer from '../fabulas/fabulaDocViewer.js'

import {getVersion} from '../../reducers/rootReducer.js'

const im = (obj) => Immutable.fromJS(obj)

const relocate = (newPath) => {
    window.location.hash = ('#/' + newPath);
}

export {relocate}

export default function App() {
    return (
        <HashRouter>
            <LayoutConnected>
               
                    <Switch>
                        <Route exact path='/' render={()=><AppealExplorer/>}/>
                        <Route exact path='/explore_out' render={()=><AppealOutExplorer/>}/>
                        <Route exact path='/explore_letter' render={()=><LetterExplorer/>}/>
                        <Route path='/appeal_incoming' render={(props)=><SidePanel hashChange = {props.location.search}/>}/>
                        <Route path='/appeal_outgoing' render={(props)=><Outgoing hashChange = {props.location.search}/>}/>
                        <Route path='/explore' render={()=><AppealExplorer/>}/>
                        <Route path='/i_check' render={()=><IDecisExplorer/>} />
                        <Route path='/i_sign' render={()=><ISignExplorer/>} />
                        <Route path='/letter_incoming' render={(props)=><IncomingLetter hashChange = {props.location.search}/>}/>
                        <Route path='/letter_outgoing' render={(props)=><OutcomingLetter hashChange = {props.location.search}/>}/>
                        <Route path='/sprav/fabulas' render={()=><FabulaDocViewer/>}/>
                        <Route path='/sprav/decisions' render={()=><DecisionsList/>}/>
                        <Route path='/sprav/categories' render={()=><CategoriesList/>}/>
                        <Route path='/sprav/appeal_causes' render={()=><AppealCauseList/>}/>
                        <Route path='/sprav/doc_types' render={()=><TipDocList/>}/>

                        <Route path='/settings/diapSPI' render={()=><DialSPI/>}/>
                        <Route path='/settings/postage' render={()=><Postage/>}/>

                        <Route path='*' component={NotFoundPage}/>
                    </Switch>
            </LayoutConnected>
        </HashRouter>
    ); //
};

const Home = () => (<h1>Главная страница. Тут может быть что-то. А может не быть.</h1>); //

const NotFoundPage = ({match}) => {
    const {url} = match;
    return (
        <div>
            <h1>Неудача.</h1>
            <p>Такой страницы тут нет</p>
        </div>
    );//
};

let versionString = null;

class LayoutMain extends React.Component {

    componentDidMount() {
        const v = getVersion();
        versionString = _.join([v.database, v.backend, v.frontend], '.');
    }

    render() {
        const a = this;

        const {children, dispatch, sessionId} = this.props;

        const onSelect = (newVal) => {
            if (newVal == 'LOGOUT') {
                relocate('');
                dispatch(logoutRequest(sessionId));
            } else {
                relocate(newVal);
            }
        }

        const onLogout = () => {
            relocate('');
            dispatch(logoutRequest(sessionId));
        }

        const versionStyle = {
            opacity: 0.5,
            marginLeft: '5px',
            marginTop: '10px',
            fontSize: '10px'
        }
        const stLogout = {'cursor': 'pointer'}
        return (
            <React.Fragment>
                <header className='ap-header flex-parent flex-parent--center-cross'>
                    <div className='flex-parent flex-parent--center-cross ml24 mr24'>
                        <h2 className='ap-h2 txt-nowrap txt-uppercase color-dark-light'>Обращения граждан</h2>
                        <h1 style={versionStyle} title='Версия'>{versionString}</h1>
                    </div>

                    <Menu defaultActive="1" className="mx-auto" mode="horizontal" onSelect={onSelect}>
                        {false && <Menu.Item index="">Главная</Menu.Item>}

                        <Menu.SubMenu index="1" title="Обращения">
                                <Menu.Item index="appeal_incoming?new">Входящие: Новое</Menu.Item>
                                <Menu.Item index="explore">Входящие: Поиск</Menu.Item>
                                <Menu.Item index="i_check">Входящие: К проверке</Menu.Item>
                                <Menu.Item index="i_sign">Входящие: К подписи</Menu.Item>
                                <Menu.Item index="appeal_outgoing?new">Исходящие: Новое</Menu.Item>
                                <Menu.Item index="explore_out">Исходящие: Поиск</Menu.Item>
                        </Menu.SubMenu>

                        <Menu.SubMenu index="2" title="Служебные письма">
                            <Menu.Item index="letter_incoming?new">Новое входящее</Menu.Item>
                            <Menu.Item index="letter_outgoing?new">Новое исходящее</Menu.Item>
                            <Menu.Item index="explore_letter">Поиск</Menu.Item>
                        </Menu.SubMenu>

                        <Menu.SubMenu index="3" title="Справочники">
                            <Menu.Item index="sprav/fabulas">Фабулы</Menu.Item>
                        </Menu.SubMenu>
                            
                        {false && <Menu.SubMenu index="3" title="Справочники">
                            <Menu.Item index="sprav/fabulas">Фабулы</Menu.Item>
                            <Menu.Item index="sprav/decisions">Решения</Menu.Item>
                            <Menu.Item index="sprav/categories">Категории</Menu.Item>
                            <Menu.Item index="sprav/appeal_causes">Причины жалоб</Menu.Item>
                            <Menu.Item index="sprav/doc_types">Типы документов</Menu.Item>
                        </Menu.SubMenu>
                        }

                        {false && <Menu.SubMenu index="4" title="Настройки">
                            <Menu.Item index="settings/diapSPI">Диапазоны ШПИ</Menu.Item>
                            <Menu.Item index="settings/postage">Почтовые отправления</Menu.Item>
                        </Menu.SubMenu>}

                        {/*<Menu.Item index="LOGOUT">Выход</Menu.Item>*/}
                    </Menu>

                    <div className='mx-auto mr24'>
                        <Popover placement='left-end' offset='5' width='80' trigger="click" content={(
                            <div>
                                <Button className='block w-full align-l' type="text" onClick={onLogout}
                                        title='Меню пользователя'>Выйти</Button>
                                <hr className='border-b border--gray-light'/>
                                <Button className='block w-full align-l' type="text">Другое</Button>
                                <Button className='block w-full align-l ml0' type="text">Третье</Button>
                            </div>
                        )}>
                            <Button type="text" className="ap-user-menu-toggle">
                            </Button>
                        </Popover>
                    </div>
                </header>

                <main>{children}</main>
            </React.Fragment>
        );
    }
} //

const LayoutConnected = withRouter(connect((state, props) => {
    const sessionId = getSessionId(state);
    return {...props, sessionId};
})(LayoutMain));
