import "../assets/style/app.scss"

import React from "react"
import ReactDOM from "react-dom"
import { Workbox } from "workbox-window"
import ColorMixer from "./utils/ColorMixer"
import Main from "./components/Main"
import Config from "./Config" 



ColorMixer.setEnvironment()

ReactDOM.render(
    <Main />,
    document.getElementById("root")
)

if (Config.REGISTER_SERVICEWORKER) {
    let worker = new Workbox("/serviceworker.js")

    worker.addEventListener("installed", e => {
        console.info(`Service worker ${e.isUpdate ? "updated" : "installed"}`)
    })
    worker.register()
}
