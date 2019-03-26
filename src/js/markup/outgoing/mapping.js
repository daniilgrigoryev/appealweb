export default {
	docLinker: {
		POST_NUMBER:     {name: 'npost',          		label: '№ постановления'},
		FIO_ORG:  		 {name: 'fio',			  		label: 'ФИО/Организация'},
		INCOM_NUM:   	 {name: 'number_in',	  		label: 'Входящий №'},
		OUTC_NUM: 	 	 {name: 'number_out',	  		label: 'Исходящий №'},
		IN_APPEAL:  	 {name: 'in_appeal',	  		label: 'Входящим обращениям'},
		OUT_APPEAL: 	 {name: 'out_appeal',	  		label: 'Исходящим обращениям'},
		INTRA_DOCS: 	 {name: 'intra_docs',	  		label: 'Служебным документам'}
	},
	ishBasic: { 	 
		VID_DOC: 		 {name: 'vid_doc',		  		label: 'Вид документа',	            key: 'DOC_VID'},
		SUMMARY: 		 {name: 'summary',		  		label: 'Краткое содержание'},
		NOTES: 		     {name: 'notes',		  		label: 'Примечание'},
		DELIV_TYPE: 	 {name: 'delivery_type',  		label: 'Способ доставки',			key: 'DELIVERY_METHOD'},
		SHEETS_COUNT: 	 {name: 'sheets_count',	  		label: 'Кол-во листов'}
	},
	ishHead: {
		TO: 			 {name: 'to',					label: 'Кому:'},
		ADDR: 			 {name: 'addr',	  				label: 'Адресаты:'},
		ZAJAV_NDOC:      {name: 'zajav_ndoc',		 	label: '№ документа'},
		SIGNER: 		 {name: 'signer',	 			label: 'Подписал',                  key: 'DECISION_MAKER'},
		EXECUTOR: 		 {name: 'executor',				label: 'Исполнитель',               key: 'EMPLOYESS_LIST'},
		DOC_NUM: 		 {name: 'doc_prefix',			label: 'Номер документа - префикс'},
		ORDER_NUM: 		 {name: 'doc_num',				label: 'Номер документа - суффикс'},
		DOC_DAT: 		 {name: 'doc_date',		  		label: 'Дата'}
	},
	ishLinksInner: {
		ID: 			{name: 'dod_id',				label: 'ID'},
		DESC: 			{name: 'desc',					label: 'Описание'}
	},
	ishLinksPost: {
		NPOST: 			{name: 'npost',					label: 'Постановление'},
		DATE: 			{name: 'date',					label: 'Дата'},
		POSTS: 			{name: 'posts',					label: 'Постановления'}
	},
	ishLinksScan: {
		ID: 			{name: 'dod_id',				label: 'ID'},
		DESC: 			{name: 'desc',					label: 'Описание'},
		SCAN_DOC: 		{name: 'scanned_docs',			label: 'Скан-образы документов:'}
	}
}