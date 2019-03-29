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
	outLetterBasic: { 	 
		MAIN_INFO:  	 {name: 'main_info', 	  		label: 'Подробные сведения'},
		VID_DOC: 		 {name: 'vid_doc',		  		label: 'Вид документа',	            key: 'doc_vid'},
		SUMMARY: 		 {name: 'summary',		  		label: 'Краткое содержание'},
		NOTES: 		     {name: 'notes',		  		label: 'Примечание'},
		DELIV_TYPE: 	 {name: 'delivery_type',	  	label: 'Вид отправки',				key: 'delivery_method'},
		SHEETS_COUNT: 	 {name: 'sheets_count', 	  	label: 'Кол-во листов'}
	},
	outLetterHead: {
		ZAJAV_NDOC:     {name: 'zajav_ndoc',	 		label: '№ документа'},
		ZAJAV_DATE:     {name: 'zajav_date',	  		label: 'Дата'},
		SIGNER: 		{name: 'signer',	 			label: 'Подписал',					key: 'DECISION_MAKER'},
		ZAJAV_SIGNER: 	{name: 'zajav_signer',			label: 'Исполнитель',				key: 'EMPLOYESS_LIST'},
		SER_VH_DOC: 	{name: 'inc_ser',				label: 'Серия входящего документа'},
		NUM_VH_DOC: 	{name: 'inc_num',				label: 'Номер входящего документа'},
		INC_DAT: 		{name: 'inc_dat',		  		label: 'Дата'},
	},
	outLetterIspoln: {
		DESC: 			{name: 'desc',			  		label: '№'},
		DATE: 			{name: 'date',			  		label: 'Дата'},
		ISP_PROIZV: 	{name: 'isp_proizv',	  		label: 'Исполнительное производство'},
		ADD_N_PROIZ: 	{name: 'add_n_proiz',			label: 'Добавить № исполнительного производства'}
	},
	outLetterPost: {
		APN: 			{name: 'apn',					label: '№'},
		DATE: 			{name: 'date',					label: 'Дата'},
		ADD_POST_N: 	{name: 'add_post_n',			label: 'Добавить № постановления'},
		POSTANS: 		{name: 'postans',				label: 'Постановления'}
	},
	outLinksInner: {
		ID: 			{name: 'doc_id',				label: 'ID'},
		DESC: 			{name: 'desc',					label: 'Описание'}
	},
	outLinksScan: {
		ID: 			{name: 'doc_id',				label: 'ID'},
		DESC: 			{name: 'desc',					label: 'Описание'},
		SCAN_DOC: 		{name: 'scanned_docs',			label: 'Скан-образы документов'}
	}
}