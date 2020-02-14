export let replacement = Symbol()

export let from = (element, ...changes) =>
{
	let modify = (...changes) =>
	{
		if (changes.length === 0) return element
		
		for (let change of changes)
		{
			if (typeof change === "object" || typeof change === "function")
			{
				let other
				while (other = change[replacement])
					change = other
			}
			
			switch (typeof change)
			{
				case "string":
				case "number":
				case "bigint":
					element.append(change)
					break
				
				case "object":
					if ("ownerDocument" in change)
						element.append(change)
					else if (change[Symbol.iterator])
						modify(...change)
					else
						for (let key in change)
						{
							let value = change[key]
							let setAttribute = value =>
							{
								if (value === undefined) return
								if (value === null) return
								
								if (value === true) element.setAttribute(key, "")
								else if (value === false) element.removeAttribute(key)
								else element.setAttribute(key, value)
							}
							if (typeof value === "function") value(value => setAttribute(value), modify, key)
							else setAttribute(value)
						}
					break
				
				case "function":
					modify(change(modify))
					break
			}
		}
		
		modify[replacement] = element
		
		return modify
	}
	
	return modify(changes)
}

export let given = create => new Proxy({}, {get: (o, name) => name in o || typeof name === "symbol" ? o[name] : from(create(name))})

export default given(name => document.createElement(name))
