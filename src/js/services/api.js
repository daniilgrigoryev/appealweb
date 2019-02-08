import * as AJ from './ajax.js'

const MODE = 'DEV_47'

const URLS = {
	'DEV_152': 'https://172.20.255.152:8443/AppealAPI/',
	'DEV_47' : 'https://172.20.255.47:8443/AppealAPI/',
	'PROD'   : '/'
}


const BASE_URL = URLS[MODE];
AJ.setBase(BASE_URL)
AJ.setMode(MODE)

export function login(loginData){ 
	return AJ.post('rest/login',loginData);
}

export function logout(sessionId){
	return AJ.post('rest/logout',{sessionId});
}

export function fetchAutocomplete(key,query){
	return new Promise((resolve,reject)=>{
		const resp = [
		  { "value": "vue", 		"property": "https://github.com/vuejs/vue" },
	      { "value": "element", 	"property": "https://github.com/ElemeFE/element" },
	      { "value": "cooking", 	"property": "https://github.com/ElemeFE/cooking" },
	      { "value": "mint-ui", 	"property": "https://github.com/ElemeFE/mint-ui" },
	      { "value": "vuex", 		"property": "https://github.com/vuejs/vuex" },
	      { "value": "vue-router", 	"property": "https://github.com/vuejs/vue-router" },
	      { "value": "babel", 		"property": "https://github.com/babel/babel" }
		]
		setTimeout(()=>{
			resolve(resp);
		},100);
	});
}

export function fetchSelect(key){
	switch(key){
		case 'REQUEST_TYPE':  return fetchAppealSource();
		case 'RESPONSE_TYPE': return fetchAppealOut();
		case 'delivery_type': return fetchAppeaVidDoc();
		case 'doc_vid':       return fetchAppeaVidDost();
	}

	return new Promise((resolve,reject)=>{
		const resp = [
		  { "value": "Svue", 		"property": "Shttps://github.com/vuejs/vue" },
	      { "value": "Selement", 	"property": "Shttps://github.com/ElemeFE/element" },
	      { "value": "Scooking", 	"property": "Shttps://github.com/ElemeFE/cooking" },
	      { "value": "Smint-ui", 	"property": "Shttps://github.com/ElemeFE/mint-ui" },
	      { "value": "Svuex", 		"property": "Shttps://github.com/vuejs/vuex" },
	      { "value": "Svue-router", "property": "Shttps://github.com/vuejs/vue-router" },
	      { "value": "Sbabel", 		"property": "Shttps://github.com/babel/babel" }
		]
		setTimeout(()=>{
			resolve(resp);
		},10);
	});
}

