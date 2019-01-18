<template lang="pug">
    .base-avatar(:class="classObject")
</template>


<script>
    export default {
        props: {
            width: {
                validator: function (value) {
                    return ['lg', 'md'].indexOf(value) !== -1
                }
            }
        },
        computed: {
            classObject() {
                if (this.width) return `base-avatar_${this.width}`
            }
        }
    }
</script>

<style lang="scss">
    .base-avatar{
        $sz:calc-em(52);
        display:inline-block;
        vertical-align:middle;
        width:$sz;
        height:$sz;
        border-radius:50%;
        background-color:glob-color('info-lighten');

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