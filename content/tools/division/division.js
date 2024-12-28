function division(dividend, divisor, mode = "decimal", max_decimals = 6) {
	var to_divide = "";
	var digits = dividend + "";
	var txt = "";
	var indent = 0;
	var in_decimal = false;
	var decimals = 0;
	var remainder = "";
	var result = "";
	var lines = 0;
	var digit;
	while(
		mode == "integer" && +(digits + remainder) >= divisor
		|| mode == "decimal" && decimals < max_decimals && lines < 50
	) {
		// remove the last line
		if(indent > 0) txt = txt.substring(0, txt.lastIndexOf("\n")) + "\n";
		// add an indentation level
		indent++;
		to_divide = "";
		if(in_decimal || (+remainder < divisor && digits.length == 0)) {
			if(!in_decimal) {
				in_decimal = true;
				if(result == "")
					result = "0";
				result += ",";
			}
			digits = remainder + "" + digits;
			digits += "0";
			decimals++;
		} else {
			digits = remainder + "" + digits;
		}
		// get the number to divide
		// (get the smallest number of digits that
		// is bigger or equal to the divisor)
		for(var i = 1; i <= digits.length; i++) {
			if(+digits.substring(0, i) >= divisor) {
				to_divide = digits.substring(0, i);
				digits = digits.substring(i);
				break;
			}
		}
		// not found => use all the digits
		if(to_divide == "") {
			to_divide = digits;
			digits = "";
		}
		// highlight the digits that we will divide
		txt += " ".repeat(indent) + "<b>" + to_divide + "</b>" + digits + "\n";
		// calculate the digit and add it to the result
		digit = Math.floor(to_divide / divisor);
		result += digit;
		// calculate the number in the subtraction and write it
		to_subtract = digit * divisor;
		txt += (
			" ".repeat(indent - 1)
			+ "-<u title=\"" + digit + " × " + divisor + " = " + to_subtract + "\">"
			+ " ".repeat(get_space(to_divide, to_subtract))
			+ to_subtract
			+ "</u>\n"
		);
		// calculate and write the remainder
		remainder = to_divide - to_subtract;
		txt += " ".repeat(indent + (
			to_subtract.length >= to_divide.length
			? get_space(to_subtract, remainder)
			: get_space(to_divide, remainder)
		)) + remainder;
		lines++;
	}
	return [txt, divisor, result];
}
function get_space(top, bottom) {
	var top = top + "";
	var bottom = bottom + "";
	if(bottom.length >= top.length) {
		return 0;
	}
	return top.length - bottom.length;
}
window.onload = () => division(5, 7, "decimal", 6);

window.addEventListener("DOMContentLoaded", () => {
	var max_decimals_container = document.getElementById("max_decimals_container");
	var mode = document.getElementById("mode");

	mode.addEventListener("change", () => {
		if(mode.value == "decimal")
			max_decimals_container.style.display = "block";
		else
			max_decimals_container.style.display = "none";
	});

	var form = document.querySelector('form[name="division"]');

	var table = document.getElementById("result");
	var division_container = table.querySelector(".division");
	var divisor_container = table.querySelector(".divisor");
	var result_container = table.querySelector(".result");

	function start_division() {
		dividend = form.dividend.value;
		divisor = form.divisor.value;
		mode = form.mode.value;
		max_decimals = form.max_decimals.value;

		var ret = division(dividend, divisor, mode, max_decimals);
		division_container.innerHTML = ret[0];
		divisor_container.innerText = ret[1];
		result_container.innerText = ret[2];
	}
	form.addEventListener("submit", (evt) => {
		evt.preventDefault();
		start_division();
	});
	start_division();
});
