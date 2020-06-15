const PageScenarioList = () => import('@/pages/PageScenarioList')
const PageScenarioSettings = () => import('@/pages/PageScenarioSettings')
const PageScenarioSettingsName = () => import('@/pages/PageScenarioSettingsName')
const PageScenarioSettingsContent = () => import('@/pages/PageScenarioSettingsContent')
const PageScenarioSettingsConditions = () => import('@/pages/PageScenarioSettingsConditions')
const PageScenarioSettingsTimeTable = () => import('@/pages/PageScenarioSettingsTimeTable')

export default [
    {
        name: 'scenarioList',
        path: ':siteId/scenario',
        component: PageScenarioList
    },
    {
        name: 'scenarioSettings',
        path: ':siteId/scenario/',
        component: PageScenarioSettings,
        children: [
            {
                name: 'scenarioSettingsName',
                path: ':scenarioId/name',
                component: PageScenarioSettingsName
            },
            {
                name: 'scenarioSettings',
                path: 'scenario-Settings',
                component: PageScenarioSettings
            },
            {
                name: 'scenarioSettingsContent',
                path: ':scenarioId/content',
                component: PageScenarioSettingsContent
            },
            {
                name: 'scenarioSettingsConditions',
                path: ':scenarioId/conditions',
                component: PageScenarioSettingsConditions
            },
            ,
            {
                name: 'scenarioSettingsTimeTable',
                path: ':scenarioId/timetable',
                component: PageScenarioSettingsTimeTable
            }
        ]
    }
]
