import React, { useEffect, useRef, useState } from 'react';

// const canvasColor = "#333333"
const canvasColor = "white"

function App() {
  const canvasRef = useRef(null);
  const canvas2Ref = useRef(null);
  const [painting, setPainting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (window.innerHeight > 700) {
      canvas.height = 700;
      canvas.width = 700;
    } else {
      canvas.height = 280;
      canvas.width = 280;
    }

    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const startPosition = (e) => {
      e.preventDefault();
      setPainting(true);
    };

    const endPosition = (e) => {
      setPainting(false);
      e.preventDefault();
      const dataURI = canvas.toDataURL();
      resizeImage(dataURI, 28, canvas2Ref.current, (hoimg) => {
        console.log(hoimg);

        fetch('http://localhost:8090/img', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            bs64_img: hoimg,
          })
        })
        .then(response => response.json())
        .then((res) => {
          console.log(res.message);
          // window.location.hash = `#${res.message}`;
        })
        .catch(err => console.log(err));
      });
    };

    const draw = (e) => {
      e.preventDefault();
      if (!painting) {
        return;
      }

      ctx.lineWidth = 30;
      ctx.lineCap = "round";

      const recto = canvas.getBoundingClientRect();
      const offsetX = recto.left;
      const offsetY = recto.top;

      ctx.lineTo(e.clientX - offsetX, e.clientY - offsetY);
      ctx.stroke();
    };

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);

    return () => {
      canvas.removeEventListener('mousedown', startPosition);
      canvas.removeEventListener('mouseup', endPosition);
      canvas.removeEventListener('mousemove', draw);
    };
  }, [painting]);

  const resizeImage = (dataURI, newWidth, canvas, callback) => {
    const img = new Image();

    img.onload = function() {
      const ctx = canvas.getContext('2d');
      const newHeight = img.height * (newWidth / img.width);

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      const resizedDataURI = canvas.toDataURL();
      callback(resizedDataURI);
    };

    img.src = dataURI;
  };

  const addedBookmark = (
        <div id="page2Item1ItemExistDiv" className="md:m-4 m-12 w-4/6 h-4/6 relative hover:scale-110 hover:lg:translate-x-16  md:hover:scale-110 z-10 hover:z-20 transition ease-in-out duration-800">
            <div role="button" id="p2clearb1" className=" ring-2 ring-red-500 absolute top-0 right-0 p-3 px-4 m-4 text-xl text-white z-30 hover:bg-red-600 hover:scale-110 rounded-full">Clear</div>
            <a id="page2Item1ItemExist" className=" relative flex justify-center items-center rounded-xl h-full w-full ring-2 ring-cyan-700 hover:ring-cyan-500 backdrop-blur-lg hover:backdrop-blur-xl "></a>
        </div>
  )

  const addNewBookMarkSign = (
        <a id="page2Item1NoItem" className="flex justify-center items-center rounded-xl m-4 w-4/6 h-4/6 ring-2 ring-cyan-700 hover:ring-cyan-500 backdrop-blur-lg hover:backdrop-blur-xl hover:scale-110 hover:translate-x-16 z-10 hover:z-20 transition ease-in-out duration-800">
            <img className=" opacity-70" width="80" height="80" src="https://img.icons8.com/ios-glyphs/480/FFFFFF/plus--v1.png" alt="plus--v1"/>
        </a>
  )

  const addNewBookmarkForm = (
        <a id="AddBmkForP2I1" className="flex flex-col  justify-center items-center rounded-xl md:m-4 m-12 w-4/6 h-4/6 ring-2 ring-cyan-700 hover:ring-cyan-500 backdrop-blur-lg hover:backdrop-blur-xl hover:scale-110 hover:translate-x-16 z-10 hover:z-20 transition ease-in-out duration-800">
            <input type="text" placeholder="Link" className=" m-4 p-4 ring-2 ring-white w-3/6 h-20 bg-black text-white text-2xl rounded-full text-center outline-none"/>
            <input type="text" placeholder="DisplayName" className=" m-4 p-4 ring-2 ring-white w-3/6 h-20 bg-black text-white text-2xl rounded-full text-center outline-none"/>
            <input type="text" placeholder="Color code in hex" className=" m-4 p-4 ring-2 ring-white w-3/6 h-20 bg-black text-white text-2xl rounded-full text-center outline-none"/>
            <div role="button" className=" bg-sky-600 hover:bg-sky-500 rounded-full text-white m-4 p-4 w-2/6 text-center text-3xl">Add</div>
        </a>
  )


  return (
    <div className="App">
      <div className="w-screen h-screen bg-black flex justify-center items-center">
        <canvas id="canvas" ref={canvasRef} className="rounded-xl" style={{border: "2px solid black"}}></canvas>
      </div>
      <canvas id="canvas2" ref={canvas2Ref} style={{width: 0, height: 0}}></canvas>


    <div id="1" className=" justify-center items-center w-screen h-screen bg-black flex relative">
        {/* <!-- Just some Balls --> */}
        <div className=" absolute -left-24 w-3/6 h-40 rounded-full bg-teal-400 p-9">
            <div className=" bg-teal-900 w-full h-full rounded-full "></div>
        </div>
        <div className=" absolute -right-24 w-3/6 h-40 rounded-full bg-teal-400 p-9">
            <div className=" bg-teal-900 w-full h-full rounded-full "></div>
        </div>
        <div className=" text-9xl text-white absolute z-20 w-24 h-20 rounded-full bg-teal-400"></div>
        <div className=" text-9xl text-white absolute z-20 bg-black rounded-full">1</div>

      {addedBookmark}
      {addNewBookMarkSign}
      {addNewBookmarkForm}
    </div>

    </div>
  );
}

export default App;
