$(document).ready(()=>{
    var userExist = localStorage.getItem("skidrowuser")
    if(userExist){
        location.href="settings.html"
    }
    $("#accedi").click(()=>{
        var user = $("#email").val()
        var pass = $("#password").val()
        $.get("/login?user="+user+"&password="+pass,(data)=>{
            if(data.error){
                alert("Account non esistente o parametri errati!")
            }else{
                localStorage.setItem("skidrowuser",user+"-"+pass)
                location.href="settings.html"
            }
        })
    })
    
})