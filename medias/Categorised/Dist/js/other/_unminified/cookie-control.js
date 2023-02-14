var config = {
  onLoad: stir.cookieControl.init,
  apiKey: 'df257b20573e9c127a7006a958df3bcdbc1dcd77',
  product: 'PRO',
  initialState: 'left',
  notifyDismissButton: false,
  position: 'left',
  layout: 'slideout',
  rejectButton: false,
  acceptBehaviour: 'recommended',
  theme: 'light',
  toggleType: 'slider',
  settingsStyle: 'button',
  logConsent: true,
  text: {
    accept: 'I\'m OK with that',
    acceptSettings: 'I\'m OK with that',
    acceptRecommended: 'I\'m OK with necessary cookies',
    intro: 'Some of the cookies we use on this website are necessary, while others help us to improve your experience. \n \n If you accept marketing and performance cookies below, we may show you personalised ads (such as reminders of our Open Days) when you are on other websites and/or social media platforms. We do this by sharing information with our selected advertising partners.',
    notifyTitle: 'Use of cookies on this website',
    notifyDescription: 'Necessary cookies enable core functionality such as page navigation and access to secure areas. The website cannot function properly without these cookies, and they can only be disabled by changing your browser preferences.',
    settings: 'See more options'
  },
  branding: {
    removeAbout: 'true'
  },
  statement: {
    description: 'All the cookies we use on this website are listed in our ',
    name: 'Privacy Statement',
    url: 'https://www.stir.ac.uk/about/professional-services/student-academic-and-corporate-services/policy-and-planning/legal-compliance/data-protectiongdpr/privacy-notices/users-of-the-universitys-website/'
  },
  // Necessary Cookies
  necessaryCookies: ['_____SITEGUID', 'AADNonce', 'ASP.NET_SessionId', 'ASP.NET_SessionId', 'AuthSess', 'AWSALBCORS', 'buid', 'COMPBRANDefojdf4gehgvx5j0hcluweyc', 'DSFPartnerID', 'esctx', 'fpc', 'LASTSITEACTIVITY', 'mgref', 'RedirectToThinEmbed', 'stsservicecookie', 'VISITOR_INFO1_LIVE', 'WEBSERVERID', 'wfeSessionId', 'x-ms-gateway-slice', 'z'],
  optionalCookies: [{
    name: 'marketing',
    label: 'Marketing Cookies',
    description: 'We use marketing cookies to help us improve the relevancy of advertising campaigns you receive.',
    // Marketing Cookies
    cookies: ['fr', '__atuvc', '__atuvs', '_fbp', '_gcl_au', '_scid', 'AnalyticsSyncHistory', 'bcookie', 'bscookie', 'Hm_lpvt_1294c0f6a17a2efc9628c40a17312ef0', 'Hm_lvt_1294c0f6a17a2efc9628c40a17312ef0', 'jvxsync', 'lang', 'li_sugr', 'lidc', 'lissc', 'personalization_id', 'sc_at', 'test_cookie', 'user-id', 'UserMatchHistory', 'vuid', 'X-AB', 'YSC'],
    thirdPartyCookies: [{
      name: "Snap",
      optOutLink: "https://www.snap.com/en-GB/cookie-policy"
    }],
    recommendedState: false,
    onAccept: function onAccept() {
      dataLayer.push({
        'civic_cookies_marketing': 'marketing_consent_given',
        'event': 'marketing_consent_given'
      });
      var el = document.getElementById('demo_marketing-optin-indicator');
      el && (el.innerHTML = '<h3 class="text-center header-stripped">Marketing consent given. Test Marketing cookie module loaded</h3><p class="text-center"><img src="https://logos-world.net/wp-content/uploads/2020/04/Facebook-Logo.png" width="400" height="225" />');
    },
    onRevoke: function onRevoke() {
      dataLayer.push({
        'civic_cookies_marketing': 'marketing_consent_revoked'
      });
      var el = document.getElementById('demo_marketing-optin-indicator');
      el && (el.innerHTML = '');
    }
  }, {
    name: 'performance',
    label: 'Performance Cookies',
    description: 'Performance cookies help us to improve our website by collecting and reporting information on its usage.',
    recommendedState: false,
    // Performance Cookies
    cookies: ['_ga', '_gid', '_gat', '__utma', '__utmt', '__utmb', '__utmc', '__utmz', '__utmv', '_hjFirstSeen', '_hjid', '_hjTLDTest'],
    onAccept: function onAccept() {
      dataLayer.push({
        'civic_cookies_performance': 'performance_consent_given',
        'event': 'performance_consent_given'
      });
    },
    onRevoke: function onRevoke() {
      dataLayer.push({
        'civic_cookies_performance': 'performance_consent_revoked'
      });
      window.location.reload();
    }
  }, {
    name: 'thirdparty',
    label: '3rd Party Cookies',
    description: 'We use 3rd party services to embed external content (video, maps, etc.) to make use of these features those third parties may store cookies in your browser.',
    cookies: [],
    recommendedState: "off",
    onAccept: function onAccept() {
      stir.cookieControl && stir.cookieControl.accept();
    },
    onRevoke: function onRevoke() {
      stir.cookieControl && stir.cookieControl.revoke();
    }
  }]
};
CookieControl.geoTest(config.product, config.apiKey, function (response) {
  CookieControl.load(config);
}); //if (response.withinEU) { } else { }