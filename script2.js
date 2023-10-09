const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");

let currentSlide = 0;
let isAnimating = false;
let xID;
let duration=3600;
goToSlide(0);

function desp() {
  clearInterval(xID);
  let thisSlide = document.querySelector(`.slide:nth-child(${currentSlide+1})`);
  let lines = thisSlide.querySelectorAll(".line");
  console.log(lines);
  show();
  xID=setInterval(show,4.2*duration);
  function show()
  {
    lines.forEach(x=>x.style.display = "none");
    let i=0;
    let id=setInterval(function(){
      if(i>0)
        lines[i-1].style.display="none";
      lines[i].style.display="block";
      i++;
      console.log(lines[i-1].textContent);
      if(i>4){
        setTimeout(() => {
          lines.forEach((x)=>x.style.display = "display");
        clearInterval(id);
        }, duration*1.1);
        
      }
    } 
    ,duration);
  }
}
  

function goToSlide(index) {
  if (!isAnimating && index >= 0 && index < slides.length) {
    isAnimating = true;

    const direction = index > currentSlide ? "next" : "prev";

    slides[currentSlide].style.left = direction === "next" ? "-100%" : "100%";
    slides[index].style.left = "0";

    // Hide title and description of the current slide
    slides[currentSlide].classList.remove("active");

    currentSlide = index;

    setTimeout(() => {
      // Show title and description of the selected slide after 1 second
      slides[index].classList.add("active");
    }, 800); // Show title after 1 second
    desp();

    setTimeout(() => {
      isAnimating = false;
    }, 500); // Adjust the duration to match the CSS transition duration
  }
}

// Listen for mouse wheel scroll events
slider.addEventListener("wheel", (event) => {
  if (event.deltaY > 0) {
    goToSlide(currentSlide + 1);
  } else {
    goToSlide(currentSlide - 1);
  }

  // Prevent default scroll behavior
  event.preventDefault();
});
const nav=document.querySelector(".nav-container");
nav.addEventListener('mouseover', (event) => {document.querySelector(".a").style.opacity=1 ;});
nav.addEventListener('mouseout', (event) => {document.querySelector(".a").style.opacity=0;});