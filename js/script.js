const buku = [];
const RENDER_EVENT = 'render-buku';
const SAVED_EVENT = 'saved-render';
const STORAGE_KEY = 'Books_Lists';

function checkStorage(){
    if(typeof(Storage) === undefined){
        alert('Browser kamu tidak memiliki local storage');
    }
    return false;
}

function generateID(){
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete){
    return {
        id,
        title,
        author,
        year,
        isComplete,
    }
}