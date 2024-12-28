// https://web.archive.org/web/20240120111615/https://www.epopia.com/blog/pedago/francais-cp/jeux-exercices-syllabes/decoupage-syllabique/
function split_syllables(word) {
    if(word.match(/\W/)) {
        var parts = word.split(/(\w+)/);
        var ret = [""];
        parts.forEach((element, index) => {
            if(index % 2 == 0)
                ret[ret.length - 1] += element;
            else
                split_syllables(element).forEach((e) => ret.push(e));
        });
        if(ret[0] == "") ret.shift();
        return ret;
    }
    if(word.length <= 2) return [word];

    function re(expr) {
        return new RegExp(expr.replace(/C/g, "[bcçdfghjklmnpqrstvwxz]").replace(/V/g, "[aáàâäeéèêëiíìîïoóòôöuúùuüyýÿ]"), "gi");
    }

    return (
        word
        .replace(/(\W)/, "*$1*")
        .replace(/gn/gi, "g*n")
        .replace(/([cpt])h/gi, "$1*h")
        .replace(re("(C)\\1"), "$1-$1")
        .replace(re("(C)([rl])"), "-$1$2")
        .replace(re("(C)\\1(C)"), "$1-$1$2")
        .replace(re("(C)(C)(C)"), "*$1*$2-$3*")
        .replace(re("(C)([rl])"), "$1*$2")
        .replace(re("(C)(C)"), "$1-$2")
        .replace(re("(V)(C)"), "$1-$2")
        .replace(/\*/g, "")

        .replace(re("((?:V|C)+)-(C)(?=-)"), "$1$2")
        .replace(re("((?:V|C)+)-(C)$"), "$1$2")
        .replace(re("(?<=-)(C)-((?:V|C)+)"), "$1$2")
        .replace(re("^(C)-((?:V|C)+)"), "$1$2")

        .replace(re("((?:V|C)+)-(C+)(?=-)"), "$1$2")
        .replace(re("((?:V|C)+)-(C+)$"), "$1$2")

        .replace(/^-+|-+$/g, "")
        .replace(/--+/g, "-")
    ).split("-");
}

function unique(array) {
    var ret = [];
    array.forEach((item) => {
        if(!ret.includes(item)) ret.push(item);
    });
    return ret;
}

function factorial(number) {
    if(number <= 0) return 1;
    var ret = 1;
    for(var i = 1; i <= number; i++)
        ret *= i;
    return ret;
}

function permutations(list, length) {
    if(length <= 0) return [[]];
    if(list.length <= 1) return [list];

    var permutationsArray = [];

    for (var i = 0; i < list.length; i++){
        var item = list[i];

        var remainingItems = list.slice(0, i).concat(list.slice(i + 1, list.length));

        for(var permutation of permutations(remainingItems, length - 1))
            permutationsArray.push([item].concat(permutation))
    }
    return permutationsArray;
}

function generate_pseudos(words, syllables_n = 3, words_n = 1, allow_word = false) {
    var parts = [];  // all the syllables

    var words = unique(words.map((word) => word.toLowerCase()));

    words.forEach((word) => {
        var syllables = split_syllables(word);
        syllables.forEach((e) => parts.push(e));
    });

    if(syllables_n > parts.length)
        throw new Error("Not enough syllables (only " + parts.length + ")!");

    var ret = [];

    var total_max = factorial(parts.length) / factorial(parts.length - syllables_n);  // number of permutations
    if(words_n > total_max)
        throw new Error("Not enough combinations (maximum = " + total_max + ")!");
    var total = words_n == 0 ? total_max : words_n;  // 0 = all the possible arrangements

    var get_name, permutation_n = 0;
    if(total >= total_max * 0.1) {
        // use permutations if we request more than 10% of the list (faster)
        var permutations_list = permutations(parts, syllables_n);
        get_name = () => {
            console.log("Getting name 1");
            if(permutation_n >= permutations_list.length) {
                console.error("Not enough combinations without an entire word in them (maximum = " + (total_max - total) + ")!");
                return false;
            }
            return permutations_list[permutation_n++].join("");
        }
    } else {
        // otherwise, use Math.random
        get_name = () => {
            console.log("Getting name 2");
            var parts_copy = [].slice.call(parts);
            var final_name = "";
            for(var pos, i = 0; i < syllables_n; i++) {
                pos = Math.floor(Math.random() * parts_copy.length);
                final_name += parts_copy.splice(pos, 1)[0];
            }
            return final_name;
        }
    }

    var final_name, stop;
    while(total > 0) {
        final_name = get_name();
        if(final_name === false) break;
        if(!allow_word) {
            stop = false;
            words.forEach((word) => {
                if(final_name.includes(word)) stop = true;
            });
            if(stop) continue;
        }
        final_name = final_name.trim().replace(/\b(\w)/, (letter) => letter.toUpperCase());  // add caps, remove spaces
        if(ret.includes(final_name)) continue;
        ret.push(final_name);
        total -= 1;
    }

    return ret;
}

window.addEventListener("DOMContentLoaded", () => {
    var form = document.querySelector('form[name="pseudos"]');
    var result = document.querySelector(".result");
    result.style.display = "none";

    var pseudos_number = document.querySelector(".pseudos-number");
    var words_list = document.querySelector(".words-list");
    var pseudos_list = document.querySelector(".pseudos-list");

    result.querySelector("a").addEventListener("click", (evt) => {
        evt.preventDefault();
        hide_result();
    });

    form.addEventListener("submit", (evt) => {
        evt.preventDefault();
        form.show_result.value = 1;
        update_hash();
    });

    function show_result() {
        form.style.display = "none";
        result.style.display = "block";

        var words = form.words.value.split("\n");
        var syllables_n = form.syllables_n.value;
        var words_n = form.words_n.value;
        var allow_word = form.allow_word.checked;
        var pseudos = generate_pseudos(words, +syllables_n, +words_n, !!allow_word);

        pseudos_number.innerText = pseudos.length;
        words_list.innerText = words.join(", ");
        [].forEach.call(pseudos_list.children, (child) => pseudos_list.removeChild(child));
        pseudos.forEach((pseudo) => {
            var pseudo_el = document.createElement("li");
            pseudo_el.innerText = pseudo;
            pseudos_list.appendChild(pseudo_el);
        });
    }

    function hide_result() {
        form.style.display = "block";
        result.style.display = "none";
    }

    var form_data_changing = false;
    function update_hash() {
        if(form_data_changing) return;

        form_data_changing = true;
        history.pushState(null, "", "#" + new URLSearchParams(new FormData(form)));

        if(+form.show_result.value)
            show_result();
        else
            hide_result();

        form_data_changing = false;
    }

    form.addEventListener("change", update_hash);

    function load_data_from_hash() {
        if(form_data_changing) return;
        console.log("Loading data from hash");
        var data = new URLSearchParams(location.hash.substring(1));
        data.forEach((value, key) => {
            try {
                form[key].value = value;
            } catch(err) {}
        });
        if(+form.show_result.value)
            show_result();
        else
            hide_result();
    }

    form.addEventListener("hashchange", load_data_from_hash);
    load_data_from_hash();
});
