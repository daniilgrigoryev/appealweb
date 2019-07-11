import * as _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {Button, Card} from 'element-react'
import {EAutocomplete} from '../components/fautocomplete.js'
import {EInput} from '../components/finput.js'
import {getSessionId, getSystem} from '../../selectors/common.js'
import {mpt, get} from '../../services/ajax.js'
import {baseUrl} from '../../services/api.js'
import FabulaSecViewer from './fabulaSecViewer.js'

class FabulaDocEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = Object.assign({system: props.sys}, props.fabDoc);

        this.ajax = this.ajax.bind(this);
        this.loadFile = this.loadFile.bind(this);
    }

    setVal(field, value) {
        this.setState({[field]: value})
    }

    ajax(alias) {
        const {reloadParent} = this.props;
        const s = Object.assign({alias}, this.state);

        mpt('db/pushMultipart', s).then(x => {
            console.log(x);
            reloadParent();
        }).catch(x => {
            console.error(x);
        });
    }

    loadFile(id) {
        const {sid} = this.props;
        const {NAME} = this.state;
        const params = new URLSearchParams();
        params.append('sessionId', sid);
        params.append('ID', id);

        const link = baseUrl() + 'doc/get_fabula_docx?' + params.toString();
        const filename = encodeURI(NAME + '.docx');

        const tempLink = document.createElement('a');
        tempLink.href = link;
        tempLink.setAttribute('download', filename);
        tempLink.click();

        setTimeout(() => {
            tempLink && (tempLink.remove());
        }, 5000);
    }

    render() {
        const {sys, cancelEdit} = this.props;
        const s = this.state;

        const dataKeyTipDoc = 'FAB_DOC_TYPES';

        return (
            <React.Fragment>
                <Card bodyStyle={{padding: '0'}}
                      className="box-card"
                      header={
                          <div className='flex-parent flex-parent--center-cross flex-parent--space-between-main'>
                              <h3 className='ap-h3 flex-parent flex-parent--center-cross'>
                                  Редактирование фабулы
                              </h3>
                          </div>
                      }>
                    <div className='ap-form-bg px18 py6'>
                        <h4 className="ap-h4">Основные сведения</h4>
                        <table>
                            <tbody>
                            <tr>
                                <td className='ap-input-caption'>Тип документа</td>
                                <td><EAutocomplete value={s.DOC_TYPE_ID} onChange={(v) => this.setVal('DOC_TYPE_ID', v)}
                                                   dataKey={dataKeyTipDoc}/></td>

                                <td className='ap-input-caption'>Тип заявителя</td>
                                <td><EAutocomplete value={s.PERSON_TYPE_ID}
                                                   onChange={(v) => this.setVal('PERSON_TYPE_ID', v)}
                                                   dataKey='PERSON_TYPE'/></td>

                            </tr>
                            <tr>
                                <td className='ap-input-caption'>Наименование</td>
                                <td><EInput value={s.NAME} onChange={(v) => this.setVal('NAME', v)}/></td>

                                <td className='ap-input-caption'>Файл</td>
                                <td><input type="file" onChange={(v) => {
                                    const F = v.target.files[0];
                                    this.setVal('NAME', F.name.replace('.docx', ''));
                                    this.setVal('file', F);
                                }}/></td>
                            </tr>
                            </tbody>
                        </table>

                        <hr className='txt-hr my12'/>
                        <h4 className="ap-h4">Список файлов DOCX</h4>
                        <p class="mt-neg18 mb18 txt-em color-gray">Нет добавленных файлов</p>

                        <table>
                            <tbody>
                            <tr>
                                <td className='ap-input-caption'></td>
                                <td>
                                    <table className='wmin300'>
                                        <tbody>
                                        <tr>
                                            <td colSpan='3'>
                                                <Button size="small" icon="upload2" type="success" plain={true}
                                                        onClick={() => this.loadFile(s.ID)}>
                                                    Загрузить DOCX
                                                </Button>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <FabulaSecViewer doc_id={s.ID}/>

                    </div>
                </Card>

                <div className="ap-form__footer flex-parent flex-parent--center-cross flex-parent--space-between-main">
                    <div>
                        <Button type='info' plain={true} onClick={() => this.ajax('FABULA_DOC_PUSH')}>Сохранить</Button>
                        <Button type='text' onClick={cancelEdit} className='ml24'>Отмена</Button>
                    </div>

                    <Button size="small" type="text" onClick={() => this.ajax('FABULA_DOC_REMOVE')}>
                        <i className="el-icon-close color-red-dark"/>
                    </Button>
                </div>
            </React.Fragment>
        );
    } //
}

const state2props = (state) => {
    const sid = getSessionId(state);
    const sys = getSystem(state); debugger;
    return {sid, sys};
}

export default connect(state2props)(FabulaDocEditor);