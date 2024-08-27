document.addEventListener("DOMContentLoaded", () => {
    let a = document.querySelector(".hamburger");
    a.addEventListener("click", () => {
        let rightDiv = document.querySelector(".right");
        rightDiv.style.right = "0";
    });

    let closeham=document.querySelector(".close")
    closeham.addEventListener("click",()=>{
        let rightDiv = document.querySelector(".right");
        // let txt=document.querySelector(".sec-text")
        if(rightDiv.style.right="0"){
            rightDiv.style.right = '-377px';
            // txt.style.display="none"
        }
        // txt.style.display="block"
    })
 

});

