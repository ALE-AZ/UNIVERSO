
/* =========================================
   ELEMENTOS DE LA PÁGINA
========================================= */

const pantallas = document.querySelectorAll(".pantalla");

const inicio = document.getElementById("inicio");
const universo = document.getElementById("universo");
const cartas = document.getElementById("cartas");
const pantallaFinal = document.getElementById("final");

const canvas = document.getElementById("estrellas");
const ctx = canvas.getContext("2d");

const botonComenzar = document.getElementById("comenzar");
const botonVerCartas = document.getElementById("ver-cartas");
const botonVerFinal = document.getElementById("ver-final");
const botonVolverUniverso = document.getElementById("volver-universo");
const botonReiniciar = document.getElementById("reiniciar");

const modal = document.getElementById("modal-carta");
const botonCerrar = document.getElementById("cerrar-carta");
const botonCerrarAbajo = document.getElementById("boton-cerrar-carta");
const fondoModal = document.getElementById("cerrar-fondo");

const tituloCarta = document.getElementById("titulo-carta");
const textoCarta = document.getElementById("texto-carta");
const frase = document.getElementById("frase");


/* =========================================
   MENSAJES EDITABLES DE LAS CARTAS
========================================= */

const mensajes = [
    {
        titulo: "Un pequeño detalle",
        texto: "Quería hacer algo diferente, algo que no fuera solamente un mensaje más. Por eso prepare esto para ti, con la intención de regalarte una sonrisa."
    },
    {
        titulo: "Algo que quería decirte",
        texto: "A veces, los detalles más pequeños pueden guardar sentimientos muy bonitos. No hace falta que todo sea perfecto para que algo tenga un significado especial y ahora lo entiendo."
    },
    {
        titulo: "Una última cosita",
        texto: "espero que esta pequeña sorpresa haya hecho tu día un poquito más bonito. La preparé con cariño, pensando en ti como ya te habia dicho, te quiero mucho ( y aunque aunque aun estes durmiendo eso me dio tiempo de hacer todo esto :V XD). y bueno en fin... eres mi univero ❤️"
    }
];


/* =========================================
   FRASES DEL UNIVERSO
========================================= */

const frases = [
    "Hay detalles que nacen del corazón.",
    "Incluso en un universo enorme, los pequeños detalles brillan.",
    "A veces, una sonrisa puede iluminar todo el espacio.",
    "Esta pequeña sorpresa fue preparada pensando en ti."
];

let fraseActual = 0;
let temporizadorFrases = null;


/* =========================================
   VARIABLES DE ANIMACIÓN
========================================= */

let ancho = 0;
let alto = 0;
let escalaPantalla = 1;
let tiempo = 0;

let estrellas = [];
let particulasAnillo = [];
let particulasCorazon = [];
let particulasFlotantes = [];

let animacionIniciada = false;
let ultimoAncho = 0;
let ultimoAlto = 0;


/* =========================================
   NAVEGACIÓN ENTRE PANTALLAS
========================================= */

function mostrarPantalla(pantalla) {
    pantallas.forEach(elemento => {
        elemento.classList.remove("activa");
    });

    pantalla.classList.add("activa");

    if (pantalla === universo) {
        requestAnimationFrame(() => {
            ajustarCanvas();
        });
    }
}

botonComenzar.addEventListener("click", () => {
    mostrarPantalla(universo);
});

botonVerCartas.addEventListener("click", () => {
    mostrarPantalla(cartas);
});

botonVerFinal.addEventListener("click", () => {
    cerrarModal();
    mostrarPantalla(pantallaFinal);
});

botonVolverUniverso.addEventListener("click", () => {
    mostrarPantalla(universo);
});

botonReiniciar.addEventListener("click", () => {
    cerrarModal();
    mostrarPantalla(inicio);
});


/* =========================================
   CAMBIAR FRASES AUTOMÁTICAMENTE
========================================= */

function cambiarFrase() {
    if (!frase) return;

    frase.style.animation = "none";
    fraseActual = (fraseActual + 1) % frases.length;
    frase.textContent = frases[fraseActual];

    void frase.offsetWidth;

    frase.style.animation = "";
}

