console.log("Ejecutando JS...");

const canvas = document.getElementById("canvas");

//-- Tamaño del canvas
canvas.width = 1000;
canvas.height = 500;

const ctx = canvas.getContext("2d");

let x = 30;
let y = 400;
let tiempo = 0;
let angulo = 0;
let velocidad = 0;
let cronometro;
let velx = 0;
let vely = 0;
let disparado = false;
let juegoTerminado = false;
let sonidoAcierto = new Audio('sonido-acierto.mp3');
let sonidoFallo = new Audio('sonido-fallo.mp3');
let sonidoDisparo = new Audio('sonido-disparo.mp3');
let imgCohete = new Image();
imgCohete.src = 'icono-cohete.png'
let imgLuna = new Image();
imgLuna.src = 'luna.png';


//-- Posición del objetivo
let objetivoX = Math.random() * (canvas.width - 200) + 100;
let objetivoY = Math.random() * (canvas.height - 200) + 100;

const tiempoDisplay = document.getElementById("tiempo");
const resultadoDisplay = document.getElementById("resultado");
const anguloInput = document.getElementById("angulo");
const velocidadInput = document.getElementById("velocidad");
const disparoButton = document.getElementById("disparo");
const inicioButton = document.getElementById("inicio");

//-- Función principal de animación
function update() 
{

  if (disparado) {
    x += velx;
    y -= vely; 
    vely -= 0.2 ;

    //-- Comprobar si el proyectil ha salido del canvas
    if (x > canvas.width) {
      x = canvas.width;
      disparado = false;
      clearInterval(cronometro);
      resultadoDisplay.textContent = "Has fallado el tiro";
      sonidoFallo.play();
      resultadoDisplay.classList.add('fallo'); 

      
    }
    if (y > canvas.height) {
      y = canvas.height;
      disparado = false;
      clearInterval(cronometro);
      resultadoDisplay.textContent = "Has fallado el tiro";
      sonidoFallo.play();
      resultadoDisplay.classList.add('fallo'); 

    }
    if (x < 0) {
      x = 0;
      disparado = false;
      clearInterval(cronometro);
      resultadoDisplay.textContent = "Has fallado el tiro";
      sonidoFallo.play();
      resultadoDisplay.classList.add('fallo'); 

    }
    if (y < 0) {
      y = 0;
      disparado = false;
      clearInterval(cronometro);
      resultadoDisplay.textContent = "Has fallado el tiro";
      sonidoFallo.play();
      resultadoDisplay.classList.add('fallo'); 

    }

    //-- Comprobar si el proyectil ha alcanzado el objetivo
    if (Math.abs(x - objetivoX) < 20 && Math.abs(y - objetivoY) < 20) {
      disparado = false;
      clearInterval(cronometro);
      resultadoDisplay.textContent = "¡Has acertado en el blanco!";
      sonidoAcierto.play()
      resultadoDisplay.classList.add('acertado'); 

    } 
    
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (imgCohete.complete) {
    ctx.drawImage(imgCohete, x, y, 50, 50); 
  } else {
    imgCohete.onload = function () {
      ctx.drawImage(imgCohete, x, y, 20, 20);
    };
  }

  if (imgLuna.complete) {
    ctx.drawImage(imgLuna, objetivoX, objetivoY, 80, 50);
  } else {
    imgLuna.onload = function () {
      ctx.drawImage(imgLuna, objetivoX, objetivoY, 20, 20);
    };
  }

  requestAnimationFrame(update);
}

disparoButton.addEventListener("click", function() {
  // Solo permite disparar si el juego no ha terminado
  if (!juegoTerminado) {
    angulo = parseFloat(anguloInput.value);
    velocidad = parseFloat(velocidadInput.value);

    velx = velocidad  * Math.cos((angulo * Math.PI) / 180);
    vely = velocidad  * Math.sin((angulo * Math.PI) / 180);

    disparado = true;
    sonidoDisparo.play();
    juegoTerminado = true; 

    cronometro = setInterval(function() {
      tiempo++;
      let segundos = Math.floor(tiempo / 100); // Convertir a segundos
      let decimas = Math.floor((tiempo % 100) / 10); // Obtener las décimas de segundo
      let centesimas = tiempo % 10; // Obtener las centésimas de segundo
      tiempoDisplay.textContent = "Tiempo: " + segundos + "." + decimas + centesimas + " " + "s";
    }, 10); // Actualizar cada 10 milisegundos
  }
});

inicioButton.addEventListener("click", function() {
  disparado = false;
  tiempo = 0;
  x = 30;
  y = 400;
  objetivoX = Math.random() * (canvas.width - 200) + 100;
  objetivoY = Math.random() * (canvas.height - 200) + 100;
  clearInterval(cronometro);
  tiempoDisplay.textContent = "Tiempo: " + tiempo;
  resultadoDisplay.textContent = "";
  juegoTerminado = false; // Reinicia el estado del juego
  resultadoDisplay.classList.remove('acertado');
  resultadoDisplay.classList.remove('fallo'); // 
});
update();
