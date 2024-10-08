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
            if(data.data.active==="true"){
                $("#active").prop( "checked", true );
            }else{
                $("#active").prop( "checked", false );
            }
        }

    })

    $("#save").click(()=>{
      
        var filter = $("#filter").val()
        var active = $("#active").is(':checked')
        console.log(active)
        $.get("/writeSettings?user="+userExist.split("-")[0]+"&password="+userExist.split("-")[1]+"&filter="+filter+"&active="+active,(data)=>{
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