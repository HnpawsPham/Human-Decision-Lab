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
    noti.style.opacity = 1;
    
    setTimeout(() => {
        noti.style.opacity = 0;
    }, ms);
}

// syntax highlightner for code
export function syntaxHighlight(str) {
    return str
        .replace(/"(.*?)":/g, '<span class="json-key">"$1"</span>:')
        .replace(/: "(.*?)"/g, ': <span class="json-string">"$1"</span>')
        .replace(/: (-?\d+(\.\d+)?)/g, ': <span class="json-number">$1</span>')
        .replace(/\b(true|false|null)\b/g, '<span class="json-boolean">$1</span>');
}