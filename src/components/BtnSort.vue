<template lang="pug">
    base-btn(:class="sortClass",  :icon="{box:false,textHidden:'Cортировка'}" , @click="sortToggle") &#9207;
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
        &_rotate{
            transform:rotate(180deg);
            color:glob-color('success');
        }
    }
</style>