<template lang="pug">
    ul.action-list
        li.action-list__item(
            v-for="(item, index) in itemList",
            :key="item.id+item[nameFieldText]",

        )
            label.action-list__button
                input(
                    :class="{highlight:index===highlightIndex}"
                    ref="input",
                    type="radio",
                    :name="name",
                    :value="nameFieldValue | setValue(item)",
                    :checked="getChecked(item)"
                    v-on="inputListeners"
                ).action-list__input
                span.action-list__text(:title="nameFieldText | setValue(item) |setTitle(title)")
                    |{{nameFieldText | setValue(item)}}
</template>

<script>
export default {
    filters: {

        setTitle: function(text, title) {
            if (!title) return ''
            return text
        },
        setValue: function(nameField, item) {
            if (!nameField) return ''
            return item[nameField]
        }
    },
    inheritAttrs: false,
    props: {
        itemList: {
            type: Array,
            default: () => []
        },
        nameFieldText: {
            type: String,
            default: ''
        },
        nameFieldValue: {
            type: String,
            default: ''
        },
        value: {
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        title: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            highlightIndex:-1,
        }
    },
    computed: {
        inputListeners: function() {
            var vm = this
            // `Object.assign` объединяет объекты вместе, чтобы получить новый объект
            return Object.assign(
                {},
                // Мы добавляем все слушатели из родителя
                this.$listeners,
                // Затем мы можем добавить собственные слушатели или
                // перезаписать поведение некоторых существующих.
                {
                    // Это обеспечит, что будет работать v-model на компоненте
                    input: function(event) {
                        vm.$emit('input', event.target.value)
                    }
                }
            )
        }
    },
    mounted() {
        document.getElementById('contenteditable').addEventListener("keyup",this.keyUp)
        document.getElementById('contenteditable').addEventListener("keydown",this.keyDown)
    },
    beforeDestroy() {
        document.getElementById('contenteditable').removeEventListener("keyup",this.keyUp)
        document.getElementById('contenteditable').removeEventListener("keydown",this.keyDown)
    },
    methods: {
        getChecked(item) {
            return this.value === item[this.nameFieldValue]
        },
        keyDown(e){
            if(e.key==='ArrowUp' || e.key==='ArrowDown') {
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.preventDefault();
                console.log(e.key);
                return false

            }

        },
        keyUp(e){




            if(e.key==='ArrowUp') {

                if(this.highlightIndex<=0) {
                    this.highlightIndex = this.itemList.length-1
                }
                else {
                    this.highlightIndex = this.highlightIndex-1;


                }
                //this.$refs.input[this.highlightIndex].click()

                //this.$emit('input', this.itemList[this.highlightIndex][this.nameFieldValue])

            }
            if(e.key==='ArrowDown') {

                if(this.highlightIndex===-1 || this.highlightIndex>=this.itemList.length-1) this.highlightIndex = 0

                else {
                    this.highlightIndex = this.highlightIndex+1;

                    //this.value = this.itemList[this.highlightIndex][this.nameFieldValue]
                }
                //this.$refs.input[this.highlightIndex].click()

                //this.$emit('input', this.itemList[this.highlightIndex][this.nameFieldValue])

            }
            if(e.key==='Enter') {



                this.$emit('input', this.itemList[this.highlightIndex][this.nameFieldValue])

            }



        }
    }
}
</script>

<style lang="scss">
.action-list {
    $self: &;
    $color-border: glob-color('info');
    $color-bg: glob-color('info-lighten');
    $transition: $glob-trans;
    $color-text: glob-color('secondary');
    $padding: calc-em(8) calc-em(25);

    &__input {
        @extend %visuallyhidden;



        &.highlight ~ #{$self}__text, &:checked ~ #{$self}__text {
            border-color: $color-border;
            background-color: $color-bg;
            font-weight: 700;
        }
    }

    &__item {
     /*   &.highlight {
            font-weight:bold;
        }*/
    }

    &__button {
        display: inline-block;
        width: 100%;
    }
    &__text {
        transition: $transition;
        position: relative;
        border: 0;
        border-left: 3px solid transparent;
        background-color: transparent;
        color: $color-text;
        padding: $padding;
        white-space: nowrap;
        text-decoration: none;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
    }
}
</style>
