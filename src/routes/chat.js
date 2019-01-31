
import ChatTeam from '@/pages/ChatTeam'
import ChatVisitor from '@/pages/ChatVisitor'
import ChatDialog from '@/pages/ChatDialog'


export default [

        {
            name: 'team',
            path: '/team',
            component: ChatTeam
        },
        {
            name: 'visitors',
            path: '/visitors',
            component: ChatVisitor
        },
        {
            name: 'process',
            path: '/process',
            component: ChatDialog,
        },
        {
            name: 'dialog',
            path: '/dialog',
            component: ChatDialog
        },
        {
            name: 'common',
            path: '/common',
            component: ChatDialog
        },

]




