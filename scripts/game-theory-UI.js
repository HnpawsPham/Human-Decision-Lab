const scoreboard = document.getElementById("scoreboard")
const header = scoreboard.querySelector(".scoreboard-header")

header.onclick = () => {
    scoreboard.classList.toggle("collapsed")
}