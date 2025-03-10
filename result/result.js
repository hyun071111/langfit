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

const base = document.querySelector('.base');
// const result = document.querySelectorAll('.result');

// const compare = ()=>{
//   base.style.display = "none";
//   let max = values[0];
//   for(let i = 1; i < values.length; i++){
//     if(values[i] > max){
//       max = values[i];
//     }
//   }
//   for(let i = 0; i < result.length; i++){
//     if(max===values[i]){
//       result.forEach((result)=>{
//         result.style.display = 'none';
//       })
//       result[i].style.display = 'block';
//     }
//   }
// }
const section = document.querySelectorAll('section')

const compare = ()=>{
  let max = values[0];
  let maxIndex = 0;
  for(let i = 1; i < values.length; i++){
    if(values[i] > max){
      max = values[i];
      maxIndex = i;
    }
  }
  window.scrollTo({
    top: section[maxIndex].offsetTop-90,
    behavior: 'smooth'
  });
  const btn = document.createElement('div');
  btn.classList.add('btn');
  btn.textContent = '추천 언어';
  btn.style.left = '';
  btn.style.right = '';
  if(maxIndex==0|maxIndex==5){
    btn.style.left = '25%';
    btn.style.top = '25px';
  }
  else if(maxIndex==2){
    btn.style.right = '25%';
    btn.style.top = '25px';
  }
  else {
    btn.style.left = '50%';
    btn.style.transform = 'translate(-50%)';
    btn.style.top = '15px';
  }
  section[maxIndex].append(btn);
}

const judge = (()=>{
  let nanNum = 0;
  for(let i = 0; i < values.length; i++){
    if(isNaN(values[i])){
      nanNum++;
      values[i]=0;
    }
  }
  if(nanNum===values.length){
    return;
  }
  else{
    compare();
  }
});

judge();

const links = document.querySelectorAll('.intro>nav>a');

links.forEach((link) =>{
  link.addEventListener('click', (event)=>{
      event.preventDefault();  // 기본 앵커 이동 동작 방지
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
          const offset = 90;  // 헤더 크기만큼 조정
          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
          });
      }
  });
});

