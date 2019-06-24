import Ui from '@/pages/Ui'
import UiMain from '@/pages/UiMain'

export default [
	{
		name: 'ui',
		path: '/ui',
		component: Ui,
		meta: {
			breadcrumb: ''
		},
		children: [
			{
				name: 'main',
				path: '',
				component: UiMain
			}
		]
		// beforeEnter: hookNoUserFundsCase
	}
]
