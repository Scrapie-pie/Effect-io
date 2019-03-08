<template lang="pug">
    .base-people(:class="classObject")
        .base-people__avatar-wrap
            base-avatar.base-people__avatar(
                :width="avatarWidth",
                :url="avatarUrl",
                :stub="avatarStub",
                :name="avatarName"
            )
            base-icon(:name="channelName").base-people__channel
            .base-people__status(
                v-if="status!=null",
                :class="classStatus",
                :title="statusText"
                )
        .base-people__inner
            .base-people__header
                strong.base-people__name(v-html="name")
                time.base-people__time(
                v-if="time"
                )
                    |{{time | formatTime}}
                base-count.base-people__count(:count="count")
            p.base-people__text(
                v-if="text"
                v-html="text"
            )
            p.base-people__img(v-if="img")
                img(
                    :src="img"
                    alt=""
                     @click="$root.$emit('popup-img',img)"
                )
            figure.base-people__files(v-if="files.length")
                ul.base-people__files-list
                    li.base-people__files-item(v-for="(item, index) in files" :key="item.link")
                        img(
                            v-if="item.link_min",
                            :src="item.link_min",
                            :alt="item.name",
                            @click="$root.$emit('popup-img',item.link)"
                        )
                        a(
                            v-else
                            v-text="item.name",
                            :href="item.link"
                            target="_blank"
                        )

</template>

<script>
    import moment from 'moment'
    import BaseCount from '@/components/BaseCount';
    export default {
        components: {
            BaseCount
        },
        filters: {
            formatTime: function (value) {

                if (value) {
                    //let date = moment(value*1000)
                    return moment(value*1000).format('HH:mm:ss')

                } else {
                    return ''
                }

            }
        },
        props: {
            status:{
                type:Number,
                default:null,
                validator: function (value) {
                    return [0,1,2,3].indexOf(value) !== -1
                }
            },
            img: false,
            right: Boolean,
            channelName: String,
            count: {
                type:Number,
                default:0,
            },
            bgTextNoFill: Boolean,
            name: String,
            text: String,
            time: Number,
            avatarWidth: String,
            avatarUrl: String,
            avatarStub:String,
            avatarName:String,
            type: {
                type:String,
                validator: function (value) {
                    return ['visitor', 'operator'].indexOf(value) !== -1
                }
            },
            files:{
                type:Array,
                default:function () {
                    return []
                },

            },
        },
        data() {
            return {}
        },
        created() {


        },
        computed: {
            statusText() {
                let text;
                switch (this.status) {
                    case 1:
                        text = 'В сети (онлайн)';
                        break;
                    case 2:
                        text = 'Перерыв';
                        break;
                    case 3:
                        text = 'Обед';
                        break;

                    default:
                        text = 'Не в сети (оффлайн)';
                        break;
                }
                return text;
            },
            classStatus(){
                return 'base-people__status_'+this.status
            } ,
            classObject() {
                let parentClass = 'base-people';
                let obj = {}
                obj[`${parentClass}_right`]=!!this.right;
                obj[`${parentClass}_bg-text_no_fill`]=!!this.bgTextNoFill;
                obj[`${parentClass}_${this.type}`]=!!this.type;
                return obj
            },

        }
    }
</script>

<style lang="scss">

    .base-people{
        $color_online:glob-color('success');
        $color_break:#d7c502;
        $color_lunch:glob-color('error');
        $color_offline:glob-color('secondary');

        $self:&;
        $ml:calc-em(5);
        $border-raduis:$glob-border-radius;
        $padding:calc-em(15);
        $color_bg:glob-color('info-light');
        $color_bg-error:glob-color('error');
        $color_name:glob-color('secondary');
        $small:$glob-font-size_small;
        display:flex;
        align-items:center;

        &__status{
            position:absolute;
            bottom:0;
            right:0;
            width:14px;
            height:14px;
            border-radius:50%;
            background-color:$color_offline;

            &_1{ background-color:$color_online; }
            &_2{ background-color:$color_break; }
            &_3{ background-color:$color_lunch; }
        }

        &__status {
            &_online{ background-color:$color_online; }
            &_break{ background-color:$color_break; }
            &_lunch{ background-color:$color_lunch; }
        }


        /* width:100%;*/

        &__header {
            margin-bottom:calc-em(5);
            display:flex;
            align-items:flex-end;
        }

        &__count{
            float:right;
            flex:0 0 auto;
            margin-left:calc-em(10);
        }

        &__avatar{
            flex:0 0 auto;
        }



        &__avatar-wrap{
            display:inline-block;
            position:relative;

            margin-right:$ml;

            #{$self}_right & {
                order:1;
                margin-left:$ml;
                margin-right:0;
            }

        }
        &__channel{
            position:absolute;
            bottom:-3px;
            right:-3px;
            z-index:1;
            .icon{
                width:24px;
                height:24px;
            }
        }

        &__inner{

            border-radius:$border-raduis;
            background-color:$color_bg;
            padding:$padding;

        }

        &_warning &__inner { background-color:$color_bg-error}

        &_operator &__name {
            white-space:normal;
        }

        &_bg-text_no_fill &__inner{ background-color:transparent }

        &__time{
            padding:0 ($padding / 2);
            font-size:$small;
        }
        &__name{
            color:$color_name;
            font-weight:bold;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        &__text{
            white-space:nowrap;
            text-overflow:ellipsis;
            overflow:hidden;


        }
        &__text + &__img {margin-top:calc-em(15)}
        &__img {
            img {
                max-width:230px;
                cursor:pointer;
            }
        }

        &_visitor &__inner, &_operator &__inner{
            background-color:transparent;
        }

        &__files-item {
            margin-top:calc-em(10)
        }
    }
</style>