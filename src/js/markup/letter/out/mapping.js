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
	outLetterBasic: { 	 
		MAIN_INFO:  	 {name: 'MAIN_INFO', 	  		label: 'Основные сведения'},
		VID_DOC: 		 {name: 'vidDoc',		  		label: 'Вид документа',	            key: 'doc_vid'},
		SUMMARY: 		 {name: 'summary',		  		label: 'Краткое содержание'},
		NOTES: 		     {name: 'notes',		  		label: 'Примечание'},
		DELIV_TYPE: 	 {name: 'deliveryType',	  		label: 'Вид отправки',				key: 'delivery_type'},
		SHEETS_COUNT: 	 {name: 'sheetsCount', 	  		label: 'Кол-во листов'}
	},
	outLetterHead: {
		ZAJAV_NDOC:     {name: 'zajavNDoc',		 		label: '№ документа'},
		ZAJAV_DATE:     {name: 'zajavDate',		  		label: 'Дата'},
		SIGNER: 		{name: 'signer',	 			label: 'Подписал'},
		ZAJAV_SIGNER: 	{name: 'zajavSigner',			label: 'Исполнитель'},
		SER_VH_DOC: 	{name: 'inc_ser',				label: 'Серия входящего документа'},
		NUM_VH_DOC: 	{name: 'inc_num',				label: 'Номер входящего документа'},
		INC_DAT: 		{name: 'inc_dat',		  		label: 'Дата'},
	},
	outLetterIspoln: {
		DESC: 			{name: 'desc',			  		label: '№'},
		DATE: 			{name: 'date',			  		label: 'Дата'},
		ISP_PROIZV: 	{name: 'ISP_PROIZV',	  		label: 'Исполнительное производство'},
		ADD_N_PROIZ: 	{name: 'ADD_N_PROIZ',			label: 'Добавить № исполнительного производства'}
	},
	outLetterPost: {
		APN: 			{name: 'apn',					label: '№'},
		DATE: 			{name: 'date',					label: 'Дата'},
		ADD_POST_N: 	{name: 'ADD_POST_N',			label: 'Добавить № постановления'},
		POSTANS: 		{name: 'POSTANS',				label: 'Постановления'}
	},
	outLinksInner: {
		ID: 			{name: 'dodId',					label: 'ID'},
		DESC: 			{name: 'desc',					label: 'Описание'}
	},
	outLinksScan: {
		ID: 			{name: 'dodId',					label: 'ID'},
		DESC: 			{name: 'desc',					label: 'Описание'},
		SCAN_DOC: 		{name: 'scannedDocs',			label: 'Скан-образы документов'}
	}
}