export function fetchDecisions(){
	return new Promise((resolve,reject)=>{
		const resp = [
		  	{ value: 'Отказано в рассмотрении (пропущен срок обжалования)' , property: 'Отказано в рассмотрении (пропущен срок обжалования)' },
			{ value: 'Отказано в рассмотрении (жалоба подана ненадлежащим лицом)' , property: 'Отказано в рассмотрении (жалоба подана ненадлежащим лицом)' },
			{ value: 'Постановление оставлено без изменения, жалоба не удовлетворена' , property: 'Постановление оставлено без изменения, жалоба не удовлетворена' },
			{ value: 'Постановление отменено, прекращено производство по делу' , property: 'Постановление отменено, прекращено производство по делу' },
			{ value: 'Постановление отменено, дело возвращено на новое рассмотрение' , property: 'Постановление отменено, дело возвращено на новое рассмотрение' },
			{ value: 'Обращение направлено в другой орган по подведомственности' , property: 'Обращение направлено в другой орган по подведомственности' },
			{ value: 'Внесены данные об оплате' , property: 'Внесены данные об оплате' },
			{ value: 'Направлен запрос' , property: 'Направлен запрос' },
			{ value: 'Дано разъяснение' , property: 'Дано разъяснение' },
			{ value: 'Внесены изменения в постановление' , property: 'Внесены изменения в постановление' },
			{ value: 'Осуществлен возврат денежных средств' , property: 'Осуществлен возврат денежных средств' },
			{ value: 'В возврате денежных средств отказано' , property: 'В возврате денежных средств отказано' },
			{ value: 'Подтвердилась' , property: 'Подтвердилась' },
			{ value: 'Не подтвердилась' , property: 'Не подтвердилась' },
			{ value: 'Предоставлена копия' , property: 'Предоставлена копия' },
			{ value: 'Постановление отменено, дело направлено на рассмотрение по подведомственности' , property: 'Постановление отменено, дело направлено на рассмотрение по подведомственности' },
			{ value: 'Жалоба направлена в суд' , property: 'Жалоба направлена в суд' },
			{ value: 'Приобщено к материалам дела' , property: 'Приобщено к материалам дела' },
			{ value: 'Удовлетворено' , property: 'Удовлетворено' },
			{ value: 'Неудовлетворено' , property: 'Неудовлетворено' },
			{ value: 'Возбуждено дело об административном правонарушении' , property: 'Возбуждено дело об административном правонарушении' },
			{ value: 'Информация внесена' , property: 'Информация внесена' },
			{ value: 'Определение суда' , property: 'Определение суда' },
			{ value: 'Ходатайство удовлетворено' , property: 'Ходатайство удовлетворено' },
			{ value: 'Ходатайство отклонено' , property: 'Ходатайство отклонено' },
			{ value: 'Отклонено определением по делу' , property: 'Отклонено определением по делу' },
			{ value: 'Отказано в предоставлении копии' , property: 'Отказано в предоставлении копии' },
			{ value: 'Приняты меры' , property: 'Приняты меры' },
			{ value: 'Платеж учтен' , property: 'Платеж учтен' },
			{ value: 'Платеж по реквизитам ОСП УФССП' , property: 'Платеж по реквизитам ОСП УФССП' },
			{ value: 'Платеж постановлений ДТиРДТИ осуществлен по неправильным реквизитам' , property: 'Платеж постановлений ДТиРДТИ осуществлен по неправильным реквизитам' },
			{ value: 'Платеж осуществлен по неправильным реквизитам' , property: 'Платеж осуществлен по неправильным реквизитам' },
			{ value: 'Ответ по повторному обращению' , property: 'Ответ по повторному обращению' },
			{ value: 'Разъяснение по возврату денежных средств' , property: 'Разъяснение по возврату денежных средств' },
			{ value: 'Платеж по данным ФК и квитанции не распознан' , property: 'Платеж по данным ФК и квитанции не распознан' },
			{ value: 'Разъяснение как оплатить ФЛ' , property: 'Разъяснение как оплатить ФЛ' },
			{ value: 'Разъяснение как оплатить ЮЛ' , property: 'Разъяснение как оплатить ЮЛ' },
			{ value: 'Не является платежом МАДИ' , property: 'Не является платежом МАДИ' },
			{ value: 'Для сведения (не требует ответа)' , property: 'Для сведения (не требует ответа)' },
			{ value: 'Предоставлена копия (в два адреса)' , property: 'Предоставлена копия (в два адреса)' },
			{ value: 'Дано разъяснение 50% (надлежащее извещение)' , property: 'Дано разъяснение 50% (надлежащее извещение)' },
			{ value: 'Предоставлена рассрочка' , property: 'Предоставлена рассрочка' }
		]
		setTimeout(()=>{
			resolve(resp);
		},10);
	});
}

export function fetchDecisionReasons(){
	return new Promise((resolve,reject)=>{
		const resp = [
			{ value: 'Несоответствия в адресе нарушения' , property: 'Несоответствия в адресе нарушения' },
			{ value: 'Разрешенное место' , property: 'Разрешенное место' },
			{ value: 'Вынужденная остановка' , property: 'Вынужденная остановка' },
			{ value: 'Продажа ТС' , property: 'Продажа ТС' },
			{ value: 'Передача управления ТС другому лицу' , property: 'Передача управления ТС другому лицу' },
			{ value: 'За данное нарушение ранее было вынесено другое постановление' , property: 'За данное нарушение ранее было вынесено другое постановление' },
			{ value: 'Дорожный знак недоступен для обозрения' , property: 'Дорожный знак недоступен для обозрения' },
			{ value: 'Инвалид I (II) группы' , property: 'Инвалид I (II) группы' },
			{ value: 'Маршрутное ТС' , property: 'Маршрутное ТС' },
			{ value: 'Спецтранспорт (маяки)' , property: 'Спецтранспорт (маяки)' },
			{ value: 'Такси в зоне действия дорожного знака 3.28' , property: 'Такси в зоне действия дорожного знака 3.28' },
			{ value: 'Ошибка идентификации государственного регистрационного знака' , property: 'Ошибка идентификации государственного регистрационного знака' },
			{ value: 'Остановка совершена в рамках пункта 6.15 ПДД РФ' , property: 'Остановка совершена в рамках пункта 6.15 ПДД РФ' },
			{ value: 'Постановление не соответствует требованиям, регламентированным статьей 29.10 КоАП РФ' , property: 'Постановление не соответствует требованиям, регламентированным статьей 29.10 КоАП РФ' },
			{ value: 'Такси на стоянке такси' , property: 'Такси на стоянке такси' },
			{ value: 'Оплата не отображена на информационном портале ПГУ' , property: 'Оплата не отображена на информационном портале ПГУ' },
			{ value: 'Оплата не отображена на информационном портале ГИБДД' , property: 'Оплата не отображена на информационном портале ГИБДД' },
			{ value: 'Направлен материал в ФССП для принудительного взыскания при наличии добровольной оплаты' , property: 'Направлен материал в ФССП для принудительного взыскания при наличии добровольной оплаты' },
			{ value: 'Оформлен протокол по ст. 20.25 при наличии своевременной оплаты' , property: 'Оформлен протокол по ст. 20.25 при наличии своевременной оплаты' },
			{ value: 'Смерть физического лица' , property: 'Смерть физического лица' },
			{ value: 'ДТП' , property: 'ДТП' },
			{ value: 'Крайняя необходимость (малозначительность)' , property: 'Крайняя необходимость (малозначительность)' },
			{ value: 'ТС зафиксировано в движении' , property: 'ТС зафиксировано в движении' },
			{ value: 'Иное' , property: 'Иное' }
		];
		setTimeout(()=>{
			resolve(resp);
		},10);
	});
}


