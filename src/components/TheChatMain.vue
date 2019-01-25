<template lang="pug">
    article.chat-main
        the-chat-main-header.chat-main__header
        scroll-bar.chat-main__body
            ul.chat-main__list
                li.chat-main__item
                    time.chat-main__date 29 ноября 2017

                    ul.chat-main__messages
                        li.chat-main__messages-item(v-for="(item, index) in messageList",:key="index" :class="{'chat-main__messages-item_right':item.right}")
                            base-people(
                                avatar-width="md",
                                :name="item.name",
                                :text="item.text",
                                :datetime="item.datetime",
                                :right="item.right",
                                :img="item.img"
                            )
                    the-chat-system-messages
        footer.chat-main__footer
            the-chat-main-footer

</template>

<script>
    import TheChatSystemMessages from '@/components/TheChatSystemMessages'
    import TheChatMainHeader from '@/components/TheChatMainHeader'
    import TheChatMainFooter from '@/components/TheChatMainFooter'
    import autosize from 'autosize'
    export default {
        components:{
            TheChatSystemMessages,
            TheChatMainHeader,
            TheChatMainFooter
        },
        data() {
            return {


                messageList: [
                    {name: 'Петр Иванов', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47,right:true},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47,right:true},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47,right:true},
                    {name: 'Петр Иванов', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47,right:true},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47,right:true},
                    {name: 'Петр Иванов', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47,right:true},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47,right:true},
                    {name: 'Петр Иванов', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47,right:true},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47,right:true},
                    {name: 'Петр Иванов', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47,right:true},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47,img:'http://dl4.joxi.net/drive/2019/01/25/0004/2024/276456/56/81f74a2997.jpg'},
                ],


            }
        },
        mounted() {
            setTimeout(() => {
                autosize(this.$refs.chatInput);
            }, 5000)


        },
        created() {


        },
        methods: {

        },


    }
</script>

<style lang="scss">
    .chat-main{
        $color_border:glob-color('border');
        $color_bg_date:glob-color('light');

        display:flex;
        flex-flow:column;
        height:100%;


        &__body{
            margin-top:auto;
            height:auto;

        }
        &__list,&__header {
            padding-right:calc-em(15);

        }

        &__date{
            position:relative;
            display:block;
            text-align:center;
            margin:0 0 1.5em;

            &::before{
                content:'';
                border-top:1px solid $color_border;
                position:absolute;
                left:0;
                right:0;
                top:50%;
                z-index:-1;
            }
            &::after{
                content:'';
                display:block;
                @extend %full-abs;
                z-index:-1;
                margin:0 auto;
                width:98px;
                background:$color_bg_date;
            }
        }

        &__messages{
            margin-bottom:calc-em(25);
        }
        &__messages-item{
            & + &{
                margin-top:calc-em(15);
            }

            .base-people {

                align-items:flex-start;
            }

            &_right {
                text-align:right;
                .base-people {
                    display:inline-flex;

                }
            }

        }



    }
</style>