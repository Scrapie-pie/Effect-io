<template lang="pug">
    base-btn(:class="sortClass",  :icon="{box:true,textHidden:'Cортировка'}"  color="success", @click="sortToggle") &#11015;
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
        &_rotate{
            transform:rotate(180deg);
        }
    }
</style>