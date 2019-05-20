<template lang="pug">
        form.chat-main-footer.js-dragDrop

            ///the-chat-system-messages

            TheProcessActions(v-if="compShowProcess")
            fieldset.chat-main-footer__fieldset(v-else)
                .chat-main-footer__box-control
                    box-controls(v-if="showMention", @boxControlClose="showMention=false")
                        select-operators(name="mention")
                    box-controls(v-if="showPhrases", @boxControlClose="showPhrases=false")
                        the-phrases-ready
                    box-controls(v-if="showSmiles", @boxControlClose="showSmiles=false")
                        the-files-board(name="smiles", @getSmile="setMessageSmile")
                    //box-controls(v-if="showGifs", @boxControlClose="showGifs=false")
                        the-files-board(name="gifs")
                    box-controls(v-if="showOffer", @boxControlClose="showOffer=false")
                        the-offer()

                .chat-main-footer__contols
                    .chat-main-footer__textarea-wrap
                        the-phrases-select(
                            v-if="viewModeChat=='visitors'"
                            :filter-search="message" ,
                            @resultText="getPhrasesSelectText"
                        ).chat-main-footer__phrases-select
                        scroll-bar.chat-main-footer__scrollbar(ref="scrollbarMessage" )
                            textarea.chat-main-footer__input(
                                placeholder="Enter - отправить сообщение, Shift+Enter - новая строка."
                                ref="chatInput",
                                v-model="message",
                                @keydown.enter.exact="onEnter",
                                @click.prevent="messageRead"

                            )
                            upload-file-list(
                                :item-list="uploadFileList",
                                @itemRemove="(index)=>uploadFileList.splice(index, 1)"
                            )
                ul.chat-main-footer__buttons
                    //li.chat-main-footer__button(v-if="viewModeChat=='common'")
                        base-btn(
                            :icon="{name:'user',textHidden:'Упомянуть в диалоге'}",
                            @click.prevent="showMention=true"
                        )
                    li.chat-main-footer__button(v-if="viewModeChat=='visitors'")
                        base-btn(
                            :icon="{name:'phrases',textHidden:'Список готовых шаблонных фраз'}",
                            @click.prevent="showPhrases=true"
                        )
                    li.chat-main-footer__button.chat-main-footer__button_offer(v-if="viewModeChat=='visitors'")
                        base-btn(
                            :icon="{name:'more-fill',textHidden:'Предложить посетителю'}",
                            @click.prevent="showOffer=true"
                        )
                    //li.chat-main-footer__button
                        base-btn(
                            :icon="{name:'smiles',textHidden:'Смайлы'}"
                            @click.prevent="showSmiles=true"
                        )
                    li.chat-main-footer__button
                        upload-file(@upload="(val)=>uploadFileList.push(val)")
                    //li.chat-main-footer__button
                        base-btn(
                            :icon="{name:'gifs',textHidden:'Гифки'}"
                            @click.prevent="showGifs=true"
                        )
                    li.chat-main-footer__button.chat-main-footer__button_send
                        base-btn.chat-main-footer__send(
                            @click="send"
                            :icon="{name:'send',textHidden:'Отправить сообщение'}"
                        )
</template>

