import * as AJ from './ajax.js'

const MODE = 'DEV_47'

const URLS = {
	'DESIGN' : 'DESIGN',
	'DEV_152': 'https://172.20.255.152:8443/AppealAPI/',
	'DEV_47' : 'https://172.20.255.47:8443/AppealAPI/',
	'PROD'   : ''
}

const BASE_URL = URLS[MODE];
AJ.setBase(BASE_URL)
AJ.setMode(MODE)

export function login(loginData){ 
	if (MODE=='DESIGN'){
		return new Promise((resolve)=>setTimeout(()=>resolve({data:{sessionID : 'a123',username : 'design'}}),1500))
	}
	return AJ.post('rest/login',loginData);
}

export function logout(sessionId){
	if (MODE=='DESIGN'){
		return new Promise((resolve)=>setTimeout(()=>resolve({data:{status:200}}),1500))
	}
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
		setTimeout(()=>resolve(resp),100);
	});
}

export function fetchSelect(key){
	switch(key){
		case 'REQUEST_TYPE':  return fetchAppealSource();
		case 'RESPONSE_TYPE': return fetchAppealOut();
		case 'delivery_type': return fetchAppeaVidDost();
		case 'doc_vid':       return fetchAppeaVidDoc();
		case 'questions':     return fetchQuestions();
		case 'departments':   return fetchDepartments();
		case 'fabulasDoc': 	  return fetchFabulasDoc();
		case 'fabulasThemes': 	  return fetchFabulasThemes();
		case 'fabulasCategories': return fetchFabulasCategories();
		case 'decision_regional_court': return fetchDecisionsRegionalCourt(); 
		case 'decision_moscow_court':   return fetchDecisionsMoscowCourt();
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
		setTimeout(()=>resolve(resp),10);
	});
}

export function fetchFabulasThemesM(){


{category,theme,fabulaTheme,decision,text}

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
		setTimeout(()=>resolve(resp),10);
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
		setTimeout(()=>resolve(resp),10);
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
		setTimeout(()=>resolve(resp),10);
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
		setTimeout(()=>resolve(resp),10);
	});
}

export function fetchAppealOut(){
	return new Promise((resolve,reject)=>{
		const resp = [
			{"value":"Электронная почта","property":"Электронная почта"},
			{"value":"Почта","property":"Почта"},
			{"value":"Лично","property":"Лично"},
			{"value":"ЭДО","property":"ЭДО"}
		];
		setTimeout(()=>resolve(resp),10);
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
		setTimeout(()=>resolve(resp),10);
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
		setTimeout(()=>resolve(resp),10);
	});
}

export function fetchQuestions(){
	return new Promise((resolve,reject)=>{
		const resp = [
			'тематика 1',
			'тематика 2',
			'тематика 3',
			'тематика 4',
			'тематика 5'
		];
		setTimeout(()=>resolve(resp),10);
	});
}

export function fetchDepartments(){
	return new Promise((resolve,reject)=>{
		const resp = [
			'отдел 1',
			'отдел 2',
			'отдел 3',
			'отдел 4'
		];
		setTimeout(()=>resolve(resp),10);
	});	
}


