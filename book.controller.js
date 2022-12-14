'use strict'
var gUpdatedBookId //global used only in the controller
function onInit() {
    doTrans()
    renderFilterByQueryStringParams()
    renderModalStateByQueryStringParams()
    renderLangByQueryStringParams()
    renderLayoutOnInit()
    renderBooks()
}

function renderBooks() {
    const books = getBooksForDisplay()

    if (getCurrLayout() === 'table') {
        const strHTML = books.map(book => {
            return `<tr>
            <td class="id-td">${book.id}</td>
            <td class="title-td"><span>${book.name}</span><div class = "img-container"><img src="${book.imgUrl}"></div></td>
            <td class="price-rate-td">$${book.price}</td>
            <td class="price-rate-td">${book.rate}</td>
            <td class="btn-td"><button data-trans="read" class="btn btn-read" onClick="onReadBook('${book.id}')">Read</button></td>
            <td class="btn-td"><button data-trans="update" class="btn btn-update" onClick="onOpenUpdateBook('${book.id}')">Update</button></td>
            <td class="btn-td"><button data-trans="delete" class="btn btn-delete" onClick="onRemoveBook('${book.id}')">Delete</button></td>
        </tr>`
        })
        const elTbody = document.querySelector('.book-container')
        elTbody.innerHTML = strHTML.join('')
    }

    if (getCurrLayout() === 'cards') {
        const strHTML = books.map(book => `
    <article class="book-preview">
        <button class="btn-remove" onclick="onRemoveBook('${book.id}')">X</button>
        <h5>${book.name}</h5>
        <h6> <span data-trans="cardsPrice">Price:</span> <span>${book.price}</span> </h6>
        <h6><span data-trans="cardsRating">Rating: </span> <span>${book.rate}</span> </h6>
        <img src="${book.imgUrl}" alt="${book.name}">
        <button data-trans="read" class="btn btn-read" onclick="onReadBook('${book.id}')">Details</button>
        <button data-trans="update" class="btn btn-update" onclick="onOpenUpdateBook('${book.id}')">Update</button>
    </article> 
    `
        )
        document.querySelector('.books-card-container').innerHTML = strHTML.join('')
    }

    const elModal = document.querySelector('.modal')
    if (getCurrModal().state === 'open') {
        updateModal(getCurrModal().bookId)
        elModal.classList.add('open')
    } else {
        elModal.classList.remove('open')
    }

    doTrans()
}

function onToggleLayout(){
    if(getCurrLayout()==='table'){
        setCurrLayout('cards')
        document.querySelector('table').classList.add('hide')
        document.querySelector('.books-card-container').classList.remove('hide')
    } else{
        setCurrLayout('table')
        document.querySelector('.books-card-container').classList.add('hide')
        document.querySelector('table').classList.remove('hide')
    }
    renderBooks()
}

function renderLayoutOnInit(){
    if(getCurrLayout()==='cards'){
        document.querySelector('table').classList.add('hide')
        document.querySelector('.books-card-container').classList.remove('hide')
    } else{
        document.querySelector('.books-card-container').classList.add('hide')
        document.querySelector('table').classList.remove('hide')
    }
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
}

function onAddBook(ev) {
    ev.preventDefault()
    var name = document.querySelector('[name="book-name"]').value
    name += ''
    const words = name.split(' ')
    const wordsMap = words.map(word => { return word.charAt(0).toUpperCase() + word.slice(1) })
    name = wordsMap.join(' ')
    const price = document.querySelector('[name="book-price"]').value
    addBook(name, price)
    renderBooks()
    document.querySelector('.add-section').classList.add('hide')
}

function onOpenAddBook() {
    document.querySelector('.add-section').classList.remove('hide')
}

function onUpdateBook(ev) {
    ev.preventDefault()
    const price = document.querySelector('[name="new-book-price"]').value
    updateBook(gUpdatedBookId, price)
    document.querySelector('.update-section').classList.add('hide')
    renderBooks()
}

function onOpenUpdateBook(bookId) {
    gUpdatedBookId = bookId
    document.querySelector('.update-section').classList.remove('hide')
}

function onReadBook(bookId) {
    updateModal(bookId)
    setCurrModal('open', bookId)
    setUrlByQueryParams()
    renderBooks()
}

function updateModal(bookId) {
    const book = getBookById(bookId)
    const elModalNameHolder = document.querySelector('.modal-name-holder')
    const elModalPriceHolder = document.querySelector('.modal-price-holder')
    const elModalRateHolder = document.querySelector('.rate-holder')
    const elModalDescriptionHolder = document.querySelector('.modal-description-holder')
    const elModalImgHolder = document.querySelector('.modal-img-holder')

    elModalNameHolder.innerText = book.name
    elModalPriceHolder.innerText = book.price
    elModalRateHolder.innerHTML = `<input type="number" min="0" max="10" value="${book.rate}" onchange="onRateBook('${book.id}',this.value)"></input>`
    elModalDescriptionHolder.innerText = getDescription()
    elModalImgHolder.innerHTML = `<img class="modal-img" src=${book.imgUrl}>`
}

function onCloseModal() {
    setCurrModal('closed')
    setUrlByQueryParams()
    renderBooks()
}

function onRateBook(bookId, value) {
    updateBookRating(bookId, value)
    renderBooks()
}

function onSetFilterBy(filterBy) {
    setBookFilter(filterBy)
    renderBooks()
    setUrlByQueryParams()
}

function onPrevPage() {
    updatePage(-1)
    renderBooks()
}
function onNextPage() {
    updatePage(1)
    renderBooks()
}
function disableNextBtn() {
    document.querySelector('.btn-next').disabled = true
}
function enableNextBtn() {
    document.querySelector('.btn-next').disabled = false
}
function disablePrevBtn() {
    document.querySelector('.btn-prev').disabled = true
}
function enablePrevBtn() {
    document.querySelector('.btn-prev').disabled = false
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        name: queryStringParams.get('name') || '',
        price: +queryStringParams.get('price') || 0,
        rate: +queryStringParams.get('rate') || 0
    }

    document.querySelector('.search').value = filterBy.name
    document.querySelector('.range-price').value = filterBy.price
    document.querySelector('.range-rate').value = filterBy.rate
    setBookFilter(filterBy)
}

function renderLangByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const lang = queryStringParams.get('lang') === null ? 'en' : queryStringParams.get('lang')
    onSetLang(lang)
}
function renderModalStateByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const currModalState = queryStringParams.get('modal') === null ? 'closed' : queryStringParams.get('modal')
    const bookId = queryStringParams.get('bookId') === null ? '' : queryStringParams.get('bookId')
    setCurrModal(currModalState, bookId)
}

function onSetLang(lang) {
    setLang(lang)

    if (lang === 'he') document.body.classList.add('rtl')
    else document.body.classList.remove('rtl')
    setUrlByQueryParams()
    doTrans()
}

function onSort(prop, el) {
    const direction = el.dataset.direction
    const sortBy = {}
    var isDesc
    const elArrows = document.querySelectorAll('.arrow-direction')
    elArrows.forEach((item, idx, arr) => {
        if (item !== el) arr[idx].innerText = ''
    })



    if (direction === 'up') {
        el.querySelector('.arrow-direction').innerText = '⬇'
        isDesc = false
        el.dataset.direction = 'down'
    } else if (direction === 'down') {
        el.querySelector('.arrow-direction').innerText = '⬆'
        isDesc = true
        el.dataset.direction = 'up'
    }

    sortBy[prop] = (isDesc) ? -1 : 1

    setBookSort(sortBy)
    renderBooks()
}
