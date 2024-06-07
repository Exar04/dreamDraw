window.addEventListener("load", async () => {
    const canvas = document.querySelector("#canvas")
    const ctx = canvas.getContext("2d")
    if (window.innerHeight > 700) {
    canvas.height = 700
    canvas.width =  700
    }else{
        canvas.height = 280
        canvas.width = 280
    }

    // ctx.strokeStyle = "red"
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,700,700)
    let painting = false

    function startPosition(e) {
        e.preventDefault()
        painting = true;
    }

    function endPosition(event){
      painting = false;
      event.preventDefault()

      const dataURI = canvas.toDataURL();
      resizeImage(dataURI, 28, "canvas2", function(hoimg) {
        console.log(hoimg)

        fetch('http://localhost:8090/img',{
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                bs64_img:hoimg,
            }) 
        })
        .then(response => response.json())
        .then((res) => {
            console.log(res.message)
            if(res.message == 0) {window.location.hash = "#0"}
            if(res.message == 1){window.location.hash = "#1"}
            if(res.message == 2){window.location.hash = "#2"}
            if(res.message == 3){window.location.hash = "#3"}
            if(res.message == 4){window.location.hash = "#4"}
            if(res.message == 5){window.location.hash = "#5"}
            if(res.message == 6){window.location.hash = "#6"}
            if(res.message == 7){window.location.hash = "#7"}
            if(res.message == 8){window.location.hash = "#8"}
            if(res.message == 9){window.location.hash = "#9"}
        })
        .catch(err => console.log(err))
      })
    }

    function draw(e) {
        e.preventDefault()
        if (!painting) {
            return
        }

        ctx.lineWidth = 10;
        ctx. lineCap = "round";

        const recto = canvas.getBoundingClientRect();

        // Calculate the offset between the canvas and the window
        const offsetX = recto.left;
        const offsetY = recto.top;

        ctx.lineTo(e.clientX - offsetX, e.clientY - offsetY)
        ctx.stroke()
    }

    canvas.addEventListener("mousedown", function(event){
        event.preventDefault()
        startPosition(event)
    })
    canvas.addEventListener("mouseup", function(event){
        event.preventDefault()
        endPosition(event)
    })
    canvas.addEventListener("mousemove", function(event){
        event.preventDefault()
        draw(event)
    })

    function resizeImage(dataURI, newWidth, canvasId, callback) {
        // Create a new image element
        var img = new Image();
    
        // When the image is loaded, resize it
        img.onload = function() {
            // Get the canvas element
            var canvas = document.getElementById(canvasId);
            var ctx = canvas.getContext('2d');
    
            // Calculate the new height based on the aspect ratio
            var newHeight = img.height * (newWidth / img.width);
    
            // Set canvas dimensions
            canvas.width = newWidth;
            canvas.height = newHeight;
    
            // Draw the image onto the canvas with the new dimensions
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
    
            // Get the data URL of the resized image
            var resizedDataURI = canvas.toDataURL();
    
            // Pass the resized data URL to the callback function
            callback(resizedDataURI);
        };
    
        // Set the source of the image to the data URL
        img.src = dataURI;
    }

})