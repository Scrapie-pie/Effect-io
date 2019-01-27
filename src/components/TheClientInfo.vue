<template lang="pug">
    scroll-bar.client-info
        base-people(:name="clientInfo.name" :text="clientInfoContacts" :bg-text-no-fill="true")
        .client-info__social-links
            social-links
        .client-info__scrollbar
            ul.client-info__list
                li.client-info__item.client-info__item_textarea

                    base-field(theme="soft" ref="clientComment" type="textarea" placeholder="Вы можете оставить комментарий к этому диалогу" maxlength="100")

                li.client-info__item

                    h4.client-info__name(@click="showContacts=!showContacts")
                        | Дополнительные контакты
                        span.client-info__arrow(:class="{'client-info__arrow_open':showContacts}")
                    transition(name="fade")
                        form(v-show="showContacts")
                            ul.client-info__sub
                                li.client-info__sub-item
                                    base-field(theme="soft" name="" placeholder="E-mail, тел или другой контакт")
                                li.client-info__sub-item
                                    base-field(theme="soft" name="" placeholder="E-mail, тел или другой контакт")
                                li.client-info__sub-item
                                    base-field(theme="soft" name="" placeholder="E-mail, тел или другой контакт")
                li.client-info__item
                    ul.client-info__sub
                        li.client-info__sub-item(v-for="(item, index) in infoList",:key="index")
                            | {{item.text}}
                li.client-info__item(@click="showAudienceSegments=!showAudienceSegments" v-if="0")
                    h4.client-info__name Аудиторные сегменты
                        span.client-info__arrow(:class="{'client-info__arrow_open':showAudienceSegments}")
                    transition(name="fade")
                        ul.client-info__sub(v-show="showAudienceSegments")
                            li.client-info__sub-item(v-for="(item, index) in audienceSegments",:key="index")
                                | {{item.name}} : {{item.text}}
</template>

<script>

    import SocialLinks from '@/components/SocialLinks';

    import autosize from 'autosize'


    export default {
        components: {

            SocialLinks
        },
        data() {
            return {
                showContacts: false,
                showAudienceSegments: false,
                clientInfo: {
                    name: 'Петр Иванов',
                    phone: '+7 911 567 55 77',
                    email: 'petr@gmail.com'
                },
                audienceSegments: [
                    {name: 'Пол', text: 'мужской'},
                    {name: 'Восраст', text: '26'},
                    {name: 'Интересы', text: 'Интерес к автомобилям по маркам (Марка не определена)'},
                ],
                infoList: [
                    {name: 'Пол', text: 'На сайте 30 мин, 43 сек., заходил 5 раз'},
                    {name: 'Восраст', text: 'yandex.ru, запрос "купить кеды" Росиия, Москва'},
                    {name: 'Интересы', text: 'Google Chrome, Windows 10, PC'},
                    {name: 'ip', text: 'IP: 109.252.7,38'},
                    {name: 'Интересы', text: 'Последнее обращение через: ВКонтакте'},
                ]
            }
        },
        computed: {
            clientInfoContacts() {
                let phone = `<div><a href="tel:${this.clientInfo.phone}">${this.clientInfo.phone}</a></div>`,
                    email = `<div><a href="mailto:${this.clientInfo.email}">${this.clientInfo.email}</a></div>`;


                return phone + email;

            }
        },
        created(){

        },
        mounted() {
            setTimeout(()=>{
                autosize(this.$refs.clientComment.$refs.input);
            },500)


        },
        beforeDestroy(){
            autosize.destroy(this.$refs.clientComment.$refs.input);
        },


    }
</script>

<style lang="scss">
    .client-info{
        max-height:90vh;
        &__scrollbar {
            height:100%;
        }
        &__scrollbar-textarea {

        }
        &__item{
            margin-bottom:calc-em(30);

            &_textarea {
                .field__input {
                    max-height:5em;

                }
            }
        }
        &__sub-item{
            margin-bottom:calc-em(5);
        }
        &__name{
            display:flex;
            align-items:center;
            cursor:pointer;
            font-weight:400;
            margin-bottom:calc-em(15);
        }
        &__arrow{
            @extend %g-icon-down;
            @extend %g-icon-down_md;

            height:15px;
            width:15px;
            line-height:15px;
            min-width:15px;
            margin-left:5px;


            &_open{
                @extend %g-icon-down_open
            }
        }
        &__social-links{
            margin-left:70px;
            margin-bottom:calc-em(20);
        }
    }

</style>