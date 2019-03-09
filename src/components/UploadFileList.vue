<template lang="pug">
    figure.upload-file-list
        ul.upload-file-list__list
            li.upload-file-list__item(v-for="(item, index) in itemList" :key="item.link")
                .upload-file-list__preview
                    base-avatar(
                        v-bind="props(item)"
                    )
                    //base-icon(v-else name="file")
                .upload-file-list__name(v-text="item.src.name")
                base-btn(
                    :icon="{name:'close'}",
                    @click="$emit('itemRemove',index)"
                    title="Удалить"
                ).upload-file-list__close
</template>

<script>
export default {
    props:{
        itemList:{
            type:Array,
            default:[],
        }
    },
    data() {
        return {}
    },
    computed:{


    },
    methods:{
        props(item){
            let obj = {
                width:'md'
            }
            if (item.link_min) obj.url= item.link_min
            else obj.name='file'

            return obj
        },
        itemRemove(index){
            this.$emit('itemRemove',index)
        }

    }
}
</script>

<style lang="scss">
    .upload-file-list{
        &__item {
            display:inline-flex;
            align-items:center;
        }
        &__preview {
            margin-right:calc-em(10);
        }
        &__close {
            .icon {width:10px;height:10px}
        }
    }
</style>