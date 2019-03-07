/*
	описание полей в форме: связь абстрактных алиасов с полями в бэкенде и с видимым текстом

	правила заполнения:
	export default {
		форма_визарда:{
			алиас_поля : { name: поле_в_бэкенде, label: видимый_текст  },
			алиас_поля : { name: поле_в_бэкенде, label: видимый_текст  },
			алиас_поля : { name: поле_в_бэкенде, label: видимый_текст, key: ключ_для_селекта/автокомплита }
		}
	}	
*/

export default {
	basicData : {
		EDO_NUM :        {name: 'EDO_NUM',        label: 'Номер в ЭДО'},
		REQUEST_TYPE :   {name: 'REQUEST_TYPE',	  label: 'Способ подачи обращения',		key: 'REQUEST_TYPE'},
		ECOO_NUM :       {name: 'ECOO_NUM',       label: 'Номер в ЕСОО'},
		RESPONSE_TYPE :  {name: 'RESPONSE_TYPE',  label: 'Способ направления ответа',   key: 'RESPONSE_TYPE'},
		SHEETS_COUNT :   {name: 'SHEETS_COUNT',	  label: 'Количество листов'}
	},
	claimantData: {
		FAM:             {name:  'FAM',           label: 'Фамилия'},
		NAME:            {name:  'NAME',          label: 'Имя'},
		SURNAME:         {name:  'SURNAME',       label: 'Отчество'},
		SEX:             {name:  'SEX',			  label: 'Пол'},
		PRED:            {name:  'PRED',          label: 'Представитель'},
		PRED_FAM:        {name:  'PRED_FAM',      label: 'Представитель: Фамилия'},
		PRED_NAME:       {name:  'PRED_NAME',	  label: 'Представитель: Имя'},
		PRED_SURNAME:    {name:  'PRED_SURNAME',  label: 'Представитель: Отчество'},
		PRED_SEX:        {name:  'PRED_SEX',	  label: 'Пол'},
		ZAJAV_LIC:       {name:  'zajavLic',      label: '#radiobutton#'},
		ORG_NAME:        {name:  'ORG_NAME',      label: 'Название организации'},
		INN:             {name:  'INN',           label: 'ИНН'},
		KPP:             {name:  'KPP',           label: 'КПП'},
		ISH_NUMBER:      {name:  'ISH_NUMBER',    label: 'Исходящий номер'},
		ISH_DATE:        {name:  'ISH_DATE',      label: 'Исходящая дата'},
		PODPIS:          {name:  'PODPIS',        label: 'Подписант'},
		PHONE:           {name:  'PHONE',         label: 'Телефон'},
		EMAIL:           {name:  'EMAIL',         label: 'Электронная почта'},
		REGION:          {name:  'REGION',        label: 'Регион' },
		RAYON:           {name:  'RAYON',         label: 'Район'},
		NPUNKT:          {name:  'NPUNKT',        label: 'Населенный пункт' },
		STREET:          {name:  'STREET',        label: 'Улица' },
		DOM:             {name:  'DOM',           label: 'Дом/владение' },
		KORPUS:          {name:  'KORPUS',        label: 'Корпус' },
		STR:             {name:  'STR',           label: 'Строение'		},
		KVART:           {name:  'KVART',         label: 'Квартира/комната'		},
		OFFICE:          {name:  'OFFICE',        label: 'Офис'},
		PINDEX:          {name:  'PINDEX',        label: 'Индекс' }
	},
	archive:{
		TOM :            {name: 'TOM',            label: 'Том'     },
		SHEETS :         {name: 'SHEETS',         label: 'Страницы'}
	},
	topicList : {
		CODEX_ARTICLE:   {name: 'CODEX_ARTICLE' , label: 'Статья кодекса'},
		OWNER_TS:        {name: 'OWNER_TS',       label: 'Владелец транспортного средства'},
		OWNER_TS_ADR:    {name: 'OWNER_TS_ADR',   label: 'Адрес владельца транспортного средства'},
		UCH_PRIS:        {name: 'UCH_PRIS',       label: 'Необходимо присутствие участника'},
		RASSMOTR_DATE:   {name: 'RASSMOTR_DATE',  label: 'Дата рассмотрения дела'},
		RASSMOTR_TIME:   {name: 'RASSMOTR_TIME',  label: 'Время рассмотрения дела'},
		
		APN_ADR:         {name: 'APN_ADR',        label: 'Адрес АПН'},
		APN_DATA:        {name: 'APN_DATA',       label: 'Дата АПН'},
		DESCRIPTION:     {name: 'DESCRIPTION',    label: 'Описание'},
		DECISION_DATE:   {name: 'DECISION_DATE',  label: 'Дата принятия решения'},
		VIOLATOR_REGNO:  {name: 'VIOLATOR_REGNO', label: 'ГРЗ нарушителя'},
		APPEAL_CAUSE:    {name: 'APPEAL_CAUSE',   label: 'Причина обращения', key: 'APPEAL_CAUSE'},

		DESISION_MAKER:  {name: 'DESISION_MAKER', label: 'Решение принял руководитель', key:'DESISION_MAKER'},
		DECISION_THEME:  {name: 'DECISION_THEME', label: 'Решение по теме',             key:'DECISION_THEME'},
		DECISION_BASIS:  {name: 'DECISION_BASIS', label: 'Основания для решения',       key: 'DECISION_BASIS'},
		APPEAL_APN:      {name: 'APPEAL_APN',     label: 'Причина жалобы на постановление по делу об АПН  (В случае отмены указывается причина отменены)', key:'APPEAL_APN'},
		REL_DOCS: 		 {name: 'docs',		      label: 'Связанные документы'},

		CAT: 			{name: 'category', 		  label: 'Категория'},
		POST_N: 		{name: 'post_n',		  label: '№ постановления' },
		POST_DATE: 		{name: 'post_date',		  label: 'Дата'}
	},
	organizationsData : {
		SENT_FROM: 		 {name: 'SENT_FROM', 	  label: 'Направлено из организации'},
		UNDER_CONTROL:   {name: 'UNDER_CONTROL',  label: 'На контроле в организации'}
	},
	apnList: {
		POST_NUM: 		 {name: 'apn', 	  		  label: '№ постановления'},
		DATE: 			 {name: 'date',			  label: 'Дата'},
	},
	ishDocList: {
		DOC_TARGET: 	 {name: 'doc_target', 	  label: 'Кому'},
		ISH_NUM: 		 {name: 'ish_num',		  label: 'Исх.номер'},
		ISH_DATE: 		 {name: 'ish_date',		  label: 'Исх.дата'}, 
		PODPISAL: 		 {name: 'podpisal',		  label: 'Подписал'},
		STATUS: 		 {name: 'status',		  label: 'Статус'},
		DETAIL_INF: 	 {name: 'DETAIL_INF', 	  label: 'Детальная информация'},
		REL_TOPIC: 		 {name: 'related_topic',  label: 'Связанная тема',			    key: 'related_topic'},
		CRYPTO_SIGN: 	 {name: 'crypto_signature',label: 'Подпись с ЭП'},
		DOC_VID: 		 {name: 'doc_vid',		  label: 'Вид документа', 				key: 'doc_vid'},
		DELIV_TYPE: 	 {name: 'delivery_type',  label: 'Способ доставки',				key: 'delivery_type'},
		SHEETS_COUNT:    {name: 'sheets_count',	  label: 'Кол-во листов'},
		EDO_NUM: 		 {name:	'edo_num',		  label: 'Номер в ЭДО'},
		COMMENT: 		 {name: 'comment',        label: 'Комментарий'},
		FAB_DOC: 		 {name: 'FAB_DOC',		  label: 'Фабулы документов'},
		SOPR_LET: 		 {name: 'SOPR_LET',		  label: 'Сопроводительное письмо'},
		UNI_TYPE: 		 {name: 'UNI_TYPE', 	  label: 'Универсальный'},
		DEFIN: 			 {name: 'DEFIN', 		  label: 'Определение'},
		NOTIF: 			 {name: 'NOTIF',		  label: 'Уведомление'},
		CALL: 			 {name: 'CALL', 		  label: 'Вызов'},
		INIT_LETTER: 	 {name: 'INIT_LETTER', 	  label: 'Инициативное письмо'},
		FORMED_DOCS: 	 {name: 'FORMED_DOCS', 	  label: 'Сформированные документы'}

	},
	organizationControl: {
		ORG_NAME: 		 {name: 'name',			  label: 'Наименование'},
		ISH_NUM: 		 {name: 'num',			  label: 'Исх. номер'},
		ISH_DATE: 		 {name: 'date',		      label: 'Исх. дата'},
		CONTR_DATE: 	 {name: 'control_date',   label: 'Дата контроля'}
	},
	organizationFrom: {
		ORG_NAME: 		 {name: 'name',			  label: 'Наименование'},
		ISH_NUM: 		 {name: 'num',			  label: 'Исходящий номер'},
		ISH_DATE: 		 {name: 'date',		      label: 'Исходящая дата'}
	},
	questionList: {
		QUEST: 			 {name: 'question',		  label: 'Тематика обращения',		    key: 'QUESTIONS_LIST'},
		DEPART: 		 {name: 'department', 	  label: 'Отдел', 						key: 'DEPARTMENTS_LIST'}
	}, 
	fabulaDialog : {
		DOCUMENT : 		 {name: 'DOCUMENT', 	  label: 'Документ'},
		ZAJAV_TYPE: 	 {name: 'ZAJAV_TYPE',	  label: 'Тип заявителя'},
		TEMPL_FILE: 	 {name: 'TEMPL_FILE', 	  label: 'Файл шаблона'},
		FABULA: 		 {name: 'FABULA', 		  label: 'Фабула'},
		DECISION: 		 {name: 'DECISION', 	  label: 'Решение'}
	}
}