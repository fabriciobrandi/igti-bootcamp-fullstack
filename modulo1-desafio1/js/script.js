let allUsers = [];
let filteredUsers = [];

let searchInput;
let searchButton;

let countMale = 0;
let countFemale = 0;
let countAges = 0;
let averageAges = 0;

let tabUserList;
let tabSumary;
let numberFormat = null;


window.addEventListener('load', () => {
    numberFormat = Intl.NumberFormat('pt-BR',{maximumFractionDigits: 2}); 

    searchInput =  document.querySelector('#searchInput');
    searchButton = document.querySelector('#searchButton');

    tabUserList = document.querySelector('#userList');
    tabSumary = document.querySelector('#sumary');

    searchInput.addEventListener('keyup',onSearchInputKeyUp);
    searchButton.addEventListener('click',searchUser);
    getUsersAsync();

  });

  const render = () =>{
     renderUserList();
     renderSummary();
}
const renderUserList = () =>{
    let filteredUsersHTML = `
    <div>
    <span class="countUsers"><h4>${filteredUsers.length} usuários(s) econtrados(s)</h4>`;

    filteredUsers.forEach(user =>{
        const {picture,name,age} = user;
        const UsersHTML =
        `
        <div class="user-information">
                <img src="${picture}" alt="image" class="circle responsive-img"> 
                <span class="user-detail">${name}, ${age} anos</span>
        </div>
        ` 
        filteredUsersHTML += UsersHTML;
    });
    filteredUsersHTML += '</div>'
    tabUserList.innerHTML = filteredUsersHTML;
}

const renderSummary = () =>{

    countMale = filteredUsers.filter(user => user.gender === 'male').length;
    countfemale = filteredUsers.filter(user => user.gender === 'female').length;
    countAges = filteredUsers.reduce((acc,cur) =>{
        return acc + cur.age
    },0);
    
    
    countAverageAges =  countAges !== 0 ? formatNumber(countAges / filteredUsers.length) : 0;

    const UsersHTML =
    `
    <h4>Estatisticas</h4>
    <p>Sexo masculino: <strong>${countMale}</strong></p>
    <p>Sexo feminino: <strong>${countfemale}</strong></p>
    <p>Soma das idades: <strong>${countAges}</strong></p>
    <p>Media das idades: <strong>${countAverageAges}</strong></p>
    ` 
    tabSumary.innerHTML = UsersHTML;
}

const formatNumber = (number) =>{
    console.log('number' + number)
    return numberFormat.format(number);
}

const onSearchInputKeyUp = (event) =>{
    toggleButtonClass();
    if(event.key === 'Enter' && searchInput.value !== ''  ){
        searchUser();
    }
}

const toggleButtonClass = () =>{
    if(searchInput.value === ''){
        searchButton.classList.add('disabled');
    }else{
        searchButton.classList.remove('disabled');
    }
}

const searchUser = () =>{
    filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().indexOf(searchInput.value.toLowerCase()) > -1);
    render();
}

const getUsersAsync = async () =>{
    const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
    const json = await res.json();
    
    allUsers = json.results.map(user => {
        const {name,picture,dob,gender} = user

        return {
        name: `${name.first} ${name.last}` ,
        picture:picture.thumbnail,
        age:dob.age,
        gender
        }
    });

    allUsers.sort((a,b) =>{
        return a.name.localeCompare(b.name);
    })
  }