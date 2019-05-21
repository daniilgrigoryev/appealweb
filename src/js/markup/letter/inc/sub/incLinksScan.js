import React, {useRef} from 'react'
import Immutable from 'immutable'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {FInput, EInput} from '../../../components/finput.js'
import {ESelect, FSelect} from '../../../components/select.js'
import {EPicker, FPicker} from '../../../components/picker.js'
import * as _ from 'lodash'
import {Button} from 'element-react'
import {mpt} from '../../../../services/ajax.js'
import {baseUrl} from '../../../../services/api.js'

import mapping from '../mapping.js'

const M = mapping.incLinksScan;

const im = (obj)=> Immutable.fromJS(obj);

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

const scannedDocs = function scannedDocs(props) {
    const {fields, disabled, files, setFiles, sid} = props
    
    const finput = useRef(null);
    const clickFile = ()=> {
        finput.current.value = null;
        finput.current.click();
    }

    const remove = (storage_id)=> {
        setFiles(files.filter(x=>x.get('storage_id')!=storage_id));
    }

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
            <td>
              <span className='ap-table-list-number mr12'>
                 {i + 1}
             </span>
            </td>
            <td className='inline-block w-full' onClick={()=>download(sid,x)}>{x.get('description')}</td>
            <td>
               <Button size="small" type="text" onClick={()=>remove(x.get('storage_id'))}>
                        <i className="el-icon-close color-red-dark"/>
                </Button>
            </td>
        </tr>));
//
    return (
        <React.Fragment>
            {!files ?
                <p className='mt-neg18 mb18 txt-em color-gray'>Нет сканированных документов</p>
                :
                <table>
                    <tbody>
                    <tr>
                        <td className='ap-input-caption'></td>
                        <td>
                            <table className='wmin360'>
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
                        <table>
                            <tbody>
                            <tr>
                                <td className='flex-parent flex-parent--center-cross'>
                                    
                                    {disabled ? null :
                                        <Button size="small" icon="upload2" type="success" plain={true} onClick={clickFile}
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
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </React.Fragment>);
};
//
class IncLinkScan extends React.Component {
    render() {
        const {disabled, files, setFiles, sid} = this.props;
        return (
            <div>
                <hr className='txt-hr my18'/>
                <h4 className='ap-h4'>{M.SCAN_DOC.label}</h4>

                <FieldArray name={M.SCAN_DOC.name} component={scannedDocs} setFiles={setFiles} files={files} disabled={disabled} sid={sid}/>
            </div>
        )
    }
}
//
export default reduxForm({
    form: 'letter_incoming', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(IncLinkScan)