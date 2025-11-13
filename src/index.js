import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../dist/public/css/main.css';

// -------------------- ELEMENTOS DEL DOM --------------------
let normal = document.getElementById("normal");
let polaca = document.getElementById("polaca");
let resultado = document.getElementById("resultado");
let btn_resolver = document.getElementById("btn_resolver");
let btn_limpiar = document.getElementById("btn_limpiar");
let btn_guardar = document.getElementById("btn_guardar");
let almacenadosDiv = document.getElementById("almacenados");

// Arreglo para los almacenados
let almacenados = [];


// -------------------- FUNCIONES DE CONVERSIÓN --------------------
function prioridad(op) {
    if (op === "+" || op === "-") return 1;
    if (op === "*" || op === "/") return 2;
    return 0;
}

// Normal → Polaca
function normalAPolaca(expr) {
    let operadores = [];
    let salida = [];

    expr = expr.replace(/\s+/g, "");

    for (let i = expr.length - 1; i >= 0; i--) {
        let c = expr[i];

        if (/\d/.test(c)) {
            let num = c;
            while (i > 0 && /\d/.test(expr[i - 1])) {
                num = expr[i - 1] + num;
                i--;
            }
            salida.push(num);
        } else if (c === ")") {
            operadores.push(c);
        } else if (c === "(") {
            while (operadores.length && operadores[operadores.length - 1] !== ")") {
                salida.push(operadores.pop());
            }
            operadores.pop();
        } else {
            while (
                operadores.length &&
                prioridad(operadores[operadores.length - 1]) > prioridad(c)
            ) {
                salida.push(operadores.pop());
            }
            operadores.push(c);
        }
    }

    while (operadores.length) {
        salida.push(operadores.pop());
    }

    return salida.reverse().join(" ");
}

// Polaca → Normal
function polacaANormal(expr) {
    let stack = [];
    let tokens = expr.trim().split(/\s+/);

    for (let i = tokens.length - 1; i >= 0; i--) {
        let t = tokens[i];

        if (!isNaN(t)) {
            stack.push(t);
        } else {
            let a = stack.pop();
            let b = stack.pop();
            stack.push(`(${a} ${t} ${b})`);
        }
    }
    return stack[0];
}

function evaluarPolaca(expr) {
    let stack = [];
    let tokens = expr.trim().split(/\s+/);

    for (let i = tokens.length - 1; i >= 0; i--) {
        let t = tokens[i];

        if (!isNaN(t)) {
            stack.push(Number(t));
        } else {
            let x = stack.pop();
            let y = stack.pop();
            switch (t) {
                case "+": stack.push(x + y); break;
                case "-": stack.push(x - y); break;
                case "*": stack.push(x * y); break;
                case "/": stack.push(x / y); break;
            }
        }
    }
    return stack[0];
}

normal.addEventListener("input", () => {
    if (normal.value.trim() === "") {
        polaca.value = "";
        resultado.value = "";
        return;
    }

    let pol = normalAPolaca(normal.value);
    polaca.value = pol;

    resultado.value = evaluarPolaca(pol);
});

polaca.addEventListener("input", () => {
    if (polaca.value.trim() === "") {
        normal.value = "";
        resultado.value = "";
        return;
    }

    let nor = polacaANormal(polaca.value);
    normal.value = nor;

    resultado.value = evaluarPolaca(polaca.value);
});
btn_resolver.addEventListener("click", () => {

    if (normal.value.trim() !== "") {
        const pol = normalAPolaca(normal.value);
        polaca.value = pol;
        resultado.value = evaluarPolaca(pol);
    } 
    else if (polaca.value.trim() !== "") {
        const nor = polacaANormal(polaca.value);
        normal.value = nor;
        resultado.value = evaluarPolaca(polaca.value);
    } 
    else {
        resultado.value = "Ingresa una operación";
    }
});

function actualizarAlmacenados() {
    almacenadosDiv.innerHTML = almacenados
        .map((item, i) => `${i + 1}. Normal: ${item.normal} | Polaca: ${item.polaca} | Resultado: ${item.resultado}`)
        .join("<br>");
}

btn_guardar.addEventListener("click", () => {
    if (normal.value.trim() === "" && polaca.value.trim() === "") {
        resultado.value = "Nada que almacenar";
        return;
    }

    almacenados.push({
        normal: normal.value.trim(),
        polaca: polaca.value.trim(),
        resultado: resultado.value.trim()
    });

    actualizarAlmacenados();
});
btn_limpiar.addEventListener("click", () => {
    normal.value = "";
    polaca.value = "";
    resultado.value = "";
});
