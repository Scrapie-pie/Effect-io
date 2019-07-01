<template lang="pug">
    transition(name="btn")
        router-link(v-on="inputListeners" ,:class="classObject", :disabled="compDisabled" v-if="isRouter", :to="compRouterName")
            slot
        button(
            v-else-if="type!=='a'"
            v-on="inputListeners",
            :type="type",
            :class="classObject",
            :disabled="compDisabled"
            ref="btn",
            :title="getTitle"
        )
            //base-wait(:name="waitName")
            template(v-if="icon")
                base-icon(v-if="icon.name" ,:name="icon.name")
                span.btn__text-hidden(v-if="icon.textHidden" v-text="icon.textHidden")
            slot
        a(
            v-else
            :class="classObject",
        )
            slot
</template>

<script>
import lodash_isEmpty from 'lodash/isEmpty'

export default {
    props: {
        size: {
            type: String,
            required: false,
            default: ''
        },
        color: {
            type: String,
            required: false,
            default: ''
        },
        padding: {
            type: String,
            required: false,
            default: ''
        },
        icon: {
            type: Object,
            required: false,
            default: () => {}
        },

        waitName: {
            type: String,
            required: false,
            default: ''
        },
        loaded: {
            type: Boolean,
            required: false,
            default: true
        },
        theme: {
            type: String,
            required: false,
            default: ''
        },

        router: {
            type: Object,
            required: false
        },
        type: {
            type: String,
            required: false,
            default: 'button'
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },
        value: {
            type: String,
            required: false,
            default: ''
        }
    },
    computed: {
        wait() {
            return this.$wait.waiting(this.waitName)
        },
        compDisabled() {
            return this.disabled || this.wait
        },
        getTitle() {
            if (!lodash_isEmpty(this.icon)) {
                if (this.icon.textHidden) return this.icon.textHidden
            }
            return null
        },
        isRouter() {
            return !lodash_isEmpty(this.router)
        },
        compRouterName() {
            return this.router
        },

        classObject() {
            let obj = {}

            if (!lodash_isEmpty(this.theme)) {
                obj['btn btn_' + this.theme] = true
            } else {
                obj['btn'] = true
            }

            if (!lodash_isEmpty(this.padding)) {
                obj['btn_padding_' + this.padding] = true
            }

            if (!lodash_isEmpty(this.color)) {
                obj['btn_color_' + this.color] = true
            }

            if (!lodash_isEmpty(this.size)) {
                obj['btn_size_' + this.size] = true
            }

            if (this.compDisabled) {
                obj['btn_disabled'] = true
            }
            if (this.wait) {
                obj['btn_wait'] = true
            }

            if (!lodash_isEmpty(this.icon)) {
                if (this.icon.top) obj['btn_icon-top'] = true
                if (this.icon.box) obj['btn_icon-box'] = true
                else obj['btn_icon-no-box'] = true

                obj['btn_icon btn_' + this.icon.name] = true
            }

            return obj
        },
        inputListeners: function() {
            var vm = this
            // `Object.assign` объединяет объекты вместе, чтобы получить новый объект

            return Object.assign(
                {},
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
.btn {
    &_wait {
        animation: btn_wait 1.2s infinite;
        will-change: transform;
    }

    @keyframes btn_wait {
        0% {
            transform: scale(1);
            animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
        }

        50% {
            transform: scale(0.95);
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        }

        100% {
            transform: scale(1);
        }
    }

    &-leave-active,
    &-leave-to {
        display: none;
    }

    $color_bg-default: glob-color('default');
    $color_error: glob-color('error');

    $color_bg-main: glob-color('success');
    $color_text-main: glob-color('light');
    $color_border: glob-color('border');
    $padding: calc-em(7) calc-em(20);

    position: relative;

    display: inline-block;
    vertical-align: top;

    font-weight: 400;
    line-height: 1.2;
    cursor: pointer;
    text-align: center;
    text-decoration: none;

    border: 1px solid transparent;
    border-radius: 3px;
    background-color: $color_bg-main;
    padding: $padding;
    color: $color_text-main;

    transition-duration: 0.1s;

    will-change: transform;

    &:hover,
    &:disabled {
        opacity: 0.8;
    }
    &:disabled {
        cursor: default;
    }
    &:active:not(:disabled) {
        transform: translateY(1px);
    }

    &_size_lg {
        font-size: calc-em(15);
    }

    @each $i, $c in $glob-colors {
        &_color_#{$i} {
            background-color: $c;
        }
    }

    &_text,
    &_link {
        padding: 0;
        border: 0;
        background: none;
        color: inherit;
        font-weight: inherit;
    }

    &_link {
        text-decoration: underline;
    }

    &-arrow {
        padding-right: 20px;
        &__arrow {
            position: absolute;
            right: 0;
            top: 0;
            width: 20px;
            min-width: 20px;
            height: 20px;
            line-height: 20px;
            @extend %g-icon-down;
            @extend %g-icon-down_md;

            &_open {
                @extend %g-icon-down_open;
            }
        }
    }

    &_block {
        width: 100%;
    }

    &_sign {
        color: $color_text-main;
        border: 0;
        box-shadow: 0 -1px 14px 2px rgba(222, 163, 31, 0.53);
        font-weight: 600;
        background: #ff783c;
        background: linear-gradient(to right, #ff783c 0%, #ffb815 100%);
        padding: 1em 2em;
        border-radius: 2em;
    }

    &_default {
        // background-color:$color_bg-default;
        background-color: transparent;
        border-color: $color_border;
        color: inherit;
    }

    &_padding_xs {
        padding: 0 calc-em(10);
    }
    &_padding_xslr {
        padding-left: calc-em(10);
        padding-right: calc-em(10);
    }

    &_icon-no-box {
        border: 0;
        background-color: transparent;
        padding: 0 5px;
        color: inherit;
    }

    &__text-hidden {
        @extend %visuallyhidden;
    }

    &_icon-top {
        display: flex;
        flex-direction: column;
        align-items: center;

        .icon {
            width: 45px;
            height: 45px;
            margin-bottom: 0.5em;
        }
    }

    &_smiles {
        .icon {
            width: 16px;
            height: 16px;
        }
    }
    &_files {
        .icon {
            height: 15px;
        }
    }
    &_edit {
        padding: calc-em(7) calc-em(7);
        .icon {
            width: 15px;
            height: 15px;
        }
    }
}
</style>
