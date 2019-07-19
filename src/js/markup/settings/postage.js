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

                    <div className="form-container">
                        <div className="wrap">
                            <div className="item item--250">
                                <small className="label">Вес конверта DL</small>
                                <div className="value">
                                    <InputNumber className='w120' defaultValue={get('weigthDL')} onChange={chg('weigthDL')}/>
                                </div>
                            </div>
                            <div className="item item--250">
                                <small className="label">Вес большого конверта <br/> (Письмо до 100г)</small>
                                <div className="value">
                                    <InputNumber className='w120' defaultValue={get('weigthBig')} onChange={chg('weigthBig')}/>
                                </div>
                            </div>
                            <div className="item item--250">
                                <small className="label">Вес конверта Бандероль</small>
                                <div className="value">
                                    <InputNumber className='w120' defaultValue={get('weightPackage')} onChange={chg('weightPackage')}/>
                                </div>
                            </div>
                            <div className="item item--250">
                                <small className="label">Максимальное число <br/> листов в конверте DL</small>
                                <div className="value">
                                    <InputNumber className='w120' defaultValue={get('maxSheetsDL')} onChange={chg('maxSheetsDL')}/>
                                </div>
                            </div>
                            <div className="item item--250">
                                <small className="label">Минимальное число <br/> листов в бандероли</small>
                                <div className="value">
                                    <InputNumber className='w120' defaultValue={get('minSheetsPkg')} onChange={chg('minSheetsPkg')}/>
                                </div>
                            </div>
                            <div className="item item--250">
                                <small className="label">Вес одного листа</small>
                                <div className="value">
                                    <InputNumber className='w120' defaultValue={get('weightSheet')} onChange={chg('weightSheet')}/>
                                </div>
                            </div>
                            <div className="item item--250">
                                <small className="label">Горизонтальный отступ <br/> шапки с ШПИ</small>
                                <div className="value">
                                    <InputNumber className='w120' defaultValue={get('offsetHorSPI')} onChange={chg('offsetHorSPI')}/>
                                </div>
                            </div>
                            <div className="item item--250">
                                <small className="label">Вертикальный отступ <br/> шапки с ШПИ</small>
                                <div className="value">
                                    <InputNumber className='w120' defaultValue={get('offsetVertSPI')} onChange={chg('offsetVertSPI')}/>
                                </div>
                            </div>
                            <div className="item item--250">
                                <small className="label">Размер пакета выгрузки</small>
                                <div className="value">
                                    <InputNumber className='w120' defaultValue={get('unloadPackSize')} onChange={chg('unloadPackSize')}/>
                                </div>
                            </div>
                        </div>
                    </div>


                    <hr className='txt-hr my18'/>
                    <h4 className='ap-h4'>Стоимость:</h4>

                    <div className="form-container">
                        <div className="wrap">
                            <div className="item item--full item--250">
                                <small className="label">НДС, %</small>
                                <div className="value">
                                    <InputNumber className="w120" defaultValue={get('nds')} onChange={chg('nds')}/>
                                </div>
                            </div>
                            <div className="item item--full item--250">
                                <small className="label"></small>
                                <div className="value">
                                    <div className="flex-parent flex-parent--space-between-main wmax360">
                                        <span className="color-gray-dark">Значение без НДС</span>
                                        <span className="color-gray-dark">Значение с НДС</span>
                                    </div>
                                </div>
                            </div>
                            <div className="item item--full item--250">
                                <small className="label">Заказное письмо до 20 г, руб</small>
                                <div className="value">
                                    <div className="flex-parent flex-parent--space-between-main wmax360">
                                        <InputNumber className='w120' defaultValue={get('letter20under')} onChange={chg('letter20under')}/>
                                        <Input className='w120' value={nds('letter20under')} disabled={true}/>
                                    </div>
                                </div>
                            </div>
                            <div className="item item--full item--250">
                                <small className="label">За каждые последующие полные или неполные 20 г веса заказного письма, руб</small>
                                <div className="value">
                                    <div className="flex-parent flex-parent--space-between-main wmax360">
                                        <InputNumber className='w120' defaultValue={get('letter20over')} onChange={chg('letter20over')}/>
                                        <Input className='w120' value={nds('letter20over')} disabled={true}/>
                                    </div>
                                </div>
                            </div>
                            <div className="item item--full item--250">
                                <small className="label">Заказная бандероль весом 100 г, руб</small>
                                <div className="value">
                                    <div className="flex-parent flex-parent--space-between-main wmax360">
                                        <InputNumber className='w120' defaultValue={get('letter100under')} onChange={chg('letter100under')}/>
                                        <Input className='w120' value={nds('letter100under')} disabled={true}/>
                                    </div>
                                </div>
                            </div>
                            <div className="item item--full item--250">
                                <small className="label">За каждые последующие полные или неполные 20 г веса заказной бандероли, руб</small>
                                <div className="value">
                                    <div className="flex-parent flex-parent--space-between-main wmax360">
                                        <InputNumber className='w120' defaultValue={get('letter100over')} onChange={chg('letter100over')}/>
                                        <Input className='w120' value={nds('letter100over')} disabled={true}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <hr className='txt-hr my18'/>
                    <h4 className='ap-h4'>Выгрузки:</h4>


                    <div className="form-container">
                        <div className="wrap">
                            <div className="item item--250">
                                <small className="label">Регулярная выгрузка (архивы)</small>
                                <div className="value">
                                    <Switch value={S.unloadArchive} onText="ВКЛ" offText="ВЫКЛ" onChange={chg('unloadArchive')}/>
                                </div>
                            </div>
                            <div className="item item--250">
                                <small className="label">Регулярная выгрузка (почт.сервис)</small>
                                <div className="value">
                                    <Switch value={S.unloadPost} onText="ВКЛ" offText="ВЫКЛ" onChange={chg('unloadPost')}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="ap-footer">
                    <Button className=''>Сохранить</Button>
                </div>
            </React.Fragment>
        );
    }
};
