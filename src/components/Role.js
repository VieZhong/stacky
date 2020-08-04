import React from "react"
import { useStore } from "../data/store"

import active1 from "../../assets/images/IP1_actived.png"
import active2 from "../../assets/images/IP2_actived.png"
import active3 from "../../assets/images/IP3_actived.png"

import default1 from "../../assets/images/IP1_default.png"
import default2 from "../../assets/images/IP2_default.png"
import default3 from "../../assets/images/IP3_default.png"

import bg from "../../assets/images/bg-role.png"
import box from "../../assets/images/box.png"
import boxShadow from "../../assets/images/box-shadow.png"

import win1 from "../../assets/images/IP1_actived_2.png"
import win2 from "../../assets/images/IP2_actived_2.png"
import win3 from "../../assets/images/IP3_actived_2.png"

export const images = {
    active1,
    active2,
    active3,
    default1,
    default2,
    default3,
    win1,
    win2,
    win3,
}

export default function Ui() {
    const roleList = useStore(state => state.roleList)
    const myRole = useStore(state => state.role)

    const index = roleList.indexOf(myRole)

    const leftRole = index === 0 ? roleList[roleList.length - 1] : roleList[index - 1]
    const rightRole = index === roleList.length - 1 ? roleList[0] : roleList[index + 1]

    return (
        <div className="role-container" style={{ backgroundImage: `url(${bg})`}}>
            <div className="text">
                <span> 请在手机选择你的化身 </span>
                <span> 开启你的迁徙之旅 </span>
            </div>
            <div className="carousel">
                <div className="left">
                    <img
                        src={images[`default${leftRole}`]}
                        style={{ width: "100%" }}
                        alt="IP"
                    />
                </div>
                <div className="current">
                    <img
                        src={images[`active${myRole}`]}
                        style={{ width: "100%" }}
                        alt="IP" 
                    />
                </div>
                <div className="right">
                    <img
                        src={images[`default${rightRole}`]}
                        style={{ width: "100%" }}
                        alt="IP"
                    />
                </div>
            </div>
            <div className="box-container">
                <div className="box" style={{ backgroundImage: `url(${box})` }}></div>
                <div className="box-shadow" style={{ backgroundImage: `url(${boxShadow})` }}></div>
            </div>
        </div>
    )
}
