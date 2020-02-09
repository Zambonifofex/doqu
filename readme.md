doqu
===

A small library that allows you to manipulate and create DOM elements with a simple API.

API
---

doqu has an extremely simple API. You can use `from` to “wrap” existing elements. The resultant function will modify the element differently depending on the arguments passed in to it.

Note: I named the function “`modify`”, but, naturally, you can name it whatever you want.

~~~JavaScript
import {from} from "doqu"

let modify = from(existing)
~~~

If the argument is an object, `modify` will set attributes on the element for each enumerable string property in the argument.

~~~JavaScript
modify({href: "https://google.com", class: "example"})
~~~

If the argument is a DOM node, it is appended to the element.

~~~JavaScript
modify(document.createElement("input"))
~~~

If the argument is a string or number, a text node is appended to the element.

~~~JavaScript
modify("Hello.")
~~~

If the argument is iterable (e.g. an array), `modify` will behave as if every element produced by its iterator was passed in to it instead.

~~~JavaScript
modify([{class: "example"}, "Hello, ", document.createElement("input"), "!"])
~~~

If the argument is a function, `modify` will call pass itself as the argument and reprocess the result.

~~~JavaScript
modify(() => "Hello!")
~~~

Unrecognized arguments are ignored (symbols, `undefined`, etc.)

~~~JavaScript
// Noop:
modify(undefined)
modify(Symbol())
modify(true)
~~~

You can pass multiple arguments to `modify`, and it’ll process them in order.

~~~JavaScript
modify({class: "example"}, "Hello, ", "World", "!")
~~~

`modify` will return itself (unless no arguments are passed to it). This allows for it to be called as curried function.

~~~JavaScript
modify({class: "example"})("Hello, ", "World")("!")
~~~

`modify` will return the element it is modifying if it is called without any arguments.

~~~JavaScript
let element = modify()
document.body.append(element)
~~~

Note: If you call `from` with more than one argument, the arguments after the first will be passed to `modify`.

~~~JavaScript
import {from} from "doqu"

from(existing, {class: "example"}, "Hello.")

// Same as:
// let modify = from(existing)
// modify({class: "example"}, "Hello.")
~~~

The default export of the module is a proxy. Every property in it, on getting, creates an element with its name and passes it to `from`.

Note: I import it as “`l`” here, but you can give it other name if you would prefer.

~~~JavaScript
import l from "doqu"

let modify = l.div
// Same as:
// let modify = from(document.createElement("div"))
~~~

`given` can be used to create elements like the default export, but you can pass in a function that determined how the element is going to be created.

This is useful when using JSDOM, or to create elements in a different namespace (e.g. SVG).

~~~JavaScript
import {given} from "doqu"

let l = given(name => document.createElementNS("http://www.w3.org/2000/svg", name))

let path = l.path({d: "M 0 0 2 0 2 2 0 2"})()
~~~

Examples
---

Creating an HTML document (for e.g. SSR):

~~~JavaScript
import l from "doqu"

let doc =
	l.html({lang: "en"})
	(
		l.head
		(
			l.meta({charset: "utf-8"}),
			l.title("doqu example"),
		),
		l.body
		(
			l.h1("doqu library"),
			l.p("doqu is a simple library for manipulating DOM elements in JS."),
			l.p(l.small("It is less than 2kB uncompressed!")),
		),
	)()

console.log("<!doctype html>\n" + doc.outerHTML)
~~~

Templating (on server):

~~~JavaScript
// "header.mjs"

import l from "doqu"

export default user =>
	l.header
	(
		l.nav(l.a({href: "/home"}, "Home"), " ", l.a({href: "/about"}, "About"), " ", l.a({href: "/contact"}, "Contact")),
		l.p
		(
			"Hello, ",
			user ? l.a({href: user.url}, user.name) : "Guest",
			"!",
			user ? null : [" ", l.a({href: "/login"}, "Login"), " ", l.a({href: "/join"}, "Join")],
		),
	)
~~~

~~~JavaScript
// "main.mjs"

import l from "doqu"
import header from "./header.mjs"
import content from "./content.mjs" // Somewhere else.

export default model =>
	l.html({lang: "en"})
	(
		l.head
		(
			l.meta({charset: "utf-8"}),
			l.title(`${model.title} \u2014 My Website`),
			l.link({rel: "stylesheet", href: "/style.css"}),
		),
		l.body
		(
			header(model.user),
			content(model),
			l.footer("Made in 2020."),
		),
	)
~~~

License — Zero-clause BSD (0BSD)
---

Copyright (C) 2020 by Pedro M. Zamboni "Zambonifofex"

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
