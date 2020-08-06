import { ImageLoader } from "three"
import img1 from "../../assets/images/p1.png"
import img11 from "../../assets/images/p11.png"
import img12 from "../../assets/images/p12.png"
import img13 from "../../assets/images/p13.png"
import img14 from "../../assets/images/p14.png"
import img15 from "../../assets/images/p15.png"
import img16 from "../../assets/images/p16.png"
import img17 from "../../assets/images/p17.png"
import img18 from "../../assets/images/p18.png"
import img19 from "../../assets/images/p19.png"
import img2 from "../../assets/images/p2.png"
import img21 from "../../assets/images/p21.png"
import img22 from "../../assets/images/p22.png"
import img23 from "../../assets/images/p23.png"
import img24 from "../../assets/images/p24.png"
import img25 from "../../assets/images/p25.png"
import img26 from "../../assets/images/p26.png"
import img27 from "../../assets/images/p27.png"
import img20 from "../../assets/images/p20.png"
import img3 from "../../assets/images/p3.png"
import img4 from "../../assets/images/p4.png"
import img5 from "../../assets/images/p5.png"
import img6 from "../../assets/images/p6.png"
import img7 from "../../assets/images/p7.png"
import img8 from "../../assets/images/p8.png"
import img9 from "../../assets/images/p9.png"
import img10 from "../../assets/images/p10.png"

import s1 from "../../assets/images/story1.png"
import s2 from "../../assets/images/story2.png"
import s3 from "../../assets/images/story3.png"
import s4 from "../../assets/images/story4.png"
import s5 from "../../assets/images/story5.png"
import s6 from "../../assets/images/story6.png"
import s7 from "../../assets/images/story7.png"
import s8 from "../../assets/images/story8.png"
import s9 from "../../assets/images/story9.png"

const images = [
    img6, // 1
    img8, // 2
    img9, // 3
    img10, // 4
    img7, // 5
    img1, // 6
    img2, // 7
    img3, // 8
    img4, // 9
    img26, // 10
    img5, // 11
    img11, // 12
    img12, // 13
    img13, // 14
    img14, // 15
    img15, // 16
    img16, // 17
    img23, // 18
    img17, // 19
    img24, // 20
    img18, // 21
    img19, // 22
    img21, // 23
    img22, // 24
    img25, // 25
    img20, // 26
    img27 // 27
]

const type = [
    2, //lancome 1
    3, // apm 2
    4, // converse 3
    5, // hermes 4
    6, // guerlain 5
    7, // givinchy 6
    1, // lv 7
    3, // 8
    6, // 9
    5, // 10
    3, // 11
    8, // dior 12
    9, // sisley 13
    9, // 14
    1, // 15
    1, // 16
    2, // 17
    6, // 18
    4, // 19
    7, // 20
    8, // 21
    8, // 22
    2, // 23
    7, // 24
    5, // 25
    4, // 26
    9 // 27
]

const story = {
    1: s1,
    2: s2,
    3: s3,
    4: s4,
    5: s5,
    6: s6,
    7: s7,
    8: s8,
    9: s9,
}

export default class ImgMixer {
    static imgs = images.map(img => new ImageLoader().load(img))
    static i = 0

    static previous() {
        return this.imgs[this.i]
        // return this.i > 0 ? this.imgs[this.i - 1]: this.imgs[0]
    }
    static next() {
        this.i = (this.i + 1) % images.length
        return this.imgs[this.i]
    }
    static reset() {
        this.i = 0
    }
    static getStoryImg() {
        return story[type[this.i]]
    }
}
