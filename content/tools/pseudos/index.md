+++
title = "Générateur de pseudos"
+++

# Générateur de pseudos

<link rel="stylesheet" href="forms.css">
<style>
.pseudos-list {
    columns: 9em;
}
</style>
<script src="pseudos.js"></script>

<form name="pseudos">
<input type="hidden" name="show_result" value="0">
<p>
    <label for="words">Mots :</label>
    <textarea name="words" id="words" placeholder="1 mot par ligne&NewLine;Écrivez votre nom par exemple" required></textarea>
    <span class="helptext">Les synonymes de ces mots seront inclus</span>
</p>
<p>
    <label for="syllables_n">Nombre de syllabes :</label>
    <input type="number" name="syllables_n" id="syllables_n" required value="4">
</p>
<p>
    <label for=words_n>Nombre de pseudos :</label>
    <input type="number" name="words_n" id="words_n" required value="10">
    <span class="helptext">0 pour lister toutes les possibilités</span>
</p>
<p>
    <label for="allow_word">Autoriser un mot entier dans le résultat :</label>
    <input id="allow_word" name="allow_word" type="checkbox">
</p>
<p>
    <input type="submit" value="OK">
</p>
</form>

<div class="result">
    <a href="#">←</a>
    <p>Voici <span class="pseudos-number">0</span> noms générés à partir des mots <b class="words-list"></b> :
    <ul class="pseudos-list"></ul>
</div>