export function fetchDecisionBasis(){
	return new Promise((resolve,reject)=>{
		const resp = [
			{ value: 'Отсутствие события АПН' , property: 'Отсутствие события АПН' },
			{ value: 'Отсутствие состава АПН' , property: 'Отсутствие состава АПН' },
			{ value: 'Крайняя необходимость' , property: 'Крайняя необходимость' },
			{ value: 'Амнистия' , property: 'Амнистия' },
			{ value: 'Отмена закона, устанавливающего ответственность' , property: 'Отмена закона, устанавливающего ответственность' },
			{ value: 'Истечение сроков давности' , property: 'Истечение сроков давности' },
			{ value: 'Наличие наказания по тому же факту' , property: 'Наличие наказания по тому же факту' },
			{ value: 'Смерть физ.лица' , property: 'Смерть физ.лица' },
			{ value: 'Малозначительность' , property: 'Малозначительность' },
			{ value: 'Неустранимые сомнения' , property: 'Неустранимые сомнения' }
		];
		setTimeout(()=>{
			resolve(resp);
		},10);
	});
}

export function fetchAppealSource(){
	return new Promise((resolve,reject)=>{
		const resp = [
			{"value":"АИС ЕСОО","property":"АИС ЕСОО"},
			{"value":"ЕСОО (ручной ввод)","property":"ЕСОО (ручной ввод)"},
			{"value":"Иное","property":"Иное"},
			{"value":"Курьер","property":"Курьер"},
			{"value":"Личный приём","property":"Личный приём"},
			{"value":"Почта","property":"Почта"},
			{"value":"Сервисный центр","property":"Сервисный центр"},
			{"value":"Фельдсвязь","property":"Фельдсвязь"},
			{"value":"ЭДО","property":"ЭДО"},
			{"value":"Электронная почта","property":"Электронная почта"},
			{"value":"Электронная приёмная","property":"Электронная приёмная"},
			{"value":"Ящик для жалоб","property":"Ящик для жалоб"}
		];
		setTimeout(()=>{
			resolve(resp);
		},10);
	});
}

export function fetchAppealOut(){
	return new Promise((resolve,reject)=>{
		const resp = [
			{"value":"Электронная почта","property":"Электронная почта"},
			{"value":"Почта","property":"Почта"},
			{"value":"Лично","property":"Лично"},
			{"value":"ЭДО","  property":"ЭДО"}
		];
		setTimeout(()=>{
			resolve(resp);
		},10);
	});
}

export function fetchAppeaVidDoc(){
	return new Promise((resolve,reject)=>{
		const resp = [
			{"value":"Окончательный ответ","property":"Окончательный ответ"},
			{"value":"Промежуточный ответ","property":"Промежуточный ответ"},
			{"value":"Запрос","property":"Запрос"},
			{"value":"Перенос контрольного срока","property":"Перенос контрольного срока"},
			{"value":"Направление по принадлежности","property":"Направление по принадлежности"}
		];
		setTimeout(()=>{
			resolve(resp);
		},10);
	});
}

export function fetchAppeaVidDost(){
	return new Promise((resolve,reject)=>{
		const resp = [
			{"value":"Электронная почта","property":"Электронная почта"},
			{"value":"Почта","property":"Почта"},
			{"value":"ЭДО","property":"ЭДО"},
			{"value":"Курьер","property":"Курьер"}
		];
		setTimeout(()=>{
			resolve(resp);
		},10);
	});
}