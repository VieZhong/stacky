import React from "react"
import { useStore } from "../data/store"
import Slice from "./Slice"

export default function Fragments() {
    let fragments = useStore(state => state.fragments)

    return (
        <>
            {fragments.map(({ img, position, size, id }) => {
                return (
                    <Slice
                        // color={color}
                        img={img}
                        key={id}
                        position={position}
                        mass={size[0] * size[2] / 4}
                        size={size}
                    />
                )
            })}
        </>
    )
}
