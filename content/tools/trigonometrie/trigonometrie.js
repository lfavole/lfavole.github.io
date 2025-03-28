function gcd(a, b) {
    return b ? gcd(b, a % b) : Math.abs(a);
}

function calculateCosineOrSine(func, angle_) {
    let angle = angle_.clone();

    // cos(x + 2π) = cos(x), sin(x + 2π) = sin(x)
    angle.numerator %= 2 * angle.denominator;

    let result = "";
    let results;

    if (func === "cos") {
        results = {
            "0": "1",
            "π/6": "√3/2",
            "π/4": "√2/2",
            "π/3": "1/2",
            "π/2": "0",
        };
        // cos(-x) = cos(x)
        if (angle.numerator < 0) {
            angle.numerator = -angle.numerator;
        }
        // cos(4π/3) = cos(2π/3)
        if (angle.denominator < angle.numerator && angle.numerator <= 2 * angle.denominator) {
            angle.numerator = 2 * angle.denominator - angle.numerator;
        }
        // cos(2π/3) = -cos(π/3)
        if (angle.denominator / 2 < angle.numerator && angle.numerator <= angle.denominator) {
            angle.numerator = angle.denominator - angle.numerator;
            result += "-";
        }
    } else if (func === "sin") {
        results = {
            "0": "0",
            "π/6": "1/2",
            "π/4": "√2/2",
            "π/3": "√3/2",
            "π/2": "1",
        };
        // sin(-x) = -sin(x)
        if (angle.numerator < 0) {
            angle.numerator = -angle.numerator;
            result += "-";
        }
        // sin(4π/3) = -sin(2π/3)
        if (angle.denominator < angle.numerator && angle.numerator <= 2 * angle.denominator) {
            angle.numerator = 2 * angle.denominator - angle.numerator;
            result += "-";
        }
        // sin(2π/3) = sin(π/3)
        if (angle.denominator / 2 < angle.numerator && angle.numerator <= angle.denominator) {
            angle.numerator = angle.denominator - angle.numerator;
        }
    } else {
        throw new Error("Unknown function: " + func);
    }
    if (result == "--") {
        result = "";
    }
    result += results[angle.toString()];
    if (result === "-0") {
        return "0";
    }
    return result;
}

function solveInInterval(func, result_, isMainMeasure) {
    // special case with 3 values
    if (func === "sin" && result_ === 0) {
        if (isMainMeasure) {
            // 0, π, 2π
            return [new PiFraction(0, 1), new PiFraction(1, 1), new PiFraction(2, 1)];
        } else {
            // -π, 0, π
            return [new PiFraction(-1, 1), new PiFraction(0, 1), new PiFraction(1, 1)];
        }
    }
    let result = result_.clone();
    let minus = false;
    let x1;
    let results;
    if (func === "cos") {
        results = {
            "1": new PiFraction(0, 1),
            "√3/2": new PiFraction(1, 6),
            "√2/2": new PiFraction(1, 4),
            "1/2": new PiFraction(1, 3),
            "0": new PiFraction(1, 2),
        };
    } else if (func === "sin") {
        results = {
            "0": new PiFraction(0, 1),
            "1/2": new PiFraction(1, 6),
            "√2/2": new PiFraction(1, 4),
            "√3/2": new PiFraction(1, 3),
            "1": new PiFraction(1, 2),
        };
    } else {
        throw new Error("Unknown function: " + func);
    }
    if (result.numerator < 0) {
        result.numerator = -result.numerator;
        minus = true;
    }
    x1 = results[result.toString()];
    let x2;
    if (!minus) {
        if (func === "cos") {
            // 2π - x1
            x2 = new PiFraction(2 * x1.denominator - x1.numerator, x1.denominator);
        } else {
            // π - x1
            x2 = new PiFraction(x1.denominator - x1.numerator, x1.denominator);
        }
    } else {
        if (func === "cos") {
            // π - x1 (safe because x1 ∈ [0;π/2])
            x1.numerator = x1.denominator - x1.numerator;
            // 2π - x1
            x2 = [2 * x1.denominator - x1.numerator, x1.denominator];
        } else {
            // sin(x) = -sin(x + π) (safe because x1 ∈ [0;π/2])
            x1.numerator += x1.denominator;
            // 2π - (x1 - π)
            x2 = new PiFraction(2 * x1.denominator - (x1.numerator - x1.denominator), x1.denominator);
        }
    }
    // x1 > π
    if (isMainMeasure && x1.numerator > x1.denominator) {
        // x1 = x1 - 2π
        x1.numerator = x1.numerator - 2 * x1.denominator;
    }
    // x2 > π
    if (isMainMeasure && x2.numerator > x2.denominator) {
        // x2 = x2 - 2π
        x2.numerator = x2.numerator - 2 * x2.denominator;
    }
    // if x1 and x2 are equal, return only one of them
    if (x1.toString() === x2.toString()) {
        return [x1];
    }
    // otherwise, return them sorted
    return [x1, x2].sort((a, b) => +a - +b);
}

function getRandomFunc() {
    return Math.random() < 0.5 ? "cos" : "sin";
}

class Fraction {
    static SYMBOL = "";
    static VALUE = 1;

    constructor(numerator, denominator) {
        this._numerator = numerator;
        this._denominator = denominator;
        this._simplify();
    }

    clone() {
        return new this.constructor(this.numerator, this.denominator);
    }

    get numerator() {
        return this._numerator;
    }

    set numerator(value) {
        this._numerator = value;
        this._simplify();
    }

    get denominator() {
        return this._denominator;
    }

