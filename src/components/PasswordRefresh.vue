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
            li.password-refresh__col
                base-btn.password-refresh__btn(@click="save") Сохранить пароль
    
</template>

<script>
export default {
    name: "password-refresh",

    data() {
        return {
            model: {
                password: '',
                confirm_password: '',
                user_id: ''
            }

        }
    },
    created(){
        this.setUserId()
    },
    methods:{
        setUserId() {
            if( this.$route.params.id ) this.model.user_id = this.$route.params.id;
            else this.model.user_id = this.$store.getters['user/profile'].user_id
        },
        save(){
            this.$http.put('user-password-update', this.model)
                .then(({ data }) => {
                console.log(data);
            }).catch(({ response }) => {
                console.log(response);
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