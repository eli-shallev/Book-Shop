'use strict'

var gTrans = {
    appTitle: {
        en: 'My Book Shop',
        he: 'ניהול מלאי - חנות ספרים'
    },
    setRating: {
        en: 'Set Rating:',
        he: 'הגדר דירוג:'
    },
    setPrice: {
        en: 'Set Price:',
        he: 'הגדר מחיר:'
    },
    search: {
        en: 'Search Book',
        he: 'חפש ספר'
    },
    next: {
        en: '⏩',
        he: '⏪'
    },
    prev: {
        en: '⏪',
        he: '⏩'
    },
    add: {
        en: 'Add New Book',
        he: 'הוסף ספר חדש'
    },
    id: {
        en: 'id',
        he: 'מספר סידורי'
    },
    title: {
        en: 'Title',
        he: 'שם הכותר'
    },
    price: {
        en: 'Price',
        he: 'מחיר'
    },
    action: {
        en: 'Action',
        he: 'פעולות'
    },
    read:{
        en: 'Read',
        he: 'הצג'
    },
    update:{
        en: 'Update',
        he: 'עדכן'
    },
    delete:{
        en: 'Delete',
        he: 'מחק'
    },
    modalPrice: {
        en: 'Price:',
        he: 'מחיר:'
    },
    modalRating: {
        en: 'Rate:',
        he: 'דרג:'
    },
    modalClose: {
        en: 'Close',
        he: 'סגור'
    },
    bookName: {
        en: 'Book Name:',
        he: 'שם הספר:'
    },
    bookPrice: {
        en: 'Book Price:',
        he: 'מחיר הספר:'
    },
    btnAddBook: {
        en: 'Add Book',
        he: 'הוסף ספר'
    },
    newBookPrice: {
        en: 'New Book Price:',
        he: 'מחיר מעודן לספר:'
    },
    btnUpdatePrice: {
        en: 'Update Price',
        he: 'עדכן מחיר'
    },
    cardsPrice: {
        en: 'Price:',
        he: 'מחיר:'
    },
    cardsRating: {
        en: 'Rating:',
        he: 'דירוג:'
    },
    toggleLayout: {
        en: 'toggle Layout',
        he: 'שנה תצוגה'
    },
    rate: {
        en: 'Rate',
        he: 'דירוג'
    }
}


var gCurrLang = 'en'

function getTrans(transKey) {
    const key = gTrans[transKey]
    if (!key) return 'UNKNOWN'
    var translation = key[gCurrLang]
    if (!translation) translation = key.en
    return translation
}

function doTrans() {
    var els = document.querySelectorAll('[data-trans]')

    els.forEach(el => {
        const transKey = el.dataset.trans
        const translation = getTrans(transKey)

        el.innerText = translation

        // done: support placeholder    
        if (el.placeholder) el.placeholder = translation
    })
}

function setLang(lang) {
    gCurrLang = lang
}

function getCurrLang(){
    return gCurrLang
}