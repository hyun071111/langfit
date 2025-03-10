const radios = document.querySelectorAll('input[type="radio"]');
const typeA = document.getElementsByClassName('C');
const typeB = document.getElementsByClassName('Cpp');
const typeC = document.getElementsByClassName('CS');
const typeD = document.getElementsByClassName('python');
const typeE = document.getElementsByClassName('java');
const typeF = document.getElementsByClassName('js');
const question = document.getElementsByClassName('select');
const page = document.getElementsByClassName('page');

let a = [], b = [], c = [], d = [], e = [], f = [];
let A = 0, B = 0, C = 0, D = 0, E = 0, F = 0;
let test = false;

radios.forEach((radio)=>{
  if(radio.checked){
    radio.closest('section').classList.add('.block');
  }
  radio.addEventListener('click', function(){
    test = true;
    for (let i = 0; i < 6; i++) {
      if(radio.closest('.C') === typeA[i]){
        a[i] = parseInt(radio.value);
        break;
      }else if(radio.closest('.Cpp') === typeB[i]){
        b[i] = parseInt(radio.value);
        break;
      }else if(radio.closest('.CS') === typeC[i]){
        c[i] = parseInt(radio.value);
        break;
      }else if(radio.closest('.python') === typeD[i]){
        d[i] = parseInt(radio.value);
        break;
      }else if(radio.closest('.java') === typeE[i]){
        e[i] = parseInt(radio.value);
        break;
      }else if(radio.closest('.js') === typeF[i]){
        f[i] = parseInt(radio.value);
        break;
      }
    }
    const move = radio.closest('.page>*').nextElementSibling;
    if(!move.classList.contains('block')){
      radio.closest('section').scrollIntoView();
      move.classList.add('block');
    }
    if(document.querySelectorAll('input[type="radio"]:checked').length===question.length){
      test = false;
    }
  });
});

//next
const nav = document.querySelectorAll('a');
const link = document.querySelectorAll('.next>a');
const main = document.querySelector('#test');
let i = 0;

const move1 = document.querySelector('.title>a');
const move2 = document.querySelector('.move a');
move1.addEventListener('click',(e)=>{
  e.preventDefault();
  window.scrollTo({
    top: main.offsetTop - document.querySelector('header').clientHeight,
  });
});
move2.addEventListener('click',(e)=>{
  e.preventDefault();
  window.scrollTo({
    top: main.offsetTop - document.querySelector('header').clientHeight,
  });
});

nav.forEach((nav)=>{
  nav.addEventListener('click', (e)=>{
    if(test===true&![link[0],link[1]].includes(e.target)){
      const userResponse = window.confirm('테스트 중단하시겠습니까?');
      if (!userResponse) {
        e.preventDefault();    //out
      }
    }
    else if(e.target===link[0]|e.target ===link[1]){
      if(page[i].querySelectorAll('input[type="radio"]:checked').length<question.length/page.length){
        alert('테스트 미완료');
      }
      else{
        page[i].style.display = 'none';
        page[i+1].style.display = 'block';
        i++;
        e.preventDefault();
        window.scrollTo({
        top: main.offsetTop - document.querySelector('header').clientHeight,
        });
      }
    }
  });
});
const result = document.querySelector('.result>a');

result.addEventListener('click', ()=>{
  for(let i = 0; i < 3; i++){
    A += a[i];
    B += b[i];
    C += c[i];
    D += d[i];
    E += e[i];
    F += f[i]; 
  }
  window.localStorage.setItem('A', A);
  window.localStorage.setItem('B', B);
  window.localStorage.setItem('C', C);
  window.localStorage.setItem('D', D);
  window.localStorage.setItem('E', E);
  window.localStorage.setItem('F', F);

  console.log(A)

});