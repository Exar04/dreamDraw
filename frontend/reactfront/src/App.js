import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from "uuid";
// import { connect } from "amqplib"
// const canvasColor = "#333333"
const canvasColor = "white"

function App() {
  const canvasRef = useRef(null);
  const canvas2Ref = useRef(null);
  const [painting, setPainting] = useState(false);
  const [pageList, setPageList] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [listOfPageRefs, setlistOfPageRefs] = useState([]);
  const [bookmarkDatalist, setBookmarkDatalist] = useState([]);

  const [justPredictedTheNumber, setJustPredictedTheNumber] = useState(false)
  const [predictedNumber, setPredictedNumber] = useState(-1)
  // var pnum = -1
  const [idOfImage, setIdOfImage] = useState("")
  const [didAutoScrolled,setDidAutoScrolled] = useState(false)

  // bookmark_structure = { name, link, color }
  // bookmark_list = [b1{},b2{},b3{},b4{}, ...]

  // This use effect is used to load in all the bookmarks stored in our localstorage
  useEffect(() => {
    var deserilized_bookmark_list = JSON.parse( localStorage.getItem("DreamDrawBookmarkList") )
    if (deserilized_bookmark_list == null) {
      const newBookmarks = [];
      pageList.forEach((fu) => {
        const bmk = { name1: "", link1: "", color1: "", name2: "", link2: "", color2: ""};
        newBookmarks.push(bmk);
      });
      setBookmarkDatalist([...newBookmarks]);
    } else{
      setBookmarkDatalist(deserilized_bookmark_list)
    }
  }, []);

  // this useEffect is used to save my bookmark list to localstorage every time it updates
  useEffect(() => {
      if (bookmarkDatalist.length > 0 ) {
        localStorage.setItem("DreamDrawBookmarkList",JSON.stringify(bookmarkDatalist))
      }
  },[bookmarkDatalist])

  useEffect(() => {
    const newRefs = pageList.map(() => React.createRef());
    setlistOfPageRefs(newRefs);
  }, [pageList]);

  useEffect(() => {
    const handleScroll = () => {
      if (didAutoScrolled) {
        console.log('Auto Scrolled')
        setDidAutoScrolled(false)
        return
      }
      console.log('User Scrolled');
      if (justPredictedTheNumber) {
        setJustPredictedTheNumber(false)
        console.log("yes yes yes")
        fetch("http://localhost:8000/imgPrecitionTruthValue", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            img_id: idOfImage,
            img_truth:false,
            img_predicted_number: predictedNumber,
          }),
        })
          .then((response) => response.json())
          .then((res) => {
            console.log(res.message);
          })
          .catch((err) => console.log(err));

      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [justPredictedTheNumber, idOfImage, predictedNumber, didAutoScrolled]);

  // Handles drawing and sending it to server and MQ
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
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
        // console.log(hoimg); // this is the resized image we got
        const unique_id = uuid();
        const small_id = unique_id.slice(0, 8);
        setIdOfImage(small_id)
        // sending image to MQ
        fetch("http://localhost:8000/img", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bs64_img: hoimg,
            img_id: small_id,
          }),
        })
          .then((response) => response.json())
          .then((res) => {
            console.log(res.message);
          })
          .catch((err) => console.log(err));

        // sending image to server for prediction
        fetch("http://localhost:8090/img", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bs64_img: hoimg,
          }),
        })
          .then((response) => response.json())
          .then((res) => {
            console.log(res.message);
            pageList.map((pageNumber) => {
              if (pageNumber == res.message) {
                console.log("pagenumber is ", pageNumber);
                setDidAutoScrolled(true)
                listOfPageRefs[pageNumber].current.scrollIntoView({
                  // behavior: "smooth",
                });
                setPredictedNumber(res.message)
                setJustPredictedTheNumber(true)
              }
            });
          })
          .catch((err) => console.log(err));
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

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", endPosition);
    canvas.addEventListener("mousemove", draw);

    return () => {
      canvas.removeEventListener("mousedown", startPosition);
      canvas.removeEventListener("mouseup", endPosition);
      canvas.removeEventListener("mousemove", draw);
    };
  }, [painting]);

  const resizeImage = (dataURI, newWidth, canvas, callback) => {
    const img = new Image();

    img.onload = function () {
      const ctx = canvas.getContext("2d");
      const newHeight = img.height * (newWidth / img.width);

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      const resizedDataURI = canvas.toDataURL();
      callback(resizedDataURI);
    };

    img.src = dataURI;
  };

  const BookmarkPage = pageList.map((pageNumber, index) => (
    <div ref={listOfPageRefs[index]} key={index} className=" justify-center items-center w-screen h-screen bg-black flex relative">
      {/* <!-- Just some Balls --> */}
      <div className=" absolute -left-24 w-3/6 h-40 rounded-full bg-teal-400 p-9">
        <div className=" bg-teal-900 w-full h-full rounded-full "></div>
      </div>
      <div className=" absolute -right-24 w-3/6 h-40 rounded-full bg-teal-400 p-9">
        <div className=" bg-teal-900 w-full h-full rounded-full "></div>
      </div>
      <div className=" text-9xl text-white absolute z-20 w-24 h-20 rounded-full bg-teal-400"></div>
      <div className=" text-9xl text-white absolute z-20 bg-black rounded-full">
        {pageNumber}
      </div>
      {
        (bookmarkDatalist[pageNumber]?.name1 == "") ?
          <AddNewBookMarkSign index={index} loc={"left"} setBookmarkDatalist={setBookmarkDatalist} bookmarkDatalist={bookmarkDatalist}/>
          :
          <AddedBookmark loc={"left"} index={index} setBookmarkDatalist={setBookmarkDatalist} bookmarkDatalist={bookmarkDatalist} justPredictedTheNumber={justPredictedTheNumber} setJustPredictedTheNumber={setJustPredictedTheNumber} idOfImage={idOfImage} predectedNumber={predictedNumber}/>
      }
      {
        (bookmarkDatalist[pageNumber]?.name2 == "") ?
          <AddNewBookMarkSign index={index} loc={"right"} setBookmarkDatalist={setBookmarkDatalist} bookmarkDatalist={bookmarkDatalist} />
          :
          <AddedBookmark  loc={"right"} index={index} setBookmarkDatalist={setBookmarkDatalist} bookmarkDatalist={bookmarkDatalist} justPredictedTheNumber={justPredictedTheNumber} setJustPredictedTheNumber={setJustPredictedTheNumber} idOfImage={idOfImage} predectedNumber={predictedNumber}/>
      }
    </div>
  ));

  return (
    <div className="App">
      <div className="w-screen h-screen bg-black flex justify-center items-center">
        <canvas id="canvas" ref={canvasRef} className="rounded-xl" style={{ border: "2px solid black" }} ></canvas>
      </div>
      <canvas id="canvas2" ref={canvas2Ref} style={{ width: 0, height: 0 }} ></canvas>
      {BookmarkPage}
    </div>
  );
}


