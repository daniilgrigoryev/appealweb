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
	ishBasic: { 	 
		VID_DOC: 		 {name: 'vidDoc',		  		label: 'Вид документа',	            key: 'doc_vid'},
		SUMMARY: 		 {name: 'summary',		  		label: 'Краткое содержание'},
		NOTES: 		     {name: 'notes',		  		label: 'Примечание'},
		DELIV_TYPE: 	 {name: 'deliveryType',	  		label: 'Способ доставки',			key: 'delivery_type'},
		SHEETS_COUNT: 	 {name: 'sheetsCount', 	  		label: 'Кол-во листов'}
	},
	ishHead: {
		TO: 			 {name: 'to',					label: 'Кому:'},
		ADDR: 			 {name: 'addr',	  				label: 'Адресаты:'},
		ZAJAV_NDOC:      {name: 'zajavNDoc',		 	label: '№ документа'},
		SIGNER: 		 {name: 'signer',	 			label: 'Подписал'},
		EXECUTOR: 		 {name: 'executor',				label: 'Исполнитель'},
		DOC_NUM: 		 {name: 'docNum',				label: 'Номер документа'},
		ORDER_NUM: 		 {name: 'orderNumber',			label: 'Номер заказа'},
		DOC_DAT: 		 {name: 'docDate',		  		label: 'Дата'}
	},
	ishLinksInner: {
		ID: 			{name: 'dodId',					label: 'ID'},
		DESC: 			{name: 'desc',					label: 'Описание'}
	},
	ishLinksPost: {
		NPOST: 			{name: 'npost',					label: 'Постановление'},
		DATE: 			{name: 'date',					label: 'Дата'},
		POSTS: 			{name: 'posts',					label: 'Постановления'}
	},
	ishLinksScan: {
		ID: 			{name: 'dodId',					label: 'ID'},
		DESC: 			{name: 'desc',					label: 'Описание'},
		SCAN_DOC: 		{name: 'scannedDocs',			label: 'Скан-образы документов:'}
	}
}