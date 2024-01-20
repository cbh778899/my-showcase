import { IDB_NAME } from "../settings/types";
const account_field_name = {
    'username': '用户名', 'email': '邮箱'
}
const cn = {
    // nav bar
    'Home': '首页',
    'Functional Pages': '功能性界面',
    'Language': '语言',
    'More': '更多',
    // Home Page
    'home-page-content': [
        {
            title: '主页',
            content: `
            欢迎来到我的主页!</br>
            在这个网页中，我仅用前端技术实现了一系列有趣的功能.</br>
            在**更多**菜单中您可以找到我的GitHub和领英链接.</br>
            请向下滑动了解更多!`
        },
        {
            title: 'IDB数据库',
            content: `
            因为这个应用并没有后端支持, 所以我使用了IDB数据库来存储数据,
            这代表着本应用生成的所有数据都存储在您的电脑上.</br>
            如果您想要清除所有数据, 请选择**IDB数据库设置** -> **删除IDB数据库**</br>
            并刷新界面, 或直接选择**手动初始化IDB数据库**来初始化IDB数据库.`
        },
        {
            title: '账户界面',
            content: `
            由**功能性界面** -> **账户界面**进入此功能, 您可以体验一个基础功能完整的账户界面:</br>
            登录, 注册, 更改信息, 上传头像...</br>
            我使用了各式各样的技术来实现这些功能, 比如:
            操作数据库, 裁剪、上传图片, 跨标签页通信...`
        },
        {
            title: '更多功能',
            content: `
            更多功能将持续更新!`
        }
    ],
    // account
    'Account Page': '账户界面',
    'Login': '登录',
    'Register Now': '立即注册',
    'click-to-register': '还没有账号?点此注册!',
    'click-to-login': '已经有账号了?点此登录!',
    'ask-input-username': '请输入您的用户名',
    'ask-input-email': '请输入您的邮箱',
    'ask-input-account': '请输入您的用户名或邮箱',
    'ask-input-password': '请输入您的密码',
    'ask-input-password-confirm': '请再次输入您的密码',
    'email-pattern-invalid': '邮箱格式不正确!',
    'password-invalid': '密码应由8-20位的数字, 大小写字母以及特殊字符组成!',
    'password-not-match': '两次输入的密码不一致!',
    'Login Success!': '登陆成功！',
    'Register Success!': '注册成功！',
    'Logout Success!': '登出成功！',
    'login-failed': '登陆失败!请检查您的用户名/邮箱以及密码是否正确。',
    'register-failed': '注册失败！您的用户名/邮箱可能已被注册过。',
    'update-success': fieldName=>{
        return `更新您的${account_field_name[fieldName]}成功!`},
    'update-failed': fieldName=>{
        return `更新${account_field_name[fieldName]}失败! 您的${account_field_name[fieldName]}可能已被注册过。`},
    'Click to edit': '点击以编辑',
    'ask-select-avatar': '请点击或把图片拖动到这里来选择您的新头像',
    'Preview not available': '加载预览出问题了',
    'file-type-invalid': '您选择的文件不是图片!',
    'edit-avatar-success': '头像更新成功!',
    'upload-avatar-failed': '上传头像时出错, 请尝试手动初始化IDB数据库',
    'Next': '下一步',
    'Finished': '完成',
    'Go Back': '返回上一步',
    'User ID': '用户ID',
    'Username': account_field_name['username'],
    'Email': account_field_name['email'],
    'avatar': '头像',
    'Edit Avatar': '编辑头像',
    'Delete Account': '删除账户',
    'confirm-delete-account': '你确定要删除该账户吗?',
    'Delete account success!': '删除账号成功!',
    'account-delete-warn': '账户已被删除!',
    'Logout': '登出',
    'Loading...': '加载中...',
    'Edit Password': '修改密码',
    'password-updated-id': '修改密码成功!',
    'password-updated-email': '重置密码成功, 请尝试用新的密码登录',
    'password-changed-logout': '您的密码更新了, 请重新登录',
    'session-expired': '当前会话已过期!',
    'password-updated': '成功修改密码',
    'email-not-exist': '这个邮箱似乎还没被注册过',
    'verification-code-wrong': '这个验证码似乎不正确',
    'verification-code-invalid': '验证码格式不正确, 请输入四位数字',
    'ask-fill-all-fields': '请填写所有缺失的部分!',
    'ask-different-password': '请输入一个和当前密码不一样的新密码!',
    'old-password-not-match': '您输入的密码和当前的密码的不一致',
    'channel-closed': '会话已结束, 现在您可以关闭此标签页',
    'waiting-for-load': '等待加载...',
    'ask-input-old-password': '请输入您当前的密码',
    'ask-input-new-password': '请输入您的新密码',
    'ask-input-confirm-new-password': '请重新输入一遍您的新密码',
    'ask-user-email': '请输入您的邮箱',
    'ask-verification-code': '请输入您的验证码',
    'verify-email-success': '恭喜您成功验证了您的邮箱',
    'confirm-send-email': email => {return (
        `请注意, 本网站没有后端, 并且所有资料都存储在本地。`+
        `我使用了EmailJS来发送验证码, 但是它有免费额度, `+
        `也就是说如果您只希望测试功能, 您可以使用“自动验证”来填写验证码。`+
        `如果您确定这是您的邮箱（${email}）并且希望用邮箱收到验证码, 请点击“依旧发送邮件”。`+
        `这种方式很有可能因为各种原因失败, 但我测试的时候是可行的。`)
    },
    'wait-email-sending': '正在发送邮件, 请稍等...',
    'email-sent': '我们给您的邮箱发了一封包含验证码的邮件, 请检查您的收件箱或垃圾邮件',
    'email-unsent': '我们尝试发送了邮件, 但是失败了, 请使用“自动验证”来验证邮箱',
    'Auto Verification': '自动验证',
    'Still Send Email': '依旧发送邮件',
    'confirm-update-password': '确认更改密码',
    'confirm-verification-code': '提交验证码',
    'confirm-email': '确认邮箱',
    'loading-channel': '等待会话加载中...',
    'forgot-password': '忘记密码了? 请点击这里重置',
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
    'homepage-title': '历历乐乐的个人主页',
    'Lililele': '历历乐乐',
    'contact-me': <>如有需要，请联系<a href="mailto:cbh778899@outlook.com">cbh778899@outlook.com</a></>,
    'Cancel': '取消',
    'Confirm': '确定'
}

export default cn;