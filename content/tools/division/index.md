+++
title = "Division euclidienne"
+++

# Division euclidienne

<link rel="stylesheet" href="division.css">
<script src="division.js"></script>

<form name="division">
<p>
    <label for="dividend">Dividende :</label>
    <input type="number" name="dividend" id="dividend" min="0" step="1" value="5">
</p>
<p>
    <label for="divisor">Diviseur :</label>
    <input type="number" name="divisor" id="divisor" min="1" step="1" value="7">
</p>
<p>
    <label for="mode">Mode :</label>
    <select name="mode" id="mode">
        <option value="integer">Entier</option>
        <option value="decimal" selected>Décimal</option>
    </select>
</p>
<p id="max_decimals_container" style="display: none">
    <label for="max_decimals">Décimales :</label>
    <input type="number" name="max_decimals" id="max_decimals" min="1" max="10" step="1" value="6">
</p>
<p>
    <input type="submit" value="OK">
</p>
</form>

<table id="result">
	<tr>
		<td rowspan="2">
			<pre class="division"></pre>
		</td>
		<td class="divisor"></td>
	</tr>
	<tr>
		<td class="result"></td>
	</tr>
</table>
