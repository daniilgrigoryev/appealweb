import * as _ from 'lodash'
import React from 'react'
import {post,get} from '../../services/ajax.js'
import {Input,Switch,InputNumber,DatePicker,Button} from 'element-react'

export default class Postage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      post: {
        nds: 18
      }
    }

    this.onInput = this.onInput.bind(this);
  }

  onInput(field,value){
    const {post} = this.state; 
    const newValue = Object.assign({},post,{[field]:value})
    this.setState({post:newValue});
  }

  render (){
    const S = this.state.post;
    const chg = (field)=>(value)=>this.onInput(field,value);
    const nds = (field)=> ((+S[field])*(1+get('nds')/100) || 0).toFixed(2);
    const get = (field)=>(+S[field]) || 0;

    return (
        <div>
          <table>
            <tbody>
              <tr>
                <td>Вес конверта DL</td>
                <td>Вес большого конверта (Письмо до 100г)</td>
                <td>Вес конверта Бандероль</td>
                <td>Максимальное число листов в конверте DL</td>
                <td>Минимальное число листов в бандероли</td>
                <td>Вес одного листа</td>
                <td>Горизонтальный отступ шапки с ШПИ</td>
                <td>Вертикальный отступ шапки с ШПИ</td>
                <td>Размер пакета выгрузки</td>
              </tr>
              <tr>
                <td><InputNumber defaultValue={get('weigthDL')}         onChange={chg('weigthDL')}       /></td>
                <td><InputNumber defaultValue={get('weigthBig')}        onChange={chg('weigthBig')}      /></td>
                <td><InputNumber defaultValue={get('weightPackage')}    onChange={chg('weightPackage')}  /></td>
                <td><InputNumber defaultValue={get('maxSheetsDL')}      onChange={chg('maxSheetsDL')}    /></td>
                <td><InputNumber defaultValue={get('minSheetsPkg')}     onChange={chg('minSheetsPkg')}   /></td>
                <td><InputNumber defaultValue={get('weightSheet')}      onChange={chg('weightSheet')}    /></td>
                <td><InputNumber defaultValue={get('offsetHorSPI')}     onChange={chg('offsetHorSPI')}   /></td>
                <td><InputNumber defaultValue={get('offsetVertSPI')}    onChange={chg('offsetVertSPI')}  /></td>
                <td><InputNumber defaultValue={get('unloadPackSize')}   onChange={chg('unloadPackSize')} /></td>
              </tr>
              <tr>
                <td colSpan='2'></td>
                <td>Значение без НДС</td>
                <td>Значение с НДС</td>
              </tr>
              <tr>
                <td colSpan='2'>Заказное письмо до 20 г, руб</td>
                <td><InputNumber defaultValue={get('letter20under')} onChange={chg('letter20under')} /></td>
                <td><InputNumber value={nds('letter20under')} disabled={true}                 /></td>
                <td>НДС, %</td>
                <td><InputNumber defaultValue={get('nds')}  onChange={chg('nds')}                   /></td>
              </tr>
              <tr>
                <td colSpan='2'>за каждые последующие полные или неполные 20 г веса заказного письма, руб </td>
                <td><InputNumber defaultValue={get('letter20over')} onChange={chg('letter20over')}   /></td>
                <td><InputNumber value={nds('letter20over')} disabled={true}                  /></td>
              </tr>
              <tr>
                <td colSpan='2'>Заказная бандероль весом 100 г, руб</td>
                <td><InputNumber defaultValue={get('letter100under')} onChange={chg('letter100under')} /></td>
                <td><InputNumber value={nds('letter100under')} disabled={true}                  /></td>
              </tr>
              <tr>
                <td colSpan='2'>за каждые последующие полные или неполные 20 г веса заказной бандероли, руб </td>
                <td><InputNumber defaultValue={get('letter100over')} onChange={chg('letter100over')}  /></td>
                <td><InputNumber value={nds('letter100over')} disabled={true}                  /></td>
              </tr>
              <tr>
                <td colSpan='2'>Регулярная выгрузка (архивы)</td>
                <td><Switch value={S.unloadArchive} onText="ВКЛ" offText="ВЫКЛ"  onChange={chg('unloadArchive')} /></td>
              </tr>
              <tr>
                <td colSpan='2'>Регулярная выгрузка (почт.сервис)</td>
                <td><Switch value={S.unloadPost} onText="ВКЛ" offText="ВЫКЛ"  onChange={chg('unloadPost')} /></td>
              </tr>
            </tbody>
          </table>
        </div>
    ); //
  }
};
