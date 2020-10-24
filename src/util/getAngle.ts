export default function getAngle(arccos: number, arcsin: number) {
    if(arcsin >= 0) {
        return arccos
    } else {
        return 2 * Math.PI - arccos
    }
}
