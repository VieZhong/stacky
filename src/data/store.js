import create from "zustand"
import axios from "axios"
import Config from "../Config"
import ColorMixer from "../utils/ColorMixer"
import ImgMixer from "../utils/ImgMixer"
import { Box3, Vector3 } from "three"
import uuid from "uuid"
import { getPositionWithOffset, getOffset } from "../utils/helpers"
import playMusic from "../utils/music"

const outOffset = Config.SLICE_SIZE * Config.DISTANCE_TIMES
const init = {
    sliceOffset: outOffset,
    score: 0,
    restTimes: 3,
    offsetAxis: "x",
    state: Config.STATE_SCAN,
    directHits: 0,
    showCombo: false,
    fragments: [],
    slices: [
        {
            position: [
                0,
                -Config.BOTTOM_SLICE_HEIGHT / 2,
                0
            ],
            id: uuid.v4(),
            size: [Config.SLICE_SIZE, Config.BOTTOM_SLICE_HEIGHT, Config.SLICE_SIZE],
            mass: 0,
            // color: ColorMixer.next()
            img: null

        }
    ],
    roleList: [1, 2, 3],
    role: 1,
    openId: null,
}

let comboTimeout = null


const [useStore, api] = create((set, get) => {
    let socket = new WebSocket("wss://viezhong.top/screen")

    function initSocket() {
        // Connection opened
        socket.addEventListener("open", function () {
            console.log("WebSocket Connection Opened!")
        })

        // Listen for messages
        socket.addEventListener("message", function (event) {
            console.log(event.data)
            const str = event.data
            const state = get().state
            try {
                const data = JSON.parse(str)
                if (data.msg_type === 3) {
                    if (data.is_new_game === 0) {
                        switch (state) {
                            case Config.STATE_READY:
                                get().start(data.open_id)
                                break
                            case Config.STATE_ACTIVE:
                                get().match()
                                break
                            case Config.STATE_GAME_OVER:
                                get().restart(data.open_id)
                                break
                        }
                    } else if (data.is_new_game === 1) {
                        get().restart(data.open_id)
                    }
                } else if (data.msg_type === 2) {
                    if (+data.confirm === 1) {
                        set({
                            state: Config.STATE_READY,
                            role: +data.role_id,
                        })
                    } else {
                        set({
                            role: +data.role_id,
                        })
                    }
                } else if (data.msg_type === 1) {
                    get().restart(data.open_id)
                }
            } catch (e) {
                console.error(e)
            }

        })
    }

    function reConnect() {
        console.log("重新连接")
        socket = new WebSocket("wss://viezhong.top/screen")
        initSocket()
    }

    function checkConnect() {
        if ((socket.readyState != WebSocket.OPEN)) {
            console.log("心跳检查断线，重连中。。。")
            reConnect()
        }
    }
    initSocket()
    setInterval(checkConnect, 5000)


    return {
        // data
        ...init,

        // actions
        incrementOffset() {
            let sliceOffset = get().sliceOffset + Config.SLICE_SPEED_INCREMENT
            set({ sliceOffset })
        },
        reset() {
            ColorMixer.reset()
            ImgMixer.reset()
            set({ ...init })
        },
        restart(openId) {
            this.reset()
            set({ state: Config.STATE_ROLE_CHOOSING, openId })
        },
        addSlice(slice) {
            set({
                slices: [
                    ...get().slices,
                    {
                        ...slice,
                        id: uuid.v4(),
                    },
                ]
            })
        },
        addFragment(fragment) {
            set({
                fragments: [
                    ...get().fragments,
                    {
                        ...fragment,
                        id: uuid.v4(),
                    },
                ]
            })
        },
        clean() {
            let { score, fragments, slices } = get()
            let buffer = 21
            let removedFragments = []
            let removedSlices = [] 

            for (let { id, position, size } of fragments) {
                let elementPosition = position[1] + size[1] / 2

                if (elementPosition < score * Config.SLICE_HEIGHT - Config.SLICE_HEIGHT * buffer) { 
                    removedFragments.push(id)
                }
            }
            for (let { id, position, size } of slices) {
                let elementPosition = position[1] + size[1] / 2

                if (elementPosition < score * Config.SLICE_HEIGHT - Config.SLICE_HEIGHT * buffer) { 
                    removedSlices.push(id)
                }
            }

            if (removedFragments.length) {
                set({
                    fragments: fragments.filter(i => !removedFragments.includes(i.id))
                })
            }

            if (removedSlices.length) {
                set({
                    slices: slices.filter(i => !removedSlices.includes(i.id))
                })
            }
        },
        start(openId) {
            set({ 
                state: Config.STATE_ACTIVE,
                openId
            })
        },
        match() {
            let {
                offsetAxis,
                directHits,
                slices,
                sliceOffset,
                addFragment,
                addSlice,
                score,
            } = get()
            let prev = slices[slices.length - 1]
            let bottom = new Box3(
                new Vector3(
                    prev.position[0] - prev.size[0] / 2,
                    prev.position[1] - prev.size[1] / 2,
                    prev.position[2] - prev.size[2] / 2
                ),
                new Vector3(
                    prev.position[0] + prev.size[0] / 2,
                    prev.position[1] + prev.size[1] / 2,
                    prev.position[2] + prev.size[2] / 2
                )
            )
            let bottomSize = bottom.getSize(new Vector3())
            let y = score * Config.SLICE_HEIGHT + Config.SLICE_HEIGHT / 2
            let distance = bottom.getCenter(new Vector3()).distanceTo(new Vector3(
                bottom.getCenter(new Vector3()).x + (offsetAxis === "x" ? getOffset(sliceOffset) : 0),
                bottom.getCenter(new Vector3()).y,
                bottom.getCenter(new Vector3()).z + (offsetAxis === "z" ? getOffset(sliceOffset) : 0)
            ))
            let directHit = distance < Config.DIRECT_HIT_THRESHOLD
            let directHitAddition = directHit && directHits + 1 >= Config.DIRECT_HIT_ADDITION_THRESHOLD
            let top = bottom.clone().translate(
                new Vector3(
                    offsetAxis === "x" && !directHit ? getOffset(sliceOffset) : 0,
                    0,
                    offsetAxis === "z" && !directHit ? getOffset(sliceOffset) : 0
                )
            )

            if (directHit && !directHitAddition) {
                set({ directHits: directHits + 1, showCombo: true })
                comboTimeout = setTimeout(() => {
                    if (comboTimeout) {
                        clearTimeout(comboTimeout)
                    }
                    set({ showCombo: false })
                }, 1200)
            } else {
                set({ directHits: 0, showCombo: false })
            }

            const bottomCenter = bottom.getCenter(new Vector3())
            const topCenter = top.getCenter(new Vector3())
            if (
                bottomCenter.x + bottomSize.x / 2 > topCenter.x
                && bottomCenter.x - bottomSize.x / 2 < topCenter.x
                && bottomCenter.z + bottomSize.z / 2 > topCenter.z
                && bottomCenter.z - bottomSize.z / 2 < topCenter.z
            ) {
                const {x, z} = top.getCenter(new Vector3())
                addSlice({
                    position: [x, y, z],
                    size: [
                        bottomSize.x + (directHitAddition ? .1 : 0),
                        Config.SLICE_HEIGHT,
                        bottomSize.z + (directHitAddition ? .1 : 0)
                    ],
                    // color: ColorMixer.previous(),
                    img: ImgMixer.previous(),
                    directHit
                })
                const currentScore = score + 1
                set({ score: currentScore})
                if (currentScore === Config.TOTAL_FLOOR) {
                    axios.get(`https://viezhong.top/game_over?open_id=${get().openId}`)
                    set({ state: Config.STATE_GAME_OVER })
                    playMusic("win")
                } else {
                    playMusic("add")
                }
            } else {
                let size = bottom.getSize(new Vector3())
                let center = bottom.getCenter(new Vector3())
                addFragment({
                    position: getPositionWithOffset(center.x, y, center.z, sliceOffset, offsetAxis),
                    size: [size.x, Config.SLICE_HEIGHT, size.z],
                    // color: ColorMixer.previous()
                    img: ImgMixer.previous()
                })
                if (get().restTimes === 0) {
                    axios.get(`https://viezhong.top/game_over?open_id=${get().openId}`)
                    set({ state: Config.STATE_BEFORE_GAME_OVER })
                    setTimeout(() => {
                        set({ state: Config.STATE_GAME_OVER })
                    }, 3000)
                    playMusic("end")
                } else {
                    set({ restTimes: get().restTimes - 1 })
                    playMusic("lose")
                }
            }

            set({ sliceOffset: outOffset, offsetAxis: offsetAxis === "x" ? "z" : "x" })

            if (score % 2 === 0) {
                get().clean()
            }
        }
    }
})

export { useStore, api }
