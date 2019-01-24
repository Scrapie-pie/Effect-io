import Chat from '@/pages/Chat'
import ChatTeam from '@/pages/ChatTeam'
import ChatVisitor from '@/pages/ChatVisitor'
import ChatDialog from '@/pages/ChatDialog'

export default [{
    name: 'chat',
    path: '/chat',
    component: Chat,
    children: [
        {
            name: 'team',
            path: 'team',
            component: ChatTeam
        },
        {
            name: 'visitors',
            path: 'visitors',
            component: ChatVisitor
        },
        {
            name: 'dialog',
            path: 'dialog',
            component: ChatDialog
        },

    ]
}]




