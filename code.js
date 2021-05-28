const apiBaseURL = "https://api.harvardartmuseums.org/";
const key = "501a94e8-dce9-4116-910a-53d9cfc6cd42";
const itemsPerPage = 10;
let currentPage = 1; 
let totalItems;

let prevUrl;
let nextUrl;

const starterUrl = `${apiBaseURL}image?apikey=${key}&size=${itemsPerPage}`;

const input = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-button');
const results = document.querySelector('#results');
const focus = document.querySelector('#focus-result');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const numberDisplay = document.querySelector('#page-number');


function getContent(url, parent) {
    results.textContent = '';
    focus.textContent = '';

    fetch(url).
        then(response => response.json()).
        then(data => {
            totalItems = data.info.totalrecords;
            numberDisplay.textContent = currentPage;

            console.log(currentPage, url);

            data.records.forEach((record) => {
                const div = document.createElement('div');
                const img = document.createElement('img');
                const p = document.createElement('p');
                const h = document.createElement('p');
                
                div.classList.toggle(parent === results ? 'flex-child' : 'focus');
                img.src = record.baseimageurl;
                p.textContent = record.alttext;
                h.textContent = record.id;
                h.classList.toggle('hidden');
                
                div.appendChild(img);
                div.appendChild(p);
                div.appendChild(h);

                parent.appendChild(div);
            });
        });
}


searchBtn.addEventListener('click',()=> {
    currentPage = 1;
    numberDisplay.textContent = currentPage;

    const title = input.value;
    const search = `q=caption:${title}&size=${itemsPerPage}`;
    const url = `${apiBaseURL}image?apikey=${key}&${search}`;
    
    getContent(url, results);
})

previous.addEventListener('click', ()=> {
    currentPage = currentPage <= 1 ? 1 : --currentPage;
    numberDisplay.textContent = currentPage;

    const title = input.value;
    const search = `q=caption:${title}&size=${itemsPerPage}&page=${currentPage}`;
    const url = `${apiBaseURL}image?apikey=${key}&${search}`;

    getContent(url, results);
})

next.addEventListener('click', ()=> {
    const totalPages = Math.floor(totalItems/itemsPerPage);
    currentPage = currentPage === totalPages ? totalPages : ++currentPage;
    numberDisplay.textContent = currentPage;

    const title = input.value;
    const search = `q=caption:${title}&size=${itemsPerPage}&page=${currentPage}`;
    const url = `${apiBaseURL}image?apikey=${key}&${search}`;

    getContent(url, results);
})

results.addEventListener('click',(evt)=> {
    if (evt.target !== evt.currentTarget) {
        numberDisplay.textContent = '';

        let div;

        switch (evt.target.nodeName) {
            case 'IMG':
                div = evt.target.parentNode;
                break;
            case 'P':
                div = evt.target.parentNode;
                break;
            case 'DIV':
                div = evt.target;
                break;
        }

        const h = div.querySelector('.hidden');
        const id = h.textContent;
        const search = `q=${id}&size=${itemsPerPage}`;
        const url = `${apiBaseURL}image?apikey=${key}&${search}`;
        
        getContent(url, focus);
    }
})


getContent(starterUrl, results);