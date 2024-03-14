
class Crono {


    constructor(display, clave) {
        this.display = display;
        this.clave = clave;

        //-- Tiempo
        this.cent = 0, 
        this.seg = 0, 
        this.min = 0,  
        this.timer = 0; 
      
        this.clave_secreta = generarClave();
        this.clave.innerHTML = Array(this.clave_secreta.length).fill('<span>*</span>').join('');  // Llena la clave con asteriscos
        this.intentos = "";  
    }

    tic() {

        this.cent += 1;

        if (this.cent == 100) {
        this.seg += 1;
        this.cent = 0;
        }

        if (this.seg == 60) {
        this.min = 1;
        this.seg = 0;
        }

        this.display.innerHTML = this.min + ":" + this.seg + ":" + this.cent
    }

    iniciarJuego() {
        this.reset();
        console.log("¡El juego ha comenzado!");
    }

    start() {
       if (!this.timer) {
          this.timer = setInterval( () => {
              this.tic();
          }, 10);
        }
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    reset() {
        this.cent = 0;
        this.seg = 0;
        this.min = 0;
    
        this.display.innerHTML = "0:0:0";
    
        this.clave_secreta = generarClave();
        this.intentos = "";  
        this.clave.innerHTML = "";  // Borra la clave al resetear el cronómetro
        this.clave.innerHTML = Array(this.clave_secreta.length).fill('<span>*</span>').join('');  // Llena la clave con asteriscos
    }
    

    adivinar(num) {
        this.intentos += num.toString();
        for (let i = 0; i < this.clave_secreta.length; i++) {
            if (this.intentos.includes(this.clave_secreta[i]) && this.clave.children[i].textContent == "*") {
                this.clave.children[i].textContent = this.clave_secreta[i];  // Muestra el dígito acertado
                this.clave.children[i].classList.add('correct');  // Cambia el color del dígito acertado a verde
            }
        }
        if (Array.from(this.clave.children).every(child => child.textContent != "*")) {
            this.stop();
        }
    }
}

function generarClave() {
    let clave = Math.floor(Math.random() * 9000) + 1000;  // Genera un número aleatorio entre 1000 y 9999
    console.log("Clave secreta generada: " + clave);  // Imprime la clave en la consola
    return clave.toString();  // Convierte la clave a una cadena antes de devolverla
}


//-- Elementos de la gui
const gui = {
    display : document.getElementById("display"),
    clave : document.getElementById("clave"),
    start : document.getElementById("start"),
    stop : document.getElementById("stop"),
    reset : document.getElementById("reset")
}

//-- Definir un objeto cronómetro
const crono = new Crono(gui.display, gui.clave);

//-- Configurar las funciones de retrollamada

//-- Arranque del cronometro
gui.start.onclick = () => {
    console.log("Start!!");
    crono.start();
}
  
//-- Detener el cronómetro
gui.stop.onclick = () => {
    console.log("Stop!");
    crono.stop();
}

//-- Reset del cronómetro
gui.reset.onclick = () => {
    console.log("Reset!");
    crono.iniciarJuego();
}

//-- Configurar las funciones de retrollamada de los botones del 0 al 9
for (let i = 0; i <= 9; i++) {
    document.getElementById(i.toString()).onclick = () => {
        console.log("Adivinar " + i);
        crono.adivinar(i);
    };
}
