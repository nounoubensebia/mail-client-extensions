const api = {
    baseURL: localStorage.getItem('baseURL'),
    createLead: "/mail_plugin/lead/create",
    createPartner: '/mail_plugin/partner/create',
    createTask: '/mail_plugin/task/create',
    createTicket: "/mail_plugin/ticket/create",
    createProject: "/mail_plugin/project/create",
    enrichCompany: "/mail_plugin/partner/enrich_and_create_company",
    getPartner: "/mail_plugin/partner/get",
    iapLeadEnrichment: "https://iap-services.odoo.com/iap/mail_extension/enrich",
    logSingleMail:"/mail_plugin/log_mail_content",
    searchPartner: "/mail_plugin/partner/search",
    getTranslations: "/mail_plugin/get_translations",
    searchProject: "/mail_plugin/project/search",

    // Authentication
    loginPage: "/web/login", // Should be the usual Odoo login page.
    authCodePage: "/mail_plugin/auth", // The page where to allow or deny access. You get an auth code.
    getAccessToken: "/mail_plugin/auth/access_token", // The address where to post to exchange an auth code for an access token.
    addInBaseURL: "https://" + __DOMAIN__,
    outlookScope: "outlook",
    outlookFriendlyName: "Outlook",
};

export default api;