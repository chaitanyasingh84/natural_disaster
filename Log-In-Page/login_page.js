console.log("test")

const publicUserRB = document.getElementById("public");
const adminUserRB = document.getElementById("admin");

function redirect(){
    if(publicUserRB.checked){
        console.log("public user");
    }
    else if(adminUserRB.checked){
        console.log("admin user");
        window.location.assign('../index.html');
        //window.location.assign('../dashboard.html')
    }
}