<template lang="pug">
    span(hidden="true").icon-wrap
        svg.icon(
        :id="`icon_${name}`"
            :class="`icon_${name}`"
        role="presentation"): use( :xlink:href="src" )
</template>

<script>

   /* const sistemFiles = require.context('!svg-sprite-loader!@/assets/img/icons/', true, /.*\.svg$/)  //Todo то у плагина не работает режим extract
    console.log(sistemFiles);
    const importAll = (r) => r.keys().forEach(function (r) {
        console.log(r);
    })
    importAll(sistemFiles);*/
    //files.keys().forEach(files);

    import check from '@/assets/img/icons/check.svg';
    import close from '@/assets/img/icons/close.svg';
    import eye from '@/assets/img/icons/eye.svg';
    import edit from '@/assets/img/icons/edit.svg';
    import info from '@/assets/img/icons/info.svg';



    import vk from '@/assets/img/icons/social/vk.svg';
    import tg from '@/assets/img/icons/social/tg.svg';
    import fbme from '@/assets/img/icons/social/fbme.svg';
    //import chat from '@/assets/img/icons/social/chat.svg';


    import phrases from '@/assets/img/icons/chat/phrases.svg';
    import more from '@/assets/img/icons/chat/more.svg';
    import moreFill from '@/assets/img/icons/chat/more-fill.svg';
    import files from '@/assets/img/icons/chat/files.svg';
    import gifs from '@/assets/img/icons/chat/gifs.svg';
    import smiles from '@/assets/img/icons/chat/smiles.svg';

    import send from '@/assets/img/icons/chat/send.svg';

    import transfer from '@/assets/img/icons/chat/transfer.svg';
    import exit from '@/assets/img/icons/chat/exit.svg';
    import bl from '@/assets/img/icons/chat/bl.svg';
    import down from '@/assets/img/icons/chat/down.svg';
    import user from '@/assets/img/icons/chat/user.svg';



    import noFoundTeam from '@/assets/img/icons/chat/no-found-team.svg';
    import noFoundVisitors from '@/assets/img/icons/chat/no-found-visitors.svg';
    import noFoundMessages from '@/assets/img/icons/chat/no-found-messages.svg';





    import account from '@/assets/img/icons/chat/menu/account.svg';
    import common from '@/assets/img/icons/chat/menu/common.svg';
    import auth from '@/assets/img/icons/chat/menu/auth.svg';
    import chatId from '@/assets/img/icons/chat/menu/chatId.svg';
    import process from '@/assets/img/icons/chat/menu/process.svg';
    import settingsApp from '@/assets/img/icons/chat/menu/settingsApp.svg';
    import team from '@/assets/img/icons/chat/menu/team.svg';
    import visitors from '@/assets/img/icons/chat/menu/visitors.svg';



    import n1 from '@/assets/img/icons/avatars/n1.svg';
    import n2 from '@/assets/img/icons/avatars/n2.svg';
    import n3 from '@/assets/img/icons/avatars/n3.svg';
    import n4 from '@/assets/img/icons/avatars/n4.svg';
    import n5 from '@/assets/img/icons/avatars/n5.svg';
    import n6 from '@/assets/img/icons/avatars/n6.svg';
    import n7 from '@/assets/img/icons/avatars/n7.svg';
    import n8 from '@/assets/img/icons/avatars/n8.svg';
    import n9 from '@/assets/img/icons/avatars/n9.svg';
    import n10 from '@/assets/img/icons/avatars/n10.svg';
    import n11 from '@/assets/img/icons/avatars/n11.svg';
    import n12 from '@/assets/img/icons/avatars/n12.svg';
    import n13 from '@/assets/img/icons/avatars/n13.svg';
    import n14 from '@/assets/img/icons/avatars/n14.svg';
    import n15 from '@/assets/img/icons/avatars/n15.svg';
    import n16 from '@/assets/img/icons/avatars/n16.svg';
    import n17 from '@/assets/img/icons/avatars/n17.svg';
    import n18 from '@/assets/img/icons/avatars/n18.svg';
    import n19 from '@/assets/img/icons/avatars/n19.svg';
    import n20 from '@/assets/img/icons/avatars/n20.svg';

    export default {

        props: {
            name: {
                required: true
            }
        },
        computed: {
            src() {
                //return `#${this.name}`;

                return `/icons-sprite.svg#${this.name}`
            }
        },
        created() {

        }
    }
</script>

<style lang="scss">

    .icon{
        fill:inherit;
        transition:$glob-trans;
        width:20px;
        height:20px;
        display:block;

        &-wrap{
            display:inline-block;
            vertical-align:top
        }

        &_more {
            height: 17px;
            width: 26px;
        }

        &_more-fill {
            width:24px;
            height:20px;
        }

        &_info {
            width:calc-em(90);
            height:calc-em(90);
        }
        &_eye {
            fill:glob-color('disabled');
        }
    }

</style>
