<template lang="pug">
    scroll-bar.client-info
        base-people(:name="clientInfo.name" :text="clientInfoContacts" :bg-text-no-fill="true" :avatar-url="info.photo")
        .client-info__social-links
            social-links
        .client-info__scrollbar
            form(@change="guestUpdateByOperator")
                ul.client-info__list
                    li.client-info__item.client-info__item_textarea

                        base-field(
                        v-model="info.comment"
                        theme="soft"
                        ref="clientComment"
                        type="textarea"
                        placeholder="Вы можете оставить комментарий к этому диалогу" maxlength="500"
                        )

                    li.client-info__item

                        h4.client-info__name(@click="showContacts=!showContacts")
                            | Дополнительные контакты
                            span.client-info__arrow(:class="{'client-info__arrow_open':showContacts}")
                        transition(name="fade")
                            form(v-show="showContacts")
                                ul.client-info__sub
                                    li.client-info__sub-item
                                        base-field(
                                            v-model="info.additional_contact_1"
                                            theme="soft"
                                            name="additional_contact_1"
                                            placeholder="E-mail, тел или другой контакт"
                                        )
                                    li.client-info__sub-item
                                        base-field(
                                            v-model="info.additional_contact_2"
                                            theme="soft"
                                            name="additional_contact_1"
                                            placeholder="E-mail, тел или другой контакт"
                                        )
                                    li.client-info__sub-item
                                        base-field(
                                            v-model="info.additional_contact_3"
                                            theme="soft"
                                            name="additional_contact_1"
                                            placeholder="E-mail, тел или другой контакт"
                                        )
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
                uuid:'03ba07f5-2757-50eb-a35d-80a496e9a343',
                site_id:1,
                showContacts: false,
                showAudienceSegments: false,
                clientInfo: {
                    name: 'Петр Иванов Камикадзев',
                    phone: '+7 911 567 55 77',
                    email: 'petr@gmail.com'
                },
                audienceSegments: [
                    {name: 'Пол', text: 'мужской'},
                    {name: 'Восраст', text: '26'},
                    {name: 'Интересы', text: 'Интерес к автомобилям по маркам (Марка не определена)'},
                ],

            }
        },
        computed: {
            info(){
                return this.clientInfo
            },
            infoList(){
                return [
                    {name: 'Пол', text: `На сайте ${this.info.online_time}, заходил ${this.info.visits_count} раз`},
                    {name: 'Восраст', text: this.info.key_phrases+', запрос "'+this.info.key_phrases+'" '+this.info.country+' '+this.info.city},
                    {name: 'Интересы', text: this.info.browser+', '+ this.info.browser+', '+ this.info.device},
                    {name: 'ip', text: 'IP' + this.info.ip},
                    {name: 'Интересы', text: `Последнее обращение через: ${this.channelName}`},
                ]
            },
            clientInfoContacts() {
                let phone = `<div><a href="tel:${this.clientInfo.phone}">${this.clientInfo.phone}</a></div>`,
                    email = `<div><a href="mailto:${this.clientInfo.mail}">${this.clientInfo.mail}</a></div>`;
                return phone + email;

            },
            channelName() {
                let text, textShort, name;
                console.log(this.status);
                switch (this.info.channel_type) {
                    case 1:
                        text = '1';
                        break;
                    case 2:
                        text = 'VK';
                        break;
                    case 3:
                        text = 'FB';
                        break;
                    case 4:
                        text = 'SLACK';
                        break;
                    case 5:
                        text = 'TG';
                        break;
                    case 6:
                        text = 'VIBER';
                        break;
                    case 7:
                        text = 'SITE2';
                        break;
                    case 8:
                        text = 'SLACKIO';
                        break;
                    case 9:
                        text = 'ZENDESK';
                        break;
                    case 10:
                        text = 'AMO';
                        break;
                    case 11:
                        text = 'SALESFORCE';
                        break;
                    case 12:
                        text = 'OPENAPI';
                        break;
                    case 13:
                        text = 'whatsapp';
                        break;

                    default:
                        text = '-';

                        break;
                }
                return text
            }
        },
        created(){
            this.$http.get('guest-info', {
                params:{
                    uuid:this.uuid,
                    site_id:this.site_id
                }}).then(({data})=>{
                this.clientInfo= data.data;
                console.log(data.data);
            })
        },
        mounted() {
            setTimeout(()=>{
                autosize(this.$refs.clientComment.$refs.input);
            },500)

        },
        beforeDestroy(){
            autosize.destroy(this.$refs.clientComment.$refs.input);
        },
        methods:{
            guestUpdateByOperator(){
                this.$http.put('guest-update-by-operator', {
                        guest_uuid:this.uuid,
                        site_id:this.site_id,
                        comment:this.info.comment,
                        additional_contact_1:this.info.additional_contact_1,
                        additional_contact_2:this.info.additional_contact_2,
                        additional_contact_3:this.info.additional_contact_3,
                    }).then(({data})=>{
                    console.log(data);
                })
            }
        }


    }
</script>

<style lang="scss">
    .client-info{
        max-height:90vh;

        &__scrollbar {
            height:100%;
        }

        &__item{
            margin-bottom:calc-em(30);

            &_textarea {
                .field__input {
                    height:auto;
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