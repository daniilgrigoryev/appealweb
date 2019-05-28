const getRights = (role,status_doc,status_claim)=>{
	const rights = {
		HEAD: null,
		THEMES: null,
		THEMES_SRC: null,
		ISHDOC: null,
		ISHDOC_SEND: null,
		ISHDOC_MANUAL: null,
		ISHDOC_VERIFY: null,
		ISHDOC_SIGN: null,
		LINKED: null,
		PLUS_DOCS: null,
		ARCHIVE: null
	};

	if ('APP_CLAIMS_GENERAL_SUPER'===role){
		rights.HEAD = true;
		rights.THEMES = true;
		rights.THEMES_SRC = true;
		rights.ISHDOC = true;
		rights.ISHDOC_SEND = true;
		rights.ISHDOC_MANUAL = true;
		rights.ISHDOC_VERIFY = true;
		rights.ISHDOC_SIGN = true;
		rights.LINKED = true;
		rights.PLUS_DOCS = true;
		rights.ARCHIVE = true;
	}

	if ('APP_CLAIMS_GENERAL_OBSERVER'===role){
		rights.HEAD = rights.HEAD || false;
		rights.THEMES = rights.THEMES || false;
		rights.THEMES_SRC = rights.THEMES_SRC || false;
		rights.ISHDOC = rights.ISHDOC || false;
		rights.ISHDOC_SEND = rights.ISHDOC_SEND || false;
		rights.ISHDOC_MANUAL = rights.ISHDOC_MANUAL || false;
		rights.ISHDOC_VERIFY = rights.ISHDOC_VERIFY || false;
		rights.ISHDOC_SIGN = rights.ISHDOC_SIGN || false;
		rights.LINKED = rights.LINKED || false;
		rights.PLUS_DOCS = rights.PLUS_DOCS || false;
		rights.ARCHIVE = rights.ARCHIVE || false;	
	}

	if ('APP_CLAIMS_OFFICE_CLERK'===role && !status_doc){
		rights.HEAD = rights.HEAD || true;
		rights.PLUS_DOCS = rights.PLUS_DOCS || true;
	}

	if ('APP_CLAIMS_OFFICE_CLERK'===role && status_doc==='SIGNED'){
		rights.HEAD = rights.HEAD || false;
		rights.THEMES = rights.THEMES || false;
		rights.ISHDOC = rights.ISHDOC || false;
		rights.ISHDOC_SEND = rights.ISHDOC_SEND || true;
		rights.LINKED = rights.LINKED || true;
		rights.PLUS_DOCS = rights.PLUS_DOCS || false;
	}

	if ('APP_CLAIMS_OFFICE_CHIEF'===role){
		rights.HEAD = rights.HEAD || true;
		rights.THEMES = rights.THEMES || true;
		rights.PLUS_DOCS = rights.PLUS_DOCS || false;
	}

	if ('APP_CLAIMS_ARCHIVE_CLERK'===role && (status_claim==='STAT_SENT' || status_claim==='STAT_ARCHIVED')){
		rights.HEAD = rights.HEAD || false;
		rights.THEMES = rights.THEMES || false;
		rights.ISHDOC = rights.ISHDOC || false;
		rights.LINKED = rights.LINKED || false;
		rights.PLUS_DOCS = rights.PLUS_DOCS || false;
		rights.ARCHIVE = rights.ARCHIVE || (status_claim==='STAT_SENT');
	}

	if ('APP_CLAIMS_DEPARTMENT_CLERK'===role && !status_doc){
		rights.HEAD = rights.HEAD || false;							
		rights.THEMES = rights.THEMES || true;
		rights.ISHDOC = rights.ISHDOC || true;
		rights.ISHDOC_MANUAL = rights.ISHDOC_MANUAL || true;
		rights.LINKED = rights.LINKED || true;
		rights.PLUS_DOCS = rights.PLUS_DOCS || true;
	}

	if ('APP_CLAIMS_DEPARTMENT_VERIFIER'===role && status_doc==='AWAIT_CHECK'){
		rights.HEAD = rights.HEAD || false;
		rights.THEMES = rights.THEMES || false;
		rights.ISHDOC = rights.ISHDOC || false;
		rights.ISHDOC_VERIFY = rights.ISHDOC_VERIFY || true;
		rights.LINKED = rights.LINKED || false;
		rights.PLUS_DOCS = rights.PLUS_DOCS || false;
	}

	if ('APP_CLAIMS_DEPARTMENT_CHIEF'===role && status_doc==='AWAIT_SIGN'){
		rights.HEAD = rights.HEAD || false;
		rights.THEMES = rights.THEMES || false;
		rights.ISHDOC = rights.ISHDOC || false;
		rights.LINKED = rights.LINKED || false;
		rights.ISHDOC_SIGN =  rights.ISHDOC_SIGN || true;
		rights.PLUS_DOCS = rights.PLUS_DOCS || false;
	}

	if (('APP_CLAIMS_DEPARTMENT_CHIEF'===role && status_doc==='SENDED') ||
		('APP_CLAIMS_DEPARTMENT_VERIFIER'===role && status_doc==='AWAIT_SIGN') ||
		('APP_CLAIMS_DEPARTMENT_CLERK'===role && status_doc==='AWAIT_CHECK')) {
		rights.HEAD = rights.HEAD || false;
		rights.THEMES = rights.THEMES || false;
		rights.ISHDOC = rights.ISHDOC || false;
		rights.LINKED = rights.LINKED || false;
		rights.PLUS_DOCS = rights.PLUS_DOCS || false;
	}

	if (role!=='APP_CLAIMS_GENERAL_SUPER' && (status_doc==='STAT_REJECTED' || status_doc==='STAT_ARCHIVED')){
		(rights.HEAD) && (rights.HEAD=false);
		(rights.THEMES) && (rights.THEMES=false);
		(rights.THEMES_SRC) && (rights.THEMES_SRC=false);
		(rights.ISHDOC) && (rights.ISHDOC=false);
		(rights.ISHDOC_SEND) && (rights.ISHDOC_SEND=false);
		(rights.ISHDOC_MANUAL) && (rights.ISHDOC_MANUAL=false);
		(rights.ISHDOC_VERIFY) && (rights.ISHDOC_VERIFY=false);
		(rights.ISHDOC_SIGN) && (rights.ISHDOC_SIGN=false);
		(rights.LINKED) && (rights.LINKED=false);
		(rights.PLUS_DOCS) && (rights.PLUS_DOCS=false);
		(rights.ARCHIVE) && (rights.ARCHIVE=false);
	}
	return rights;
}

export {getRights};