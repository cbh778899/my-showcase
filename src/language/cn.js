import { IDB_NAME } from "../settings/types";

const cn = {
    // nav bar
    'Home': '首页',
    'Functional Pages': '功能性界面',
    'Language': '语言',
    // db
    'IndexedDB Settings': 'IDB数据库设置',
    'Initialize IndexedDB Manually': '手动初始化IDB数据库',
    'Delete Current IndexedDB': '删除IDB数据库',
    // notification: db
    'init-idb-success': '手动初始化IDB数据库成功!',
    'del-idb-success': `删除IDB数据库${IDB_NAME}成功!`,
    'del-idb-fail': `删除IDB数据库${IDB_NAME}失败!`,
    'open-idb-timeout': '打开IDB数据库耗时过长(大于500毫秒),请尝试手动初始化IDB数据库!',
    'clear-table-success': tb_name=>{return `清空IDB表${tb_name}成功!`},
    'clear-table-fail': tb_name=>{return `清空IDB表${tb_name}失败!`},
    // Declaimer & global
    'Lililele': '历历乐乐',
    'contact-me': <>如有需要，请联系<a href="mailto:cbh778899@outlook.com">cbh778899@outlook.com</a></>,
}

export default cn;