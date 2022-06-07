const books = [];
const RENDER_EVENT = 'render-buku';
const SAVED_EVENT = 'saved-render';
const STORAGE_KEY = 'Books_Lists';
const modal = document.getElementById('myModal');

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function saveData() { 
    if (checkStorage()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

function checkStorage(){
    if(typeof(Storage) === undefined){
        alert('Browser kamu tidak memiliki local storage');
        return false;
    }
    return true;
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

function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }
  
  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
    return -1;
  }

  function createBook(bookObject){
    const {id, title, author, year, isComplete} = bookObject;

    const textTitle = document.createElement('h4');
    textTitle.innerText = title;
    textTitle.classList.add('card-title');

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${author}`;
    textAuthor.classList.add('card-subtitle','mb-2','text-muted');

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${year}`;
    textYear.classList.add('card-text');

    const textContainer = document.createElement('div');
    textContainer.classList.add('card-body');
    textContainer.append(textTitle, textAuthor, textYear);

    const bookContainer = document.createElement('div');
    bookContainer.classList.add('card', 'w-75', 'h-75', 'mx-auto');
    bookContainer.style.margin = '2px';
    bookContainer.setAttribute('id',`book-${id}`);
    bookContainer.append(textContainer);

    if (isComplete) {

        const undoneButton = document.createElement('button');
        const undoneIcon = document.createElement('i');
        undoneButton.classList.add('btn','btn-outline-dark');
        undoneIcon.classList.add('fa','fa-undo');
        undoneButton.append(undoneIcon);
        undoneButton.addEventListener('click', function(){
            moveToUndone(id);
        });

        const trashButton = document.createElement('button');
        const trashIcon = document.createElement('i');
        trashButton.classList.add('btn','btn-outline-danger');
        trashIcon.classList.add('fa','fa-trash-o');
        trashButton.append(trashIcon);
        trashButton.addEventListener('click', function(){
            modal.style.display = 'block';
            const cancelButton = document.getElementById('cancel');
            cancelButton.addEventListener('click',function(){
                modal.style.display = 'none';
            });

            const confirmButton = document.getElementById('confirm');
            confirmButton.addEventListener('click', function(){
                removeBook(id);
                modal.style.display = 'none';
            });
        });


        textContainer.append(undoneButton, trashButton);

    }else{

        const doneButton = document.createElement('button');
        const doneIcon = document.createElement('i');
        doneButton.classList.add('btn','btn-outline-success');
        doneIcon.classList.add('fa','fa-check');
        doneButton.append(doneIcon);
        doneButton.addEventListener('click', function(){
            moveToDone(id);
        })

        const trashButton = document.createElement('button');
        const trashIcon = document.createElement('i');
        trashButton.classList.add('btn','btn-outline-danger');
        trashIcon.classList.add('fa','fa-trash-o');
        trashButton.append(trashIcon);
        trashButton.addEventListener('click', function(){
            modal.style.display = 'block';
            const cancelButton = document.getElementById('cancel');
            cancelButton.addEventListener('click',function(){
                modal.style.display = 'none';
            });

            const confirmButton = document.getElementById('confirm');
            confirmButton.addEventListener('click', function(){
                removeBook(id);
                modal.style.display = 'none';
            });
        });

        textContainer.append(doneButton, trashButton);
    }

    return bookContainer;

  }

  function addBook() {
      const id = generateID();
      const bookTitle = document.getElementById('judul').value;
      const bookAuthor = document.getElementById('penulis').value;
      const bookYear = document.getElementById('tahun').value;
      const bookStatus = document.querySelector('.form-check-input:checked');
      const isComplete = bookStatus === null? false : true;

      const objectBook = generateBookObject(id, bookTitle, bookAuthor, bookYear, isComplete);
      books.push(objectBook);
      if(nullCheck()){
          location.reload();
      }
      else{
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
      }
  }

  function moveToDone(id) {
    const bookTarget = findBook(id);
    if(bookTarget === null) return;
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function moveToUndone(id) {
    const bookTarget = findBook(id);
    if(bookTarget === null) return;
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }


  function removeBook(id) {
    const bookTarget = findBookIndex(id);
    if(bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function clear(){
    document.getElementById('judul').value = '';
    document.getElementById('penulis').value = '';
    document.getElementById('tahun').value = '';
    document.getElementById('search').value = '';
    document.getElementById('checkBox').removeAttribute('Checked');
    
  }

  function nullCheck(){
    for (const index in books) {
        if (books[index].title === '' || books[index].author === '' || books[index].year === '') {
            alert('Data tidak boleh kosong');
            return true;
        }
      }
      return false;
      
  }

  function searchBooks(){
    const searchTitle = document.getElementById('search').value;
    const matchedBooks = [];
    for (const bookItem of books) {
        const match = bookItem.title.search(searchTitle);
        if (match !== -1) {
          matchedBooks.push(bookItem);
        }
      }
      
    if(matchedBooks === null) return null;

    return matchedBooks;

  }

  document.getElementById('search-button').addEventListener('click', function(){
    document.dispatchEvent(new Event(RENDER_EVENT));
  });

  document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('book-form');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
      
    });
  
    if (checkStorage()) {
      loadDataFromStorage();
    }
    clear();
  });

  document.addEventListener(RENDER_EVENT, function () {

    const undoneBookLists = document.getElementById('buku-belum-dibaca'); 
    const doneBookLists = document.getElementById('buku-sudah-dibaca');
    const searching = searchBooks();
    undoneBookLists.innerHTML = '';
    doneBookLists.innerHTML= ''; 
    

        for (const bookItem of books) {
            for (const searchItem of searching){
                if(bookItem.id === searchItem.id){
                    const bookElement = createBook(bookItem);
                    if (bookItem.isComplete) {
                    doneBookLists.append(bookElement);
                    } else {
                    undoneBookLists.append(bookElement);
                    }
                }
            }
          }
          clear();
  });
  
  document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
    const snackbar = document.getElementById('snackbar');
    snackbar.classList.add('show');
    setTimeout(function(){
      snackbar.classList.remove('show');
    },3000);
  });
  
  