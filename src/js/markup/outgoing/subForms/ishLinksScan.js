import React, {useRef} from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import Immutable from 'immutable'
import {FInput, EInput} from '../../components/finput.js'
import {EAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox} from '../../components/checkbox.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import {baseUrl} from '../../../services/api.js'
import {mpt} from '../../../services/ajax.js'
import * as _ from 'lodash'
import {Button, Card, Layout} from 'element-react'
import mapping from '../mapping.js'

const M = mapping.ishLinksScan;

const im = (obj)=> Immutable.fromJS(obj);

// const getRow = (id, npost, desc, docId, content) => {
//     return {
//         id: id || null,
//         desc: desc || '',
//         docId: docId || null,
//         content: content || null
//     }
// };

const download = async (sessionId,row)=>{
    const params = new URLSearchParams();
    params.append('sessionId',sessionId);
    params.append('storage_id',row.get('storage_id'));
    
    const path = 'storage/pull?'; 
    const tempLink = document.createElement('a');
    tempLink.href = baseUrl() + path + params.toString();
    tempLink.setAttribute('download', row.get('description'));
    tempLink.click();
    setTimeout(()=>(tempLink && (tempLink.remove())),5000);    
}

const scannedDocs = (props) => {
    const {disabled, files, setFiles, sid} = props
    const finput = useRef(null);
    const clickFile = ()=>finput.current.click();
    const remove = (storage_id)=>setFiles(files.filter(x=>x.get('storage_id')!=storage_id));

    const onFileLoad = async (e)=>{
        const file = e.target.files[0];
        const resp = await mpt('storage/push',{file});
        onFileDone(resp,file.name,'F')
    }

    const onFileDone = (resp,description,source_alias)=>{
        const {data,error} = resp;
        if (error){
            return console.error(error);
        }
        setFiles((files || im([])).push(im({ description: description, source_alias: source_alias, id: null, storage_id: data.id })));
    }

    const ROWS = !files ? null : files.map((x, i) => (   
        <tr key={x.get('storage_id')}>
            <td className="align-r pr6 w24">
                <span className='ap-table-list-number'>
                    {i + 1}
                </span>
            </td>
            <td className='inline-block w-full' onClick={()=>download(sid,x)}>{x.get('description')}</td>
            <td>
                <Button size="small" className="absolute mt-neg2" type="text" onClick={()=>remove(x.get('storage_id'))}>
                        <i className="el-icon-close color-red-dark ml6"/></Button>
            </td>
        </tr>));
//

    return (
        <React.Fragment>
            {!files ?
                <p className='mt-neg18 mb18 txt-em color-gray'>Нет сканированных документов</p>
                :
                <Layout.Row gutter="0">
                    <Layout.Col xs="24" md="12" lg="10">
                        <table className='mb18 w-full'>
                            <tbody>
                            {ROWS}
                            </tbody>
                        </table>
                    </Layout.Col>
                </Layout.Row>
            }
            <div className='flex-parent flex-parent--center-cross'>
                {disabled ? null :
                    <Button size="small" icon="upload2" onClick={clickFile} type="success" plain={true}
                            className="flex-parent mb18 mr12"
                            title='Добавить постановление'>Загрузить</Button>
                }

                {disabled ? null : 
                    <input type="file" name="file" style={{'display':'none'}} ref={finput} onChange={onFileLoad}/>}

                {disabled ? null :
                    <Button size="small" icon="picture" type="success" plain={true}
                            className="flex-parent mb18"
                            title='Добавить постановление'>Сканировать</Button>
                }
            </div>
        </React.Fragment>);
};

class IshLinkScan extends React.Component { //
    render() {
        const {disabled, setFiles, files, sid} = this.props;
        return (
            <div>
                <hr className='txt-hr my18'/>
                <h4 className='ap-h4'>{M.SCAN_DOC.label}</h4>

                <FieldArray name={M.SCAN_DOC.name} component={scannedDocs} disabled={disabled} setFiles={setFiles} files={files} sid={sid}/>
            </div>
        )
    }
}//

export default reduxForm({
    form: 'outgoing', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(IshLinkScan)