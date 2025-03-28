+++
title = "Quiz sur les fonctions trigonométriques"
date = 2025-03-28
+++

# Quiz sur les fonctions trigonométriques

<form id="trig-form">
    <label for="question-input" id="question"></label>
    <input type="text" id="question-input" name="question-input" autocomplete="off" required>
    <br>
    <button type="button" class="sqrt-button" onclick="insertSqrt()">√</button>
    <button type="button" class="pi-button" onclick="insertPi()">π</button>
    <input type="submit" value="Valider">
    <input type="button" id="show-answer" value="Afficher la réponse">
</form>
<div id="result" class="result"></div>

Pour les questions sur les valeurs de cos ou sin, veuillez entrer la forme la plus simplifiée possible.<br>
Par exemple : √2/2

Pour les questions sur les solutions, veuillez entrer les solutions par ordre croissant séparées par "ou".<br>
Par exemple : π/6 ou π/4 ou π/3

<style>
    .result {
        margin-top: 20px;
        padding: 10px;
        display: none;
    }
    .correct {
        background-color: #d4edda;
        color: #155724;
    }
    .incorrect {
        background-color: #f8d7da;
        color: #721c24;
    }
    .sqrt-button {
        margin-top: 10px;
    }
</style>
<script>
    function gcd(a, b) {
        return b ? gcd(b, a % b) : Math.abs(a);
    }

    function simplifyPiFraction([numerator, denominator]) {
        if (numerator === 0) return "0";
        const divisor = gcd(numerator, denominator);
        const simplifiedNumerator = numerator / divisor;
        const simplifiedDenominator = denominator / divisor;
        return `${simplifiedNumerator}π/${simplifiedDenominator}`.replace(/^(-?)1π/, "$1π").replace(/\/1$/, "");
    }

    function getRandomAngle() {
        const multiple = [1, 2, 3, 4, 6][Math.floor(Math.random() * 5)];
        return [Math.floor(Math.random() * (multiple * 20 + 1)) - (multiple * 10 + 1), multiple];
    }

    function getSquareRoot(number) {
        const sqrt = Math.sqrt(number);
        if (Number.isInteger(sqrt)) {
            return sqrt;
        }
        return "√" + number;
    }

    function getRandomResult() {
        const result = Math.floor(Math.random() * 5);
        if (result === 0) return "0";
        if (result === 4) return (Math.random() < 0.5 ? "-" : "") + "1";
        return (Math.random() < 0.5 ? "-" : "") + getSquareRoot(result) + "/2";
    }

    function solveInInterval(func, result_, isMainMeasure) {
        // special case with 3 values
        if (func === "sin" && result_ === 0) {
            if (isMainMeasure) {
                // 0, π, 2π
                return [[0, 1], [1, 1], [2, 1]];
            } else {
                // -π, 0, π
                return [[-1, 1], [0, 1], [1, 1]];
            }
        }
        let result = result_;
        let minus = false;
        let x1;
        let results;
        if (func === "cos") {
            results = {
                "1": [0, 1],
                "√3/2": [1, 6],
                "√2/2": [1, 4],
                "1/2": [1, 3],
                "0": [1, 2],
            };
        } else if (func === "sin") {
            results = {
                "0": [0, 1],
                "1/2": [1, 6],
                "√2/2": [1, 4],
                "√3/2": [1, 3],
                "1": [1, 2],
            };
        } else {
            throw new Error("Unknown function: " + func);
        }
        if (result == "-0") {
            result = "0";
        }
        if (result[0] === "-") {
            result = result.substring(1);
            minus = true;
        }
        x1 = results[result];
        let x2;
        if (!minus) {
            if (func === "cos") {
                // 2π - x1
                x2 = [2 * x1[1] - x1[0], x1[1]];
            } else {
                // π - x1
                x2 = [x1[1] - x1[0], x1[1]];
            }
        } else {
            if (func === "cos") {
                // π - x1 (safe because x1 ∈ [0;π/2])
                x1[0] = x1[1] - x1[0];
                // 2π - x1
                x2 = [2 * x1[1] - x1[0], x1[1]];
            } else {
                // sin(x) = -sin(x + π) (safe because x1 ∈ [0;π/2])
                x1[0] += x1[1];
                // 2π - (x1 - π)
                x2 = [2 * x1[1] - (x1[0] - x1[1]), x1[1]];
            }
        }
        // x1 > π
        if (isMainMeasure && x1[0] > x1[1]) {
            // x1 = x1 - 2π
            x1[0] = x1[0] - 2 * x1[1];
        }
        // x2 > π
        if (isMainMeasure && x2[0] > x2[1]) {
            // x2 = x2 - 2π
            x2[0] = x2[0] - 2 * x2[1];
        }
        // if x1 and x2 are equal, return only one of them
        if (x1 + "" === x2 + "") {
            return [x1];
        }
        // otherwise, return them sorted
        return [x1, x2].sort((a, b) => a[0] - b[0]);
    }

    function getTrigFunction() {
        return Math.random() < 0.5 ? "cos" : "sin";
    }

    function getCorrectAnswer(func, angle) {
        let [numerator, denominator] = angle;

        // cos(x + 2π) = cos(x), sin(x + 2π) = sin(x)
        numerator %= 2 * denominator;

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
            if (numerator < 0) {
                numerator = -numerator;
            }
            // cos(4π/3) = cos(2π/3)
            if (denominator < numerator && numerator <= 2 * denominator) {
                numerator = 2 * denominator - numerator;
            }
            // cos(2π/3) = -cos(π/3)
            if (denominator / 2 < numerator && numerator <= denominator) {
                numerator = denominator - numerator;
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
            if (numerator < 0) {
                numerator = -numerator;
                result += "-";
            }
            // sin(4π/3) = -sin(2π/3)
            if (denominator < numerator && numerator <= 2 * denominator) {
                numerator = 2 * denominator - numerator;
                result += "-";
            }
            // sin(2π/3) = sin(π/3)
            if (denominator / 2 < numerator && numerator <= denominator) {
                numerator = denominator - numerator;
            }
        } else {
            throw new Error("Unknown function: " + func);
        }
        result += results[simplifyPiFraction([numerator, denominator])];
        if (result === "-0") {
            return "0";
        }
        return result;
    }

    function generateQuestion() {
        const func = getTrigFunction();
        if (Math.random() < 0.5) {
            const angle = getRandomAngle();
            const correctAnswer = getCorrectAnswer(func, angle);
            return { question: `Quelle est la valeur de ${func}(${simplifyPiFraction(angle)}) ?`, answer: correctAnswer };
        } else {
            const isMainMeasure = Math.random() < 0.5;
            const result = getRandomResult();
            const antecedents = solveInInterval(func, result, isMainMeasure).map(simplifyPiFraction).join(" ou ");
            return { question: `Quelles sont les solutions de ${func}(x) = ${result}${isMainMeasure ? " en mesure principale" : ""} par ordre croissant ?`, answer: antecedents };
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
</script>