<script>

    import SelectOperators from '@/components/SelectOperators'
    import TheOffer from '@/components/TheOffer'
    import TheFilesBoard from '@/components/TheFilesBoard'
    import ThePhrasesReady from '@/components/ThePhrasesReady'
    import ThePhrasesSelect from '@/components/ThePhrasesSelect'
    import TheProcessActions from '@/components/TheProcessActions'
    import UploadFile from '@/components/UploadFile'
    import UploadFileList from '@/components/UploadFileList'

    import autosize from 'autosize'
    import { viewModeChat,httpParams } from '@/mixins/mixins'

    export default {
        components:{
            SelectOperators,
            TheOffer,
            TheFilesBoard,
            ThePhrasesReady,
            ThePhrasesSelect,
            TheProcessActions,
            UploadFile,
            UploadFileList,
        },
        mixins:[viewModeChat,httpParams],
        watch:{
            '$route' (to, from) {
                this.checkIsProcessPage();
            },
            message(val){
                console.log('message',val,this.autosizeInit);
                if(val && this.autosizeInit){
                    autosize(this.$refs.chatInput);
                    this.autosizeInit=false;
                }
                if(val && this.showPhrasesSelectAllow){

                    this.showPhrasesSelect=true;
                }
            },
            uploadFileList(val){
                console.log(val);
            }
        },

        data() {
            return {
                autosizeInit:true,
                showMention:false,
                showProcess:false,
                showGifs:false,
                showOffer:false,
                showSmiles:false,
                showPhrases:false,

                showPhrasesSelect:false,
                showPhrasesSelectAllow:true,
                message:'',
                uploadFileList:[]
            }
        },
        computed:{
            compShowProcess(){
                return this.showProcess
            }
        },
        mounted() {
        },
        beforeDestroy(){
            autosize.destroy(this.$refs.chatInput);
        },
        created() {
            this.checkIsProcessPage()
        },
        methods: {
            setMessageSmile(emoji){
                const textarea = this.$refs.chatInput;
                const cursorPosition = textarea.selectionEnd;
                const start = this.message.substring(0, textarea.selectionStart)
                const end = this.message.substring(textarea.selectionStart)

                this.message=start + emoji.native + end;
                textarea.focus();
                this.$nextTick(() => {
                    textarea.selectionEnd = cursorPosition + emoji.native.length
                })
            },
            getPhrasesSelectText(val){
                autosize.destroy(this.$refs.chatInput);
                this.message=val;
                this.$refs.chatInput.focus()
            /*
                this.autosizeInit=true;*/
                setTimeout(()=>{ //Todo костыль
                    autosize(this.$refs.chatInput);
                    this.$refs.scrollbarMessage.update()
                },300)
            },
            messageRead(){
                if(this.viewModeChat ==='operators') {
                    this.$http.put('message-operator-guest-mark-as-read', {
                        user_id:this.httpParams.params.id
                    });
                    this.$store.dispatch('setMessageRead', {
                            id:this.httpParams.params.id,
                            type:this.viewModeChat
                        }
                    );
                } //Todo у оператора
                if(this.viewModeChat ==='visitors'){
                    this.$http.put('message-operator-guest-mark-as-read', {
                        room_id:this.$store.state.roomActiveId
                    });
                    this.$store.dispatch('setMessageRead', {
                            uuid:this.httpParams.params.uuid,
                            site_id:this.httpParams.params.site_id,
                            type:this.viewModeChat
                        }
                    );
                }
                if(this.viewModeChat ==='common'){
                    this.$http.put('message-operator-guest-mark-as-read', {
                        room_id:this.$store.state.user.profile.common_room_id
                    });

                    this.$store.commit('user/unreadUpdate',['common','clear'])
                }
            },
            onEnter: function (e) {
                e.stopPropagation();
                e.preventDefault();
                e.returnValue = false;
                this.input = e.target.value;
                this.send();
                this.messageRead()
            },
            send(){
                let data = {},
                    to_id,
                    files=[],
                    body = this.message;


                if(this.viewModeChat=="visitors") {

                 let {guest_uuid,site_id} = this.httpParams.params;

                    data = {
                        guest_uuid,
                        site_id,
                        delivery_status:0,
                    }

                    let val = this.httpParams.params
                    this.$store.commit('visitors/messageHot',{val,set:false})

                } else if(this.viewModeChat==="operators") {

                    to_id = + this.httpParams.params.id;
                    data = {
                        to_id,
                        delivery_status:1,
                    }

                }
                else if(this.viewModeChat==="common") {
                    data.room_id = this.$store.state.user.profile.common_room_id;
                    data.delivery_status=1;
                }

                data.body=body;

                if(this.uploadFileList.length) {
                    files = this.uploadFileList.map(item=>{

                        item.name=item.src.name;
                        delete item.src
                        return item
                    })
                    data.files=files;
                }


                if (!body && !files.length) return
                this.$http.post('message-send', data).then((responsive)=>{

                    console.log('message-send',responsive.data.data.id);
                    let {id} = responsive.data.data;

                    let {first_name:name,photo,employee_id} = this.$store.state.user.profile,
                        time = (new Date).getTime() / 1000,
                        message = {
                            id,
                            time,
                            body,
                            files,
                            from_user_info:{
                                id:employee_id,
                                name,
                                photo
                            },
                            delivery_status:data.delivery_status
                        }
                    this.uploadFileList=[]

                    this.$root.$emit('messageAdd',message);

                    message.from_user_info.id = this.$store.state.user.profile.employee_id;

                    if(this.viewModeChat ==='operators') {

                        message.selfId = this.httpParams.params.id;
                        this.$store.commit('operators/messageLastUpdate',message)
                    } //Todo у оператора}

                    if(this.viewModeChat ==='visitors') {

                        message.selfUuid = this.httpParams.params.uuid;
                        message.last_message_author = 'Вы';
                        this.$store.commit('visitors/selfMessageLastUpdate',message)
                    }

                    this.message='';
                    autosize.destroy(this.$refs.chatInput);
                    this.autosizeInit=true;
                    setTimeout(()=>{
                        this.$refs.scrollbarMessage.update()
                    },200)
                });




            },
            checkIsProcessPage() {
                if(this.viewModeChat ==='process') {
                    this.showProcess = true;
                }
                else this.showProcess = false
            }
        },
    }
</script>

<style lang="scss">
    .chat-main-footer{
        $color_border:glob-color('border');
        $color_bg-send:glob-color('info-lighten');
        $color_success:glob-color('success');

        position:relative;
        border:1px dashed transparent;
        border-top:1px solid $color_border;
        padding-top:calc-em(20);

        &.drag-over {
            &::after {
                @extend %full-abs;
                border:1px dashed $color_success;
                background:glob-color('light');
                content:'';
                z-index:9;
            }
            &::after {

                content:'Перетащите сюда файлы';
                color:inherit;
                @extend %full-abs;
                display:flex;
                align-items:center;
                justify-content:center;
                z-index:2;
                @extend %h3

            }
        }

        &__fieldset {min-width:0}

        &__scrollbar{
            max-height:7.5em;
        }
        &__input{
            width:100%;
            height:2em;
            line-height:1.5;


            padding:0;
            overflow:hidden !important;
            border:0;

        }

        &__buttons{
            display:flex;
            align-items:center;
        }

        &__button_offer {
            fill:#cbcfde;
        }

        &__button_send{
            margin-left:auto;
        }

        &__send{
            .icon{
                width:calc-em(45);
                height:calc-em(45);
            }
        }

        &__box-control {
            position:relative;
            z-index:9;
            .box-controls__box {
                @extend %full-abs;
                top:auto;
            }
        }


    }
</style>