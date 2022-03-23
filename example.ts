import { stringsFromFirstTable } from "./mod.ts";
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