if (frase) {
    frase.textContent = frases[0];
    temporizadorFrases = window.setInterval(cambiarFrase, 8000);
}


/* =========================================
   ABRIR Y CERRAR CARTAS
========================================= */

document.querySelectorAll(".carta-boton").forEach(boton => {
    boton.addEventListener("click", () => {
        const indice = Number(boton.dataset.carta);
        const mensaje = mensajes[indice];

        if (!mensaje) return;

        tituloCarta.textContent = mensaje.titulo;
        textoCarta.textContent = mensaje.texto;

        modal.classList.add("visible");
    });
});

function cerrarModal() {
    modal.classList.remove("visible");
}

botonCerrar.addEventListener("click", cerrarModal);
botonCerrarAbajo.addEventListener("click", cerrarModal);
fondoModal.addEventListener("click", cerrarModal);

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") {
        cerrarModal();
    }
});


/* =========================================
   FUNCIONES AUXILIARES
========================================= */

function aleatorio(min, max) {
    return Math.random() * (max - min) + min;
}

function limitar(valor, min, max) {
    return Math.max(min, Math.min(max, valor));
}


/* =========================================
   AJUSTAR CANVAS A LA PANTALLA
========================================= */

function ajustarCanvas() {
    if (!canvas || !ctx) return;

    const rect = universo.getBoundingClientRect();

    ancho = rect.width || window.innerWidth;
    alto = rect.height || window.innerHeight;

    escalaPantalla = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(ancho * escalaPantalla);
    canvas.height = Math.round(alto * escalaPantalla);

    canvas.style.width = `${ancho}px`;
    canvas.style.height = `${alto}px`;

    ctx.setTransform(
        escalaPantalla,
        0,
        0,
        escalaPantalla,
        0,
        0
    );

    ultimoAncho = ancho;
    ultimoAlto = alto;

    crearEstrellas();
    crearAnillo();
    crearCorazon();
    crearParticulasFlotantes();
}

window.addEventListener("resize", () => {
    const nuevoAncho = universo.getBoundingClientRect().width;
    const nuevoAlto = universo.getBoundingClientRect().height;

    if (
        Math.abs(nuevoAncho - ultimoAncho) > 2 ||
        Math.abs(nuevoAlto - ultimoAlto) > 2
    ) {
        ajustarCanvas();
    }
});


/* =========================================
   ESTRELLAS DEL ESPACIO
========================================= */

function crearEstrellas() {
    estrellas = [];

    const cantidad = limitar(
        Math.floor((ancho * alto) / 3000),
        100,
        320
    );

    for (let i = 0; i < cantidad; i++) {
        estrellas.push({
            x: Math.random() * ancho,
            y: Math.random() * alto,
            radio: aleatorio(0.4, 1.7),
            brillo: aleatorio(0.25, 1),
            velocidad: aleatorio(0.002, 0.012),
            fase: aleatorio(0, Math.PI * 2)
        });
    }
}


/* =========================================
   CREAR ANILLO GALÁCTICO
========================================= */

function crearAnillo() {
    particulasAnillo = [];

    const cantidad = 1700;

    for (let i = 0; i < cantidad; i++) {
        const angulo = Math.random() * Math.PI * 2;

        particulasAnillo.push({
            angulo,
            radio: aleatorio(0.72, 1.28),
            grosor: aleatorio(-1, 1),
            tamano: aleatorio(0.45, 1.65),
            brillo: aleatorio(0.2, 1),
            velocidad: aleatorio(0.0015, 0.0045),
            tono: Math.random()
        });
    }
}


/* =========================================
   CREAR CORAZÓN DE PARTÍCULAS
========================================= */

function crearCorazon() {
    particulasCorazon = [];

    const cantidad = 650;

    for (let i = 0; i < cantidad; i++) {
        const t = Math.random() * Math.PI * 2;

        const x = 16 * Math.pow(Math.sin(t), 3);

        const y =
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t);

        const profundidad = Math.sqrt(Math.random());

        particulasCorazon.push({
            x: x * profundidad,
            y: y * profundidad,
            tamano: aleatorio(0.5, 1.7),
            fase: aleatorio(0, Math.PI * 2),
            brillo: aleatorio(0.3, 1)
        });
    }
}


