import Settings from '@/pages/Settings'
import SettingsApp from '@/pages/SettingsApp'
import SettingsProfile from '@/pages/SettingsProfile'

import Ui from '@/routes/ui'

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
        ...Ui
    ]
}]


