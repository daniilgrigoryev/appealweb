export default {
	docLinker: {
		POST_NUMBER:     {name: 'npost',          		label: '№ постановления'},
		FIO_ORG:  		 {name: 'fio',			  		label: 'ФИО/Организация'},
		INCOM_NUM:   	 {name: 'number_in',		  	label: 'Входящий №'},
		OUTC_NUM: 	 	 {name: 'number_out',	  		label: 'Исходящий №'},
		IN_APPEAL:  	 {name: 'in_appeal',	  		label: 'Входящим обращениям'},
		OUT_APPEAL: 	 {name: 'out_appeal',	  		label: 'Исходящим обращениям'},
		INTRA_DOCS: 	 {name: 'intra_docs',	  		label: 'Служебным документам'}
	},
	incLetterBasic: { 	 
		MAIN_INFO:  	 {name: 'main_info', 	  		label: 'Подробные сведения'},
		VID_DOC: 		 {name: 'vid_doc',		  		label: 'Вид документа',	            key: 'doc_vid'},
		SUMMARY: 		 {name: 'summary',		  		label: 'Краткое содержание'},
		NOTES: 		     {name: 'notes',		  		label: 'Примечание'},
		DELIV_TYPE: 	 {name: 'delivery_type',	  	label: 'Вид доставки',				key: 'delivery_method'},
		SHEETS_COUNT: 	 {name: 'sheets_count', 	  	label: 'Кол-во листов'}
	},
	incLetterHead: {
		ZAJAV_SENDER: 	{name: 'zajav_sender',	  		label: 'От кого'},
		ZAJAV_NDOC:     {name: 'zajav_ndoc',	 		label: '№ документа'},
		ZAJAV_DATE:     {name: 'zajav_date',		  	label: 'Дата'},
		ZAJAV_SIGNER: 	{name: 'zajav_signer',	 		label: 'Подписал'},
		ORG_NAME: 		{name: 'org_name',		  		label: 'Список организаций/заявителей'},
		INC_NUM: 		{name: 'inc_num',		  		label: 'Входящий №'},
		SER_VH_DOC: 	{name: 'inc_ser',				label: 'Серия входящего документа'},
		NUM_VH_DOC: 	{name: 'inc_num',				label: 'Номер входящего документа'},
		INC_DAT: 		{name: 'inc_dat',		  		label: 'Дата'},
	},
	incLetterIspoln: {
		DESC: 			{name: 'desc',			  		label: '№'},
		DATE: 			{name: 'date',			  		label: 'Дата'},
		ISP_PROIZV: 	{name: 'isp_poizv',	  			label: 'Исполнительное производство'},
		ADD_N_PROIZ: 	{name: 'add_n_proizv',			label: 'Добавить № исполнительного производства'}
	},
	incLetterPlus: {
		DOP_INF: 		{name: 'dop_inf', 		  			label: 'Дополнительные сведения'},
		PROT_N: 		{name: 'prot_n',			  		label: 'Номер протокола'},
		PROT_DATE: 		{name: 'prot_date',		  			label: 'Дата'},
		VIOLATOR: 		{name: 'violator',		  			label: 'ФИО/Наименование нарушителя'},
		COURT: 	   		{name: 'court',			  			label: 'Наименование суда'},
		DEC_REG_COURT: 	{name: 'decision_regional_court', 	label: 'Решение районного суда',	key: 'decision_regional_court'},
		DEC_DATE: 		{name: 'decision_date',				label: 'Дата решения'},
		DEC_MSC_COURT: 	{name: 'decision_moscow_court',		label: 'Обжалование в Мосгорсуд',	key: 'decision_moscow_court'},
		EFFECT_DATE: 	{name: 'effect_date',				label: 'Вступление в законную силу'},
		NOTE: 			{name: 'note',						label: 'Комментарий'}
	},
	incLetterPost: {
		APN: 			{name: 'apn',					label: '№'},
		DATE: 			{name: 'date',					label: 'Дата'},
		ADD_POST_N: 	{name: 'add_post_n',			label: 'Добавить № постановления'},
		POSTANS: 		{name: 'postans',				label: 'Постановления'}
	},
	incLinksInner: {
		ID: 			{name: 'doc_id',				label: 'ID'},
		DESC: 			{name: 'desc',					label: 'Описание'}
	},
	incLinksScan: {
		ID: 			{name: 'doc_id',				label: 'ID'},
		DESC: 			{name: 'desc',					label: 'Описание'},
		SCAN_DOC: 		{name: 'scanned_docs',			label: 'Скан-образы документов'}
	}
}