<template lang="pug">
    transition
        router-link(v-on="inputListeners" ,:class="classObject", :disabled="disabled" v-if="isRouter", :to="compRouterName")
            slot
        button(
            v-else
            v-on="inputListeners",
            :type="type",
            :class="classObject",
            :disabled="disabled"
            ref="btn",
            :title="getTitle"
        )
            template(v-if="icon")
                base-icon(:name="icon.name")
                span.btn__text-hidden(v-if="icon.textHidden" v-text="icon.textHidden")
            slot
</template>

<script>
    import _ from 'underscore'

    export default {
        props: {
            size:String,
            color:String,
            padding: String,
            icon: Object,


            loaded: {
                required: false,
                default: true
            },
            theme: {
                required: false,
                default: ''
            },

            router: {
                required: false,
                default: ''
            },
            type: {
                required: false,
                default: 'button'
            },
            disabled: {
                required: false,
                default: false
            },
            value: {
                required: false,
                default: ''
            }

        },
        computed: {
            getTitle(){
                if (!_.isEmpty(this.icon)) {
                    if (this.icon.textHidden) return this.icon.textHidden
                }
            },
            isRouter() {
                return !_.isEmpty(this.router)
            },
            compRouterName() {
                return this.router
            },

            classObject() {

                let obj = {


                   /* 'spinner spinner_sm': this.loaded*/
                }

                if (!_.isEmpty(this.theme)) {
                    obj['btn btn_' + this.theme] = true;
                } else {
                    obj['btn'] = true;
                }

                if (!_.isEmpty(this.padding)) {
                    obj['btn_padding_' + this.padding] = true;
                }

                if (!_.isEmpty(this.color)) {
                    obj['btn_color_' + this.color] = true;
                }

                if (!_.isEmpty(this.size)) {
                    obj['btn_size_' + this.size] = true;
                }

                if (!_.isEmpty(this.icon)) {

                    if (this.icon.top) obj['btn_icon-top'] = true;
                    if (this.icon.box) obj['btn_icon-box'] = true;
                    else obj['btn_icon-no-box'] = true

                    obj['btn_icon btn_' + this.icon.name] = true;
                }


                return obj
            },
            inputListeners: function () {
                var vm = this
                // `Object.assign` объединяет объекты вместе, чтобы получить новый объект

                return Object.assign({},
                    // Мы добавляем все слушатели из родителя
                    this.$listeners,
                    // Затем мы можем добавить собственные слушатели или
                    // перезаписать поведение некоторых существующих.
                    {}
                )
            }
        }
    }
</script>

<style lang="scss">
    .btn{
        $color_bg-default:glob-color('default');
        $color_error:glob-color('error');

        $color_bg-main:glob-color('success');
        $color_text-main:glob-color('light');
        $color_border:glob-color('border');
        $padding:calc-em(7) calc-em(20);

        position:relative;

        display:inline-block;
        vertical-align:top;

        font-weight:400;
        line-height:1.2;
        cursor:pointer;
        text-align:center;
        text-decoration:none;

        border:1px solid transparent;
        border-radius:3px;
        background-color:$color_bg-main;
        padding:$padding;
        color:$color_text-main;

        transition-duration:.1s;

        will-change:transform;

        &:hover {
            opacity:.8;
        }
        &:active {
            transform:translateY(1px);
        }


        &_size_lg {
            font-size:calc-em(15);
        }

        @each $i, $c in $glob-colors {
            &_color_#{$i} {
                background-color: $c;
            }
        }

        &_error {
            background-color:$color_error;
        }

        &_text,&_link {
            padding:0;
            border:0;
            background:none;
            color:inherit;
            font-weight:inherit;
        }

        &_link {
            text-decoration:underline;
        }

        &-arrow {
            padding-right:20px;
            &__arrow {
                position:absolute;
                right:0;
                top:0;
                width:20px;
                min-width:20px;
                height:20px;
                line-height:20px;
                @extend %g-icon-down;
                @extend %g-icon-down_md;

                &_open {
                    @extend %g-icon-down_open;
                }
            }

        }

        &_block{
            width:100%;
        }

        &_sign{
            color:$color_text-main;
            border:0;
            box-shadow:0 -1px 14px 2px rgba(222, 163, 31, .53);
            font-weight:600;
            background:#ff783c;
            background:linear-gradient(to right, #ff783c 0%, #ffb815 100%);
            padding:1em 2em;
            border-radius:2em;
        }

        &_default{
            // background-color:$color_bg-default;
            background-color:transparent;
            border-color:$color_border;
            color:inherit;
        }

        &_padding_xs{
            padding:0 calc-em(10);
        }

        &_icon-no-box{
            border:0;
            background-color:transparent;
            padding:0 5px;
            color:inherit;
        }



        &__text-hidden {
            @extend %visuallyhidden;
        }

        &_icon-top {
            display:flex;
            flex-direction:column;
            align-items:center;

            .icon {
                width:45px;
                height:45px;
                margin-bottom:.5em;
            }

        }


        &_smiles{
            .icon{
                width:16px;
                height:16px;
            }
        }
        &_files{
            .icon{
                height:15px;
            }
        }
        &_edit{
            padding:calc-em(7) calc-em(7);
            .icon{
                width:15px;
                height:15px;
            }
        }
    }
</style>