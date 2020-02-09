export default (...values) => modify =>
{
	let el = modify()
	for (let value of values.flat(Infinity))
	for (let key in value)
		el.addEventListener(key, value[key])
}
