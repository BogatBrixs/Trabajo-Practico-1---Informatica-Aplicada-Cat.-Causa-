let figuras = [];
let distanciaEntreFiguras = 50; // distancia fija entre las figuras
let escalaMinima = 0.9; // escala mínima de las figuras
let escalaMaxima = 1.6; // escala máxima de las figuras
let formaActual = "circulo";
let angle = 5; // VARIABLE QUE SERVIRÁ PARA DEFINIR EL ÁNGULO DE ROTACIÓN DE LAS FIGURAS
let colorDeFondo; //variable global de color celeste
let colorDeFondo2; //variable global de color rojo
let colorActual; // Variable que almacena el color actual
let cambioColor = false; // Variable de bandera para el cambio de color
let cantidadFiguras = 19;
let granos; //declaramos la variable para la foto de granos
let saturacionDeseada = 90; // Valor de saturación deseado (0-100)

//____________________ PARTE DE AUDIO ____________________//
let monitorear = false;

let mic;
let pitch;
let audioContext;

let c;
let gestorAmp;
let gestorPitch;
let haySonido;
let antesHabiaSonido;
let desfaseporTono = 0;

const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

let tiempoEntreFiguras = 5; // una variable para almacenar el tiempo en segundos que deseas que transcurra antes de cambiar las figuras
let tiempoTranscurrido = 0; //variable para realizar un seguimiento del tiempo transcurrido


//____________________ ^^PARTE DE AUDIO^^____________________//


