export default {
	docLinker: {
		POST_NUMBER:     {name: 'npost',          		label: '№ постановления'},
		FIO_ORG:  		 {name: 'fio',			  		label: 'ФИО/Организация'},
		INCOM_NUM:   	 {name: 'numberIn',		  		label: 'Входящий №'},
		OUTC_NUM: 	 	 {name: 'numberOut',	  		label: 'Исходящий №'},
		IN_APPEAL:  	 {name: 'IN_APPEAL',	  		label: 'Входящим обращениям'},
		OUT_APPEAL: 	 {name: 'OUT_APPEAL',	  		label: 'Исходящим обращениям'},
		INTRA_DOCS: 	 {name: 'INTRA_DOCS',	  		label: 'Служебным документам'}
	},
	incLetterBasic: { 	 
		MAIN_INFO:  	 {name: 'MAIN_INFO', 	  		label: 'Подробные сведения'},
		VID_DOC: 		 {name: 'vidDoc',		  		label: 'Вид документа',	            key: 'doc_vid'},
		SUMMARY: 		 {name: 'summary',		  		label: 'Краткое содержание'},
		NOTES: 		     {name: 'notes',		  		label: 'Примечание'},
		DELIV_TYPE: 	 {name: 'deliveryType',	  		label: 'Вид доставки',				key: 'delivery_type'},
		SHEETS_COUNT: 	 {name: 'sheetsCount', 	  		label: 'Кол-во листов'}
	},
	incLetterHead: {
		ZAJAV_SENDER: 	{name: 'zajavSender',	  		label: 'От кого'},
		ZAJAV_NDOC:     {name: 'zajavNDoc',		 		label: '№ документа'},
		ZAJAV_DATE:     {name: 'zajavDate',		  		label: 'Дата'},
		ZAJAV_SIGNER: 	{name: 'zajavSigner',	 		label: 'Подписал'},
		ORG_NAME: 		{name: 'ORG_NAME',		  		label: 'Список организаций/заявителей'},
		INC_NUM: 		{name: 'INC_NUM',		  		label: 'Входящий №'},
		SER_VH_DOC: 	{name: 'inc_ser',				label: 'Серия входящего документа'},
		NUM_VH_DOC: 	{name: 'inc_num',				label: 'Номер входящего документа'},
		INC_DAT: 		{name: 'inc_dat',		  		label: 'Дата'},
	},
	incLetterIspoln: {
		DESC: 			{name: 'desc',			  		label: '№'},
		DATE: 			{name: 'date',			  		label: 'Дата'},
		ISP_PROIZV: 	{name: 'ISP_PROIZV',	  		label: 'Исполнительное производство'},
		ADD_N_PROIZ: 	{name: 'ADD_N_PROIZ',			label: 'Добавить № исполнительного производства'}
	},
	incLetterPlus: {
		DOP_INF: 		{name: 'DOP_INF', 		  		label: 'Дополнительные сведения'},
		PROT_N: 		{name: 'protN',			  		label: 'Номер протокола'},
		PROT_DATE: 		{name: 'protDate',		  		label: 'Дата'},
		VIOLATOR: 		{name: 'violator',		  		label: 'ФИО/Наименование нарушителя'},
		COURT: 	   		{name: 'court',			  		label: 'Наименование суда'},
		DEC_REG_COURT: 	{name: 'decisionRegionalCourt', label: 'Решение районного суда',	key: 'decision_regional_court'},
		DEC_DATE: 		{name: 'decisionDate',			label: 'Дата решения'},
		DEC_MSC_COURT: 	{name: 'decisionMoscowCourt',	label: 'Обжалование в Мосгорсуд',	key: 'decision_moscow_court'},
		EFFECT_DATE: 	{name: 'effectDate',			label: 'Вступление в законную силу'},
		NOTE: 			{name: 'note',					label: 'Комментарий'}
	},
	incLetterPost: {
		APN: 			{name: 'apn',					label: '№'},
		DATE: 			{name: 'date',					label: 'Дата'},
		ADD_POST_N: 	{name: 'ADD_POST_N',			label: 'Добавить № постановления'},
		POSTANS: 		{name: 'POSTANS',				label: 'Постановления'}
	},
	incLinksInner: {
		ID: 			{name: 'dodId',					label: 'ID'},
		DESC: 			{name: 'desc',					label: 'Описание'}
	},
	incLinksScan: {
		ID: 			{name: 'dodId',					label: 'ID'},
		DESC: 			{name: 'desc',					label: 'Описание'},
		SCAN_DOC: 		{name: 'scannedDocs',			label: 'Скан-образы документов'}
	}
}