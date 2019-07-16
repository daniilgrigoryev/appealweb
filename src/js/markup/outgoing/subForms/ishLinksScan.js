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
        <Card className="fileCard" key={x.get('storage_id')} bodyStyle={{'padding': 0}}>
            <div className="fileCard__header">
                <i className="ico defaultFile"></i>
            </div>
            <div className="fileCard__footer">
                {disabled ? null :
                    <Button className="action py0" size="small" type="text" onClick={()=>remove(x.get('storage_id'))}>
                        <i className="ico round minus mr6"/>
                    </Button>
                }
                <div className="content">
                    <p className="fileName" title="Скачать" onClick={()=>download(sessionId,x)}>{x.get('description')}</p>
                    {/* {(!fTypes) ? null : <EAutocomplete onChange={(newVal)=>onChange(i,'type_id',newVal)} value={x.get('type_id')} data={fTypes} disabled={disabled} />}
                    
                    <div className="flex-parent flex-parent--space-between-main my6">
                        {x.get('source_alias') ? <p className="txt-em inline-block">{txtSourceAlias(x.get('source_alias'))}</p> : <span className="txt-middle color-gray-light">[не заполнено]</span>}
                        {(fTypes && !disabled && showCheckCB && _.endsWith(x.get('description').toLowerCase(),'.docx')) ? 
                            <React.Fragment>
                            <span>ЭЦП</span>
                            <ECheckbox сlassName="inline-block" onChange={(v)=>onChange(i,'for_check',v)} value={x.get('for_check')} style={{marginLeft: '10px'}}/>
                        </React.Fragment>
                        : null
                        }
                    </div> */}
               </div>
            </div>
        </Card>

    ));

    return (
        <React.Fragment>
            {!files 
                ? <p className='my6 txt-em color-gray align-center'>Нет сканированных документов</p>
                : <div className="flex-parent flex-parent--center-main flex-parent--wrap">{ROWS}</div>
            }
            <div className='flex-parent flex-parent--center-main'>
                {disabled ? null :
                    <Button size="small" className="my6 block h30 py0" onClick={clickFile} plain={true}>
                        <i className="ico upload mr6"></i>
                        <span className="align-middle">Загрузить документ</span>
                    </Button>
                }
                {disabled ? null :
                    <Button size="small" className="my6 block h30 py0"> {/* onClick={onFileScan} */}
                        <i className="ico scan mr6"></i>
                        <span className="align-middle">Сканировать документ</span>
                    </Button>
                }
                {disabled ? null : <input type="file" name="file" style={{'display':'none'}} ref={finput} onChange={onFileLoad}/>}
            </div>
        </React.Fragment>);
};

class IshLinkScan extends React.Component { //
    render() {
        const {disabled, setFiles, files, sid} = this.props;
        return (
            <div scrollanchor="ishDoc" id="ishDoc">
                <Card className="box-card sectionCard" header={
                    <div className='headline'>
                        <h3>Загруженные документы</h3>
                    </div>
                }>
                    <div className="form-container">
                        <FieldArray name={M.SCAN_DOC.name} component={scannedDocs} disabled={disabled} setFiles={setFiles} files={files} sid={sid}/>
                    </div>
                </Card>
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