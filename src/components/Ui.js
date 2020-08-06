import React from "react"
import Only from "./Only"
import Role from "./Role" 
import Config from "../Config"
import { useStore } from "../data/store"
import { images } from "./Role"

import qrBg from "../../assets/images/qr-bg.png"
import ImgMixer from "../utils/ImgMixer"
import winImg from "../../assets/images/win-bg.png"
import longBg from "../../assets/images/long-bg.jpg"

export default function Ui() {
    const state = useStore(state => state.state)
    const score = useStore(state => state.score)
    const directHits = useStore(state => state.directHits)
    const showCombo = useStore(state => state.showCombo)
    const role = useStore(state => state.role)
    const restTimes = useStore(state => state.restTimes)
    const reset = useStore(state => state.reset)
    const top = score ? 100 - 100 / Config.TOTAL_FLOOR * score : 100

    return (
        <>
            <Only if={state === Config.STATE_SCAN}>
                <div className="qr-bg" style={{backgroundImage: `url(${qrBg})`}}></div>
            </Only>

            <Only if={state === Config.STATE_ROLE_CHOOSING}>
                <Role />
            </Only>

            <Only if={state === Config.STATE_ACTIVE || state === Config.STATE_BEFORE_GAME_OVER}>
                <div className="avatar-container">
                    <div className="avatar">
                        <img src={images[`active${role}`]} style={{ width: "100%" }} alt="avatar"/>
                    </div>
                    <span className="x">X</span>
                    <span className="num">{restTimes}</span>
                </div>
                <div className="panel panel--score">
                    {score}
                </div>
                <div className="combo" style={{ display: showCombo ? "block"  : "none"}}>
                    <div className="combotx">
                        combo <span className="combox">x</span> {directHits}
                    </div>
                </div>
            </Only>

            <Only if={state === Config.STATE_GAME_OVER || state === Config.STATE_BEFORE_GAME_OVER}>
                <div className="gameover-container" style={{ backgroundPosition: `0 ${top}%`, backgroundImage: `url(${longBg})` }}>
                    <Only if={score === Config.TOTAL_FLOOR}>
                        <div className="win" style={{ backgroundImage: `url(${winImg})` }} onClick={reset}>
                            <div className="role">
                                <img src={images[`win${role}`]} style={{ width: "100%" }} alt="role" />
                            </div>
                        </div>
                    </Only>
                    <Only if={score !== Config.TOTAL_FLOOR}>
                        <div className="story" style={{ backgroundImage: `url(${ImgMixer.getStoryImg()})`}}></div>
                        <div className="x" onClick={reset}>x</div>
                    </Only>
                </div>
            </Only>
            <Only if={state === Config.STATE_READY}>
                <div className="panel panel--intro logo">
                    {"火星异种".split("").map((i,index) => <span style={{ animationDelay: (index * 125 + 500) + "ms"}} key={i}>{i}</span>)}
                </div> 
                <div className="panel__subtitle">点击</div>
            </Only>
        </>
    )
}
