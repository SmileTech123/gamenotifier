$(document).ready(()=>{
    var userExist = localStorage.getItem("skidrowuser")
    if(!userExist){
        location.href="index.html"
    }

    $.get("/settings?user="+userExist.split("-")[0]+"&password="+userExist.split("-")[1],(data)=>{
        if(data.error){
            localStorage.removeItem("skidrowuser")
            location.href="index.html"
        }else{
            $("#filter").val(data.data.filter)
        }

    })

    $("#save").click(()=>{
      
        var filter = $("#filter").val()
        console.log(filter)
        $.get("/writeSettings?user="+userExist.split("-")[0]+"&password="+userExist.split("-")[1]+"&filter="+filter,(data)=>{
            if(data.error){
                alert("Errore durante il salvataggio")
            }else{
                alert("Salvataggio avvenuto con successo")
            }
        })
    })

    $("#logout").click(()=>{
 
        localStorage.removeItem("skidrowuser")
        location.href = "index.html"
    })
    
})