+++
title = "I won \"The Password Game\" on neal.fun"
date = 2024-11-18
+++

# I won "The Password Game" on neal.fun

On November 18, 2024, I won "The Password Game" on [neal.fun](https://neal.fun/password). In this game, you have to choose a password with stricter and stricter requirements, like having the name of a country, the best chess move, the Wordle answer of the day, a YouTube video with a certain duration, and so on. I was able to complete all the levels and win the game.

<div style="text-align: center">
    <img src="passwordgame.jpg" alt="The Password Game" style="max-width: 300px">
</div>

## Useful scripts

Get a CAPTCHA with only letters:
```javascript
var i = setInterval(() => {var m = $(".captcha-img").src.match(/\/([a-z]+)\.png/); if(m) clearInterval(i), console.log(m[1]); else $(".captcha-refresh").click()}, 50);
```

Get the map solution:
```javascript
$("iframe.geo").src
```
and search the URL in the source code.

Get the chess solution:
```javascript
chess = [{sol:...}]  // Get this in the source code
chess[$(".chess-img").src.match(/\/puzzle(\d+)\.svg/)[1]].sol
```

Get a color that only has letters in it:
```javascript
var i = setInterval(() => {var m = $(".rand-color").style.backgroundColor.match(/rgb\((\d+), (\d+), (\d+)\)/), r = (+m[1]).toString(16).padStart(2, 0), g = (+m[2]).toString(16).padStart(2, 0), b = (+m[3]).toString(16).padStart(2, 0); if(!r.match(/\d/) && !g.match(/\d/) && !b.match(/\d/)) clearInterval(i), console.log(r + g + b); else $(".rand-color .refresh").click()}, 50);
```

## UPDATE: Script for [Stimulation Clicker](https://neal.fun/stimulation-clicker/)

To change your stimulation:
```javascript
$nuxt.$root.$children[1].$children[0].$children[0]._data.stimulation = 1e30;
```
