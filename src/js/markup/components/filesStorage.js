import React, {useRef} from 'react'
import moment from 'moment'
import {compose} from 'redux'
import {connect} from 'react-redux'
import Immutable from 'immutable'
import {Button, Dropdown, Card, Popover} from 'element-react'
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
const getPath = (sessionId,row) => {
    const params = new URLSearchParams();
    params.append('sessionId',sessionId);
    params.append('storage_id',row.get('storage_id'));
    const path = 'storage/pull?'; 
    const tempLink = document.createElement('a');
    tempLink.href = baseUrl() + path + params.toString();
    return tempLink.href; 
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

    const txtSourceAlias = (source_alias) => {
        switch (source_alias) {
            case 'F':   return 'Загруженный документ';
            case 'S':   return 'Сканированный документ';
            default:    return null;}
    }

    const showCheckCB = (!status_alias) || status_alias=='AWAIT_CHECK';

    const DOCUMENTS = !_.size(files)
        ?(<p className="my6 txt-em color-gray align-center">Нет загруженных файлов</p>)
        :(files.map((x,i)=>(
            <Card className="fileCard" key={x.get('storage_id')} bodyStyle={{'padding': 0}}>
                <div className="fileCard__header">
                    <img src={getPath(sessionId, x)}/>
                </div>
                <div className="fileCard__footer">

                <Popover placement="right" width="200px" trigger="hover" content={(
                    <div className="flex-parent flex-parent--column">
                        {disabled ? null :
                            <Button className="py0 mb6" size="small" type="text" onClick={()=>remove(x.get('storage_id'))}>
                                <i className="ico round minus mr6"/>
                                удалить
                            </Button>
                        }
                        {disabled ? null : 
                            <Button className="py0 ml0 mt6" size="small" type="text" onClick={()=>download(sessionId,x)}>
                                <i className="ico download mr6"/>
                                скачать
                            </Button>
                        }
                    </div>
                   

                )}>
                    <Button className="action py0" size="small" type="text">
                        <i className="ico dot"/>
                    </Button>
                </Popover>
                    <div className="content">
                        {(!fTypes) ? null : <EAutocomplete onChange={(newVal)=>onChange(i,'type_id',newVal)} value={x.get('type_id')} data={fTypes} disabled={disabled} />}
                        {/* <p onClick={()=>download(sessionId,x)}>{x.get('description')}</p> */}

                        {x.get('source_alias') ? <p className="txt-em">{txtSourceAlias(x.get('source_alias'))}</p> : null}

                        {(fTypes && !disabled && showCheckCB && _.endsWith(x.get('description').toLowerCase(),'.docx')) ? 
                            <ECheckbox onChange={(v)=>onChange(i,'for_check',v)} value={x.get('for_check')} style={{marginLeft: '10px'}}/>
                            : null
                        }
                    </div>

                </div>
            </Card>))); //

    return (<React.Fragment>
                <div className="flex-parent flex-parent--center-main flex-parent--center-cross flex-parent--wrap">{DOCUMENTS}</div>
                {disabled ? null :
                <div className="flex-parent flex-parent--center-main py18 border-t border-gray">
                    <Button size="small" className="my6 block h30 py0" onClick={clickFile}>
                        <i className="ico upload mr6"></i>
                        <span className="align-middle">Загрузить документ</span>
                    </Button>
                    <Button size="small" className="my6 block h30 py0" onClick={onFileScan}>
                        <i className="ico scan mr6"></i>
                        <span className="align-middle">Сканировать документ</span>
                    </Button>
                    <input type="file" name="file" style={{'display':'none'}} ref={finput} onChange={onFileLoad} />
                </div>}

            </React.Fragment>)
}) //

export default connect((state,props)=>({sessionId : getSessionId(state)}))(FilesStorage)
