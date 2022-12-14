'use srtict'
const STORAGE_KEY = 'booksDB'
const LAYOUT_STORAGE_KEY = 'favLayout'
const PAGE_SIZE_TABLE_LAYOUT = 3
const PAGE_SIZE_CARDS_LAYOUT = 4

var gBooks
var gFilterBy = { name: '', price: 0, rate: 0 }
var gPageIndex = 0
var gCurrModal = { state: 'closed', bookId: '' }
var gCurrLayout = 'table'

_createBooks()

function getBooksForDisplay() {
    var books = gBooks.filter(book => {
        var name = turnToLowerCase(book.name)
        var filterName = turnToLowerCase(gFilterBy.name)
        return (name.includes(filterName) && (book.price >= gFilterBy.price) && (book.rate >= gFilterBy.rate))
    })
    const pageSize = gCurrLayout === 'table'? PAGE_SIZE_TABLE_LAYOUT : PAGE_SIZE_CARDS_LAYOUT
       
    const startIdx = gPageIndex * pageSize
    const endIdx = startIdx + pageSize

    if (endIdx >= books.length - 1) {
        disableNextBtn()
    } else {
        enableNextBtn()
    }

    if (startIdx === 0) {
        disablePrevBtn()
    } else {
        enablePrevBtn()
    }

    return books.slice(startIdx, endIdx)
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(bookIdx, 1)
    saveToStorage(STORAGE_KEY, gBooks)
}

function addBook(name, price) {
    const book = _createBook(name, price, 'img/abc.jpg')
    gBooks.unshift(book)
    saveToStorage(STORAGE_KEY, gBooks)
}

function updateBook(bookId, price) {
    const book = gBooks.find(book => book.id === bookId)
    book.price = price
    saveToStorage(STORAGE_KEY, gBooks)
}
function getBookById(bookId) {
    return gBooks.find(book => book.id === bookId)
}

function getDescription() {
    return makeLorem(40)
}

function updateBookRating(bookId, value) {
    const book = gBooks.find(book => book.id === bookId)
    book.rate = value
    saveToStorage(STORAGE_KEY, gBooks)
}

function setBookFilter(filterBy) {
    gPageIndex = 0
    if (filterBy.name !== undefined) gFilterBy.name = filterBy.name
    if (filterBy.price !== undefined) gFilterBy.price = filterBy.price
    if (filterBy.rate !== undefined) gFilterBy.rate = filterBy.rate
}

function setUrlByQueryParams() {
    const filterBy = getFilterBy()
    const lang = getCurrLang()
    const modalBookId = getCurrModal().bookId
    const currModalState = getCurrModal().state

    const queryStringParams = `?lang=${lang}&modal=${currModalState}&bookId=${modalBookId}&name=${filterBy.name}&price=${filterBy.price}&rate=${filterBy.rate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}

function getFilterBy() {
    return gFilterBy
}

function updatePage(dir) {
    gPageIndex += dir
}

function setCurrModal(modalState, bookId) {
    gCurrModal.state = modalState
    gCurrModal.bookId = bookId
}

function getCurrModal() {
    return gCurrModal
}

function setBookSort(sortBy) {
    gPageIndex = 0
    if (sortBy.price !== undefined) {
        gBooks.sort((b1, b2) => (b1.price - b2.price) * sortBy.price)
    } else if (sortBy.title !== undefined) {
        gBooks.sort((b1, b2) => b1.name.localeCompare(b2.name) * sortBy.title)
    }

    saveToStorage(STORAGE_KEY, gBooks)
}

function getCurrLayout() {
    return gCurrLayout
}

function setCurrLayout(layout) {
    gCurrLayout = layout
    saveToStorage(LAYOUT_STORAGE_KEY, gCurrLayout)
}

function _createBook(name, price, imgUrl) {
    return {
        id: makeId(),
        name: name,
        price: price,
        imgUrl: imgUrl,
        rate: 0
    }
}

function _createBooks() {
    gBooks = loadFromStorage(STORAGE_KEY)
    if (!gBooks || !gBooks.length) {
        gBooks = [
            _createBook('The Lord of the Rings', getRandomIntInclusive(20, 100), 'img/lotr.jpg'),
            _createBook('Enders Game', getRandomIntInclusive(20, 100), 'img/eg.jpg'),
            _createBook('The End Of Mr. Y', getRandomIntInclusive(20, 100), 'img/teomy.jpg'),
            _createBook('The Art of Hearing Heartbeats', getRandomIntInclusive(20, 100), 'img/taohh.jpg'),
            _createBook('The Hitchhikers Guide to the Galaxy', getRandomIntInclusive(20, 100), 'img/thgttg.jpg'),
            _createBook('Across the Nightingale Floor', getRandomIntInclusive(20, 100), 'img/atnf.jpg'),
            _createBook('Brilliance of the Moon', getRandomIntInclusive(20, 100), 'img/Botm.jpg'),
            _createBook('The Harsh Cry of the Heron', getRandomIntInclusive(20, 100), 'img/thcoth.jpg'),
            _createBook('The Way of Kings', getRandomIntInclusive(20, 100), 'img/twok.jpg'),
            _createBook('Words of Radiance', getRandomIntInclusive(20, 100), 'img/wor.jpg'),
            _createBook('Oathbringer', getRandomIntInclusive(20, 100), 'img/ob.jpg'),
            _createBook('Rhythm of War', getRandomIntInclusive(20, 100), 'img/row.jpg'),
            _createBook('Assassins Apprentice', getRandomIntInclusive(20, 100), 'img/aa.jpg'),
            _createBook('Royal Assassin', getRandomIntInclusive(20, 100), 'img/ra.jpg'),
            _createBook('Assassins Quest', getRandomIntInclusive(20, 100), 'img/aq.jpg'),
            _createBook('The Hobbit', getRandomIntInclusive(20, 100), 'img/hobbit.jpg'),
            _createBook('The Girl with the Dragon Tattoo', getRandomIntInclusive(20, 100), 'img/gwdt.jpg'),
            _createBook('Grass for His Pillow', getRandomIntInclusive(20, 100), 'img/gfhp.jpg')
        ]
    }
    saveToStorage(STORAGE_KEY, gBooks)

    gCurrLayout = loadFromStorage(LAYOUT_STORAGE_KEY)
    if (!gCurrLayout) gCurrLayout = 'table'
    saveToStorage(LAYOUT_STORAGE_KEY, gCurrLayout)
}
