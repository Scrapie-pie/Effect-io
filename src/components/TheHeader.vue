<template lang="pug">
    header.header(:class="isAuth ? '' : 'header_notauth'")
        .header__inner
            .g-grid
                .header__main
                    a(href="/").header__logo
                        svg-inline.header__logo-img(src="/logo_text.svg")
                    ul.header__phones(v-if="!isAuth")
                        li.header__phone
                            a(href="tel:88002009058") 8 (800) 200 90 58
                            br.g-hidden
                        li.header__phone
                            a(href="tel:84957886646") 8 (495) 788 66 46
                    .header__user(v-else)
                        router-link(:to="{name:'profile'}").header__user-name.icon-left
                            app-icon(name="personal")
                            span(v-text="userName")

                        app-btn.btn-icon_exit(type="input" name="submit", @click="logout"  mode="iconBox" iconBoxName="exit" iconBoxText="Выход")

        app-nav-main(v-if="isAuth")

</template>

<script>

    import AppNavMain from '@/components/NavMain.vue'

    export default {

        components: {
            AppNavMain
        },

        created() {

        },
        methods: {
            logout() {
                this.$store.dispatch('user/logout')
                    .then(() => {
                        this.$router.push('/')
                        // document.querySelector('.site').classList.remove('site_overlay')
                    })
            }

        },
        computed: {
            userName() {
                if (this.$store.state.user.state_loaded) {
                    return this.$store.state.user.profile.shortName
                }

                return ''
            }

        }
    }
</script>

<style lang="scss">
    $el:'.header';
    #{$el}{

        &_notauth{
            #{$el}__inner #{$el}__logo path{fill:#fff;}
            #{$el}__inner{background:glob-color('main');}
            #{$el}__main{padding-right:6em;}
        }
        &__inner{
            background:glob-color('light');
            transition:$trans;
        }
        &__main{
            height:100px;
        }

        &__main, &__phones{
            display:flex;
            align-items:center;
            justify-content:space-between;
        }

        &__logo{
            margin-top:-1em;
            max-width:337px;
            display:block;
            border-bottom:0;
        }

        &__phones{
            color:glob-color('light');
            font-weight:700;
        }
        &__phone{
            white-space:nowrap;
            font-size:$fsz_h3;
            margin-left:em(6);
            margin-top:em(1);
        }

        &__user{
            display:flex;
            align-items:center;
        }
        &__user-name{
            margin-right:em(5);
            border-bottom:0;
        }
    }
</style>
