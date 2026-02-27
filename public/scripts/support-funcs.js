// add ... when the string is too long
export function stringShortener(str, lim){
    if(str.length <= lim) return str;
    return str.slice(0, lim - 3) + "...";
}

// notification
const noti = document.getElementById("noti");

export function sendNoti(text, ms){
    if(noti == null) return;
    noti.innerHTML = text;
    noti.style.display = "flex";
    
    setTimeout(() => {
        noti.style.display = "none";
    }, ms);
}