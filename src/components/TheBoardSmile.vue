<template>
    <div>
        <textarea v-model="input"></textarea>

        <emoji-picker @emoji="insert" :search="search">
            <div slot="emoji-invoker" slot-scope="{ events }" v-on="events">
                <button type="button">open</button>
            </div>
            <div slot="emoji-picker" slot-scope="{ emojis, insert, display }">
                <div>
                    <div>
                        <input type="text" v-model="search">
                    </div>
                    <div>
                        <div v-for="(emojiGroup, category) in emojis" :key="category">
                            <h5>{{ category }}</h5>
                            <div>
            <span
                    v-for="(emoji, emojiName) in emojiGroup"
                    :key="emojiName"
                    @click="insert(emoji)"
                    :title="emojiName"
            >{{ emoji }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </emoji-picker>
    </div>

</template>

<script>
    import EmojiPicker from 'vue-emoji-picker'

    export default {
        components: {
            EmojiPicker,
        },

        data(){
            return {
                input:'',
                search:''
            }
        },
        computed:{


        },

        methods:{
            insert(emoji) {
                console.log(emoji);
                this.input += emoji
            },
        }

    }
</script>

<style lang="scss">
    .files-board {

    }
</style>