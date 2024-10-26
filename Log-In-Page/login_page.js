console.log("test")

const publicUserRB = document.getElementById("public");
const adminUserRB = document.getElementById("admin");

function redirect(){
    if(publicUserRB.checked){
        console.log("public user");
        window.location.assign('../index.html');
    }
    else if(adminUserRB.checked){
        console.log("admin user");
        //window.location.assign('../dashboard.html')
    }
}