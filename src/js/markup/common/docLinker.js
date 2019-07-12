import React from 'react'
import {Field, FieldArray, reduxForm, arrayPush} from 'redux-form/immutable'
import {Dialog, Button, Card, Layout, Alert} from 'element-react'
import * as _ from 'lodash'
import {post} from '../../services/ajax.js'
import LinkerSearch from './linkerSearch.js'
import {FInput, EInput} from '../components/finput.js'
import {EPicker, FPicker} from '../components/picker.js'
import {messageSet} from '../../actions/common.js'


const linkedDocs = (props) => {
    const {fields, disabled, hideLinker, showLinker,dispatch} = props
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
    const ROWS = fields.map((x, i)=>(
        <tr key={i}>
            <td className="align-center">
                <Field component={FInput} name={x + 'registration_number'} value={x.registration_number} disabled={true}/> 
            </td>
            <td>
                {null && <span>782101771503040</span>}
            </td>
            <td>
                {null && <span>Письмо</span>}
            </td>
            <td>
                <Field component={FInput} name={x + 'name'} value={x.name} disabled={true}/> 
            </td>
            <td>
                {null && <span>Колесников Александр Васильевич</span>}
            </td>
            <td>
                {null && <span>Милушкин А. Ю. (Майорова Н. И.)</span>}
            </td>
            <td>
                {null && <span>19.04.2019</span>}
            </td>
            <td>
                {null && <span>Исполнено</span>}
            </td>
            <td>
                {disabled ? null : 
                <Button size="small" type="text" onClick={rmv(i)}>
                    <i className="ico round minus"/>
                </Button>}
            </td>
        </tr>)); //

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
                                    <th style={{'width': '140px'}}>Тип документа</th>
                                    <th style={{'width': '140px'}}>Направление</th>
                                    <th style={{'width': '210px'}}>Заявитель</th>
                                    <th style={{'width': '160px'}}>Исполнители</th>
                                    <th style={{'width': '160px'}}>Дата регистрации</th>
                                    <th style={{'width': '140px'}}>Стадия</th>
                                    <th style={{'width': '60px'}}>-</th>

                                    {/* <th className='ap-table-header'>Документ</th>
                                    <th className='ap-table-header'>Регистрационный номер</th> */}
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
        const {disabled, array, dispatch,id,reloadRow,root_doc,root_dir} = this.props
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
                    <FieldArray name='linked_docs' component={linkedDocs} disabled={disabled} showLinker={this.showLinker} hideLinker={this.hideLinker}/>
                </div>)
        
        const LINKER = !linkerVisible
            ? null
            : (<Dialog key='ilid'
                       title="Связанные обращения/письма"
                       showClose={false}
                       closeOnClickModal={false}
                       closeOnPressEscape={false}
                       visible={linkerVisible}
                       onCancel={this.hideLinker}
                       lockScroll={true} >

                <Dialog.Body>
                    <LinkerSearch dialogClose={this.hideLinker} reloadRow={reloadRow} root_id={id} root_doc={root_doc} root_dir={root_dir}/>
                </Dialog.Body>
            </Dialog>); //


            return [
                <div scrollanchor='links' key='ili' id='links'>
                    <Card className="box-card sectionCard" bodyStyle={{padding: '0 0 20px 0'}} header={
                        <div className="headline">
                            <h3>Связанные обращения/письма</h3>
                        </div>
                    }>
                        {CONTENT}
                    </Card>
                </div>
                ,
                LINKER
                ];
    };
} //

export default DocLinker;