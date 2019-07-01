import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
//'staging' || process.env.NODE_ENV
Sentry.init({
    dsn: 'https://6e8272b198fc441fa55ede8d62e7f90e@sentry.io/1489595',
    integrations: [new Integrations.Vue({ Vue, attachProps: true })],
    environment:process.env.NODE_ENV
    //debug: process.env.NODE_ENV === 'development' ? true : false
})

console.log('Sentry on',process.env.NODE_ENV);
