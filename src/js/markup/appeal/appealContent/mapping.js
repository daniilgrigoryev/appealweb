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
		EDO_NUM :        {name: 'edo_num',        label: 'Номер в ЭДО'},
		REQUEST_TYPE :   {name: 'request_type',	  label: 'Способ подачи обращения',		key: 'REQUEST_TYPE'},
		ECOO_NUM :       {name: 'ecoo_num',       label: 'Номер в ЕСОО'},
		RESPONSE_TYPE :  {name: 'response_type',  label: 'Способ направления ответа',   key: 'RESPONSE_TYPE'},
		SHEETS_COUNT :   {name: 'sheets_count',	  label: 'Количество листов'}
	},
	claimantData: {
		FAM:             {name:  'fam',           label: 'Фамилия'},
		NAME:            {name:  'name',          label: 'Имя'},
		SURNAME:         {name:  'surname',       label: 'Отчество'},
		SEX:             {name:  'sex',			  label: 'Пол'},
		PRED:            {name:  'pred',          label: 'Представитель'},
		PRED_FAM:        {name:  'pred_fam',      label: 'Представитель: Фамилия'},
		PRED_NAME:       {name:  'pred_name',	  label: 'Представитель: Имя'},
		PRED_SURNAME:    {name:  'pred_surname',  label: 'Представитель: Отчество'},
		PRED_SEX:        {name:  'pred_sex',	  label: 'Пол'},
		ZAJAV_LIC:       {name:  'zajav_lic',     label: '#radiobutton#'},
		ORG_NAME:        {name:  'org_name',      label: 'Название контролирующей организации',        key: 'ORG_LIST'},
		INN:             {name:  'inn',           label: 'ИНН'},
		KPP:             {name:  'kpp',           label: 'КПП'},
		ISH_NUMBER:      {name:  'ish_number',    label: 'Исходящий номер'},
		ISH_DATE:        {name:  'ish_date',      label: 'Исходящая дата'},
		PODPIS:          {name:  'podpis',        label: 'Подписант'},
		PHONE:           {name:  'phone',         label: 'Телефон'},
		EMAIL:           {name:  'email',         label: 'Электронная почта'},
		REGION:          {name:  'region',        label: 'Регион',                                     key:'REGION_LIST' },
		RAYON:           {name:  'rayon',         label: 'Район',									   key:'RAYON_LIST'},
		NPUNKT:          {name:  'npunkt',        label: 'Населенный пункт',						   key:'NPUNKT_LIST' },
		STREET:          {name:  'street',        label: 'Улица',									   key:'STREET_LIST'},
		DOM:             {name:  'dom',           label: 'Дом/владение' },
		KORPUS:          {name:  'korpus',        label: 'Корпус' },
		STR:             {name:  'str',           label: 'Строение'		},
		KVART:           {name:  'kvart',         label: 'Квартира/комната'		},
		OFFICE:          {name:  'office',        label: 'Офис'},
		PINDEX:          {name:  'pindex',        label: 'Индекс' },
		MESTO: 			 {name:  'mesto',		  label: 'Место'},
		KM: 			 {name:  'km',			  label: 'км, метр'},
		MGO: 			 {name:  'mgo',			  label: 'МГО'},
		MGT: 			 {name:  'mgt',			  label: 'МГТ'},
		DOP_SVED: 		 {name:  'dop_sved',	  label: 'Доп. сведения'},
		SHIR: 			 {name:  'shir',		  label: 'Широта'},
		DOLG: 			 {name:  'dolg',		  label: 'Долгота'},
		ADDRESS: 		 {name:  'address', 	  label: 'Адрес'}
	},
	archive:{
		TOM :            {name: 'tom',            label: 'Том'     },
		SHEETS :         {name: 'sheets',         label: 'Страницы'}
	},
	topicList : {
		CODEX_ARTICLE:   {name: 'codex_article' , label: 'Статья кодекса'},
		OWNER_TS:        {name: 'owner_ts',       label: 'Владелец транспортного средства'},
		OWNER_TS_ADR:    {name: 'owner_ts_adr',   label: 'Адрес владельца транспортного средства'},
		UCH_PRIS:        {name: 'uch_pris',       label: 'Необходимо присутствие участника'},
		RASSMOTR_DATE:   {name: 'rassmotr_date',  label: 'Дата рассмотрения дела'},
		RASSMOTR_TIME:   {name: 'rassmotr_time',  label: 'Время рассмотрения дела'},
		
		APN_ADR:         {name: 'apn_ade',        label: 'Адрес АПН'},
		APN_DATA:        {name: 'apn_data',       label: 'Дата АПН'},
		DESCRIPTION:     {name: 'description',    label: 'Описание'},
		DECISION_DATE:   {name: 'decicion_date',  label: 'Дата принятия решения'},
		VIOLATOR_REGNO:  {name: 'violator_regno', label: 'ГРЗ нарушителя'},
		APPEAL_CAUSE:    {name: 'appeal_cause',   label: 'Причина обращения', key: 'APPEAL_CAUSE'},

		DESISION_MAKER:  {name: 'decision_maker', label: 'Решение принял руководитель', key:'DECISION_MAKER'},
		DECISION_THEME:  {name: 'decision_theme', label: 'Решение по теме',             key:'APPEAL_DECISION'},
		DECISION_BASIS:  {name: 'decision_basis', label: 'Основания для решения',       key: 'APPEAL_DECISION_BASIS'},
		APPEAL_APN:      {name: 'appeal_apn',     label: 'Причина жалобы на постановление по делу об АПН  (В случае отмены указывается причина отмены)', key:'APPEAL_CAUSE'},
		REL_DOCS: 		 {name: 'docs',		      label: 'Сформированные документы'},

		CAT: 			{name: 'category', 		  label: 'Категория',                   key:'CLAIM_CATEGORIES'},
		POST_N: 		{name: 'post_n',		  label: '№ постановления' },
		POST_DATE: 		{name: 'post_date',		  label: 'Дата'}
	},
	organizationsData : {
		SENT_FROM: 		 {name: 'sent_from', 	  label: 'Направлено из организации'},
		UNDER_CONTROL:   {name: 'under_control',  label: 'На контроле в организации'}
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
		DETAIL_INF: 	 {name: 'detail_inf', 	  label: 'Детальная информация'},
		REL_TOPIC: 		 {name: 'related_topic',  label: 'Связанная тема',			    key: 'related_topic'},
		CRYPTO_SIGN: 	 {name: 'crypto_signature',label: 'Подпись с ЭП'},
		DOC_VID: 		 {name: 'doc_vid',		  label: 'Вид документа', 				key: 'doc_vid'},
		DELIV_TYPE: 	 {name: 'delivery_type',  label: 'Способ доставки',				key: 'DELIVERY_METHOD'},
		SHEETS_COUNT:    {name: 'sheets_count',	  label: 'Кол-во листов'},
		EDO_NUM: 		 {name:	'edo_num',		  label: 'Номер в ЭДО'},
		COMMENT: 		 {name: 'comment',        label: 'Комментарий'},
		FAB_DOC: 		 {name: 'fab_doc',		  label: 'Документы'},
		SOPR_LET: 		 {name: 'sopr_let',		  label: 'Сопроводительное письмо'},
		UNI_TYPE: 		 {name: 'uni_type', 	  label: 'Универсальный'},
		DEFIN: 			 {name: 'defin', 		  label: 'Определение'},
		NOTIF: 			 {name: 'notif',		  label: 'Уведомление'},
		CALL: 			 {name: 'call', 		  label: 'Вызов'},
		INIT_LETTER: 	 {name: 'init_tetter', 	  label: 'Инициативное письмо'},
		FORMED_DOCS: 	 {name: 'formed_docs', 	  label: 'Сформированные документы'}

	},
	organizationControl: {
		ORG_NAME: 		 {name: 'name',			  label: 'Наименование',        key: 'ORG_LIST'},
		ISH_NUM: 		 {name: 'num',			  label: 'Исх. номер'},
		ISH_DATE: 		 {name: 'date',		      label: 'Исх. дата'},
		CONTR_DATE: 	 {name: 'control_date',   label: 'Дата контроля'}
	},
	organizationFrom: {
		ORG_NAME: 		 {name: 'name',			  label: 'Наименование',        key: 'ORG_LIST'},
		ISH_NUM: 		 {name: 'num',			  label: 'Исходящий номер'},
		ISH_DATE: 		 {name: 'date',		      label: 'Исходящая дата'}
	},
	questionList: {
		QUEST: 			 {name: 'question',		  label: 'Тематика обращения',		    key: 'QUESTIONS_LIST'},
		DEPART: 		 {name: 'department', 	  label: 'Отдел', 						key: 'DEPARTMENTS_LIST'}
	},
	ishLinksInner: {
		ID: 			{name: 'dod_id',				label: 'ID'},
		DESC: 			{name: 'desc',					label: 'Описание'}
	}, 
	fabulaDialog : {
		DOCUMENT : 		 {name: 'document', 	  label: 'Документ'},
		ZAJAV_TYPE: 	 {name: 'zajav_type',	  label: 'Тип заявителя'},
		TEMPL_FILE: 	 {name: 'templ_file', 	  label: 'Файл шаблона'},
		FABULA: 		 {name: 'fabule', 		  label: 'Фабула'},
		DECISION: 		 {name: 'decision', 	  label: 'Решение'}
	},
	status: {
		DEPART: 		 {name: 'exec_org_key', 	   label: 'Отдел', 	     key: 'DEPARTMENTS_LIST'},
		STATUS: 		 {name: 'processing_stage_id', label: 'Статус',      key: 'PROCESSING_STAGES'},
		EXECUTOR: 		 {name: 'exec_emp_key', 	   label: 'Исполнитель', key: 'EMPLOYESS_LIST'},
		REG_NUM: 		 {name: 'registration_number', label: 'Рег. номер'},
		CHK_DATE: 		 {name: 'checking_date', 	   label: 'Дата контроля'}
	}
}