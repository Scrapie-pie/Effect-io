<template lang="pug">
    base-btn(:class="sortClass",  :icon="{box:false,textHidden:'Cортировка'}" , @click="sortToggle")
        span.btn-sort__triangle
</template>

<script>
export default {
    name: "btn-sort", 
    props:{
        toggle:{
            type:Boolean,
            default:false,
        }
    },
    data() {
        return {

        }
    },
    computed:{
        sortClass(){
            let str=(this.toggle)?'btn-sort_rotate':''
            return 'btn-sort '+str
        },

    },
    methods:{
        sortToggle(){
            this.$emit('result',!this.toggle)

        }
    }
}
</script>

<style lang="scss">
    .btn-sort{
        padding:0 calc-em(5);
        color:glob-color('info');
        position:relative;
        top:4px;

        &__triangle::before {
            content:'';
            display:block;
            position:relative;
            top:3px;
            border: 4px solid transparent;
            border-top: 4px solid glob-color('info');


        }
        &_rotate &__triangle::before {
            border-top-color:glob-color('success');;
        }
        &_rotate{
            transform:rotate(180deg);


        }
    }
</style>