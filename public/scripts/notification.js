const noti = document.getElementById("noti");

export function sendNoti(text, ms){
    noti.innerHTML = text;
    noti.style.display = "flex";
    
    setTimeout(() => {
        noti.style.display = "none";
    }, ms);
}