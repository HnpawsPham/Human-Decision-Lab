import {sendNoti, syntaxHighlight} from "./support-funcs.js";

const output = document.getElementById("output");
const AI_output = output.querySelector("#output pre");

//#region CHAR SETTING
// char submit handle
const charSubmitBtn = document.getElementById("char-submit-btn");
const charNameInp = document.getElementById("char-name-inp");
const charName = document.getElementById("char-name");
const charBackgroundPrompt = document.getElementById("char-background-prompt");

function loadAttributeBar(name, value) {
    const attr = document.getElementById(name);
    attr.style.display = "flex";

    const left = attr.querySelector(".inside.left");
    const right = attr.querySelector(".inside.right");

    const percent = Math.abs(value) * 100;

    left.style.width = "0%";
    right.style.width = "0%";

    if(value > 0) 
        right.style.width = percent + "%";
    else if (value < 0) 
        left.style.width = percent + "%";
}

charSubmitBtn.addEventListener("click", async () => {
    console.log(charNameInp.value)
    if(!charNameInp.value){
        sendNoti("You want your character nameless, huh?", 4000);
        return;
    }

    if(!charBackgroundPrompt.value){
        sendNoti(`Tell us about your character’s background, or choose “I'll go with default” to begin.`, 6000);
        return;
    }

    // read user prompt and transform it into 
    const res = await fetch("/api/personal-state-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            prompt: charBackgroundPrompt.value
        })
    });

    const data = await res.json();
    console.log(typeof data.reply, data.reply);

    if(data.reply === null){
        sendNoti("The server is overload, please try again after a while", 5000);
        return;
    }
    const attributes = JSON.parse(data.reply);

    Object.entries(attributes).forEach(([key, value]) => {
        loadAttributeBar(key, value);
    });

    output.style.backgroundImage = "none";

    charName.innerHTML = charNameInp.value;
})