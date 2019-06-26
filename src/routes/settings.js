/*import PageSettings from '@/pages/PageSettings'
import PageSettingsApp from '@/pages/PageSettingsApp'
import PageSettingsProfile from '@/pages/PageSettingsProfile'*/

const PageSettings = () => import('@/pages/PageSettings')
const PageSettingsApp = () => import('@/pages/PageSettingsApp')
const PageSettingsProfile = () => import('@/pages/PageSettingsProfile')

export default [
    {
        name: 'settings',
        path: '/settings',
        component: PageSettings,
        children: [
            {
                name: 'settingsApp',
                path: 'app',
                component: PageSettingsApp
            },
            {
                name: 'settingsProfile',
                path: 'profile',
                component: PageSettingsProfile
            }
        ]
    }
]
