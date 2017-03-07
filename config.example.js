export default {
  api: {
    port: 3000
  },
  pushEndPoint: {
    port: 3001
  },
  services: [
    {
      model: 'pull',
      serviceName: 'google',
      displayName: 'Google',
      description: 'Google front page.',
      endPoint: 'https://google.com',
      accept: {
        status: [200]
      },
      slow: 1000 * 10,
      timeout: 1000 * 60,
      interval: 1000 * 60 * 1,
      maxRecord: 10,
      manualState: null
    },
    // Not supported yet.
    {
      model: 'push',
      serviceName: 'mrspaint_main',
      displayName: 'mrspaint main site',
      description: 'Our main site',
      auth: {
        tokenName: 'x-status-auth-token',
        tokenValue: 'iuwehio-asdasdjq-a23e0ca-asd'
      },
      interval: 1000 * 60 * 5,
      maxRecord: 10,
      manualState: 'Maintenance'
    }
  ],
  // Not supported yet.
  stories: [
    {
      date: Date.now(),
      title: 'We are having an major outage',
      services: ['mrspaint_main', 'mrspaint_service'],
      content: 'markdown here.'
    }
  ]
};
