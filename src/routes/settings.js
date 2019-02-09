import Settings from '@/pages/Settings'
import SettingsApp from '@/pages/SettingsApp'
import SettingsProfile from '@/pages/SettingsProfile'


/*const  Settings = ()=> import('@/pages/Settings')
const  SettingsApp  = ()=> import('@/pages/SettingsApp')
const  SettingsProfile = ()=> import('@/pages/SettingsProfile')*/





export default [{
    name: 'settings',
    path: '/settings',
    component: Settings,
    children: [
        {
            name: 'settingsApp',
            path: 'app',
            component: SettingsApp
        },
        {
            name: 'settingsProfile',
            path: 'profile',
            component: SettingsProfile
        },

    ]
}]



