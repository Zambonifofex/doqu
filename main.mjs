export let from = (element, ...properties) =>
{
	let modify = (...properties) =>
	{
		if (properties.length === 0) return element
		
		for (let object of properties)
		{
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
							if (key.startsWith(".")) element[key.slice(1)] = object[key]
							else element.setAttribute(key, object[key])
					break
				
				case "function":
					modify(object.call(element))
					break
			}
		}
		
		return modify
	}
	
	modify(...properties)
	return modify
}

export let given = create => new Proxy({}, {get: (o, name) => name in o || typeof name === "symbol" ? o[name] : from(create(name))})

export default given(name => document.createElement(name))
