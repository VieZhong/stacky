export default {
    BOTTOM_SLICE_HEIGHT: 30,
    TOTAL_FLOOR: 28,
    DISTANCE_TIMES: 1.6,
    SLICE_SIZE: 4,
    SLICE_HEIGHT: 4,
    SLICE_SPEED_INCREMENT: .02,
    DIRECT_HIT_THRESHOLD: .9,
    DIRECT_HIT_ADDITION: .1,
    DIRECT_HIT_ADDITION_THRESHOLD: 30,
    STATE_SCAN: "state:scan",
    STATE_ROLE_CHOOSING: "state:role-choosing",
    STATE_READY: "state:ready",
    STATE_ACTIVE: "state:active",
    STATE_BEFORE_GAME_OVER: "state:before-game-over",
    STATE_GAME_OVER: "state:game-over",
    REGISTER_SERVICEWORKER: process.env.REGISTER_SERVICEWORKER === "true"
}
