<template lang="pug">
        form.chat-main-footer.js-dragDrop(@click="messageRead")

            ///the-chat-system-messages

            processActions(v-if="compShowProcess")
            fieldset.chat-main-footer__fieldset(v-else)
                .chat-main-footer__box-control
                    box-controls(v-if="showMention", @boxControlClose="showMention=false")
                        select-operators(name="mention")

                    box-controls(v-if="showSmiles", @boxControlClose="showSmiles=false")
                        //the-files-board(name="smiles", @getSmile="setMessageSmile")
                        the-board-smile(@getSmile="setMessageSmile", @result="setTextWidthSmiles")
                    //box-controls(v-if="showGifs", @boxControlClose="showGifs=false")
                        the-files-board(name="gifs")
                    box-controls(v-if="showOffer", @boxControlClose="showOffer=false")
                        the-offer()
                    box-controls(v-if="spellingShow", @boxControlClose="spellingShow=false;getPhrasesSelectText(spellingResultMessage)").chat-main-footer__the-spelling-form
                        TheSpellingForm(
                            :list="spellingList",
                            :message="spellingMessage",
                            @ignoredWords="val=>spellingIgnoredWords.push(...val)",
                            @resultMessage="(val)=>spellingResultMessage=val"
                        )
                .chat-main-footer__box-control-fixed
                    box-controls(v-if="showPhrases", @boxControlClose="thePhrasesReadyClose")
                        the-phrases-ready-popup(@resultText="getPhrasesSelectText" is-absolute)
                .chat-main-footer__contols
                    .chat-main-footer__textarea-wrap
                        the-phrases-select(
                            @show="val=>showThePhrasesSelect=val"
                            v-if="viewModeChat==='visitors'",
                            :filter-search="message" ,
                            @resultText="getPhrasesSelectText",
                            @close="thePhrasesSelectClose"
                        ).chat-main-footer__phrases-select

                        scroll-bar.chat-main-footer__scrollbar(ref="scrollbarMessage")
                            div(
                                @keydown.enter.exact="onEnter",
                                @click.prevent="messageRead"
                                )
                                input-emoji(
                                    ref="inputEmoji"
                                    :text="textWidthSmiles",
                                    @caret="val=>textCaret=val",
                                    @getText="val=>message=val",
                                    @inputChange="inputEmojiInputChange"
                                    @blur="saveTextarea"
                                )
                            textarea.chat-main-footer__input(
                                placeholder="Enter - отправить сообщение, Shift+Enter - новая строка."
                                ref="chatInput",
                                v-model="message",
                                @keydown.enter.exact="onEnter",
                                @click.prevent="messageRead"
                                )
                            upload-file-list(
                                v-if="uploadFileList.length"
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
                    li.chat-main-footer__button
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
                    li.chat-main-footer__button(v-if="viewModeChat=='visitors'")
                        base-radio-check(name="spellingCheck" v-model="spellingCheck", @click="toggleSpellingCheck") Проверка орфографии
                    li.chat-main-footer__button.chat-main-footer__button_send

                        base-btn.chat-main-footer__send(

                            @click="send",
                            :icon="{name:'send',textHidden:'Отправить сообщение'}"
                        )

</template>

<script>
import SelectOperators from '@/components/SelectOperators'
import TheOffer from '@/components/TheOffer'
import TheFilesBoard from '@/components/TheFilesBoard'
import TheBoardSmile from '@/components/TheBoardSmile'

import ThePhrasesReadyPopup from '@/components/ThePhrasesReadyPopup'
import ThePhrasesSelect from '@/components/ThePhrasesSelect'
import ProcessActions from '@/components/ProcessActions'
import UploadFile from '@/components/UploadFile'
import UploadFileList from '@/components/UploadFileList'
import inputEmoji from '@/components/inputEmoji'
import TheSpellingForm from '@/components/TheSpellingForm'

import lodash_split from 'lodash/split'
import lodash_cloneDeep from 'lodash/cloneDeep'

import textWidthTagToText from '@/modules/textWidthTagToText'

import { viewModeChat, httpParams, spelling, typingLive } from '@/mixins/mixins'

export default {
    components: {
        SelectOperators,
        TheOffer,
        TheFilesBoard,
        ThePhrasesReadyPopup,
        ThePhrasesSelect,
        ProcessActions,
        UploadFile,
        UploadFileList,
        TheBoardSmile,
        inputEmoji,
        TheSpellingForm

    },
    mixins: [viewModeChat, httpParams, spelling, typingLive],

    data() {
        return {
            showMention: false,
            showProcess: false,
            showGifs: false,
            showOffer: false,
            showSmiles: false,
            showPhrases: false,

            textWidthSmiles: '',
            textCaret: null,

            showThePhrasesSelect: false,

            message: '',
            uploadFileList: [],
            bufferingSend: false
        }
    },
    computed: {
        compShowProcess() {
            return this.showProcess
        }
    },
    watch: {
        $route: {
            handler(to, from) {
                this.checkIsProcessPage()

                setTimeout(() => {
                    if (this.viewModeChat === 'visitors') {
                        this.getPhrasesSelectText('')
                        this.getTextAreaVisitors(this.$store.state.visitors.self, to.params)
                    }
                    if (this.viewModeChat === 'operators') {
                        this.getPhrasesSelectText('')
                        this.getTextAreaOperators(this.$store.state.operators.all, to.params)
                    }
                }, 300)
                setTimeout(() => {
                    this.$refs?.inputEmoji?.$el.focus()
                }, 750)
            },
            immediate: true
        },

        uploadFileList(val) {}
    },

    created() {},
    beforeDestroy() {
        // this.$refs.inputEmoji?.$el.removeEventListener("paste", this.listenerClearStylePaste);
    },
    methods: {
        saveTextarea({
            httpParamsRequestBefore = { params: this.$route.params },
            viewModeChat = this.viewModeChat,
            message = this.message
        }) {
            console.log(httpParamsRequestBefore, this.message)
            if (viewModeChat === 'visitors') {
                this.$store.commit('visitors/saveTextAreaItem', {
                    ids: httpParamsRequestBefore.params,
                    textArea: message
                })
            }

            if (viewModeChat === 'operators') {
                this.$store.commit('operators/saveTextAreaItem', {
                    ids: httpParamsRequestBefore.params,
                    textArea: message
                })
            }
        },

        inputEmojiInputChange(text) {
            this.typingLive(text)
        },
        getTextAreaVisitors(list, routerParams) {
            let { site_id, guest_uuid } = routerParams
            let find = list.find(item => item.site_id + item.guest_uuid === site_id + guest_uuid)
            if (find?.textArea) {
                this.getPhrasesSelectText(find.textArea)
            }
        },
        getTextAreaOperators(list, routerParams) {
            let { id } = routerParams
            let find = list.find(item => item.id === id)
            if (find?.textArea) {
                this.getPhrasesSelectText(find.textArea)
            }
        },
        textWidthTagToText() {
            let ct = document.getElementById('contenteditable')
            let listText = textWidthTagToText(ct)
            ct.innerText = ''

            return listText
        },
        setTextWidthSmiles({ emoji }) {
            this.textWidthSmiles = ''
            let text = this.textWidthTagToText()
            setTimeout(() => {
                let textMas = lodash_split(text, '')
                let textMasFinish = this.textCaret
                for (let i = 0; i < textMasFinish; i++) {
                    if (textMas[i].length > 1) {
                        this.textCaret += 1
                    }
                }

                let str_left = text.substring(0, this.textCaret)
                let str_right = text.substr(this.textCaret)

                this.textWidthSmiles = str_left + emoji + str_right
            }, 1)
        },
        setMessageSmile(emoji) {
            const textarea = this.$refs.chatInput
            const cursorPosition = textarea.selectionEnd
            const start = this.message.substring(0, textarea.selectionStart)
            const end = this.message.substring(textarea.selectionStart)

            this.message = start + emoji.native + end
            textarea.focus()
            this.$nextTick(() => {
                textarea.selectionEnd = cursorPosition + emoji.native.length
            })
        },
        getPhrasesSelectText(val) {
            this.message = val

            this.textWidthSmiles = ''
            this.textWidthTagToText()
            setTimeout(() => {
                this.textWidthSmiles = val
                setTimeout(() => {
                    this.$refs?.chatInput?.focus()
                }, 100)
            }, 1)
        },
        messageRead() {
            if (this.viewModeChat === 'operators') {
                this.$http.put('message/operator-mark-as-read', {
                    user_id: this.httpParams.params.id
                })
                this.$store.dispatch('setMessageRead', {
                    id: this.httpParams.params.id,
                    type: this.viewModeChat
                })
            } //Todo у оператора
            if (this.viewModeChat === 'visitors') {
                this.$http.put('message/operator-mark-as-read', {
                    room_id: this.$store.state.roomActive.id
                })
                this.$store.dispatch('setMessageRead', {
                    guest_uuid: this.httpParams.params.guest_uuid,
                    site_id: this.httpParams.params.site_id,
                    type: this.viewModeChat
                })
            }
            if (this.viewModeChat === 'common') {
                this.$http.put('message/operator-mark-as-read', {
                    room_id: this.$store.state.user.profile.common_room_id
                })

                this.$store.commit('user/unreadUpdate', ['common', 'clear'])
            }
        },
        thePhrasesReadyClose(val){
            this.showPhrases=false


        },
        thePhrasesSelectClose(){
            this.send()
        },
        onEnter: function(e) {
            console.log(e);
            //if(this.bufferingSend) return

            e.stopPropagation()
            e.preventDefault()
            e.returnValue = false
            if (this.showThePhrasesSelect) return
            this.input = e.target.value
            this.send()
        },
        messageReset({ httpParamsRequestBefore, viewModeChat, message }) {
            this.message = message
            this.spellingIgnoredWords = []
            this.uploadFileList = []
            this.saveTextarea({
                httpParamsRequestBefore,
                viewModeChat,
                message
            })
        },
        send() {
            if (!navigator.onLine)
                return this.$root.$emit('popup-notice', 'Проверьте подключение к сети =(')
            this.typingLive('')
            this.message = this.textWidthTagToText()

            let data = {},
                to_id,
                files = [],
                body = this.message

            if (this.uploadFileList.length) {
                files = lodash_cloneDeep(this.uploadFileList)
                files = files.map(item => {
                    item.name = item.src.name
                    //delete item.src
                    return item
                })
            }

            if (!body && !files.length) return
            if (this.bufferingSend) return
            this.bufferingSend = true

            if (this.viewModeChat === 'visitors') {
                let { guest_uuid, site_id } = this.httpParams.params

                data = {
                    guest_uuid,
                    site_id,
                    delivery_status: 0
                }

                let val = this.httpParams.params
                this.$store.commit('visitors/messageHot', { val, set: false })
            } else if (this.viewModeChat === 'operators') {
                to_id = +this.httpParams.params.id
                data = {
                    to_id,
                    delivery_status: 1
                }
            } else if (this.viewModeChat === 'common') {
                data.room_id = this.$store.state.user.profile.common_room_id
                data.delivery_status = 1
            }

            data.body = body
            data.files = files
            data.spelling = this.spellingCheck
            data.spelling_ignored_words = this.spellingIgnoredWords
            this.spellingMessage = this.message


            if(this.$store.state.phrases.selectSnippetId) {
                data.snippet_id = this.$store.state.phrases.selectSnippetId;
                this.$store.commit('phrases/setSelectSnippetId',null)
            }




            let httpParamsRequestBefore = this?.httpParams //Пользователь мог не дожидаться запроса и переходить в другой чат, под конец запроса переменная была уже с другим значением
            let viewModeChatRequestBefore = this.viewModeChat
            this.$http
                .post('message/send-from-operator', data)
                .then(response => {
                    this.bufferingSend = false
                    console.log(this.httpParams)
                    let { id } = response.data.data
                    console.log('message/send-from-operator', response.data.data)
                    let { first_name: name, photo, employee_id } = this.$store.state.user.profile,
                        time = new Date().getTime() / 1000,
                        message = {
                            guest_uuid: httpParamsRequestBefore?.params.guest_uuid, //Делаем синхранизацию, если опер открыл в журнале свой диалог и пишет сообщени в другой вкладке {  ?. решает баг отправки в общем чате
                            site_id: httpParamsRequestBefore?.params.site_id, //
                            room_id: this.$store.state.roomActive.id, //}
                            id,
                            time,
                            body,
                            files,
                            from_user_info: {
                                id: employee_id,
                                name,
                                photo
                            },
                            delivery_status: data.delivery_status
                        }

                    if (this.viewModeChat === 'visitors' || this.viewModeChat === 'operators') {
                        //Был баг. На медленном инете, пользователь отправлял сообщение, не дожидаясь ответа переходил в другой чат, сообщение прилетало тудв
                        if (this.viewModeChat === 'visitors') {
                            if (
                                message.guest_uuid === this.httpParams.params.guest_uuid &&
                                message.site_id === this.httpParams.params.site_id
                            ) {
                                this.$root.$emit('messageAdd', message)
                            }
                        }
                        if (this.viewModeChat === 'operators') {
                            if (message.from_user_info.employee_id === this.httpParams.params.id) {
                                this.$root.$emit('messageAdd', message)
                            }
                        }
                    }
                    if(this.viewModeChat==='common') this.$root.$emit('messageAdd', message)

                    localStorage.setItem('messageAdd', JSON.stringify(message))

                    message.from_user_info.id = this.$store.state.user.profile.employee_id

                    if (viewModeChatRequestBefore === 'operators') {
                        message.selfId = httpParamsRequestBefore.params.id
                        this.$store.commit('operators/messageLastUpdate', message)
                    } //Todo у оператора}

                    if (viewModeChatRequestBefore === 'visitors') {
                        message.selfUuid = httpParamsRequestBefore.params.guest_uuid
                        message.last_message_author = 'Вы'
                        this.$store.commit('visitors/selfMessageLastUpdate', message)
                    }
                })
                .then(() => {
                    this.messageReset({
                        message: '',
                        viewModeChat: viewModeChatRequestBefore,
                        httpParamsRequestBefore
                    })

                    setTimeout(() => {
                        this.$refs.scrollbarMessage?.update()
                    }, 200)
                })
                .catch(error => {
                    console.log(error)
                    let { response } = error
                    if (response.status === 400) {
                        this.getPhrasesSelectText(this.spellingMessage)

                        console.log('spellingSuggestions', response.data.spellingSuggestions)
                        this.spellingShowBox(response.data.spellingSuggestions)
                    } else {
                        this.messageReset({
                            message: '',
                            viewModeChat: viewModeChatRequestBefore,
                            httpParamsRequestBefore
                        })
                    }
                    this.bufferingSend = false
                })
        },
        checkIsProcessPage() {
            if (this.viewModeChat === 'process') {
                this.showProcess = true
            } else this.showProcess = false
        }
    }
}
</script>

<style lang="scss">
.chat-main-footer {
    $color_border: glob-color('border');
    $color_bg-send: glob-color('info-lighten');
    $color_success: glob-color('success');

    .icon_phrases {
        fill: #8c8c8c;
    }

    position: relative;
    border: 1px dashed transparent;
    border-top: 1px solid $color_border;
    $pt: calc-em(20);

    .process-actions {
        padding-top: $pt;
    }

    &.drag-over {
        &::after {
            @extend %full-abs;
            border: 1px dashed $color_success;
            background: glob-color('light');
            content: '';
            z-index: 9;
        }
        &::after {
            content: 'Перетащите сюда файлы';
            color: inherit;
            @extend %full-abs;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            @extend %h3;
        }
    }

    &__fieldset {
        min-width: 0;
    }

    &__scrollbar {
        max-height: 7.5em;
    }
    &__input {
        width: 100%;
        height: 2em;
        line-height: 1.5;

        border: 0;
        padding: 0;
        overflow: hidden !important;
        height: 0;
        width: 0;
        @extend %visuallyhidden;
    }

    .input-emoji {
        padding-top: $pt;
        min-height:4em;
    }

    &__buttons {
        display: flex;
        align-items: center;
    }

    &__button_offer {
        fill: #cbcfde;
    }

    &__button_send {
        margin-left: auto;
    }

    &__send {
        .icon {
            width: calc-em(45);
            height: calc-em(45);
        }
    }

    &__box-control {
        position: relative;
        z-index: 9999;
        .box-controls__box {
            @extend %full-abs;
            top: auto;
        }
    }
    &__box-control-fixed {
        position: relative;
        z-index: 9999;
        .box-controls__box {
            @extend %full-abs;
            position:fixed;
            max-width:80%;
            max-height:80%;
            margin:auto;
        }
    }

    &__the-spelling-form {
        .box-controls__box {
            max-width: 550px;
        }
    }


}
</style>
