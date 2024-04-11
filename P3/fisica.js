console.log("Ejecutando JS...");

const canvas = document.getElementById("canvas");

//-- Definir el tamaño del canvas
canvas.width = 1000;
canvas.height = 500;

//-- Obtener el contexto del canvas
const ctx = canvas.getContext("2d");

//-- Posición del elemento a animar
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
  //-- Algoritmo de animación:
  //-- 1) Actualizar posiciones de los elementos
  if (disparado) {
    x += velx;
    y -= vely; // Ajuste para la gravedad
    vely -= 0.2 ; // Ajuste para la gravedad en la velocidad vertical

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

  // Dibujar la imagen del cohete en lugar del rectángulo
  if (imgCohete.complete) {
    ctx.drawImage(imgCohete, x, y, 50, 50); // Asegúrate de que el tamaño de la imagen sea el adecuado
  } else {
    imgCohete.onload = function () {
      ctx.drawImage(imgCohete, x, y, 20, 20);
    };
  }

  // Dibujar la imagen de la luna en lugar del círculo
  if (imgLuna.complete) {
    ctx.drawImage(imgLuna, objetivoX, objetivoY, 80, 50); // Asegúrate de que el tamaño de la imagen sea el adecuado
  } else {
    imgLuna.onload = function () {
      ctx.drawImage(imgLuna, objetivoX, objetivoY, 20, 20);
    };
  }

  // Volver a ejecutar update cuando toque
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
    juegoTerminado = true; // Indica que el juego ha terminado

    cronometro = setInterval(function() {
      tiempo++;
      let segundos = Math.floor(tiempo / 100); // Convertir a segundos
      let decimas = Math.floor((tiempo % 100) / 10); // Obtener las décimas de segundo
      let centesimas = tiempo % 10; // Obtener las centésimas de segundo
      tiempoDisplay.textContent = "Tiempo: " + segundos + "." + decimas + centesimas + " " + "s";
    }, 10); // Actualizar cada 10 milisegundos
  }
});

// Y finalmente, modifica el evento del botón de inicio para reiniciar el juego
inicioButton.addEventListener("click", function() {
  // Aquí puedes añadir la lógica para reiniciar el juego
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
  resultadoDisplay.classList.remove('fallo'); // Elimina la clase que pueda estar interfiriendo // Elimina la clase que pueda estar interfiriendo
});
//-- ¡Que empiece la función!
update();
