const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const controls = $(".slideshow .controls")
const slideshowInner = $(".slideshow .inner")
const slideItem = $$(".slideshow .slide-item")

console.log(slideshowInner)
let currentIndex = 0;

controls.onclick = function(event){
    const prevBtn = event.target.closest(".prev-btn");
    const maxIndex = slideItem.length - 1;

    if(prevBtn.matches(".prev")){
        currentIndex = Math.max(0, --currentIndex)
        if(currentIndex === 0){
            currentIndex = maxIndex;
        }
    }
    if(prevBtn.matches(".next")){
        currentIndex = Math.min(++currentIndex, maxIndex)
        if(currentIndex === slideItem.length - 1){
            currentIndex = 0;
        }
    }
    const offset = `-${currentIndex * 100}%`;
    slideshowInner.style.translate = offset;
}