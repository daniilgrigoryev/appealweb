import React from 'react'
import {Field, FieldArray, reduxForm, arrayPush} from 'redux-form/immutable'
import {Dialog, Button, Card, Layout, Alert} from 'element-react'
import * as _ from 'lodash'
import {post} from '../../services/ajax.js'
import LinkerSearch from './linkerSearch.js'
import {FInput, EInput} from '../components/finput.js'
import {EPicker, FPicker} from '../components/picker.js'
import {messageSet} from '../../actions/common.js'
import Immutable from 'immutable'

const im = (obj) => Immutable.fromJS(obj)

const linkedDocs = (props) => {
    const {fields, disabled, hideLinker, showLinker,dispatch,change,initialize} = props
    const add = showLinker;

    const rmv = (indx) => async () => { // replace with db call needed
       const alias = 'REMOVE_LINK_TABLE';
       try {
            const LINK_ID = fields.get(indx).get('link_id');
            await post('db/select',{alias,LINK_ID});
            fields.remove(indx);
       } catch (exc){
            messageSet(exc,'error');
       }
    } 
    const inf = (ind) => () => fields.remove(ind); // ! replace me
    const ROWS = fields.map((x, i,arr)=>{      
        const {l_dir,l_doc,doc_id} = arr.get(i).toJS();

        const openRow = async () => {
            let alias = false;
            let redir = false;
            if (l_dir=='IN' && l_doc=='CLAIM'){
                alias = 'CLAIM_GET';
                redir = '/appeal_incoming&storageKey=';            
            } else if (l_dir=='OUT' && l_doc=='CLAIM'){
                alias = 'CLAIM_OUT_GET';
                redir = '/appeal_outgoing&storageKey=';
            } else {
                return  messageSet('Не удалось открыть документ','error');;
            } // http://127.0.0.1:8081/#/appeal_incoming

            const orphan = true;
            const claim_id = doc_id;
            const x = await post('db/select', {alias, claim_id,orphan});

            dispatch(initialize(im(x.data)));
            const key = window.stateSave();
            const href =  window.location.href.replace(/[^\/]+$/,redir + key);
            window.open(href,'_blank');            
        }

        return (<tr key={i}>
                    <td><Field component={FInput} name={x + 'registration_number'} disabled={true}/></td>
                    <td><Field component={FInput} name={x + 'post_n'} disabled={true}/></td>
                    <td><Field component={FInput} name={x + 'name'} disabled={true}/></td>
                    <td><Field component={FInput} name={x + 'zajav'} disabled={true}/></td>
                    <td><Field component={FInput} name={x + 'isp_name'} disabled={true}/></td>
                    <td><Field component={FInput} name={x + 'reg_date'} disabled={true}/></td>
                    <td><Field component={FInput} name={x + 'status'} disabled={true}/></td>
                    <td>
                        {disabled ? null : 
                        <Button size="small" type="text" onClick={rmv(i)}>
                            <i className="ico round minus"/>
                        </Button>}
                    </td>
                </tr>);
    }); //

    //<td>{disabled ? null : <button type='button' onClick={inf(i)}>I</button>}</td>
            
    return (
        <React.Fragment>
            {!fields.length 
                ? <p className="my6 txt-em color-gray align-center">Нет связанных документов</p>
                : <div className="style-table-wrapper">
                        <table className="style-table">
                            <thead>
                                <tr>
                                    <th style={{'width': '180px'}} className="align-center">№ документа</th>
                                    <th style={{'width': '180px'}}>№ постановления</th>
                                    <th style={{'width': '140px'}}>Документ</th>
                                    <th style={{'width': '210px'}}>Заявитель</th>
                                    <th style={{'width': '160px'}}>Исполнители</th>
                                    <th style={{'width': '160px'}}>Дата регистрации</th>
                                    <th style={{'width': '140px'}}>Стадия</th>
                                    <th style={{'width': '60px'}}>-</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ROWS}
                            </tbody>
                        </table>
                    </div>

            }

            {disabled ? null :
                <Button size="small" icon="plus" onClick={add} plain={true}
                    className={`flex-parent mx-auto block ${!fields.length ? 'my6' : 'mt18'}`}
                        title='Добавить адресата'>Добавить</Button>
            }
        </React.Fragment>
    ); //
}

class DocLinker extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            linkerVisible: false
        }

        this.showLinker = this.showLinker.bind(this);
        this.hideLinker = this.hideLinker.bind(this);
    }

    showLinker() {
        this.setState({linkerVisible: true});
    }

    hideLinker() {
        this.setState({linkerVisible: false});
    }

    render() {
        const {disabled, array, dispatch,id,reloadRow,root_doc,root_dir,initialize} = this.props
        const {linkerVisible} = this.state;

        const CONTENT = (!id) 
            ? (
            <div className="flex-parent flex-parent--center-main flex-parent--column form-container">
                <i className="ico round info w30 h30 mx-auto mt18"/>
                <p className="my6 txt-em color-gray align-center">
                    Связывание возможно только для зарегистрированных обращений <br/>
                    Вначале сохраните документ, нажав кнопку 'Зарегистрировать
                </p>
            </div>
            )
            : (<div key='ili'>
                    <FieldArray name='linked_docs' component={linkedDocs} disabled={disabled} initialize={initialize} showLinker={this.showLinker} hideLinker={this.hideLinker}/>
                </div>)
        
        const LINKER = !linkerVisible
            ? null
            : (<Dialog key='ilid'
                       title="Связанные обращения"
                       showClose={false}
                       closeOnClickModal={false}
                       closeOnPressEscape={false}
                       visible={linkerVisible}
                       onCancel={this.hideLinker}
                       lockScroll={true} 
                       className="style-modal">

                <Dialog.Body className="px0 py0">
                    <LinkerSearch dialogClose={this.hideLinker} reloadRow={reloadRow} root_id={id} root_doc={root_doc} root_dir={root_dir}/>
                </Dialog.Body>
            </Dialog>); //

            return [
                <div scrollanchor='links' key='ili' id='links'>
                    <Card className="box-card sectionCard" bodyStyle={{padding: '0 0 20px 0'}} header={
                        <div className="headline">
                            <h3>Связанные обращения</h3>
                        </div>
                    }>{CONTENT}</Card>
                </div>
                ,LINKER];
    };
} //

export default DocLinker;