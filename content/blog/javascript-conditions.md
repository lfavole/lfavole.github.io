+++
title = "This JavaScript condition is very strange..."
date = 2025-03-28
+++

# This JavaScript condition is very strange...

I was writing [this code](https://github.com/lfavole/lfavole.github.io/blob/1a7b1f5/content/blog/trigonometrie/trigonometrie.js#L153)...
<div style="cursor: not-allowed; user-select: none">

```javascript
class Fraction {
    // snip

    toString() {
        if (this.numerator === 0)
            return "0";
        let result = "";
        if (this.constructor.SYMBOL)
            if (this.numerator === -1)
                result += "-";
        else
            result += this.numerator;
        result += this.constructor.SYMBOL;
        if (this.denominator !== 1)
            result += "/" + this.denominator;
        return result;
    }
}

class PiFraction extends Fraction {
    static SYMBOL = "π";
}
```

</div>

but I quickly saw that it was doing the wrong thing, e.g.
> `» new PiFraction(1, 4).toString()`<br>
> `← "1π/4"`

which is not a fully simplified fraction.

I ended up finding the error, which was:
```javascript
class Fraction {
    toString() {
        // snip
        if (this.constructor.SYMBOL) {
            if (this.numerator === -1) {
                result += "-";
            }
        } else {
            result += this.numerator;
        }
        // snip
    }
}
```
which was what I meant when indenting the code, but the JavaScript compiler didn't understand it
and compiled the nested conditional first.

So if you write this:
<div style="cursor: not-allowed; user-select: none">

```javascript
if (a)
    if (b)
        c();
else
    d();
```

</div>

Be careful, because it gets evaluated as:
<div style="cursor: not-allowed; user-select: none">

```javascript
if (a) {
    if (b) {
        c();
    }
else {
    d();
}}
```

</div>

and NOT as:
```javascript
if (a) {
    if (b) {
        c();
    }
} else {
    d();
}
```
as you would expect it.

The last code snippet is the only one that you should use.
