import * as _ from 'lodash'
import React from 'react'
import {post, get} from '../../services/ajax.js'
import {Input, Switch, InputNumber, DatePicker, Button, Card, Layout} from 'element-react'

export default class Postage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            post: {
                nds: 18
            }
        };

        this.onInput = this.onInput.bind(this);
    }

    onInput(field, value) {
        const {post} = this.state;
        const newValue = Object.assign({}, post, {[field]: value})
        this.setState({post: newValue});
    }

    render() {
        const S = this.state.post;
        const chg = (field) => (value) => this.onInput(field, value);
        const nds = (field) => ((+S[field]) * (1 + get('nds') / 100) || 0).toFixed(2);
        const get = (field) => (+S[field]) || 0;

        return (
            <React.Fragment>
                <Card className="box-card sectionCard" header={
                    <div className="headline">
                        <h3>Настройки / Почтовые отправления</h3>
                    </div>
                }>

                    <h4 className='ap-h4'>Основные сведения:</h4>

                    <table>
                        <tbody>
                        <tr>
                            <td className='ap-input-caption'>
                                Вес конверта DL
                            </td>
                            <td>
                                <span className='mr12'>
                                    <InputNumber className='w120' defaultValue={get('weigthDL')}
                                                    onChange={chg('weigthDL')}/>
                                </span>
                            </td>
                            <td className='ap-input-caption'>
                                Вес большого конверта <br/> (Письмо до 100г)
                            </td>
                            <td>
                                <span className='mr12'>
                                    <InputNumber className='w120' defaultValue={get('weigthBig')}
                                                onChange={chg('weigthBig')}/>
                                </span>
                            </td>
                            <td className='ap-input-caption'>
                                Вес конверта Бандероль
                            </td>
                            <td>
                                <span>
                                    <InputNumber className='w120' defaultValue={get('weightPackage')}
                                                onChange={chg('weightPackage')}/>
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td className='ap-input-caption'>
                                Максимальное число <br/> листов в конверте DL
                            </td>
                            <td>
                                <span className='mr12'>
                                    <InputNumber className='w120' defaultValue={get('maxSheetsDL')}
                                                    onChange={chg('maxSheetsDL')}/>
                                </span>
                            </td>
                            <td className='ap-input-caption'>
                                Минимальное число <br/> листов в бандероли
                            </td>
                            <td>
                                <span className='mr12'>
                                    <InputNumber className='w120' defaultValue={get('minSheetsPkg')}
                                                onChange={chg('minSheetsPkg')}/>
                                </span>
                            </td>
                            <td className='ap-input-caption'>
                                Вес одного листа
                            </td>
                            <td>
                                <span>
                                    <InputNumber className='w120' defaultValue={get('weightSheet')}
                                                onChange={chg('weightSheet')}/>
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td className='ap-input-caption'>
                                Горизонтальный отступ <br/> шапки с ШПИ
                            </td>
                            <td>
                                <span className='mr12'>
                                    <InputNumber className='w120' defaultValue={get('offsetHorSPI')}
                                                    onChange={chg('offsetHorSPI')}/>
                                </span>
                            </td>
                            <td className='ap-input-caption'>
                                Вертикальный отступ <br/> шапки с ШПИ
                            </td>
                            <td>
                                <span className='mr12'>
                                    <InputNumber className='w120' defaultValue={get('offsetVertSPI')}
                                                onChange={chg('offsetVertSPI')}/>
                                </span>
                            </td>
                            <td className='ap-input-caption'>
                                Размер пакета выгрузки
                            </td>
                            <td>
                                <span>
                                    <InputNumber className='w120' defaultValue={get('unloadPackSize')}
                                                onChange={chg('unloadPackSize')}/>
                                </span>
                            </td>
                        </tr>
                        </tbody>
                    </table>


                    <hr className='txt-hr my18'/>
                    <h4 className='ap-h4'>Стоимость:</h4>

                    <table>
                        <tbody>
                        <tr>
                            <td className='ap-input-caption'>
                                <span>НДС, %</span>
                            </td>
                            <td>
                                <InputNumber className='w120' defaultValue={get('nds')} onChange={chg('nds')}/>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td className='ap-table__header'>Значение без НДС</td>
                            <td className='ap-table__header'>Значение с НДС</td>
                        </tr>
                        <tr>
                            <td className='ap-input-caption'>Заказное письмо до 20 г, руб</td>
                            <td>
                                <span className='mr60'>
                                    <InputNumber className='w120' defaultValue={get('letter20under')}
                                                    onChange={chg('letter20under')}/>
                                </span>
                            </td>
                            <td>
                                <Input className='w120' value={nds('letter20under')} disabled={true}/>
                            </td>
                        </tr>
                        <tr>
                            <td className='ap-input-caption'>
                                За каждые последующие полные или неполные 20 г веса заказного письма, руб
                            </td>
                            <td>
                                <span className='mr60'>
                                    <InputNumber className='w120' defaultValue={get('letter20over')}
                                                onChange={chg('letter20over')}/>
                                </span>
                            </td>
                            <td>
                                <Input className='w120' value={nds('letter20over')} disabled={true}/>
                            </td>
                        </tr>
                        <tr>
                            <td className='ap-input-caption'>Заказная бандероль весом 100 г, руб</td>
                            <td>
                                <span className='mr60'>
                                    <InputNumber className='w120' defaultValue={get('letter100under')}
                                                onChange={chg('letter100under')}/>
                                </span>
                            </td>
                            <td>
                                <Input className='w120' value={nds('letter100under')} disabled={true}/>
                            </td>
                        </tr>
                        <tr>
                            <td className='ap-input-caption'>
                                За каждые последующие полные или неполные 20 г веса заказной бандероли, руб
                            </td>
                            <td>
                                <span className='mr60'>
                                    <InputNumber className='w120' defaultValue={get('letter100over')}
                                                onChange={chg('letter100over')}/>
                                </span>
                            </td>
                            <td>
                                <Input className='w120' value={nds('letter100over')} disabled={true}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <hr className='txt-hr my18'/>
                    <h4 className='ap-h4'>Выгрузки:</h4>

                    <table>
                        <tbody>
                        <tr>
                            <td colSpan='2' className='ap-input-caption'>
                                Регулярная выгрузка (архивы)
                            </td>
                            <td>
                                <Switch value={S.unloadArchive} onText="ВКЛ" offText="ВЫКЛ"
                                        onChange={chg('unloadArchive')}/>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan='2' className='ap-input-caption'>
                                Регулярная выгрузка (почт.сервис)
                            </td>
                            <td>
                                <Switch value={S.unloadPost} onText="ВКЛ" offText="ВЫКЛ"
                                        onChange={chg('unloadPost')}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </Card>

                <div className="ap-footer">
                    <Button className=''>Сохранить</Button>
                </div>
            </React.Fragment>
        );
    }
};
