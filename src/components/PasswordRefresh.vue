<template lang="pug">
    fieldset.password-refresh
        ul.password-refresh__row
            li.password-refresh__col
                base-field.password-refresh__control.password-refresh__field(
                    label="Придумайте пароль",
                    type="password",
                    name="password"
                    v-model="model.password"
                    v-validate="'max:32|min:6'"
                    data-vv-as="пароль"
                )
            li.password-refresh__col
                base-field.password-refresh__control.password-refresh__field(
                    label="Повторите пароль",
                    type="password",
                    name="passwordConfirm"
                    v-model="model.confirm_password"
                    v-validate="{required: true, confirmed: model.password}"
                    data-vv-as="пароль 2"
                )
            li.password-refresh__col(v-if="hideBtn")
                base-btn.password-refresh__btn(@click="save") Сохранить пароль
    
</template>

<script>
export default {
    name: "password-refresh",
    props:{
        hideBtn:{
            type:Boolean,
            default:false,
        }
    },
    data() {
        return {

            model: {
                password: '',
                confirm_password: '',
                user_id: ''
            }

        }
    },

    watch:{
        'model.confirm_password'(val){
            if(val === this.model.password) this.$emit('getPassword',val)

        }
    },
    methods:{
        setUserId() {
            this.model.user_id = this.$route.query.user_id;
            if(!this.model.user_id) {
                this.model.user_id = this.$store.getters['user/profile'].user_id;
            }

        },
        save(){
            this.setUserId()
            this.$http.put('user-password-update', this.model)
                .then(({ data }) => {
                this.password='';
                this.confirm_password='';
            }).catch(({ response }) => {
                this.password='';
                this.confirm_password='';
            })
        }
    }
}
</script>

<style lang="scss">
    .password-refresh {
        &__row {
            @extend %row-flex;

        }
        &__col {
            width:100%;
        }
        &__btn {
            transform:translateY(calc-em(4));
        }
    }
</style>