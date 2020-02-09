export let replacement = Symbol()

export let from = (element, ...properties) =>
{
	let modify = (...properties) =>
	{
		if (properties.length === 0) return element
		
		for (let object of properties)
		{
			if (typeof object === "object" || typeof object === "function")
			{
				let other
				while (other = object[replacement])
					object = other
			}
			
			switch (typeof object)
			{
				case "string":
				case "number":
				case "bigint":
					element.append(object)
					break
				
				case "object":
					if ("ownerDocument" in object)
						element.append(object)
					else if (object[Symbol.iterator])
						modify(...object)
					else
						for (let key in object)
						{
							let value = object[key]
							if (value === undefined) continue
							if (value === null) continue
							
							if (value === true) element.setAttribute(key, "")
							else if (value === false) element.removeAttribute(key)
							else element.setAttribute(key, value)
						}
					break
				
				case "function":
					modify(object(modify))
					break
			}
		}
		
		modify[replacement] = element
		
		return modify
	}
	
	return modify(properties)
}

export let given = create => new Proxy({}, {get: (o, name) => name in o || typeof name === "symbol" ? o[name] : from(create(name))})

export default given(name => document.createElement(name))
