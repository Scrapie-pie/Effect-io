<template lang="pug">
    transition
        span(v-if="status==0", :class="loaderMessageClass" title="Доставляется")
        base-icon(v-if="status==1", name="check"  :class="loaderMessageClass" title="Доставлено")
        base-icon(v-if="status==2", name="prohibition"  :class="loaderMessageClass" title="Не доставлено")
</template>

<script>
export default {
    name: "loader-message",
    props: {
        status: {
            type: Number,
            default: -1,
            validator: function (value) {
                return [-1,0, 1, 2].indexOf(value) !== -1
            }
        },
    },
    data() {
        return {}
    },
    computed: {
        loaderMessageClass(){

            if(this.status==0) return 'loader-message spinner spinner_xs'
            return 'loader-message loader-message_'+this.status
        },


    }
}
</script>

<style lang="scss">
    .loader-message{

            &::after {
                position:absolute;
                content:'';
            }
            &.spinner {
                width:16px;
            }
            &.spinner:before {
                width:14px;
                height:14px;
                margin-top:-14px;
                margin-left:-7px;
            }
            &_1 {
                .icon {
                    width:10px;
                    height:7px;
                    fill:glob-color('success');
                    transform:translateY(-3px);
                }
            }
            &_2 {
                .icon {
                    width: 12px;
                    height: 14px;

                }
            }


    }
</style>