export function fetchFabulasDoc(){
	return new Promise((resolve,reject)=>{
		const resp =[
			{id:1,label:'Сопроводительное письмо - ЮЛ без шапки',type:'Сопроводительное письмо'},
			{id:2,label:'Сопроводительное письмо - ФЛ без шапки',type:'Сопроводительное письмо'},
			{id:3,label:'Определение об отказе в расследовании 8.25 физ. лицо',type:'Определение'},
			{id:4,label:'Письмо гражданину Эвакуация 3.27 Привлечение к адм.ответств',type:'Сопроводительное письмо'},
			{id:5,label:'Определение_отказ_такси',type:'Универсальный'},
			{id:6,label:'Сопроводительное письмо - ФЛ - такси',type:'Сопроводительное письмо'},
			{id:7,label:'Сопроводительное письмо - ЮЛ (УКИП)',type:'Сопроводительное письмо'},
			{id:8,label:'Сопроводительное письмо - ЮЛ без шапки (УКИП)',type:'Сопроводительное письмо'},
			{id:9,label:'Сопроводительное письмо - ФЛ (УКИП)',type:'Сопроводительное письмо'},
			{id:10,label:'Уведомление_пропуск срока_8.25 (ФЛ)',type:'Решение'},
			{id:11,label:'Решение 8.25 ФЛ_ФФ',type:'Решение'},
			{id:12,label:'Уведомление_НЛ_Матвеев 8.25',type:'Решение'},
			{id:13,label:'Определение_срок_8.25 Матвеев_ЮЛ',type:'Решение'},
			{id:14,label:'Определение_срок_8.25 Матвеев_ФЛ',type:'Решение'},
			{id:15,label:'Решение 8.25 ЮЛ_ФФ',type:'Решение'},
			{id:16,label:'Такси_физ',type:'Решение'},
			{id:17,label:'Такси',type:'Решение'},
			{id:18,label:'Сопроводительное письмо - ФЛ',type:'Сопроводительное письмо'},
			{id:19,label:'Сопроводительное письмо - ЮЛ',type:'Сопроводительное письмо'},
			{id:20,label:'Сопроводительное письмо УРДиО (ЭЦП)',type:'Сопроводительное письмо'},
			{id:21,label:'Сопроводительное письмо - ФЛ без шапки (УКИП)',type:'Сопроводительное письмо'},
			{id:22,label:'Сопроводительное письмо - ФЛ угловой бланк',type:'Сопроводительное письмо'},
			{id:23,label:'Перенаправление_ФЛ',type:'Перенаправление'},
			{id:24,label:'Решение - ФЛ_Эвакуация',type:'Решение'},
			{id:25,label:'Уведомление об отказе НЛ ФЛ ЭВ',type:'Решение'},
			{id:26,label:'Определение_пропуск_срока_ФЛ',type:'Решение'},
			{id:27,label:'Определение об отказе в возбуждении (пункт 7)',type:'Решение'},
			{id:28,label:'Определение об отказе в возбуждении (пункт 7) ЮЛ',type:'Решение'},
			{id:29,label:'Отказ в возбуждении дела по срокам ЮЛ',type:'Решение'},
			{id:30,label:'Решение-ЮЛ_Фотофиксация',type:'Решение'},
			{id:31,label:'Уведомление_ПРОПУСК СРОКА_ЮЛ',type:'Решение'},
			{id:32,label:'Отказ в возбуждении дела по срокам',type:'Решение'},
			{id:33,label:'Уведомление об отказе НЛ ФЛ',type:'Решение'},
			{id:34,label:'Определение_пропуск_срока_ЮЛ',type:'Решение'},
			{id:35,label:'Решение - ФЛ_Фотофиксация',type:'Решение'},
			{id:36,label:'Уведомление_ПРОПУСК СРОКА_ФЛ',type:'Решение'},
			{id:37,label:'Извещение о явке ФЛ',type:'Извещение о явке'}
		];
		setTimeout(()=>resolve(resp),10);
	});	
}


export function fetchDecisionsRegionalCourt(){
	return new Promise((resolve,reject)=>{
		const resp =[
			"постановление оставлено без изменения, жалоба не удовлетворена",
			"постановление отменено, прекращено производство по делу",
			"постановление отменено, дело возвращено на новое рассмотрение"
		];
		setTimeout(()=>resolve(resp),10);
	});	
}

export function fetchDecisionsMoscowCourt(){
	return new Promise((resolve,reject)=>{
		const resp =[
			"МАДИ",
			"заявитель"
		];
		setTimeout(()=>resolve(resp),10);
	});	
}

export function fetchFabulasCategories(){
	return new Promise((resolve,reject)=>{
		const resp =[];
		const size = Math.floor(Math.random()*4);

		for (let i=0;i<size;i++){
			const id = i;
			const label = 'Категория ' + i;
			resp.push({id,label});
		}

		setTimeout(()=>resolve(resp),10);
	});		
}

export function fetchFabulasThemes(){
	return new Promise((resolve,reject)=>{
		const resp =[];
		const size = 2+Math.floor(Math.random()*8);

		for (let i=0;i<size;i++){
			const category = 'Категория ' + i;
			const fabulaTheme = 'Тема '   + i;
			const decision = 'Решение '   + i;
			const text = 'ТЕКСТ' + i;
			resp.push({category,fabulaTheme,decision,text});
		}

		setTimeout(()=>resolve(resp),10);
	});	
}