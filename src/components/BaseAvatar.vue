<template lang="pug">
    .base-avatar(:class="classObject" :style="style")
        base-icon.base-avatar__icon(v-if="!url" :name="setName")

</template>


<script>

    export default {
        props: {
            url:'',
            name:String,
            width: {
                validator: function (value) {
                    return ['lg', 'md'].indexOf(value) !== -1
                }
            }
        },
        computed: {

            style(){
                return `backgroundImage:url(${this.url})`
            },
            classObject() {
                if (this.width) return `base-avatar_${this.width}`
            },
            setName(){
              return 'n3'
            },
        }
    }
</script>

<style lang="scss">
    .base-avatar{
        $sz:calc-em(52);
        position:relative;
        display:inline-block;
        vertical-align:middle;
        width:$sz;
        height:$sz;
        border-radius:50%;
        background:glob-color('info-lighten') no-repeat center/cover;

        .base-avatar__icon .icon{
            @extend %full-abs;
            width:100%;
            height:100%;
        }

        &_lg{
            $sz:calc-em(70);
            width:$sz;
            height:$sz;
        }

        &_md{
            $sz:calc-em(36);
            width:$sz;
            height:$sz;
        }
    }

</style>