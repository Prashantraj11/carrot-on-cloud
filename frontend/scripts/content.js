
// extracting contest id
const contest_Title=document.querySelector(".contest-name a").href;
let contestId=0;
for(const c of contest_Title){
    if('0'<=c && c<='9'){
        contestId*=10;
        contestId+=c-'0';
    }
}

const userList=new Set();

// extracting participants username
const table = document.querySelectorAll(".standings tbody .contestant-cell")
for(const user of table){
    let userName="";
    for(const c of user.textContent){
        if(c!==' ' && c!=='*' && c!=='#'){
            userName+=c;
        }
    }
    userList.add(userName);
}

const queryData={contestId,userList:[...userList]};



fetch("http://127.0.0.1:3000/contest",{
    method:"POST",
    headers: {
        'Content-Type': 'application/json', // Indicate the content type
    },
    body:JSON.stringify(queryData),
}).then(res=>res.json())
    .then((res)=> {
        console.log(res)
    }) .catch(error => {
    console.error('Error fetching data:', error); // Handle network errors
});

