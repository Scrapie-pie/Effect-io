<template lang="pug">
    span(hidden="true").icon-wrap
        svg.icon(:class="`icon_${name}`" role="presentation"): use( :xlink:href="src" )
</template>

<script>

    const files = require.context('!svg-sprite-loader!@/assets/img/icons/', true, /.*\.svg$/)

    const importAll = (r) => r.keys().forEach(r)
    //importAll(files);
    //files.keys().forEach(files);

    import twitterLogo from '@/assets/img/icons/check.svg';

    export default {

        props: {
            name: {
                required: true
            }
        },
        computed: {
            src() {
                //return `#${this.name}`
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
