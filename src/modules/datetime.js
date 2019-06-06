

function datetimeDMY(val){

    if(Object.prototype.toString.call(val) !== '[object Date]') val = new Date(val*1000)

    let today = val;
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    return dd + '.' + mm + '.' + yyyy;
}

function datetimeHMS(val){

    if(Object.prototype.toString.call(val) !== '[object Date]') val = new Date(val*1000)

    let today = val;

    let h = padStart(today.getHours())
    let m = padStart(today.getMinutes()); //January is 0!
    let s = padStart(today.getSeconds()); //January is 0!

    return h + ':' + m + ':' + s;
}

function datetimeStoHMS(valSec,unitsNo){

    let sec = Number(valSec);
    if(!sec) return '-'
    let h = sec/3600 ^ 0 ;
    let m = (sec-h*3600)/60 ^ 0 ;
    let s = sec-h*3600-m*60 ;

    if(unitsNo) return (h?padStart(h)+":":'00:')+(m?padStart(m)+":":'00:')+(s?padStart(s)+"":'00')
    return (h?h+" ч. ":'')+(m?m+" мин. ":'')+(s?s+" сек.":'')
}


function padStart(numb) {
    return String(numb).padStart(2, '0')
}








export {datetimeDMY,datetimeHMS,datetimeStoHMS}