const AddNewBookMarkSign = (props) => {
  const [clicked, setclicked] = useState(false)
  const [displayName, setdisplayName] = useState("")
  const [link, setlink] = useState("")
  const [hexCode, setHexCode] = useState("")

  function addNewBookmarkToTheList() {

    const newBookmarkDatalist = [...props.bookmarkDatalist];
    
    // Update the specific index with new values for name1, link1, color1
    if (props.loc == "left"){
    newBookmarkDatalist[props.index] = {
      ...newBookmarkDatalist[props.index],
      name1: displayName,
      link1: link,
      color1: hexCode,
    };
  }else{
    newBookmarkDatalist[props.index] = {
      ...newBookmarkDatalist[props.index],
      name2: displayName,
      link2: link,
      color2: hexCode,
    };
  }
    // Update the state
    props.setBookmarkDatalist(newBookmarkDatalist);

  }

  const formToAddNewBk = (
    <div className='justify-center items-center rounded-xl flex flex-col w-full h-full'> 
      <input onChange={(e) => { setdisplayName(e.target.value) }} type="text" placeholder="DisplayName" className=" m-4 p-4 ring-2 ring-white w-3/6 h-20 bg-black text-white text-2xl rounded-full text-center outline-none" />
      <input onChange={(e) => { setlink(e.target.value) }} type="text" placeholder="Link" className=" m-4 p-4 ring-2 ring-white w-3/6 h-20 bg-black text-white text-2xl rounded-full text-center outline-none" />
      <input onChange={(e) => { setHexCode(e.target.value) }} type="text" placeholder="Color code in hex" className=" m-4 p-4 ring-2 ring-white w-3/6 h-20 bg-black text-white text-2xl rounded-full text-center outline-none" />
      <div onClick={() => { addNewBookmarkToTheList() }} role="button" className=" bg-sky-600 hover:bg-sky-500 rounded-full text-white m-4 p-4 w-2/6 text-center text-3xl" >
        Add
      </div>
    </div>
  )

  return (
    <div onClick={() => {setclicked(true)}} className={`flex justify-center items-center rounded-xl m-4 w-4/6 h-4/6 ring-2 ring-cyan-700 hover:ring-cyan-500 backdrop-blur-lg hover:backdrop-blur-xl hover:scale-110 hover:${(props.loc == "left") ? "translate-x-16" : "-translate-x-16"} z-10 hover:z-20 transition ease-in-out duration-800`}>
      {clicked ?
        formToAddNewBk
        :
        <div>
          <img className=" opacity-70" width="80" height="80" src="https://img.icons8.com/ios-glyphs/480/FFFFFF/plus--v1.png" alt="plus--v1" />
        </div>
      }
    </div>
  )
}

