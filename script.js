// === DEFINICIÓN DE LAS METAS ===
const metas = {
    horizontal: [1,2,3,4, 5,6,7,8, 9,10,11,12, 13,14,15,0],
    vertical: [1,5,9,13, 2,6,10,14, 3,7,11,15, 4,8,12,0],
    serpiente: [1,2,3,4, 8,7,6,5, 9,10,11,12, 0,15,14,13],
    espiral: [1,2,3,4, 12,13,14,5, 11,0,15,6, 10,9,8,7],
    diagonal: [1,2,4,7, 3,5,8,11, 6,9,12,14, 10,13,15,0],
    retroceso: [15,14,13,12, 11,10,9,8, 7,6,5,4, 3,2,1,0]
};

let estadoActual = [...metas.horizontal];
let metaActual = [...metas.horizontal];
let resolviendo = false;

// === FUNCIONES DE LA INTERFAZ GRÁFICA ===
function renderizarTablero() {
    const tableroDiv = document.getElementById("tablero");
    tableroDiv.innerHTML = "";
    
    estadoActual.forEach(numero => {
        const ficha = document.createElement("div");
        ficha.className = "ficha";
        
        if (numero === 0) {
            ficha.classList.add("vacia");
        } else if (numero % 2 === 0) {
            ficha.classList.add("par");
        } else {
            ficha.classList.add("impar");
        }
        
        ficha.innerText = numero;
        tableroDiv.appendChild(ficha);
    });
}

function cambiarMeta() {
    if(resolviendo) return;
    const seleccion = document.getElementById("selector-meta").value;
    metaActual = [...metas[seleccion]];
    estadoActual = [...metaActual]; 
    limpiarPasos();
    renderizarTablero();
}

function limpiarPasos() {
    document.getElementById("lista-pasos").innerHTML = "";
    document.getElementById("contador-pasos").innerText = "0";
}

// === LÓGICA DEL PUZZLE ===
function obtenerVecinos(indice) {
    const vecinos = [];
    const fila = Math.floor(indice / 4);
    const col = indice % 4;

    if (fila > 0) vecinos.push(indice - 4); 
    if (fila < 3) vecinos.push(indice + 4); 
    if (col > 0) vecinos.push(indice - 1);  
    if (col < 3) vecinos.push(indice + 1);  
    
    return vecinos;
}

function mezclar() {
    if(resolviendo) return;
    let indiceCero = estadoActual.indexOf(0);
    
    for(let i = 0; i < 30; i++) {
        const vecinos = obtenerVecinos(indiceCero);
        const vecinoAleatorio = vecinos[Math.floor(Math.random() * vecinos.length)];
        
        estadoActual[indiceCero] = estadoActual[vecinoAleatorio];
        estadoActual[vecinoAleatorio] = 0;
        indiceCero = vecinoAleatorio;
    }
    limpiarPasos();
    renderizarTablero();
}

// === ALGORITMO DE BÚSQUEDA (IDA*) ===
function calcularHeuristica(estado) {
    let distancia = 0;
    for (let i = 0; i < 16; i++) {
        let valor = estado[i];
        if (valor !== 0) {
            let indiceMeta = metaActual.indexOf(valor);
            let filaActual = Math.floor(i / 4), colActual = i % 4;
            let filaMeta = Math.floor(indiceMeta / 4), colMeta = indiceMeta % 4;
            distancia += Math.abs(filaActual - filaMeta) + Math.abs(colActual - colMeta);
        }
    }
    return distancia; 
}

let solucionEncontrada = null;

function resolverIDA() {
    let limite = calcularHeuristica(estadoActual);
    solucionEncontrada = null;

    while (limite <= 60) { 
        let limiteAlcanzado = busquedaRecursiva(estadoActual, 0, limite, -1, []);
        if (solucionEncontrada) break;
        if (limiteAlcanzado === Infinity) break;
        limite = limiteAlcanzado;
    }
    return solucionEncontrada;
}

function busquedaRecursiva(estado, costoG, limite, posCeroAnterior, ruta) {
    let costoH = calcularHeuristica(estado);
    let costoF = costoG + costoH;

    if (costoF > limite) return costoF; 
    if (costoH === 0) { 
        solucionEncontrada = ruta; 
        return 0; 
    }

    let minimo = Infinity;
    let posCero = estado.indexOf(0);
    let vecinos = obtenerVecinos(posCero);

    for (let nuevaPos of vecinos) {
        if (nuevaPos === posCeroAnterior) continue; 

        let nuevoEstado = [...estado];
        nuevoEstado[posCero] = nuevoEstado[nuevaPos];
        nuevoEstado[nuevaPos] = 0;

        let nuevaRuta = [...ruta, { 
            ficha: estado[nuevaPos], 
            posCeroAnterior: posCero, 
            posCeroNueva: nuevaPos,
            estado: nuevoEstado 
        }];

        let resultado = busquedaRecursiva(nuevoEstado, costoG + 1, limite, posCero, nuevaRuta);
        
        if (solucionEncontrada) return 0; 
        if (resultado < minimo) minimo = resultado;
    }
    return minimo;
}

// === CONTROL DE ANIMACIÓN ===
function iniciarResolucion() {
    if(resolviendo) return;
    
    if(calcularHeuristica(estadoActual) === 0) {
        alert("El puzzle ya está en su estado final.");
        return;
    }

    resolviendo = true;
    const ruta = resolverIDA();
    
    if (ruta) {
        animarEImprimirPasos(ruta);
    } else {
        alert("No se encontró solución. Intenta mezclar de nuevo.");
        resolviendo = false;
    }
}

function animarEImprimirPasos(ruta) {
    const listaUI = document.getElementById("lista-pasos");
    document.getElementById("contador-pasos").innerText = ruta.length;

    let pasoIndex = 0;

    function ejecutarPaso() {
        if (pasoIndex < ruta.length) {
            let paso = ruta[pasoIndex];
            estadoActual = paso.estado; 
            renderizarTablero();

            let diferencia = paso.posCeroAnterior - paso.posCeroNueva;
            let direccion = "";
            if (diferencia === 4) direccion = "hacia Arriba";
            if (diferencia === -4) direccion = "hacia Abajo";
            if (diferencia === 1) direccion = "a la Izquierda";
            if (diferencia === -1) direccion = "a la Derecha";

            let li = document.createElement("li");
            li.innerHTML = `<b>Paso ${pasoIndex + 1}:</b> Ficha <b>${paso.ficha}</b> se movió ${direccion}`;
            listaUI.appendChild(li);
            listaUI.scrollTop = listaUI.scrollHeight;

            pasoIndex++;
            setTimeout(ejecutarPaso, 300); 
        } else {
            resolviendo = false; 
        }
    }
    ejecutarPaso(); 
}

window.onload = renderizarTablero;