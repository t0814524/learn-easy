/**
 * pixabay key  
 * user: learneasy   
 * email: saheco6824@javnoi.com  
 * pw: Learneasy123  
 */
let apiKey = "44033969-6bdc26296ed9b402226dc983f"

function getImg(q: string) {
    let url = "https://pixabay.com/api/"

    fetch(url).then(res => {
        console.log(res)
    })
}