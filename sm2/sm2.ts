/**
 * https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm
 */

export interface Card {
    /**
     * The repetition number n, which is the number of times the card has been successfully recalled (meaning it was given a grade ≥ 3) in a row since the last time it was not.  
     */
    n: number
    /**
     * The easiness factor EF, which loosely indicates how "easy" the card is (more precisely, it determines how quickly the inter-repetition interval grows). The initial value of EF is 2.5.
     */
    ef: number
    /**
     * The inter-repetition interval I, which is the length of time (in days) SuperMemo will wait after the previous review before asking the user to review the card again.
     */
    i: number

    /**
     * date as timestamp
     */
    due: number
}
let interval = 1000 * 60 * 1 // 2min //todo: ether hardcode or pass config

export function sm2(card: Card, q: number) {

    if (q < 0 || q > 5) throw new Error("invalid grade!");
    let n = card.n
    let ef = card.ef
    let i = card.i
    if (q >= 3) {
        // correct response
        if (n == 0) i = 1
        else if (n = 1) i = 6
        else i = Math.round(i * ef)
        n++ // increment n
    } else {
        // incorrect response
        n = 0
        i = 1
    }

    ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    if (ef < 1.3) ef = 1.3

    card.n = n
    card.ef = ef
    card.i = i
    if (q >= 4) card.due = new Date().getTime() + interval; // set new due date only if rating is >=4 
    // card.due.setDate(card.due.getDate() + card.i);
    return card
}