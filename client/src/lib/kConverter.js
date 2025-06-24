export const kConverter = (num)=> {
    if (num >= 10) {
        return (num / 1000).toFixed(1) + "k"
    } else {
        return num
    }
}