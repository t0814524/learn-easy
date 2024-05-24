/**
 * pixabay key  
 * user: learneasy   
 * email: saheco6824@javnoi.com  
 * pw: Learneasy123  
 */
let apiKey = "44033969-6bdc26296ed9b402226dc983f"

export function getImg(q: string) {
    let url = `https://pixabay.com/api/?key=${apiKey}&q=${q}`

    return fetch(url).then(res => {

        return res.json().then(res => {
            let firstHit = res.hits[0].webformatURL
            console.log(firstHit)
            return firstHit
        })
        //     .catch(err => {
        //         console.error("err in get img")
        //         console.error(err)
        //     })
        // }).catch(err => {
        //     console.error("err in get img")
        //     console.error(err)
    })
}