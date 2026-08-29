// BlockNote → Plate rolling transform
// Runs client-side when article.content.editor_type !== "plate"
// Plate Value = TElement[] (platejs), BlockNote Block[] is opaque JSON from backend.

type InlineStyles = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  textColor?: string;
  backgroundColor?: string;
};

type BlockNoteInline =
  | { type: "text"; text: string; styles?: InlineStyles }
  | { type: "link"; href: string; content: BlockNoteInline[] };

type BlockNoteBlock = {
  id?: string;
  type: string;
  props?: Record<string, unknown>;
  content?: BlockNoteInline[] | string;
  children?: BlockNoteBlock[];
};

// Plate leaf / element shapes (minimal for Value serialization)
type PlateLeaf = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

type PlateElement = {
  type: string;
  children: (PlateElement | PlateLeaf)[];
  // list / todo
  listStyleType?: string;
  indent?: number;
  checked?: boolean;
  listStart?: number;
  // media / code
  url?: string;
  caption?: { children: PlateLeaf[] }[];
  lang?: string | null;
  // link
  // generic
  [key: string]: unknown;
};

export type PlateValue = PlateElement[];

const DEFAULT_PARA: PlateValue = [{ type: "p", children: [{ text: "" }] }];

// ── inline helpers ─────────────────────────────────────────────────

function inlineToLeaves(inlines: BlockNoteInline[] | undefined): PlateLeaf[] {
  if (!inlines || inlines.length === 0) return [{ text: "" }];

  const out: PlateLeaf[] = [];

  for (const inline of inlines) {
    if (inline.type === "link") {
      const inner = inlineToLeaves((inline as unknown as { content: BlockNoteInline[] }).content);
      const linkLeaves = inner.map((l) => ({ ...l }));
      if (linkLeaves.length === 0) linkLeaves.push({ text: "" });
      (out as unknown as unknown[]).push({
        type: "a",
        url: (inline as { href: string }).href,
        children: linkLeaves,
      });
      continue;
    }

    if (inline.type === "text") {
      const s = inline.styles ?? {};
      const leaf: PlateLeaf = { text: inline.text };
      if (s.bold) leaf.bold = true;
      if (s.italic) leaf.italic = true;
      if (s.underline) leaf.underline = true;
      if (s.strike) leaf.strikethrough = true;
      if (s.code) leaf.code = true;
      // textColor/backgroundColor ignored for now (maps to highlight if needed)
      if (leaf.text === "" && out.length === 0) {
        out.push(leaf);
      } else if (leaf.text !== "" || Object.keys(leaf).length > 1) {
        // keep zero-width styled leaves? drop empty plain
        if (leaf.text === "" && !leaf.bold && !leaf.italic && !leaf.underline && !leaf.strikethrough && !leaf.code) continue;
        out.push(leaf);
      }
    }
  }

  if (out.length === 0) return [{ text: "" }];
  return out;
}

// Handle BlockNote content that is a plain string (some legacy blocks)
function contentToLeaves(content: BlockNoteBlock["content"]): (PlateLeaf | PlateElement)[] {
  if (typeof content === "string") {
    return [{ text: content }];
  }
  return inlineToLeaves(content as BlockNoteInline[] | undefined) as unknown as (PlateLeaf | PlateElement)[];
}

// ── block helpers ──────────────────────────────────────────────────

function blockTypeToPlateType(bnType: string, props?: Record<string, unknown>): string {
  switch (bnType) {
    case "paragraph":
      return "p";
    case "heading": {
      const level = (props?.level as number) ?? 1;
      if (level <= 1) return "h1";
      if (level === 2) return "h2";
      if (level === 3) return "h3";
      if (level === 4) return "h4";
      if (level === 5) return "h5";
      return "h6";
    }
    case "bulletListItem":
      return "p"; // rendered via listStyleType disc
    case "numberedListItem":
      return "p";
    case "checkListItem":
      return "p";
    case "blockquote":
      return "blockquote";
    case "codeBlock":
      return "code_block";
    case "image":
      return "img";
    default:
      return "p";
  }
}

