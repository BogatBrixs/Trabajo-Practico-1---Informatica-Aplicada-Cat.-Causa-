
let distanciaEntreFiguras = 50; // distancia fija entre las figuras
let escalaMinima = 0.9; // escala mínima de las figuras
let escalaMaxima = 1.6; // escala máxima de las figuras
let angle = 5; // VARIABLE QUE SERVIRÁ PARA DEFINIR EL ÁNGULO DE ROTACIÓN DE LAS FIGURAS

let colorDeFondo; //variable global de color celeste
let colorDeFondo2; //variable global de color rojo
let colorActual; // Variable que almacena el color actual
let cambioColor = false; // Variable de bandera para el cambio de color

let figuras = [];
let cantidadFiguras = 19;
let granos; //declaramos la variable para la foto de granos
let saturacionDeseada = 90; // Valor de saturación deseado (0-100)


//____________________ PARTE DE AUDIO ____________________//
let monitorear = true;

let mic;
let pitch;
let amp;
let audioContext;

let c;
let gestorAmp;
let gestorPitch;
let haySonido;
let antesHabiaSonido;
let desfaseporTono = 0;

let tiempoEntreFiguras = 1; // una variable para almacenar el tiempo en segundos que deseas que transcurra antes de cambiar las figuras
let tiempoTranscurrido = 0; //variable para realizar un seguimiento del tiempo transcurrido


//____________________ PARTE DE ESTADOS____________________//
let formaActual = "circulo";
let marcaEnElTiempo;
let tiempoLimiteForma = 4000;
let tiempoLimiteColor = 4000;
let tiempoLimiteTamaño = 4000;
let tiempoReinicio = 3000;
let estados = ["forma", "color", "tamaño", "fin", "reinicio"];
let estadoActual = 0;
let estado;
const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';


//____________________ ^^PARTE DE AUDIO^^____________________//


