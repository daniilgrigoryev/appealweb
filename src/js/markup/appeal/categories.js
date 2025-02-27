import mapping from './mapping.js' 

const M = mapping.topicList; // связь с именованием полей в форме

/*
	все возможные в форме категории:
	первая ячейка - забой (первая строка матрицы и первая колонка - служебные, их пересечение заполнению не подлежит)
	
	атрибуты категорий:
	-sys: системы в которых доступна категория,  A (лат) = ампп, M (лат) = мади ; поиск по регистрозависимому вхождению символа в строку
	-text: видимый в интерфейсе текст (автокомплит)

*/
const categories = [void 0 /*matrix index sync - void cell*/, 
	{ sys: "AM", text: "Жалоба на постановление по делу об АПН" },
	{ sys: "AM", text: "Ходатайство о восстановлении срока обжалования постановления" },
	{ sys: "AM", text: "Ходатайство о переносе срока рассмотрения дела об АПН" },
	{ sys: " M", text: "Внесение информации об оплате административного штрафа, подтверждение отсутствия задолженности по оплате штрафа" },
	{ sys: "AM", text: "Возврат денежных средств" },
	{ sys: " M", text: "Предоставление копии постановления# протокола# других материалов дела" },
	{ sys: " M", text: "Внесение информации об отмене постановления" },
	{ sys: " M", text: "Привлечение к административной ответственности по ч.5 ст.12.16,1" },
	{ sys: " M", text: "Жалоба на отсутствие ответа на ранее поданную жалобу или на ненадлежащий ответ" },
	{ sys: " M", text: "Жалоба на работу МАДИ" },
	{ sys: " M", text: "Жалоба на действия должностных лиц" },
	{ sys: " M", text: "Запрос информации о причине передачи дела об АПН в ФССП России" },
	{ sys: " M", text: "Разъяснение порядка обжалования# оплаты# эвакуации" },
	{ sys: " M", text: "Досудебная претензия" },
	{ sys: " M", text: "Обращение по вопросу нарушения правил остановки и стоянки легковыми такси" },
	{ sys: " M", text: "Обращение по вопросу нарушения правил перевозок пассажиров легковыми такси" },
	{ sys: " M", text: "Обращения не относящиеся к сфере деятельности МАДИ" },
	{ sys: " M", text: "Несогласие с протоколом об АПН" },
	{ sys: " M", text: "Обращение по вопросам прохождения государственной службы" },
	{ sys: " M", text: "Обращение содержащее несколько вопросов компетенции разных управлений" },
	{ sys: "AM", text: "Повторное обжалование постановлений" },
	{ sys: " M", text: "Привлечение к административной ответственности за стоянку на газоне" },
	{ sys: " M", text: "Привлечение к административной ответственности за …ри погрузочно-разгрузочных работах в ночное время" },
	{ sys: " M", text: "Обращения Mos.Ru" },
	{ sys: " M", text: "Ознакомление с материалами дела об АПН" },
	{ sys: " M", text: "Заявление о продлении льготного периода оплаты штрафа" },
	{ sys: " M", text: "Дополнительные материалы" },
	{ sys: " M", text: "Предоставление реквизитов для оплаты постановлений" },
	{ sys: " M", text: "Заявление о предоставлении отсрочки/рассрочки по оплате штрафа" },
	{ sys: " M", text: "Заявление о прекращении исполнения постановления" },
	{ sys: " M", text: "Обращение по вопросам перемещения ТС без ГРЗ" },
	{ sys: " M", text: "Иное" },
	{ sys: "A ", text: "Парковочное разрешение многодетной семьи (МПР)" },
	{ sys: "A ", text: "Парковочное разрешение инвалида (ИПР)" },
	{ sys: "A ", text: "Абонементы" },
	{ sys: "A ", text: "Парковочные карты" },
	{ sys: "A ", text: "Сайт" },
	{ sys: "A ", text: "Колл-центр" },
	{ sys: "A ", text: "Мобильное приложение" },
	{ sys: "A ", text: "СМС-сервис" },
	{ sys: "A ", text: "Парковочный счет" },
	{ sys: "A ", text: "Оплата парковки" },
	{ sys: "A ", text: "Организация парковочного пространства" },
	{ sys: "A ", text: "Паркомат" },
	{ sys: "A ", text: "Эвакуация" },
	{ sys: "A ", text: "Штрафы"}
];

