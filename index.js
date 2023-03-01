fetchData = [];

function newsCategoryFind() {
    const url = 'https://openapi.programming-hero.com/api/news/categories';
    fetch(url)
        .then(res => res.json())
        .then(data => {
            newsCategoryShow(data.data.news_category)
        })
}

function newsCategoryShow(data) {
    const navUl = document.getElementById('get-ul');
    data.forEach(item => {
        const {category_name, category_id} = item
        const li = document.createElement('li');
        li.classList.add('nav-item')
        li.innerHTML = `
        <button onClick="getNewsCategory('${category_id}','${category_name}')" type="button" class="btn btn-dark mx-3">${category_name}</button>
        `
        navUl.appendChild(li);
    })
}


function getNewsCategory(data, name) {
    const url = `https://openapi.programming-hero.com/api/news/category/${data}`
    fetch(url)
        .then(res => res.json())
        .then(data => {
            fetchData = data.data;
            showNewsCategory(data.data.length, name)
            getCategoryNews(data.data)
        })
}

function showNewsCategory(value, name) {
    document.getElementById('item-number').innerText = value;
    document.getElementById('item-name').innerText = name;
}

function getCategoryNews(data) {
    const card = document.getElementById('news-card');
    card.innerHTML = '';
    data.forEach(item => {
        const {image_url, title, details, author, total_view, rating, _id} = item
        const div = document.createElement('div');
        div.classList.add('card', 'mb-3', 'w-100')
        div.innerHTML = `
        <div class="row g-0">
                    <div class="col-md-4">
                        <img style="height:100%" src="${image_url}" class="img-fluid rounded-start" alt="...">
                    </div>
                    <div class="col-md-8 d-flex flex-column">
                    
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                            <p class="card-text">${details.slice(0, 200)}...</p>
                        </div>
                        
                        <div class="card-footer border-0 bg-body d-flex justify-content-between align-items-center">
                            <div class="d-flex gap-2">
                                <img class="rounded-circle" style="width:50px" src="${author.img}">
                                <div>
                                    <h6 class="mb-0">${author.name ? author.name : 'Not Found'}</h6>
                                    <small>${author.published_date}</small>
                                </div>
                            </div>
                            
                            <div>
                                <i class="fa-solid fa-eye"></i>
                                <small>${total_view ? total_view : 'Not Found'}</small>
                            </div>
                            
                            <div>
                            ${generateStar(rating.number)}
                                <small>${rating.number}</small>
                            </div>
                            
                            <div>
                                <i onClick="fetchNewsDetails('${_id}')" class="fa-solid fa-arrow-right" data-bs-toggle="modal"
                                data-bs-target="#exampleModal" style="cursor: pointer; padding:15px"></i>
                            </div>
                        </div>
                        
                    </div>
                </div>
        `
        card.appendChild(div)
    })
}

function fetchNewsDetails(id) {
    const url = `https://openapi.programming-hero.com/api/news/${id}`
    fetch(url)
        .then(res => res.json())
        .then(data => showNewsDetails(data.data[0]))
}

function showNewsDetails(item) {
    console.log(item);
    const {image_url, title, details, others_info} = item
    document.getElementById('modal-div').innerHTML = `
    <div class="modal-content">
    
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">${title} ${others_info.is_trending ? '<span class="badge text-bg-warning">Trending</span>' : ''} </h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal"
                aria-label="Close"></button>
        </div>
        
        <div class="modal-body">
            <img src="${image_url}" class="img-fluid rounded-start" alt="...">
            <p class="card-text my-2">${details}</p>
        </div>
        
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary"
                data-bs-dismiss="modal">Close</button>
        </div>
    </div>
    `;
}

function fetchTodaysNews() {
    let todayNews = fetchData.filter(data => data.others_info.is_todays_pick === true)
    const name = document.getElementById('item-name').innerText;
    getCategoryNews(todayNews)
    showNewsCategory(todayNews.length, name)
}

function fetchTrending() {
    let trending = fetchData.filter(data => data.others_info.is_trending === true)
    getCategoryNews(trending)
    const name = document.getElementById('item-name').innerText;
    showNewsCategory(trending.length, name)
}

function generateStar(rating) {
    let starIcon = ''
    for (let i = 1; i <= Math.floor(rating); i++) {
        starIcon += `<i class="fa-solid fa-star"></i> `;
    }
    if (rating - Math.floor(rating) > 0) {
        starIcon += `<i class="fa-solid fa-star-half-stroke"></i>`;
    }
    return starIcon;
}



function allData() {
    getNewsCategory('08', 'All News')
}