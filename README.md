# html_table_parser

Parses a `<table>` from an HTML document, into an array of string arrays.

## Usage

```typescript
// example.ts

import { stringsFromFirstTable } from "https://deno.land/x/html_table_parser/mod.ts";
import { parseDocument } from "https://deno.land/x/html_parser@v0.1.3/src/mod.ts";

const DOC_URL = Deno.args[0] ??
  "https://en.wikipedia.org/wiki/Table_(information)";

const response: Response = await fetch(DOC_URL);
if (!response.ok) {
  throw new Error(
    `Could not download ${DOC_URL}. Got ${response.status} ${response.statusText}.`,
  );
}

const html: string = await response.text();
const document = parseDocument(html);
const table: string[][] = stringsFromFirstTable(document);

console.log(table);
```

Running the above program:

```sh
deno run --allow-net=en.wikipedia.org https://deno.land/x/html_table_parser/example.ts
```

...would output:

```json
[
  ["Tinu", "Elejogun", "14"],
  ["Javier", "Zapata", "28"],
  ["Lily", "McGarrett", "18"],
  ["Olatunkbo", "Chijiaku", "22"],
  ["Adrienne", "Anthoula", "22"],
  ["Axelia", "Athanasios", "22"],
  ["Jon-Kabat", "Zinn", "22"],
  ["Thabang", "Mosoa", "15"],
  ["Kgaogelo", "Mosoa", "11"]
]
```
