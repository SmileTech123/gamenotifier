$(document).ready(()=>{
 
    $("#register").click(()=>{
        var user = $("#email").val()
        var pass = $("#password").val()
        $.get("/register?user="+user+"&password="+pass,(data)=>{
            if(data.error){
                alert("Errore durante la registrazione")
            }else{
                localStorage.setItem("skidrowuser",user+"-"+pass)
                location.href="settings.html"
            }
        })
    })
    
})