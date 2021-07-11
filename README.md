# esidoc.js

Simple JS client for Esidoc's private API.
Probably just scratches the surface of what the API can do, but for now 2 of the main features are there: search documents & get info about the school.

### Example

```ts
import Esidoc from "esidoc.js";

(async () => {
	const client = await new Esidoc("your-code").init();
	const info = await client.about();
	const query = await client.search({ query: "agatha christie" });
	// Everything is typed, and the keys are more or less explicit about how they do.
	// Sometimes, the data types are a bit confusing (with values such as: "5" in string)
})();
```
