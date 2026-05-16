
'use client';

type DescriptionBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[]; ordered: boolean };

function parseDescription(description: string): DescriptionBlock[] {
  const blocks: DescriptionBlock[] = [];
  const lines = description.replace(/\r/g, '').split('\n');
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let listOrdered: boolean | null = null;

  const flushParagraph = () => {
    const text = paragraphLines.join('\n').trim();
    if (text) {
      blocks.push({ type: 'paragraph', text });
    }
    paragraphLines = [];
  };

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: 'list', items: listItems, ordered: listOrdered ?? false });
    }
    listItems = [];
    listOrdered = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = line.match(/^#{1,6}\s*(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', text: headingMatch[1].trim() });
      continue;
    }

    const unorderedMatch = line.match(/^[-*•]\s+(.+)$/);
    const orderedMatch = line.match(/^\d+[.)]\s+(.+)$/);
    if (unorderedMatch || orderedMatch) {
      flushParagraph();
      const ordered = Boolean(orderedMatch);
      const itemText = (unorderedMatch?.[1] ?? orderedMatch?.[1] ?? '').trim();
      if (listOrdered !== null && listOrdered !== ordered) {
        flushList();
      }
      listOrdered = ordered;
      listItems.push(itemText);
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

export function PropertyDescriptionDisplay({ description }: { description: string }) {
  const blocks = parseDescription(description);

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <h3 key={index} className="text-xl font-bold text-foreground">
              {block.text}
            </h3>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <p key={index} className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {block.text}
            </p>
          );
        }

        const ListTag = block.ordered ? 'ol' : 'ul';
        return (
          <ListTag
            key={index}
            className={`space-y-2 pl-5 text-muted-foreground ${block.ordered ? 'list-decimal' : 'list-disc'}`}
          >
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ListTag>
        );
      })}
    </div>
  );
}
