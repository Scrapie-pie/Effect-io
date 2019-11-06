import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
//'staging' || process.env.NODE_ENV

if (process.env.VUE_APP_SENTRY) {
    Sentry.init({
        dsn: 'https://8db6bd1700a44f43aeb0bc4d7a09e951@sentry.io/1803533',
        integrations: [new Integrations.Vue({ Vue, attachProps: true, logErrors: true })],
        environment: process.env.NODE_ENV
        //debug: process.env.NODE_ENV === 'development' ? true : false
    })

    console.log('Sentry on test', process.env.NODE_ENV)
}
