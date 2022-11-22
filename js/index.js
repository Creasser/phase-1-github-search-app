//Add event listener to the form and prevent the default functions, call on a GET fetch request when the user is passed into the form.
//need to make clearing functions when the a new user input is made and submitted. can do this by clearing the DOM tree each time a new submit is made
//need to make a card for each user profile

const form = document.querySelector('form')
form.addEventListener('submit', fetchAllUsers)

function fetchAllUsers(e){
    e.preventDefault()
    let userName = e.target.search.value
    fetch(`https://api.github.com/search/users?q=${userName}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json'
        }
    })
    .then(resp => resp.json())
    .then(users => initializeUsers(users))
}
function initializeUsers(users){
    clearDom(userList)
    clearDom(repoList)
    users.items.forEach(user => addOneUser(user))
    setTimeout(addBtnEvents, 1000)
}

//function to clear the DOM when a new search is made
function clearDom(el){
    let child = el.lastElementChild
    while (child) {
        el.removeChild(child)
        child = el.lastElementChild
    }
}

//function to create each card for the users 
let userList = document.querySelector('#user-list')

function addOneUser(user){
    let card = document.createElement('li')
    card.className = 'user'
    let userNameDiv = document.createElement('div')
    userNameDiv.className = 'userName'
    userNameDiv.textContent = user.login
    let userPic = document.createElement('img')
    userPic.src = user['avatar_url']
    let userUrl = document.createElement('a')
    userUrl.className = 'userLink'
    userUrl.href = user['html_url']
    userUrl.textContent = 'Link to profile'
    let repos = document.createElement('button')
    repos.id = user.login
    repos.className = 'repos'
    repos.textContent = 'Show repositorys'
    card.append(userPic, userNameDiv, userUrl, repos)
    userList.appendChild(card)
}

//build a function that adds event listeners to each btn

function addBtnEvents(){
    let repoBtns = document.getElementsByClassName('repos')
    Array.from(repoBtns).forEach((btn) => {
        btn.addEventListener('click', (e) => {
            fetchUserRepos(e.target.id)})
        })
}

//build a function that fetchs the userRepos, going to need another function to clear the DOM before pushing the new repos into it

function fetchUserRepos(user){
    fetch(`https://api.github.com/users/${user}/repos`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json'
        }
    })
    .then(resp => resp.json())
    .then(repos => initializeRepos(repos))
}

let repoList = document.querySelector('#repos-list')

function initializeRepos(repos){
    clearDom(repoList)
    repos.forEach(repo => createUserRepo(repo))
}
//full_name and html_url

function createUserRepo(repo){
    let repoName = document.createElement('div')
    repoName.textContent = repo.name
    let repoLink = document.createElement('a')
    repoLink.href = repo['html_url']
    repoLink.textContent = 'Click to view repo'
    repoList.append(repoName, repoLink)
}