import React from "react"
import { Canvas } from "react-three-fiber"
// import { TextureLoader } from "three"
import Config from "../Config"
import { useStore } from "../data/store"
import { CannonProvider } from "../utils/cannon"
import Stack from "./Stack"
import Camera from "./Camera"
import Lights from "./Lights"
import Ui from "./Ui"
import Only from "./Only"
import bgMusic from "../../assets/music/bg.mp3"
import longBg from "../../assets/images/long-bg.jpg"

let pixelRatio = window.matchMedia("(min-width:900px)").matches ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio

export default function Main() {
    let state = useStore(state => state.state)

    return (
        <>
            <audio id="bg" muted src={bgMusic} style={{ position: "absolute", width: "100px", top: 0, right: 20, zIndex: 999 }} controls autoPlay loop></audio>
            <audio id="audio" muted src={bgMusic} style={{ position: "absolute", width: "20px", top: 0, right: 0, zIndex: 999 }} controls autoPlay></audio>
            <Ui />
            <Only if={state === Config.STATE_ACTIVE || state === Config.STATE_BEFORE_GAME_OVER}>
                <div className="canvas-container" id="canvas" style={{ backgroundImage: `url(${longBg})`}}>
                    <Canvas
                        orthographic
                        pixelRatio={pixelRatio}
                        camera={{
                            position: [Config.SLICE_SIZE, 5, Config.SLICE_SIZE],
                            zoom: 50,
                            left: -10,
                            right: 10,
                            top: 10,
                            bottom: -10,
                            near: -10,
                            far: 20
                        }}
                    >
                        <CannonProvider defaultFriction={1} defaultRestitution={.25}>
                            <Lights />
                            <Camera />
                            <Stack />
                        </CannonProvider>
                        {/* <fog args={[0x397fbf, 6, 20]} attach={"fog"} /> */}
                        {/* <scene background={new TextureLoader().load(longBg)} autoUpdate={false}></scene> */}
                    </Canvas>
                </div>
            </Only>
        </>
    )
}
