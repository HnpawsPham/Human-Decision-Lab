
import {sendNoti, syntaxHighlight} from "./support-funcs.js";

// UI: make attributes circle
const attrCircle = document.getElementById("attr-circle");
const attrs = document.querySelectorAll(".attribute")

function layoutAttributes(){
    const rect = attrCircle.getBoundingClientRect()
    const radius = Math.min(rect.width, rect.height) / 2;
    const step = (Math.PI * 2) / attrs.length;

    attrs.forEach((el, i) => {
        const angle = i * step - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
    })
}

layoutAttributes()
window.addEventListener("resize", layoutAttributes)

// AI output handle
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
    const percent = Math.abs(value) * 100;
    attr.querySelector(".liquid").style.height = `${percent}%`;
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

    if(data.reply === null){
        sendNoti("The server is overload, please try again after a while", 5000);
        return;
    }
    const attributes = JSON.parse(data.reply);

    // show attribute bubbles
    attrCircle.style.display = "block";

    Object.entries(attributes).forEach(([key, value]) => {
        loadAttributeBar(key, value);
    });
    layoutAttributes();

    // output attributes to Character Setting tab
    output.style.backgroundImage = "none";
    output.style.backgroundColor = "var(--dark)";
    AI_output.innerHTML = syntaxHighlight(attributes);

    charName.innerHTML = charNameInp.value;
})