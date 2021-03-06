import React, { useState, useEffect, useRef } from "react"
import { Box, Vec3 } from "cannon"
import { DoubleSide } from "three"
import { useCannon } from "../utils/cannon"
import Config from "../Config"
import Only from "./Only"
import anime from "animejs"

export default function Slice({
    position,
    mass = 0,
    size = [1, 1, 1],
    // color,
    img,
    directHit
}) {
    let planeRef = useRef()
    let [body, setBody] = useState(null)
    let [hasDirectHit, setHasDirectHit] = useState(directHit)
    let [sizeAddition, setSizeAddition] = useState(0)
    let [opacity, setOpacity] = useState(1)
    let ref = useCannon(
        { mass },
        body => { 
            body.addShape(new Box(new Vec3(size[0] / 2, size[1] / 2, size[2] / 2)))
            body.position.set(...position)

            if (mass > 0) {
                // let random = (min, max) => Math.random() * (max - min) + min
                let point = body.position.clone()

                // point.x += random(-size[0] / 2, size[0] / 2)
                // point.z += random(-size[2] / 2, size[2] / 2)
    
                body.applyImpulse(new Vec3(0, -mass * .6, 0), point) 
            }

            setBody(body)
        }
    )

    useEffect(() => {
        if (body) {
            body.position.set(...position)
        }
    }, [body, position])

    useEffect(() => {
        if (directHit) {
            let targets = { sizeAddition, opacity }

            anime({
                targets,
                sizeAddition: .95,
                opacity: 0,
                duration: 800,
                delay: 0,
                easing: "easeOutQuart",
                update() {
                    setSizeAddition(targets.sizeAddition)
                    setOpacity(targets.opacity)
                },
                complete() {
                    setHasDirectHit(false)
                }
            })
        }
    }, [directHit])

    return (
        <>
            <Only if={hasDirectHit}>
                <mesh
                    ref={planeRef}
                    position={[position[0], position[1] + size[1] / 2 - Config.SLICE_HEIGHT, position[2]]}
                    rotation-x={Math.PI / 2}
                >
                    <planeBufferGeometry attach="geometry" args={[size[0] + sizeAddition, size[2] + sizeAddition, 1]} />
                    <meshLambertMaterial transparent opacity={opacity} side={DoubleSide} color={0xFFFFFF} attach="material" />
                </mesh>
            </Only>

            <mesh ref={ref}>
                <boxBufferGeometry attach="geometry" args={size} />
                {img ? 
                    <meshPhongMaterial attach="material">
                        <texture 
                            attach="map" 
                            image={img} 
                            needsUpdate={!!img}
                        />
                    </meshPhongMaterial>
                    : <meshPhongMaterial color="#78a5e7" attach="material" />
                }
            </mesh>
        </>
    )
}
