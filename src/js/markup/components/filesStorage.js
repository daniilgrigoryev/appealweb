import React, {useRef} from 'react'
import moment from 'moment'
import {compose} from 'redux'
import {connect} from 'react-redux'
import Immutable from 'immutable'
import {Button, Dropdown} from 'element-react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {getSessionId} from '../../selectors/common.js'
import {post,postFile,mpt} from '../../services/ajax.js'
import {baseUrl} from '../../services/api.js'
import {scanPdf} from '../../services/scanService.js'
import {EAutocomplete} from './fautocomplete.js'
import {ECheckbox} from './checkbox.js'

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

const FilesStorage = React.memo(function FilesStorage(props){
    const {files,setFiles,sessionId,fTypes,status_alias,disabled} = props;
    const finput = useRef(null);
    const clickFile = ()=> {
        finput.current.value = null;
        finput.current.click();
    }
            
    const remove = (storage_id)=>setFiles(files.filter(x=>x.get('storage_id')!=storage_id));
    
    const onFileDone = (resp,description,source_alias)=>{
        const {data,error} = resp;
        if (error){
            return console.error(error);
        }
        setFiles((files || im([])).push(im({ description: description, source_alias: source_alias, id: null, storage_id: data.id })));
    }

    const onFileLoad = async (e)=>{
        const file = e.target.files[0];
        const resp = await mpt('storage/push',{file});
        onFileDone(resp,file.name,'F')
    }

    const onFileScan = async()=>{
        const blob = await scanPdf();
        const name = 'scan+' + moment(new Date()).format("MMM_Do_YY-HH_mm") + '.pdf';        
        const file = new File([blob],name);
        const resp = await mpt('storage/push',{file});
        onFileDone(resp,file.name,'S')
    }
 
    const onChange = (index,field,val)=>{
        const newFiles = (files|| im([]) ).setIn([index,field],val);
        setFiles(newFiles);
    }

    const showCheckCB = (!status_alias) || status_alias=='AWAIT_CHECK';

    const DOCUMENTS = !_.size(files)
        ?(<tr><td colSpan='2'>Нет загруженных файлов</td></tr>)
        :(files.map((x,i)=>(
            <tr key={x.get('storage_id')}>
                <td>
                    <span className='ap-table-list-number mr12'>{i + 1}</span>
                </td>
                <td className='ap-table__header' onClick={()=>download(sessionId,x)} >{x.get('description')}</td>
                <td>
                    {(!fTypes) ? null 
                        : <EAutocomplete onChange={(newVal)=>onChange(i,'type_id',newVal)} value={x.get('type_id')} data={fTypes} disabled={disabled} />}
                </td>
                <td>
                    { disabled ? null : 
                        <Button size="small" type="text" onClick={()=>remove(x.get('storage_id'))}>
                            <i className="el-icon-close color-red-dark ml18"/>
                        </Button>   
                    }                 
                </td>
                <td>
                { (fTypes && !disabled && showCheckCB && _.endsWith(x.get('description').toLowerCase(),'.docx')) ? 
                    <ECheckbox onChange={(v)=>onChange(i,'for_check',v)} value={x.get('for_check')} style={{marginLeft: '10px'}} />
                    : null
                }
                </td>
            </tr>))); //

    return (<React.Fragment>
                
                {disabled ? null : <div>
                    <Button size="small" style={{marginLeft: '10px'}} onClick={clickFile} >Загрузить документ</Button>
                    <Button size="small" onClick={onFileScan} >Сканировать документ</Button>
                    <input type="file" name="file" style={{'display':'none'}} ref={finput} onChange={onFileLoad} />
                </div>}

                <table>
                    <tbody>
                        {DOCUMENTS}
                    </tbody>
                </table>
            </React.Fragment>)
}) //

export default connect((state,props)=>({sessionId : getSessionId(state)}))(FilesStorage)
