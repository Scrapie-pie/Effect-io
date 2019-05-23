
<script>
    import emojisBase from 'vue-emoji-picker/src/emojis'



       let emojisBaseAll = [
               ...Object.entries(emojisBase['Frequently used']),
               ...Object.entries(emojisBase['People']),
               ...Object.entries(emojisBase['Nature']),
               ...Object.entries(emojisBase['Objects']),
               ...Object.entries(emojisBase['Places']),
               ...Object.entries(emojisBase['Symbols']),
       ]
    console.log(emojisBaseAll);
    import '@/scss/vendors/gl-16-emoji.css'
    import lodash_split from 'lodash/split'
    import {getCaretPosition} from '@/mixins/mixins'
export default {
    props: {
        type:'',
        text:'',
        list:{
            type:Array,
            default:function () {
                return []
            }
        }
    },
    mixins:[getCaretPosition],
    render(h){
        let src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAABN2lDQ1BBZG9iZSBSR0IgKDE5OTgpAAAokZWPv0rDUBSHvxtFxaFWCOLgcCdRUGzVwYxJW4ogWKtDkq1JQ5ViEm6uf/oQjm4dXNx9AidHwUHxCXwDxamDQ4QMBYvf9J3fORzOAaNi152GUYbzWKt205Gu58vZF2aYAoBOmKV2q3UAECdxxBjf7wiA10277jTG+38yH6ZKAyNguxtlIYgK0L/SqQYxBMygn2oQD4CpTto1EE9AqZf7G1AKcv8ASsr1fBBfgNlzPR+MOcAMcl8BTB1da4Bakg7UWe9Uy6plWdLuJkEkjweZjs4zuR+HiUoT1dFRF8jvA2AxH2w3HblWtay99X/+PRHX82Vun0cIQCw9F1lBeKEuf1UYO5PrYsdwGQ7vYXpUZLs3cLcBC7dFtlqF8hY8Dn8AwMZP/fNTP8gAAAAJcEhZcwAACxMAAAsTAQCanBgAAAXRaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDQtMTlUMTU6Mjc6NTMrMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTktMDQtMTlUMTU6Mjc6NTMrMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTA0LTE5VDE1OjI3OjUzKzAzOjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjc5NzBiY2E4LTg4YWUtZTg0Ni1hZWM2LTI2NzExODI2MzZjNSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjkzZDIyMjZhLTVhYmEtOGE0NS05MzI3LWJhOTQ1NjQ0ZGQ5NCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjYyYzVhNTU1LTYzZjMtNjI0MS05YmQ1LTA2ODUyYmZhNDU2YSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjYyYzVhNTU1LTYzZjMtNjI0MS05YmQ1LTA2ODUyYmZhNDU2YSIgc3RFdnQ6d2hlbj0iMjAxOS0wNC0xOVQxNToyNzo1MyswMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3OTcwYmNhOC04OGFlLWU4NDYtYWVjNi0yNjcxMTgyNjM2YzUiIHN0RXZ0OndoZW49IjIwMTktMDQtMTlUMTU6Mjc6NTMrMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6lkCtfAAAADUlEQVQImWP4//8/AwAI/AL+hc2rNAAAAABJRU5ErkJggg==';
        src = "data:image/svg+xml;utf8,<svg viewBox='0 0 0 0' version='1.1' xmlns='http://www.w3.org/2000/svg'><circle cx='0' cy='0' r='0'/></svg>"


        let splitStr = lodash_split(this.text,'')
        splitStr = splitStr.map(item=>{

            let find  = emojisBaseAll.find(itemFind=>{

                return itemFind[1]==item
            })
            console.log(find);
            if(find) {
                if(!Array.isArray(find)) return item
            } else {
                return item
            }


            let className="gl-16 gl-16-"+find[0];
            if (item.length>1) {
                if(this.type=='text') item = `<img class="${className}"   src="${src}" alt="${item}"/>`
                else item = (<img class={className}  src={src} alt={item}/>)
            }
            return item
        })
        console.log(this.text);

        console.log(splitStr);



        if (this.type==='text') {
            splitStr = splitStr.join('')
            return (<span domPropsInnerHTML={splitStr}></span>)
        }
        else return (<div  class="input-emoji" id="contenteditable" contenteditable="true" placeholder="Enter - отправить сообщение, Shift+Enter - новая строка.">{splitStr}</div>)
    }
}
</script>

<style lang="scss">
.input-emoji  {

    cursor:text;
    img {vertical-align:middle}
    &[contenteditable=true]:empty:before {
        content: attr(placeholder);
        display: block; /* For Firefox */
        color:glob-color('placeholder');
    }
}
</style>