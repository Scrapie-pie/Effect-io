function datetimeDMY(val) {
    if (Object.prototype.toString.call(val) !== '[object Date]') val = new Date(val * 1000)

    let today = val
    let dd = String(today.getDate()).padStart(2, '0')
    let mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    let yyyy = today.getFullYear()

    return dd + '.' + mm + '.' + yyyy
}

export default datetimeDMY
