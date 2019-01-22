<template lang="pug">
    span(hidden="true").icon-wrap
        svg.icon(:class="`icon_${name}`" role="presentation"): use( :xlink:href="src" )
</template>

<script>

    const sistemFiles = require.context('!svg-sprite-loader!@/assets/img/icons/', true, /.*\.svg$/)

    const importAll = (r) => r.keys().forEach(r)
    //importAll(files);
    //files.keys().forEach(files);

    import check from '@/assets/img/icons/check.svg';
    import eye from '@/assets/img/icons/eye.svg';
    import edit from '@/assets/img/icons/edit.svg';


    import vk from '@/assets/img/icons/social/vk.svg';
    import tg from '@/assets/img/icons/social/tg.svg';
    import fbme from '@/assets/img/icons/social/fbme.svg';
    import chat from '@/assets/img/icons/social/chat.svg';


    import phrases from '@/assets/img/icons/chat/phrases.svg';
    import offer from '@/assets/img/icons/chat/offer.svg';
    import files from '@/assets/img/icons/chat/files.svg';
    import gifs from '@/assets/img/icons/chat/gifs.svg';
    import smiles from '@/assets/img/icons/chat/smiles.svg';
    import arrow from '@/assets/img/icons/chat/arrow.svg';


    import n1 from '@/assets/img/icons/avatars/n1.svg';

    export default {

        props: {
            name: {
                required: true
            }
        },
        computed: {
            src() {
                //return `#${this.name}`;
                //console.log(this);
                return `/icons-sprite.svg#${this.name}`
            }
        },
        created() {

        }
    }
</script>

<style lang="scss">

    .icon{
        fill:glob-color('main');
        transition:$glob-trans;
        width:20px;
        height:20px;
        display:block;

        &-wrap{
            display:inline-block;
            vertical-align:top
        }
    }

</style>