    set denominator(value) {
        this._denominator = value;
        this._simplify();
    }

    _simplify() {
        const divisor = gcd(this.numerator, this.denominator);
        this._numerator /= divisor;
        this._denominator /= divisor;
    }

    valueOf() {
        return this.constructor.VALUE * this.numerator / this.denominator;
    }

    toString() {
        if (this.numerator === 0)
            return "0";
        let result = "";
        if (this.constructor.SYMBOL) {
            if (this.numerator === -1) {
                result += "-";
            }
        } else {
            result += this.numerator;
        }
        result += this.constructor.SYMBOL;
        if (this.denominator !== 1)
            result += "/" + this.denominator;
        return result;
    }
}

class PiFraction extends Fraction {
    static SYMBOL = "π";
    static VALUE = Math.PI;
}

function getPrimeFactors(num) {
    const factors = [];
    // Check for the number of 2s that divide num
    while (num % 2 === 0) {
        factors.push(2);
        num = num / 2;
    }
    // num must be odd at this point, so a skip of 2 is used
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
        // While i divides num, add i and divide num
        while (num % i === 0) {
            factors.push(i);
            num /= i;
        }
    }
    // This condition is to handle the case when num is a prime number greater than 2
    if (num > 2) {
        factors.push(num);
    }
    return factors;
}

function findPairs(arr) {
    const pairs = [];
    const elementCount = {};

    // Count occurrences of each element
    arr.forEach(element => {
        elementCount[element] = (elementCount[element] || 0) + 1;
    });

    // Separate pairs and other elements
    for (const [element, count] of Object.entries(elementCount)) {
        const pairsCount = Math.floor(count / 2);

        for (let i = 0; i < pairsCount; i++) {
            pairs.push(element);
        }
    }

    return pairs;
}

class SquareRootFraction extends Fraction {
    static SYMBOL = "√";

    _simplify() {
        const factors = getPrimeFactors(this.numerator);
        const integer = findPairs(factors);
        const divisor = gcd(integer.reduce((a, b) => a * b, 1), this.denominator);
        this._numerator /= divisor * divisor;
        this._denominator /= divisor;
    }

    _formatSquareRoot(number) {
        const sqrt = Math.sqrt(number);
        if (Number.isInteger(sqrt))
            return sqrt;
        return "√" + number;
    }

    valueOf() {
        return Math.sqrt(this.numerator) / this.denominator;
    }

    toString() {
        if (this.numerator === 0)
            return "0";
        let result = this._formatSquareRoot(this.numerator);
        if (this.denominator !== 1)
            result += "/" + this.denominator;
        return result;
    }
}

class Question {
    constructor() {
        if (this.constructor === Question) {
            throw new Error("Question class can't be instantiated.");
        }
    }
}

class AngleQuestion extends Question {
    constructor() {
        super();
        this.func = getRandomFunc();
        // the bottom part of the fraction (π, π/2, π/3, π/4, π/6)
        const divisor = [1, 2, 3, 4, 6][Math.floor(Math.random() * 5)];
        // from -20π to 20π included
        this.angle = new PiFraction(Math.floor(Math.random() * (divisor * 20 + 1)) - (divisor * 10 + 1), divisor);
        this.answer = calculateCosineOrSine(this.func, this.angle);
    }

    get question() {
        return `Quelle est la valeur de ${this.func}(${this.angle}) ?`;
    }
}

class EquationQuestion extends Question {
    constructor() {
        super();
        this.func = getRandomFunc();
        // 0, 1/2, √2/2, √3/2 or 1
        this.result = new SquareRootFraction(Math.floor(Math.random() * 5), 2);
        this.isMainMeasure = Math.random() < 0.5;
        this.answer = solveInInterval(this.func, this.result, this.isMainMeasure).map(x => x.toString()).join(" ou ");
    }

    get question() {
        return (
            `Quelles sont les solutions de ${this.func}(x) = ${this.result}`
            + (this.isMainMeasure ? " en mesure principale" : "")
            + " par ordre croissant ?"
        )
    }
}

function generateQuestion() {
    if (Math.random() < 0.5) {
        return new AngleQuestion();
    } else {
        return new EquationQuestion();
    }
}

const questionContainer = document.getElementById("question-container");

let answer;
function displayNewQuestion() {
    const q = generateQuestion();
    document.getElementById("question").textContent = q.question;
    answer = q.answer;
    document.getElementById("result").style.display = "none";
    const input = document.getElementById("question-input");
    input.value = "";
    input.focus();
}

function insertSqrt() {
    const input = document.getElementById("question-input");
    input.value += "√";
    input.focus();
}

function insertPi() {
    const input = document.getElementById("question-input");
    input.value += "π";
    input.focus();
}

document.getElementById("question-input").addEventListener("input", function() {
    const resultDiv = document.getElementById("result");
    resultDiv.style.display = "none";
});

document.getElementById("show-answer").addEventListener("click", function() {
    const input = document.getElementById("question-input");
    input.value = answer;
});

document.getElementById("trig-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const input = document.getElementById("question-input");
    const resultDiv = document.getElementById("result");
    if (input.value.trim().replace(/pi/g, "π").replace(/sqrt/g, "√") === answer) {
        resultDiv.innerHTML = "Bonne réponse !";
        resultDiv.className = "result correct";
        setTimeout(displayNewQuestion, 2000); // Display a new question after 2 seconds
    } else {
        resultDiv.innerHTML = "Mauvaise réponse, veuillez réessayer.";
        resultDiv.className = "result incorrect";
    }
    resultDiv.style.display = "block";
});

displayNewQuestion(); // Display the first question when the page loads
