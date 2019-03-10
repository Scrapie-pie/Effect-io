const scrollLoadAllow = function(e,direction='down'){
    const scroller = e.target
    let height = scroller.clientHeight,
        scrollHeight = scroller.scrollHeight - height,
        scrollTop = scroller.scrollTop,
        percent = Math.floor(scrollTop / scrollHeight * 100);
    if(direction==='down') {
        if ( percent > 80 ) {

            return true
        }
    } else if(percent < 20) {
        return true
    }


}

export { scrollLoadAllow};