function preload() {
  granos = loadImage('filtro.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start( startPitch );

  gestorAmp = new GestorSenial( 0.01 , 0.4 ); 
  gestorPitch = new GestorSenial( 40 , 70 ); //RANGO DINAMICO DE FRECUENCIA

  userStartAudio();
//____________________ ^^PARTE DE AUDIO^^____________________//


//CREACION DE COPIAS
  // Creamos la primera y última figura con tamaños definidos
  let primeraFigura = new Figura(0, 0, 30);
  let ultimaFigura = new Figura(0, 0, 60);
  
  // Calculamos la escala máxima y mínima de las figuras intermedias
  let escalaMinimaIntermedia = escalaMinima * primeraFigura.size / ultimaFigura.size;
  let escalaMaximaIntermedia = escalaMaxima * primeraFigura.size / ultimaFigura.size;

  // Creamos las figuras intermedias con una escala que varía entre la mínima y máxima calculadas
  for(let i = 1; i < 13; i++) {
    let escalaIntermedia = map(i, 1, 10, escalaMinimaIntermedia, escalaMaximaIntermedia);
    let nuevaFigura = new Figura(0, 0, primeraFigura.size * escalaIntermedia * (i));
    figuras.push(nuevaFigura);
  }

  antesHabiaSonido = false;

  colorDeFondo = color(97,168,217); // Definir color celeste
  colorDeFondo2 = color(222, 105, 83); // Definir color rojo
  colorActual = colorDeFondo; // Establecer el color inicial

  rectMode( CENTER ); 
  angleMode( DEGREES ); // ANGULO EN GRADOS
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

//____________________ PARTE DE ESTADOS____________________//
if( estadoActual === 0 ){
  background(255);
let textToShow = "ELIGE LA FORMA EMITIENDO Y PAUSANDO TU VOZ";
let x = width / 2; // Posición horizontal del texto
let y = height - 50; // Posición vertical del texto
fill(0);
textSize(20);
textAlign(CENTER, BOTTOM);
text(textToShow, x, y);


  if( inicioElSonido ){

    cambiarFiguras();// Reiniciar el tiempo transcurrido
  }

  if( finDelSonido ){
    marcaEnElTiempo = millis();
  }

  if( !haySonido ){
    let ahora = millis();
    if( ahora > marcaEnElTiempo+tiempoLimiteForma ){
        estadoActual = 1;
        marcaEnElTiempo = millis();
    }
  }

}else if( estadoActual === 1 ){
  background(255);
  
  let textToShow = "ELIGE EL COLOR CON EL TONO DE TU VOZ";
  let x = width / 2; // Posición horizontal del texto
  let y = height - 50; // Posición vertical del texto
  fill(0);
  textSize(20);
  textAlign(CENTER, BOTTOM);
  text(textToShow, x, y);

  if( haySonido ){
    let tono = gestorPitch.filtrada; // Obtener el valor del tono del micrófono utilizando gestorPitch.filtrada
    let porcentaje = map(tono, 0, 1, -1, 2); // Calcular el porcentaje de transición basado en el tono (0-1)
    let colorTransicion = lerpColor(colorDeFondo, colorDeFondo2, porcentaje);  // Interpolar entre colorDeFondo y colorDeFondo2 utilizando el porcentaje
    colorActual = colorTransicion;
  }

  if( finDelSonido ){
    marcaEnElTiempo = millis();
  }

  if( !haySonido ){
    let ahora = millis();
    if( ahora > marcaEnElTiempo+tiempoLimiteColor ){
        estadoActual = 2;
        marcaEnElTiempo = millis();
    }
  }

}else if( estadoActual === 2 ){
  background(255);

  if( haySonido ){

    // SE PASA POR CADA FIGURA
    push();
    translate(width/2, height/2);
      for(let i = 0; i < figuras.length; i++) {

        figuras[figuras.length-i-1].update(vol);
        
      }
    pop(); // Dibuja la imagen con opacidad 
  }

  if( finDelSonido ){
    marcaEnElTiempo = millis();
  }

  if( !haySonido ){
    let ahora = millis();
    if( ahora > marcaEnElTiempo+tiempoLimiteTamaño){
        estadoActual = 3;
        marcaEnElTiempo = millis();
    }
  }
  

}else if( estadoActual === 3){
  


  if( inicioElSonido ){
    marcaEnElTiempo = millis();
  }

  if( haySonido ){
    let ahora = millis();
    if( ahora > marcaEnElTiempo+tiempoReinicio ){
        estadoActual = 4;
        marcaEnElTiempo = millis();
    }
  }

}else if( estadoActual === 4 ){

      estadoActual = 0;
      save("resultado"+frameCount+".png");
}

// DIBUJAMOS LAS FIGURAS
push();
translate(width/2, height/2);
  for(let i = 0; i < figuras.length; i++) {
    //figuras[figuras.length-i-1].update(mouseY);
    //figuras[figuras.length-i-1].update(vol);
    //figuras[figuras.length-i-1].display(i, figuras.length);
   

    figuras[figuras.length-i-1].display(i, figuras.length);
  }
pop(); // Dibuja la imagen con opacidad
tint(255, 50); // 128 es el valor de opacidad (0 es completamente transparente y 255 es opaco)
image(granos,0,0, width, height); // Cambia las coordenadas y dimensiones según tus necesidades

if( estadoActual == 0 ){

  let textToShow = "ELIGE LA FORMA EMITIENDO Y PAUSANDO TU VOZ";
  let x = width / 2; // Posición horizontal del texto
  let y = height - 50; // Posición vertical del texto
  fill(0);
  textSize(20);
  textAlign(CENTER, BOTTOM);
  text(textToShow, x, y);
}

if( estadoActual == 1 ){

  let textToShow = "ELIGE EL COLOR CON EL TONO DE TU VOZ";
  let x = width / 2; // Posición horizontal del texto
  let y = height - 50; // Posición vertical del texto
  fill(0);
  textSize(20);
  textAlign(CENTER, BOTTOM);
  text(textToShow, x, y);
}

if( estadoActual == 2 ){

  let textToShow = "ELIGE EL TAMAÑO CON CON EL VOLUMEN DE TU VOZ";
  let x = width / 2; // Posición horizontal del texto
  let y = height - 50; // Posición vertical del texto
  fill(0);
  textSize(20);
  textAlign(CENTER, BOTTOM);
  text(textToShow, x, y);
}
if( estadoActual == 3 ){

  let textToShow = "EMITE UN SONIDO CONTINUO PARA EL REINICIO";
  let x = width / 2; // Posición horizontal del texto
  let y = height - 50; // Posición vertical del texto
  fill(0);
  textSize(20);
  textAlign(CENTER, BOTTOM);
  text(textToShow, x, y);
}
//CHEQUEAR QUE SE CAPTURE EL AUDIO
if( monitorear ){
  //gestorAmp.dibujar( width/7 , height - 150 );
  //gestorPitch.dibujar( width/7, height - 300);
}

antesHabiaSonido = haySonido;
console.log( estadoActual );
}

function cambiarFiguras() {
  // Lógica de cambio de figuras aquí
  // Por ejemplo, puedes seleccionar una nueva forma aleatoria:
  let formas = ["cuadrado", "circulo", "triangulo", "pentagono", "hexagono", "galleta", "estrella"];
  formaActual = random(formas);
}

//____________________ CLASE ____________________//
class Figura {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.originalSize = size;
    this.escalaColor = color(255, 0 , 0);
    this.tonoVoz = 0;

  }

update(volumen) {
  //____________________ PARTE DE AUDIO____________________//
  //Controla el tamaño de la figura minimo y maximo
  let escalaDeseada = map(volumen, 0, 1, escalaMinima / 2, escalaMaxima * 10);
  let velocidadCambio = 0.1; // suavisado del cambio de tamaño en las figuras

  // Interpola suavemente entre el tamaño actual y el tamaño deseado
  this.size = lerp(this.size, this.originalSize * escalaDeseada, velocidadCambio);

  //en base a la detección de un valor bajo o alto del tono de la voz 
  desfaseporTono = map(gestorPitch.filtrada, 40, 90, -width, width);
}

display(indice, cantidad) {
    // calculamos el valor de transparencia de la figura
      let mezcla = map(indice, 0, cantidad , 0, 2);
  if (mezcla < 1)
      {
        this.escalaColor= lerpColor(color(250,250,250),colorActual,mezcla);

  } else {
        this.escalaColor= lerpColor(colorActual, color(36,25,50),mezcla-1);
  }

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
      rotate(angle + 58 * (width +- desfaseporTono) / width*2)
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
      rotate(angle + 360 * (width/2 +- desfaseporTono*3) / width)
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



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
//--------------------------------------------------------------------
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
