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
                <Card bodyStyle={{padding: '0'}} className="box-card sectionCard" header={
                        <div className='headline'>
                            <h3>Редактирование фабулы</h3>
                        </div>}>

                        <Card className="box-card sectionCard" header={
                            <div className='headline'>
                                <h3>Основные сведения</h3>
                            </div>
                        }>
                        <div className="wrap">
                            <div className="item">
                                <small className="label">Тип документа</small>
                                <div className="value">
                                    <EAutocomplete value={s.DOC_TYPE_ID} onChange={(v) => this.setVal('DOC_TYPE_ID', v)} dataKey={dataKeyTipDoc}/>
                                </div>
                            </div>
                            <div className="item">
                                <small className="label">Тип заявителя</small>
                                <div className="value">
                                    <EAutocomplete value={s.PERSON_TYPE_ID} onChange={(v) => this.setVal('PERSON_TYPE_ID', v)} dataKey='PERSON_TYPE'/>
                                </div>
                            </div>
                            <div className="item">
                                <small className="label">Наименование</small>
                                <div className="value">
                                    <EInput value={s.NAME} onChange={(v) => this.setVal('NAME', v)}/>
                                </div>
                            </div>
                            <div className="item">
                                <small className="label">Файл</small>
                                <div className="value">
                                    <input type="file" onChange={(v) => {
                                        const F = v.target.files[0];
                                        this.setVal('NAME', F.name.replace('.docx', ''));
                                        this.setVal('file', F);
                                    }}/>
                                </div>
                            </div>
                        </div>
                        </Card>
                        <Card className="box-card sectionCard" header={
                            <div className='headline'>
                                <h3>Список файлов DOCX</h3>
                            </div>
                        }>
                                <p className='my6 txt-em color-gray align-center'>Нет добавленных файлов</p>

                                <Button size="small" icon="upload2" className="mb18 mt6 mx-auto block" plain={true} onClick={() => this.loadFile(s.ID)}>
                                    Загрузить DOCX
                                </Button>
                        </Card>
                        <FabulaSecViewer doc_id={s.ID}/>
                    
                </Card>




                <div className='flex-parent flex-parent--space-between-main flex-parent--center-cross bg-white px18 py12'>
                    <div>
                        <Button size="small" type="text" onClick={() => this.ajax('FABULA_DOC_REMOVE')}>
                            <i className="el-icon-delete color-red-dark" style={{'fontSize': '18px'}}/>
                        </Button>
                    </div>
                    <div>
                        <Button type='info' size="small" plain={true} onClick={() => this.ajax('FABULA_DOC_PUSH')}>Сохранить</Button>
                        <Button type="primary" size="small" onClick={cancelEdit} className='ml24'>Отмена</Button>
                    </div>
                </div>
            </React.Fragment>
        );
    } //
}

const state2props = (state) => {
    const sid = getSessionId(state);
    const sys = getSystem(state);
    return {sid, sys};
}

export default connect(state2props)(FabulaDocEditor);