const AddedBookmark = (props) => {
  function removeBookmarkFromTheList() {
    const newBookmarkDatalist = [...props.bookmarkDatalist];
    if (props.loc == "left"){
      newBookmarkDatalist[props.index] = {
        ...newBookmarkDatalist[props.index],
        name1: "",
        link1: "",
        color1: "",
      };
    }else{
      newBookmarkDatalist[props.index] = {
        ...newBookmarkDatalist[props.index],
        name2: "",
        link2: "",
        color2: "",
      };
    }
    props.setBookmarkDatalist(newBookmarkDatalist);
  }

  function sendMessageToMQ () {
    console.log("yo ho ho ho")
    if (props.justPredictedTheNumber) {
      props.setJustPredictedTheNumber(false)
      fetch("http://localhost:8000/imgPrecitionTruthValue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          img_id: props.idOfImage,
          img_truth:true,
          predicted_number: props.predectedNumber,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          console.log(res.message);
        })
        .catch((err) => console.log(err));
    } 
    console.log("yo ho ho ho 2")
    handleClick()
  } 

  const handleClick = () => {
      window.location.href = "https://www.youtube.com" 
  }

  return (
    <a  onClick={() => { sendMessageToMQ()}} className={`md:m-4 m-12 w-4/6 h-4/6 relative hover:scale-110 hover:${(props.loc == "left") ? "translate-x-16" : "-translate-x-16"} md:hover:scale-110 z-10 hover:z-20 transition ease-in-out duration-800`} >
      <div onClick={() => {removeBookmarkFromTheList()}} role="button" id="p2clearb1" className=" ring-2 ring-red-500 absolute top-0 right-0 p-3 px-4 m-4 text-xl text-white z-30 hover:bg-red-600 hover:scale-110 rounded-full" >
        Clear
      </div>
      <div className=" relative flex justify-center items-center rounded-xl h-full w-full ring-2 ring-cyan-700 hover:ring-cyan-500 backdrop-blur-lg hover:backdrop-blur-xl " >
        <div className=" p-4 bg-red-500 rounded-lg text-3xl font-mono text-white">
          {(props.loc == "left") ?
            props.bookmarkDatalist[props.index]?.name1
            :
            props.bookmarkDatalist[props.index]?.name2
          }
        </div>
        </div>
    </a>
  )
}

export default App;