function preload() {
  granos = loadImage('filtro.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
   // LAS FIGURAS TIENEN COMO PUNTO DE ORIGEN SU CENTRO

//____________________ PARTE DE AUDIO____________________//
//inicializo la escucha de sonido
audioContext = getAudioContext();
mic = new p5.AudioIn();
//acá le pido que llame a startPitch
mic.start( startPitch );

gestorAmp = new GestorSenial( 0.01 , 0.4 );
gestorPitch = new GestorSenial( 40 , 90 );

//hay que agregar esto
userStartAudio();

//SonidoX = 0;
//____________________ ^^PARTE DE AUDIO^^____________________//

  // Creamos la primera y última figura con tamaños definidos
  let primeraFigura = new Figura(0, 0, 30);
  let ultimaFigura = new Figura(0, 0, 60);
  
  colorDeFondo = color(97,168,217); // Definir color celeste
  colorDeFondo2 = color(222, 105, 83); // Definir color rojo
  colorActual = colorDeFondo; // Establecer el color inicial

  // Calculamos la escala máxima y mínima de las figuras intermedias
  let escalaMinimaIntermedia = escalaMinima * primeraFigura.size / ultimaFigura.size;
  let escalaMaximaIntermedia = escalaMaxima * primeraFigura.size / ultimaFigura.size;

  // Creamos las figuras intermedias con una escala que varía entre la mínima y máxima calculadas
  for(let i = 1; i < 13; i++) {
    let escalaIntermedia = map(i, 1, 10, escalaMinimaIntermedia, escalaMaximaIntermedia);
    let nuevaFigura = new Figura(0, 0, primeraFigura.size * escalaIntermedia * (i));
    figuras.push(nuevaFigura);
  }

  rectMode( CENTER );
  // ANGULO EN GRADOS
  angleMode( DEGREES );
  frameRate( 60 ); // DEFINO UN NUMERO ESTABLECIDO DE FOTOGRAMAS

}

function draw() {
  background(255);

//____________________ PARTE DE AUDIO____________________//
  let vol = mic.getLevel();
  gestorAmp.actualizar( vol );

  haySonido = gestorAmp.filtrada>0.1;
  let inicioElSonido = haySonido && !antesHabiaSonido;
  let finDelSonido = !haySonido && antesHabiaSonido;

// Incrementar el tiempo transcurrido
tiempoTranscurrido += deltaTime / 1000; // deltaTime es el tiempo transcurrido desde el último cuadro en milisegundos, por lo que lo dividimos por 1000 para obtener segundos

// Verificar si ha transcurrido el tiempo suficiente para cambiar las figuras
if (tiempoTranscurrido >= tiempoEntreFiguras) {
  // Cambiar las figuras aquí
  cambiarFiguras();

  // Reiniciar el tiempo transcurrido
  tiempoTranscurrido = 0;
}
 // Obtener el valor del tono del micrófono utilizando gestorPitch.filtrada
 let tono = gestorPitch.filtrada;
  
 // Calcular el porcentaje de transición basado en el tono (0-1)
 let porcentaje = map(tono, 0, 1, -1, 2);
 
 // Interpolar entre colorDeFondo y colorDeFondo2 utilizando el porcentaje
 let colorTransicion = lerpColor(colorDeFondo, colorDeFondo2, porcentaje);
 
 colorActual = colorTransicion;
//____________________ ^^PARTE DE AUDIO^^____________________//

  push();
  translate(width/2, height/2);
  for(let i = 0; i < figuras.length; i++) {
    //figuras[figuras.length-i-1].update(mouseY);
    figuras[figuras.length-i-1].update(vol);
    //figuras[figuras.length-i-1].display(i, figuras.length);
   

    figuras[figuras.length-i-1].display(i, figuras.length);
  }
pop();
// Dibuja la imagen con opacidad
tint(255, 50); // 128 es el valor de opacidad (0 es completamente transparente y 255 es opaco)
image(granos,0,0, width, height); // Cambia las coordenadas y dimensiones según tus necesidades
}

function cambiarFiguras() {
  // Lógica de cambio de figuras aquí
  // Por ejemplo, puedes seleccionar una nueva forma aleatoria:
  let formas = ["cuadrado", "circulo", "triangulo", "pentagono", "hexagono", "galleta", "estrella"];
  formaActual = random(formas);
}

function keyPressed() {
  if (key == "1") {        // Tecla 1
    formaActual = "cuadrado";
  } else if (key == "2") { // Tecla 2
    formaActual = "circulo";
  } else if (key == "3") { // Tecla 3
    formaActual = "triangulo";
  } else if (key == "4") { // Tecla 4
    formaActual = "pentagono";
  } else if (key == "5") { // Tecla 5
    formaActual = "hexagono";
  } else if (key == "6") { // Tecla 6
    formaActual = "galleta";
  } else if (key == "7") { // Tecla 7
    formaActual = "estrella";
  } 

}

//CLASE//
class Figura {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.originalSize = size;
    this.escalaColor = color(255, 0 , 0);
    this.tonoVoz = 0;

  }
//____________________ PARTE DE AUDIO____________________//
//Controla el tamaño de la figura minimo y maximo
update(volumen) {
  let escalaDeseada = map(volumen, 0, 1, escalaMinima / 2, escalaMaxima * 10);
  let velocidadCambio = 0.02; // suavisado del cambio de tamaño en las figuras

  // Interpola suavemente entre el tamaño actual y el tamaño deseado
  this.size = lerp(this.size, this.originalSize * escalaDeseada, velocidadCambio);

  //en base a la detección de un valor bajo o alto del tono de la voz 
  desfaseporTono = map(gestorPitch.filtrada, 40, 90, -width, width);
}
//____________________ ^ PARTE DE AUDIO ^ ____________________//

  // update(mouseY) {
  //   // cambiamos el tamaño de la figura basado en la posición del mouse en el eje Y
  //   let escala = map(mouseY, 0, height, escalaMinima, escalaMaxima);
  //   this.size = this.originalSize * escala;
  // }

  display(indice, cantidad) {
    // calculamos el valor de transparencia de la figura
      let mezcla = map(indice, 0, cantidad , 0, 2);
      if (mezcla < 1)
      {
        this.escalaColor= lerpColor(color(250,250,250),colorActual,mezcla);

      } else {
        this.escalaColor= lerpColor(colorActual, color(36,25,50),mezcla-1);
      }
     // let colorTransicion = lerpColor(colorDeFondo, colorDeFondo2, transicion);

      //this.escalaColor = colorTransicion;
    fill(this.escalaColor);

  // dibujamos la figura con el gradiente de color celeste
  noStroke();
  
  ellipseMode(CENTER);
  
  
  //---------------------FUNCIONAMIENTO DE LAS 7 FIGURAS---------------------//
  switch (formaActual) {
    case "cuadrado":
      rotate(angle + 175 * (width/2 +- desfaseporTono) / width)
      rectMode(CENTER);
      rect(this.x, this.y, this.size * 1.5, this.size * 1.5);
      break;

    case "circulo":
      rotate(angle + 280 * (width/5 +- desfaseporTono*2) / width)
      ellipseMode(CENTER);
      ellipse(this.x * sin(angle), this.y, this.size * 1.6, this.size * 1.7);
      break;

    case "triangulo":
      rotate(angle + 150 * (width +- desfaseporTono) / width*2)
      beginShape();
      for (let i = 0; i < 5; i++) {
        let angulo = 600  * i - 5;
        let x = this.x + ((cos(angulo) * (this.size * 0.9))); //aumento de tamaño en x
        let y = this.y + ((sin(angulo) * (this.size * 0.9))); //aumento de tamaño en y
        vertex(x, y);
      }
      endShape(CLOSE);
      break;

    case "pentagono":
        rotate(angle + 80 * (width/3 +- desfaseporTono*2) / width)
        beginShape();

        for (let i = 0; i < 5; i++) {
          let angulo =  i * 360 /5;
          let x = ((this.x ) + cos(angulo) * (this.size * 0.9)); //aumento de tamaño en x
          let y = ((this.y ) + sin(angulo) * (this.size * 0.9)); //aumento de tamaño en y
          vertex(x, y);
        }
        endShape(CLOSE);
        break;

    case "hexagono":
        rotate(angle + 150 * (width/2 +- desfaseporTono*2) / width)
        beginShape();
       
        for (let i = 0; i < 6; i++) {
          let angulo =  i * 360 / 6;
          let x = this.x + ((cos(angulo) * (this.size * 0.9))); //aumento de tamaño en x
          let y = this.y + ((sin(angulo) * (this.size * 0.9))); //aumento de tamaño en y
          vertex(x, y);
        }
        endShape(CLOSE);
        break;

    case "galleta":
      rotate(angle + 3600 * (width/2 +- desfaseporTono) / width)

      beginShape();
      //let radio = this.size;
      for (let i = 0; i < 360; i++) {
        let angulo = 180  - i * 50;
        let x = this.x + ((cos(angulo) * (this.size * 0.9))); //aumento de tamaño en x
        let y = this.y + ((sin(angulo) * (this.size * 0.9))); //aumento de tamaño en y
        vertex(x, y);
      }
      endShape(CLOSE);
    break;
      
    case "estrella":
      rotate(angle + 360 * (width/2 +- desfaseporTono) / width)
      beginShape();
      for (let i = 0; i < 100; i++) {
        let angulo = (desfaseporTono * 3.5) * i/30;
        let x = this.x + ((cos(angulo) * (this.size * 0.9))); //aumento de tamaño en x
        let y = this.y + ((sin(angulo) * (this.size * 0.9))); //aumento de tamaño en y
        vertex(x, y);
      }
      endShape(CLOSE);
    break;
      }
  }
}

/*function mouseClicked() {
  // Cambia entre los dos colores al hacer clic
  cambioColor = !cambioColor; // Invierte el valor de la bandera

  if (cambioColor) {
    colorActual = colorDeFondo2;
  } else {
    colorActual = colorDeFondo;
  }
}*/

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext , mic.stream, modelLoaded);
}
//--------------------------------------------------------------------
function modelLoaded() {
//select('#status').html('Model Loaded');
getPitch();
//console.log( "entro aca !" );

}
//--------------------------------------------------------------------
function getPitch() {
  pitch.getPitch(function(err, frequency) {
  if (frequency) {    	
    let midiNum = freqToMidi(frequency);
    console.log( midiNum );
    desfaseporTono = map(midiNum, 40, 90, -1, 1);
    gestorPitch.actualizar( midiNum );

  }
  getPitch();
  })
}
