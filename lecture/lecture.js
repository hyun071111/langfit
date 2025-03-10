const slider = document.getElementsByClassName('slider')[0];
const slide = document.getElementsByClassName('slide');
const arrow_left = document.querySelector('.arrow>img:first-child');
const arrow_right = document.querySelector('.arrow>img:last-child');
const btn = document.querySelector('.btn');

let complete = 0;
let currentSlide;
let move = true;
let stop = false;
let timer;

// btn.addEventListener('click', ()=>{
//     if(stop===false){
//         stop = true;
//     }else{
//         stop = false
//     }
// });

const autoSlide = (()=>{
    if(move === true & stop === false){
        timer = setInterval(()=>{
            move = false;
            currentSlide = slide[0];
            slider.removeChild(currentSlide);
            slider.appendChild(currentSlide);
            setTimeout(()=>{
                move = true;
            },500);
        },5000);
    }
});

const clickSlide = (()=>{
    arrow_left.addEventListener('click', ()=>{
        if(move == true){
            move = false;
            clearInterval(timer);
            currentSlide = slide[slide.length-1];
            slider.removeChild(currentSlide);
            slider.prepend(currentSlide);
            setTimeout(()=>{
                move = true;
                autoSlide();
            },500);
        }
    });
    arrow_right.addEventListener('click',()=>{
        if(move == true){
            move = false;
            clearInterval(timer);
            currentSlide = slide[0];
            slider.removeChild(currentSlide);
            slider.appendChild(currentSlide);
            setTimeout(()=>{
                move = true;
                autoSlide();
            },500);
        }
    });
});

autoSlide();
clickSlide();

const values = [
    parseInt(window.localStorage.getItem('A')),
    parseInt(window.localStorage.getItem('B')),
    parseInt(window.localStorage.getItem('C')),
    parseInt(window.localStorage.getItem('D')),
    parseInt(window.localStorage.getItem('E')),
    parseInt(window.localStorage.getItem('F'))
];
for(let i = 0; i < values.length; i++){
  console.log(values[i]);
}

const compare = ()=>{
    let max = values[0];
    let maxIndex = 0;
    for(let i = 1; i < values.length; i++){
      if(values[i] > max){
        max = values[i];
        maxIndex = i;
      }
    }
    const btn = document.createElement('div');
    btn.classList.add('btn');
    btn.textContent = '추천 언어';
    if(maxIndex===0){
        slide[slide.length-1].appendChild(btn)
    }
    else{
        slide[maxIndex-1].appendChild(btn);
    }
}