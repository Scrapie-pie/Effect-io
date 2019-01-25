<template lang="pug">
    form.last-messages
        .last-messages__search
            base-field(type="search" name="search" v-model="search" theme="soft")
        scroll-bar.scroll-bar(v-once)
            .last-messages__scroll-bar
                ul.last-messages__list
                    li.last-messages__item(v-for="(item, index) in peopleList",:key="index")
                        button.last-messages__btn(type="button" v-text="`${item.name}:${item.text}`")
                        base-people.last-messages__people(
                        :name="item.name"
                            :text="item.text"
                                :bg-text-no-fill="true"
                                :channel-name="item.channel"
                        hidden
                        )
</template>

<script>
    export default {
        data() {
            return {
                peopleList: [
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', channel: 'vk'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', channel: 'fbme'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', channel: 'chat'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', channel: 'tg'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', channel: 'vk'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},

                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},

                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},

                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},

                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?'},
                ],


            }
        },
    }
</script>

<style lang="scss">

    .last-messages{
        $color_bg-hover:glob-color('border');
        $transition:$glob-trans;
       // height:100%;

        &__search{
            padding-left:calc-em(10);
            padding-right:calc-em(10);
        }

        &__list{
            padding-top:calc-em(10);
        }

        &__item{
            position:relative;
            transition:$transition;
            padding-left:calc-em(10);
            &:hover{
                background:$color_bg-hover;
            }

        }
        &__people{
            z-index:1;
            position:relative;

            .base-people__inner{
                flex:1 0 60%;
                width:60%;
            }
        }
        &__btn{
            @extend %full-abs;
            z-index:2;
            width:100%;
            height:100%;
            background-color:transparent;
            border-color:transparent;
            font-size:0;
        }
    }


</style>