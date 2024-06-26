document.addEventListener("DOMContentLoaded", () => {
    var ifClicked = "nexist";
    var deserilized_bookmark = JSON.parse(localStorage.getItem("page1Item2"));
    if (deserilized_bookmark == null) {
        deserilized_bookmark = {
            name: "",
            link: "",
            color: ""  
        }
    } 
    console.log(deserilized_bookmark)

    const link1 = document.getElementById("page2Item2ItemExist");
    const link1Div = document.getElementById("page2Item2ItemExistDiv");
  
    const link2 = document.getElementById("page2Item2NoItem");
    const link3 = document.getElementById("AddBmkForP2I2");
  
    const inputs1 = link3.querySelectorAll("input");
    const addButton1 = link3.querySelector("div[role='button']");
    const clearButton1 = document.getElementById("p2clearb2");
  
    toggleLinks1("nexist")
  
    if (deserilized_bookmark.name) {
      toggleLinks1("exist");
    } else {
      toggleLinks1("nexist");
    }
  
  
    const nameElement1 = document.createElement("div");
    nameElement1.textContent = deserilized_bookmark.name;
    nameElement1.classList.add(
      "text-4xl",
      "font-bold",
      "m-4",
      "p-4",
      "px-12",
      "bg-red-500",
      "text-white",
      "font-mono",
      "rounded-lg"
    )
    link1.setAttribute("href", deserilized_bookmark.link);
    link1.appendChild(nameElement1);
  
    clearButton1.addEventListener("click", function () {
      const newBookMark = {
        name: "",
        link: "",
        color: "",
      };
  
      const serilized_bookmark = JSON.stringify(newBookMark);
      localStorage.setItem("page1Item2", serilized_bookmark);
      toggleLinks1("nexist");
    });
  
    addButton1.addEventListener("click", function () {
      const inputLink1 = inputs1[0].value;
      const inputName1 = inputs1[1].value;
      const inputColor1 = inputs1[2].value;
  
      const newBookMark = {
        name: inputName1,
        link: inputLink1,
        color: inputColor1,
      };
  
      const serilized_bookmark = JSON.stringify(newBookMark);
      localStorage.setItem("page1Item2", serilized_bookmark);
  
      toggleLinks1("exist");
    })
  
    link2.addEventListener("click", function () {
      console.log("ooo")
      toggleLinks1("add");
    });
  
    function toggleLinks1(whattodo) {
      if (whattodo == "nexist") {
        link1Div.style.display = "none";
        link1.style.display = "none";
        link2.style.display = "flex";
        link3.style.display = "none";
      } else if (whattodo == "exist") {
        link1Div.style.display = "flex";
        link1.style.display = "flex";
        link2.style.display = "none";
        link3.style.display = "none";
      } else {
        link1Div.style.display = "none";
        link1.style.display = "none";
        link2.style.display = "none";
        link3.style.display = "flex";
      }
    }
  });
  