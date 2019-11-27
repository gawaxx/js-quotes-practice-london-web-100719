// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

// API

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

const getApi = (url) => fetch(url).then(res => res.json())
const postApi = (url, quoteInfo) => fetch(url, {method: "POST", headers: headers, body: JSON.stringify(quoteInfo) }).then(res => res.json())
const deleteApi = (url) => fetch(url, {method: "DELETE"}).then(res => res.json())

const API = { getApi, postApi, deleteApi };
// const

const quoteURL = "http://localhost:3000/quotes";
const quoteWithLikesURL = "http://localhost:3000/quotes?_embed=likes";
const likeQuoteURL = "http://localhost:3000/likes"


const listCont = document.querySelector('#quote-list')

const newFormQuote = document.querySelector('#new-quote')
const newFormAuthor = document.querySelector('#author')
const submitButton = document.querySelector('#submitButton')

// code


document.addEventListener("DOMContentLoaded", function(){

    API.getApi(quoteWithLikesURL).then(data => data.forEach(quote => renderQuote(quote)) )

    submitButton.addEventListener('click', (e) => postApiStuff(e))

})



function renderQuote(quote) {
    
    const newLi = document.createElement('li')
    newLi.className = 'quote-card'

    const blockquote = document.createElement('blockquote')
    blockquote.className = "blockquote"

    const newP = document.createElement('p')
    newP.innerHTML = quote.quote
    newP.className = 'mb-0'

    //Footer 

    const footer = document.createElement('footer')
    footer.className = 'blockquote-footer'
    footer.innerHTML = quote.author

    // Below footer

    const newButton = document.createElement('button')
    newButton.className = 'btn-success'
    newButton.innerHTML = 'Likes: '
    const newSpan = document.createElement('span')
    newSpan.innerHTML = quote.likes.length

    const deleteButton = document.createElement('button')
    deleteButton.className = 'btn-danger'
    deleteButton.innerHTML = 'Delete'

    //Linkers

    newButton.append(newSpan)
    blockquote.append(newP, footer, newButton, deleteButton)
    newLi.append(blockquote)
    listCont.append(newLi)

    // Event listeners

    deleteButton.addEventListener('click', () => deleteQuote(newLi, quote))

    newButton.addEventListener('click', () => likeQuote(quote, newSpan))

}

function deleteQuote(newLi, quote) {
    newLi.remove()
    deleteSingleQuote(quote)
}

function likeQuote(quote, newSpan) {

    newSpan.innerHTML = parseInt(newSpan.innerHTML, 10) + 1

    let infoToPass = {
        quoteId: quote.id,
        createdAt: new Date().toISOString()
    }

    API.postApi(likeQuoteURL, infoToPass)

}


function postApiStuff(event) {
    event.preventDefault();

    let quoteText = newFormQuote.value
    let authorText = newFormAuthor.value

    let quoteInfo = {
        quote: quoteText,
        author: authorText,
        likes: []
    }
   
    API.postApi(quoteWithLikesURL, quoteInfo).then(quote => renderQuote(quote))
}

function deleteSingleQuote(quote) {
    API.deleteApi(`${quoteURL}/${quote.id}`)
}