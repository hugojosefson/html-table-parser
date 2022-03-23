import { DomUtils } from "https://deno.land/x/html_parser@v0.1.3/src/mod.ts";
import {
  Element,
  Node,
  NodeWithChildren,
  Text,
} from "https://deno.land/x/html_parser@v0.1.3/src/Node.ts";

// deno-lint-ignore no-unused-vars
class Table extends Element {}
// deno-lint-ignore no-unused-vars
class Tbody extends Element {}
// deno-lint-ignore no-unused-vars
class Tr extends Element {}
// deno-lint-ignore no-unused-vars
class Td extends Element {}

/**
 * Casts a Node to an Element.
 * @param node a Node
 * @returns the Node, looking like an Element
 */
function asElement(node?: Node | null): Element | null | undefined {
  if (typeof node === "undefined") {
    return undefined;
  }
  if (node === null) {
    return null;
  }
  return node as unknown as Element;
}

function isTable(element: Element): element is Table {
  return element.type === "tag" && element.name === "table";
}

function isTbody(node: Node): node is Tbody {
  return node.type === "tag" && asElement(node)?.name === "tbody";
}

function isTr(node: Node): node is Tr {
  return node.type === "tag" && asElement(node)?.name === "tr";
}

function isTd(node: Node): node is Td {
  return node.type === "tag" && asElement(node)?.name === "td";
}

function isText(node: Node): node is Text {
  return node.type === "text";
}

function trsFromTable(table: Table): Tr[] {
  const children: Node[] = table?.children || [];
  const tbodies: Tbody[] = children.filter(isTbody);
  const potentialTrs: Node[] = [
    ...tbodies.flatMap((tbody) => tbody.children),
    ...children,
  ];
  return potentialTrs.filter(isTr);
}

function tdsFromTr(tr: Tr): Td[] {
  const children: Node[] = asElement(tr)?.children || [];
  return children.filter(isTd);
}

function textsFromTd(td: Td): Text[] {
  const children = td?.children || [];
  return children.filter(isText);
}

function stringFromText(text: Text): string {
  return text?.data?.trim();
}

function joinStringsWithSpace(acc: string, curr: string): string {
  return [acc, curr].join(" ").trim();
}

/**
 * Extracts strings from a table.
 * @param table a table Element from html_parser
 * @returns an array of string arrays, based on tr:s and the Text nodes in each of their td:s
 */
export function stringsFromTable(table: Table): string[][] {
  const trs: Tr[] = trsFromTable(table);

  const nonEmptyRowsOfTds: Td[][] = trs
    .map(tdsFromTr)
    .filter((tds: Td[]) => tds.length > 0);

  const rowsOfTdsWithTexts: Text[][][] = nonEmptyRowsOfTds
    .map((tds: Td[]) => tds.map(textsFromTd));

  const rowsOfStrings: string[][] = rowsOfTdsWithTexts.map((
    tdsOfTexts: Text[][],
  ) =>
    tdsOfTexts.map((texts: Text[]) =>
      texts
        .map(stringFromText)
        .reduce(joinStringsWithSpace, "")
    )
  );
  return rowsOfStrings;
}

/**
 * Extracts strings from the first table found.
 * @param document a Document from html_parser
 * @returns an array of string arrays, based on tr:s and the Text nodes in each of their td:s
 */
export function stringsFromFirstTable(document: NodeWithChildren): string[][] {
  const table: Element | null = DomUtils.findOne(isTable, document.children);
  if (table === null) {
    throw new Error("No table found in Document.");
  }
  return stringsFromTable(table);
}
