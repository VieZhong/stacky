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

const images = [
    img6,
    img8,
    img9,
    img10,
    img7,
    img1,
    img2,
    img3,
    img4,
    img26,
    img5,
    img11,
    img12,
    img13,
    img14,
    img15,
    img16,
    img23,
    img17,
    img24,
    img18,
    img19,
    img21,
    img22,
    img25,
    img20,
    img27
]

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
}
