import end from "../../assets/music/end.mp3"
import bg from "../../assets/music/bg.mp3"
import win from "../../assets/music/win.mp3"
import lose from "../../assets/music/lose.wav"
import add from "../../assets/music/add.mp3"

const music = {
    end,
    bg,
    win,
    lose,
    add
}

export default function playMusic(type) {
    document.getElementById("audio").src = music[type]
    document.getElementById("audio").play()
}
