let figuras = [];
let distanciaEntreFiguras = 50; // distancia fija entre las figuras
let escalaMinima = 0.5; // escala mínima de las figuras
let escalaMaxima = 1.5; // escala máxima de las figuras

let formaActual = "circulo";

let angle = 0; // VARIABLE QUE SERVIRÁ PARA DEFINIR EL ÁNGULO DE ROTACIÓN DE LAS FIGURAS


let colorDeFondo; //variable global de color celeste
let colorDeFondo2; //variable global de color rojo
let colorActual; // Variable que almacena el color actual
let cambioColor = false; // Variable de bandera para el cambio de color


function setup() {
  createCanvas(windowWidth, windowHeight);
   // LAS FIGURAS TIENEN COMO PUNTO DE ORIGEN SU CENTRO

  // Creamos la primera y última figura con tamaños definidos
  let primeraFigura = new Figura(0, 0, 30);
  let ultimaFigura = new Figura(0, 0, 60);
  
  colorDeFondo = color(80, 150, 200); // Definir color celeste
  colorDeFondo2 = color(200, 80, 60); // Definir color rojo
  colorActual = colorDeFondo; // Establecer el color inicial

  // Calculamos la escala máxima y mínima de las figuras intermedias
  let escalaMinimaIntermedia = escalaMinima * primeraFigura.size / ultimaFigura.size;
  let escalaMaximaIntermedia = escalaMaxima * primeraFigura.size / ultimaFigura.size;

  // Creamos las figuras intermedias con una escala que varía entre la mínima y máxima calculadas
  for(let i = 1; i < 19; i++) {
    let escalaIntermedia = map(i, 1, 20, escalaMinimaIntermedia, escalaMaximaIntermedia);
    let nuevaFigura = new Figura(0, 0, primeraFigura.size * escalaIntermedia * i);
    figuras.push(nuevaFigura);
  }

  rectMode( CENTER );
  // ANGULO EN GRADOS
  angleMode( DEGREES );
  frameRate( 60 ); // DEFINO UN NUMERO ESTABLECIDO DE FOTOGRAMAS
}

function draw() {
  background(220);
  translate(width/2, height/2);
  for(let i = 0; i < figuras.length; i++) {
    figuras[i].update(mouseY);
    figuras[i].display(i, figuras.length);
  }
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


class Figura {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.originalSize = size;
    let radio = size;

  }

  update(mouseY) {
    // cambiamos el tamaño de la figura basado en la posición del mouse en el eje Y
    let escala = map(mouseY, 0, height, escalaMinima, escalaMaxima);
    this.size = this.originalSize * escala;
  }

  display(indice, cantidad) {
    // calculamos el valor de transparencia de la figura
    let transparencia = map(indice, 0, cantidad - 1, 255, 0);
    colorActual.setAlpha(transparencia);
  fill(colorActual);

  // dibujamos la figura con el gradiente de color celeste
  noStroke();
 // fill(currentColor);
  ellipseMode(CENTER);
  
  
  //---------------------FUNCIONAMIENTO DE LAS 7 FIGURAS---------------------//
  switch (formaActual) {
    case "cuadrado":
      rotate(angle + 8 * (width/2 +- mouseX) / width)
      rectMode(CENTER);
      rect(this.x, this.y, this.size, this.size);
      break;

    case "circulo":
      rotate(angle + 15 * (width/3 +- mouseX) / width)
      ellipseMode(CENTER);
      ellipse(this.x * sin(angle), this.y, this.size + 45, this.size + 15);
      break;

    case "triangulo":
      rotate(angle + 5 * (width/2 +- mouseX) / width)
      beginShape();
      for (let i = 0; i < 5; i++) {
        let angulo = 600  * i - 5;
        let x = this.x + ((cos(angulo) * (this.size * 0.7))); //aumento de tamaño en x
        let y = this.y + ((sin(angulo) * (this.size * 0.7))); //aumento de tamaño en y
        vertex(x, y);
      }
      endShape(CLOSE);
      break;

    case "pentagono":
        rotate(angle + 5 * (width/2 +- mouseX) / width)
        beginShape();

        for (let i = 0; i < 5; i++) {
          let angulo =  i * 360 /5;
          let x = ((this.x ) + cos(angulo) * (this.size * 0.7)); //aumento de tamaño en x
          let y = ((this.y ) + sin(angulo) * (this.size * 0.7)); //aumento de tamaño en y
          vertex(x, y);
        }
        endShape(CLOSE);
        break;

    case "hexagono":
        rotate(angle + 5 * (width/2 +- mouseX) / width)
        beginShape();
       
        for (let i = 0; i < 6; i++) {
          let angulo =  i * 360 / 6;
          let x = this.x + ((cos(angulo) * (this.size * 0.7))); //aumento de tamaño en x
          let y = this.y + ((sin(angulo) * (this.size * 0.7))); //aumento de tamaño en y
          vertex(x, y);
        }
        endShape(CLOSE);
        break;

    case "galleta":
      rotate(angle + 5 * (width/2 +- mouseX) / width)

      beginShape();
      //let radio = this.size;
      for (let i = 0; i < 360; i++) {
        let angulo = 100  - i * 50;
        let x = this.x + ((cos(angulo) * (this.size * 0.7))); //aumento de tamaño en x
        let y = this.y + ((sin(angulo) * (this.size * 0.7))); //aumento de tamaño en y
        vertex(x, y);
      }
      endShape(CLOSE);
    break;
      
    case "estrella":
      rotate(angle + 5 * (width/2 +- mouseX) / width)
      beginShape();
      for (let i = 0; i < 100; i++) {
        let angulo = (mouseX * 2.5) * i/30;
        let x = this.x + ((cos(angulo) * (this.size * 0.7))); //aumento de tamaño en x
        let y = this.y + ((sin(angulo) * (this.size * 0.7))); //aumento de tamaño en y
        vertex(x, y);
      }
      endShape(CLOSE);
    break;
      }
  }
}

function mouseClicked() {
  // Cambia entre los dos colores al hacer clic
  cambioColor = !cambioColor; // Invierte el valor de la bandera

  if (cambioColor) {
    colorActual = colorDeFondo2;
  } else {
    colorActual = colorDeFondo;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}