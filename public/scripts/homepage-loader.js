import { sendNoti } from "./support-funcs.js";

// ongoing noti
sendNoti("This website is under development, please use PC or a better experience", 5000);

// go to profile page
const userAccountBtn = document.getElementById("user-account");
userAccountBtn.addEventListener("click", () => {
    window.location = "./pages/user-profile.html";
})

// demo images open in new tab for larger view
const demoImgs = document.querySelectorAll("#demo .item");
for(let img of demoImgs)
    img.addEventListener("click", () => {
        window.open(img.src, "_blank");
    })