/*
	все возможные поля для заполнения:
	-field: наименование поля (СТРОГО соответствующее таковому из формы)
	-label: видимый в интерфейсе текст (слева от поля ввода)
*/
const fields = [
	{field: M.CODEX_ARTICLE.name , 		label: 'Статья кодекса'},
	{field: M.OWNER_TS.name,       		label: 'Владелец транспортного средства'},
	{field: M.OWNER_TS_ADR.name,   		label: 'Адрес владельца транспортного средства'},
	{field: M.POST_APPEAL_CAUSE.name,   label: 'Причина жалобы на постановление по делу об АПН  (В случае отмены указывается причина отмены)'},
	{field: M.UCH_PRIS.name,       		label: 'Необходимо присутствие участника'},
	{field: M.RASSMOTR_DATE.name,  		label: 'Дата рассмотрения дела'},
	{field: M.RASSMOTR_TIME.name,  		label: 'Время рассмотрения дела'},
	{field: M.DECISION_THEME.name, 		label: 'Решение по теме'},
	{field: M.DECISION_BASIS.name, 		label: 'Основания для решения'},
	{field: M.APN_ADR.name,        		label: 'Адрес АПН'},
	{field: M.APN_DATA.name,       		label: 'Дата АПН'},
	{field: M.DESCRIPTION.name,    		label: 'Описание'},
	{field: M.DESISION_MAKER.name, 		label: 'Решение принял руководитель'},
	{field: M.DECISION_DATE.name,  		label: 'Дата принятия решения'},
	{field: M.VIOLATOR_REGNO.name, 		label: 'ГРЗ нарушителя'},
	{field: M.APPEAL_CAUSE.name,   		label: 'Причина обращения'}
];

/*
	матрица видимости полей ввода:
	-первая строка:  поля
	-первая колонка: категории
	-тело: 1 - поле отображается, 0 - поле ввода

	для N полей и M категорий размер матрицы (N+1)x(M+1)

       забой   | поле1 | поле2 | поле3 | поле4 | поле5 | полеN 
	-----------+-------+-------+-------+-------+-------+-------
    категория1 |   0   |   0   |   0   |   1   |   0   |   1   
	-----------+-------+-------+-------+-------+-------+-------
    категория2 |   0   |   1   |   1   |   0   |   0   |   0   
	-----------+-------+-------+-------+-------+-------+-------
    категория3 |   1   |   1   |   0   |   0   |   0   |   1   
	-----------+-------+-------+-------+-------+-------+-------
    категорияM |   0   |   1   |   0   |   0   |   1   |   0   

*/
const matrix = [
[categories[ 0],fields[ 0],fields[ 1],fields[ 2],fields[ 3],fields[ 4],fields[ 5],fields[ 6],fields[ 7],fields[ 8],fields[ 9],fields[10],fields[11],fields[12],fields[13],fields[14],fields[15]],

[null               ,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],

[categories[ 1].text,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
[categories[ 2].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[ 3].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[ 4].text,1,0,0,0,1,1,1,1,0,1,1,1,0,0,0,1],
[categories[ 5].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[ 6].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[ 7].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[ 8].text,0,0,0,1,1,1,1,0,1,1,1,0,0,1,0,0],
[categories[ 9].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[10].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[11].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[12].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[13].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[14].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[15].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[16].text,1,0,0,0,1,1,1,1,1,1,1,1,0,0,1,0],
[categories[17].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[18].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[19].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[20].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[21].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[22].text,1,0,0,0,1,1,1,1,1,1,1,1,0,0,1,0],
[categories[23].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[24].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[25].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[26].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[27].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[28].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[29].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[30].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[31].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[32].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[33].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[34].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[35].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[36].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[37].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[38].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[39].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[40].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[41].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[42].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[43].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[44].text,1,0,0,0,1,1,1,1,0,1,1,1,0,0,1,0],
[categories[45].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0],
[categories[46].text,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0]]

export {fields,categories,matrix}