function blockToPlateElement(block: BlockNoteBlock, indent: number): PlateElement[] {
  const props = block.props ?? {};
  const bnType = block.type;
  const leaves = contentToLeaves(block.content) as PlateLeaf[];

  // image
  if (bnType === "image") {
    const url = (props.url as string) ?? (props.src as string) ?? "";
    if (!url) return [];
    const captionText = (props.caption as string) ?? "";
    const element: PlateElement = {
      type: "img",
      url,
      children: [{ text: "" }],
      // plate image caption plugin handles caption separately; keep simple
      caption: captionText ? ([{ type: "caption", children: [{ text: captionText }] } as unknown as PlateElement] as unknown as { children: PlateLeaf[] }[]) : undefined,
    };
    return [element];
  }

  // code block — Plate expects children: code_line elements
  if (bnType === "codeBlock") {
    const lang = (props.language as string) ?? null;
    const raw = (leaves as unknown as PlateLeaf[]).map((l) => (l as PlateLeaf).text).join("");
    const lines = raw.split("\n");
    // If leaves were empty, keep one empty line
    const codeLines: PlateElement[] =
      lines.length === 0
        ? [{ type: "code_line", children: [{ text: "" }] }]
        : lines.map((line) => ({ type: "code_line", children: [{ text: line }] }));
    return [
      {
        type: "code_block",
        lang,
        children: codeLines,
      },
    ];
  }

  // lists — Plate list is a single p with listStyleType + indent
  if (bnType === "bulletListItem") {
    return [
      {
        type: "p",
        listStyleType: "disc",
        indent,
        children: leaves.length ? (leaves as unknown as PlateElement[]) : [{ text: "" } as unknown as PlateElement],
      },
    ];
  }
  if (bnType === "numberedListItem") {
    return [
      {
        type: "p",
        listStyleType: "decimal",
        indent,
        children: leaves.length ? (leaves as unknown as PlateElement[]) : [{ text: "" } as unknown as PlateElement],
      },
    ];
  }
  if (bnType === "checkListItem") {
    const checked = Boolean(props.checked);
    return [
      {
        type: "p",
        listStyleType: "todo",
        checked,
        indent,
        children: leaves.length ? (leaves as unknown as PlateElement[]) : [{ text: "" } as unknown as PlateElement],
      },
    ];
  }

  // blockquote — wraps a paragraph
  if (bnType === "blockquote") {
    return [
      {
        type: "blockquote",
        children: [
          {
            type: "p",
            children: leaves.length ? (leaves as unknown as PlateElement[]) : [{ text: "" } as unknown as PlateElement],
          } as unknown as PlateElement,
        ],
      },
    ];
  }

  // heading / paragraph / fallback
  const plateType = blockTypeToPlateType(bnType, props);
  return [
    {
      type: plateType,
      children: leaves.length ? (leaves as unknown as PlateElement[]) : [{ text: "" } as unknown as PlateElement],
    },
  ];
}

export function blockNoteToPlateValue(blocks: unknown): PlateValue {
  if (!Array.isArray(blocks) || blocks.length === 0) return structuredClone(DEFAULT_PARA);

  const out: PlateElement[] = [];

  function walk(bns: BlockNoteBlock[], indent: number) {
    for (const b of bns) {
      if (!b || typeof b !== "object" || !("type" in b)) continue;
      const els = blockToPlateElement(b as BlockNoteBlock, indent);
      out.push(...els);
      const children = (b as BlockNoteBlock).children;
      if (Array.isArray(children) && children.length > 0) {
        walk(children as BlockNoteBlock[], indent + 1);
      }
    }
  }

  walk(blocks as BlockNoteBlock[], 1);

  if (out.length === 0) return structuredClone(DEFAULT_PARA);
  return out;
}

export function isPlateValueEmpty(value: unknown): boolean {
  if (!Array.isArray(value) || value.length === 0) return true;
  if (value.length === 1) {
    const first = value[0] as PlateElement;
    const children = first?.children as unknown[] | undefined;
    if (!children || children.length === 0) return true;
    if (children.length === 1) {
      const c = children[0] as { text?: string; type?: string };
      if (c && typeof c.text === "string" && c.text.trim() === "" && !c.type) return true;
    }
  }
  return false;
}

export const DEFAULT_PLATE_VALUE: PlateValue = structuredClone(DEFAULT_PARA);
