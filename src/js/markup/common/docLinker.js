import React from 'react'
import {Field, FieldArray, reduxForm, arrayPush} from 'redux-form/immutable'
import {Dialog, Button, Card, Layout, Alert} from 'element-react'
import * as _ from 'lodash'
import {post,response} from '../../services/ajax.js'
import LinkerSearch from './linkerSearch.js'
import {FInput, EInput} from '../components/finput.js'
import {EPicker, FPicker} from '../components/picker.js'


const linkedDocs = (props) => {
    const {fields, disabled, hideLinker, showLinker,dispatch} = props
    const add = showLinker;

    const rmv = (indx) => async () => { // replace with db call needed
       const alias = 'REMOVE_LINK_TABLE';
       try {
            const LINK_ID = fields.get(indx).get('link_id');
            response(await post('db/select',{alias,LINK_ID}));
            fields.remove(indx);
       } catch (exc){
            dispatch(messageSet(ecx,'error'));
       }
    } 
    const inf = (ind) => () => fields.remove(ind); // ! replace me
    const ROWS = fields.map((x, i)=>(
        <tr key={i}>
            <td><Field component={FInput} name={x + 'name'}                value={x.name}                disabled={true}/></td>
            <td><Field component={FInput} name={x + 'registration_number'} value={x.registration_number} disabled={true}/></td>
            <td>{disabled ? null : <button type='button' onClick={rmv(i)}>Удалить</button>}</td>
        </tr>)); //

    //<td>{disabled ? null : <button type='button' onClick={inf(i)}>I</button>}</td>
            
    return (
        <React.Fragment>
            {!fields.length 
                ? <p className='mt-neg18 mb18 txt-em color-gray'>Нет связанных документов</p>
                : <table>
                    <tbody>
                    <tr>
                        <td className='ap-input-caption'></td>
                        <td>
                            <table>
                                <thead>
                                <tr>
                                    <th className='ap-table-header'>Документ</th>
                                    <th className='ap-table-header'>Регистрационный номер</th>
                                </tr>
                                </thead>
                                <tbody>
                                {ROWS}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
            }

            <table>
                <tbody>
                <tr>
                    <td className='ap-input-caption'></td>
                    <td>
                        <table className='wmin300'>
                            <tbody>
                            <tr>
                                <td colSpan='3'>
                                    {disabled ? null :
                                        <Button size="small" icon="plus" onClick={add} type="success" plain={true}
                                                className="flex-parent mb18"
                                                title='Добавить адресата'>Добавить</Button>
                                    }
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
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
            ? (<Alert title="Связывание возможно только для зарегистрированных обращений"
                      type="warning"
                      description="Вначале сохраните документ, нажав кнопку 'Зарегистрировать' "
                      showIcon={true}
                      closable={false}
            />)
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
                <div scrollanchor='links' key='ili'>
                    <Layout.Row gutter="20">
                        <Layout.Col span="24">
                            <hr className='txt-hr my6'/>
                            <h4 className='ap-h4'>Связанные обращения/письма</h4>

                                {CONTENT}
                        </Layout.Col>
                    </Layout.Row>
                </div>,
                LINKER
                ];
    };
} //

export default DocLinker;