/* =========================================
   PARTÍCULAS FLOTANTES
========================================= */

function crearParticulasFlotantes() {
    particulasFlotantes = [];

    for (let i = 0; i < 110; i++) {
        particulasFlotantes.push({
            x: Math.random() * ancho,
            y: Math.random() * alto,
            radio: aleatorio(0.5, 2),
            velocidad: aleatorio(0.12, 0.5),
            fase: aleatorio(0, Math.PI * 2)
        });
    }
}


/* =========================================
   LOCALIZAR EL CENTRO DEL PLANETA
========================================= */

function obtenerCentroPlaneta() {
    const planeta = document.querySelector("#universo .planeta");

    if (!planeta) {
        return {
            x: ancho / 2,
            y: alto / 2
        };
    }

    const rectCanvas = canvas.getBoundingClientRect();
    const rectPlaneta = planeta.getBoundingClientRect();

    return {
        x: rectPlaneta.left - rectCanvas.left + rectPlaneta.width / 2,
        y: rectPlaneta.top - rectCanvas.top + rectPlaneta.height / 2
    };
}


/* =========================================
   DIBUJAR ESTRELLAS
========================================= */

function dibujarEstrellas() {
    for (const estrella of estrellas) {
        const pulso =
            0.48 +
            Math.sin(
                tiempo * estrella.velocidad + estrella.fase
            ) * 0.4;

        ctx.beginPath();

        ctx.arc(
            estrella.x,
            estrella.y,
            estrella.radio,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = `rgba(255, 230, 255, ${
            Math.max(0.1, pulso * estrella.brillo)
        })`;

        ctx.fill();
    }
}


/* =========================================
   DIBUJAR HALO DEL ANILLO
========================================= */

function dibujarHaloAnillo(radioX, radioY) {
    ctx.save();

    ctx.scale(1, radioY / radioX);

    const halo = ctx.createRadialGradient(
        0,
        0,
        radioX * 0.72,
        0,
        0,
        radioX * 1.3
    );

    halo.addColorStop(0, "rgba(255, 70, 180, 0)");
    halo.addColorStop(0.45, "rgba(255, 70, 180, 0.035)");
    halo.addColorStop(0.72, "rgba(190, 100, 255, 0.11)");
    halo.addColorStop(1, "rgba(255, 70, 180, 0)");

    ctx.beginPath();
    ctx.arc(0, 0, radioX * 1.3, 0, Math.PI * 2);

    ctx.fillStyle = halo;
    ctx.fill();

    ctx.restore();
}


/* =========================================
   DIBUJAR PARTÍCULAS DEL ANILLO
========================================= */

function dibujarParticulasAnillo(radioX, radioY, giro) {
    const ordenadas = particulasAnillo.slice().sort((a, b) => {
        return (
            Math.sin(a.angulo + giro) -
            Math.sin(b.angulo + giro)
        );
    });

    for (const particula of ordenadas) {
        const angulo = particula.angulo + giro;

        const radio = radioX * particula.radio;

        const x = Math.cos(angulo) * radio;

        const y =
            Math.sin(angulo) *
            radioY *
            particula.radio;

        const profundidad = Math.sin(angulo);
        const estaDelante = profundidad > 0;

        let color;

        if (particula.tono < 0.52) {
            color = "255, 105, 210";
        } else if (particula.tono < 0.82) {
            color = "205, 150, 255";
        } else {
            color = "255, 238, 255";
        }

        const alpha = estaDelante
            ? 0.48 + particula.brillo * 0.5
            : 0.18 + particula.brillo * 0.34;

        const tamano = particula.tamano *
            (estaDelante ? 1.05 : 0.78);

        if (particula.brillo > 0.78) {
            ctx.beginPath();

            ctx.arc(
                x,
                y,
                tamano * 3.1,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = `rgba(${color}, ${alpha * 0.13})`;
            ctx.fill();
        }

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            tamano,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.fill();
    }
}


/* =========================================
   DIBUJAR EL ANILLO COMPLETO
========================================= */

function dibujarAnillo() {
    const centro = obtenerCentroPlaneta();

    const base = Math.min(
        ancho * 0.31,
        alto * 0.24,
        175
    );

    const radioX = Math.max(95, base * 1.55);
    const radioY = Math.max(30, base * 0.48);

    const giro = tiempo * 0.00045;

    ctx.save();

    ctx.translate(centro.x, centro.y);
    ctx.rotate(-0.16);

    dibujarHaloAnillo(radioX, radioY);

    // Capas orbitales suaves.

    for (let i = 0; i < 3; i++) {
        const factor = 0.84 + i * 0.13;

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            radioX * factor,
            radioY * factor,
            giro * (i % 2 === 0 ? 1 : -1),
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = i === 1
            ? "rgba(255, 130, 230, 0.20)"
            : "rgba(180, 140, 255, 0.10)";

        ctx.lineWidth = i === 1 ? 1.1 : 0.7;

        ctx.stroke();
    }

    dibujarParticulasAnillo(radioX, radioY, giro);

    // Arcos decorativos que rodean la galaxia.

    for (let i = 0; i < 4; i++) {
        const inicioArco =
            giro * (i % 2 === 0 ? 1 : -1) + i * 1.4;

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            radioX * (0.90 + i * 0.055),
            radioY * (0.90 + i * 0.055),
            inicioArco * 0.035,
            inicioArco,
            inicioArco + Math.PI * 0.75
        );

        ctx.strokeStyle = i % 2 === 0
            ? "rgba(255, 135, 225, 0.27)"
            : "rgba(205, 160, 255, 0.20)";

        ctx.lineWidth = 1;
        ctx.stroke();
    }

    ctx.restore();
}


/* =========================================
   DIBUJAR CORAZÓN CENTRAL
========================================= */

function dibujarCorazon() {
    const centro = obtenerCentroPlaneta();

    const escala = Math.min(
        ancho * 0.009,
        alto * 0.008,
        1.05
    );

    const latido = 1 + Math.sin(tiempo * 0.003) * 0.045;

    for (const p of particulasCorazon) {
        const x = centro.x + p.x * escala * latido;
        const y = centro.y - p.y * escala * latido;

        const brillo =
            0.55 +
            Math.sin(tiempo * 0.003 + p.fase) * 0.35;

        const verde = 65 + Math.floor(brillo * 45);
        const azul = 150 + Math.floor(brillo * 90);

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            p.tamano,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = `rgba(255, ${verde}, ${azul}, ${
            Math.max(0.2, brillo * p.brillo)
        })`;

        ctx.fill();
    }
}


/* =========================================
   DIBUJAR PARTÍCULAS FLOTANTES
========================================= */

function dibujarParticulasFlotantes() {
    for (const p of particulasFlotantes) {
        p.y -= p.velocidad;

        if (p.y < -5) {
            p.y = alto + 5;
            p.x = Math.random() * ancho;
        }

        const pulso =
            0.25 +
            Math.abs(
                Math.sin(tiempo * 0.002 + p.fase)
            ) * 0.55;

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.radio,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = `rgba(255, 170, 235, ${pulso})`;
        ctx.fill();
    }
}


/* =========================================
   ANIMACIÓN PRINCIPAL
========================================= */

function animar() {
    requestAnimationFrame(animar);

    if (!ancho || !alto) return;

    tiempo += 1;

    ctx.clearRect(0, 0, ancho, alto);

    if (!universo.classList.contains("activa")) {
        return;
    }

    dibujarEstrellas();
    dibujarParticulasFlotantes();
    dibujarAnillo();
    dibujarCorazon();
}


/* =========================================
   INICIAR ANIMACIÓN
========================================= */

ajustarCanvas();

if (!animacionIniciada) {
    animacionIniciada = true;
    animar();
}
