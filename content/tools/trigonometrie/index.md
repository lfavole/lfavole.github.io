+++
title = "Quiz sur les fonctions trigonométriques"
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
<script src="trigonometrie.js"></script>
