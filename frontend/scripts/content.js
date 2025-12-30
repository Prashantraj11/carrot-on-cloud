
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
    userList.add(user.textContent.replace(/[ *#]/g, "").trim());
}

const queryData={contestId,userList:[...userList]};

function updatePage(res){
    const data={};
    for(const user of res){
        data[user.handle]={"delta":user.delta,"performance":user.performance};
    }
    const location =document.querySelector(".standings tr");
    const pref=document.createElement("th")
    const delta=document.createElement("th")
    pref.textContent="Performance";
    delta.textContent="Delta";
    location.append(pref);
    location.append(delta);

    const table = document.querySelectorAll(".standings tbody tr");

    for(let i=1;i<table.length-1;i++){
        const user=table[i];
        const handle=user.querySelector(".contestant-cell")

        const userName=handle.textContent.replace(/[ *#]/g, "").trim();

        if(data[userName]===undefined)continue;


        const userPref=data[userName]["performance"];
        const userDelta=data[userName]["delta"];

        const pref=document.createElement("td")
        const delta=document.createElement("td")
        pref.textContent=userPref;
        delta.textContent=userDelta;
        user.append(pref);
        user.append(delta);
    }
}

fetch("http://127.0.0.1:3000/contest",{
    method:"POST",
    headers: {
        'Content-Type': 'application/json', // Indicate the content type
    },
    body:JSON.stringify(queryData),
}).then(res=>res.json())
    .then((res)=> {
        console.log(res)
        updatePage(res);
    }) .catch(error => {
    console.error('Error fetching data:', error); // Handle network errors
});

