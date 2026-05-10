/**
 * Minimal markdown -> docx renderer for USCIS overlay templates.
 *
 * Templates use a known, well-formed subset of Markdown:
 *   - # H1, ## H2, ### H3 headings
 *   - Paragraphs (blank-line separated)
 *   - Bullet lists with `- ` prefix
 *   - Numbered lists with `1. ` prefix
 *   - Pipe tables (with `| --- |` separator row)
 *   - Inline **bold** and _italic_
 *
 * We do NOT support: code blocks, blockquotes, links, images, footnotes,
 * nested lists. The templates do not use these. If a template needs them,
 * extend this renderer rather than working around it.
 *
 * Output: a flat array of (Paragraph | Table) ready to push into a docx
 * Document section.
 */

import {
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
} from 'docx';

type Block = Paragraph | Table;

// ============================================================================
// Inline parsing (**bold** and _italic_)
// ============================================================================

interface InlineSegment {
  text: string;
  bold?: boolean;
  italics?: boolean;
}

function parseInline(text: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  // Pattern matches **bold** or _italic_ groups.
  // Order matters: try bold first, then italic.
  const pattern = /(\*\*([^*]+)\*\*|_([^_]+)_)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index) });
    }
    if (match[2] !== undefined) {
      segments.push({ text: match[2], bold: true });
    } else if (match[3] !== undefined) {
      segments.push({ text: match[3], italics: true });
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ text }];
}

function inlineToTextRuns(text: string, baseSize = 22): TextRun[] {
  return parseInline(text).map(
    (seg) =>
      new TextRun({
        text: seg.text,
        bold: seg.bold,
        italics: seg.italics,
        size: baseSize,
      }),
  );
}

// ============================================================================
// Block parsing
// ============================================================================

interface RawBlock {
  type: 'heading' | 'paragraph' | 'bullet' | 'numbered' | 'table' | 'blank';
  level?: number; // for headings
  lines: string[];
}

function tokenizeBlocks(markdown: string): RawBlock[] {
  const lines = markdown.split('\n');
  const blocks: RawBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Blank line
    if (trimmed === '') {
      i++;
      continue;
    }

    // Heading
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        lines: [headingMatch[2]],
      });
      i++;
      continue;
    }

    // Bullet list (collect contiguous bullet lines)
    if (trimmed.match(/^[-*]\s+/)) {
      const bulletLines: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^[-*]\s+/)) {
        bulletLines.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'bullet', lines: bulletLines });
      continue;
    }

    // Numbered list (collect contiguous numbered lines)
    if (trimmed.match(/^\d+\.\s+/)) {
      const numberedLines: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s+/)) {
        numberedLines.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push({ type: 'numbered', lines: numberedLines });
      continue;
    }

    // Table (collect lines starting with | and including a | --- | separator)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2 && tableLines[1].includes('---')) {
        blocks.push({ type: 'table', lines: tableLines });
      } else {
        // Not a real table, treat as paragraph
        blocks.push({ type: 'paragraph', lines: tableLines });
      }
      continue;
    }

    // Paragraph (collect lines until blank or special block)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().match(/^#{1,6}\s+/) &&
      !lines[i].trim().match(/^[-*]\s+/) &&
      !lines[i].trim().match(/^\d+\.\s+/) &&
      !(lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|'))
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', lines: [paraLines.join(' ')] });
    }
  }

  return blocks;
}

// ============================================================================
// Block -> docx converters
// ============================================================================

function headingToDocx(text: string, level: number, isFirstHeading: boolean): Paragraph {
  const docxLevel = [
    HeadingLevel.HEADING_1,
    HeadingLevel.HEADING_2,
    HeadingLevel.HEADING_3,
    HeadingLevel.HEADING_4,
    HeadingLevel.HEADING_5,
    HeadingLevel.HEADING_6,
  ][Math.min(level - 1, 5)];

  return new Paragraph({
    children: inlineToTextRuns(text, level === 1 ? 32 : level === 2 ? 26 : 22),
    heading: docxLevel,
    spacing: { before: level === 1 ? 480 : 360, after: 180 },
    pageBreakBefore: level === 1 && isFirstHeading,
  });
}

function paragraphToDocx(text: string): Paragraph {
  return new Paragraph({
    children: inlineToTextRuns(text, 22),
    spacing: { after: 160, line: 320 },
  });
}

function bulletToDocx(text: string): Paragraph {
  return new Paragraph({
    children: inlineToTextRuns(text, 22),
    bullet: { level: 0 },
    spacing: { after: 80, line: 300 },
  });
}

function numberedToDocx(text: string, idx: number): Paragraph {
  // docx package's numbering needs a configured numbering reference. To avoid
  // mucking with global numbering config, we manually prefix the number.
  return new Paragraph({
    children: [new TextRun({ text: `${idx + 1}. `, bold: true, size: 22 }), ...inlineToTextRuns(text, 22)],
    spacing: { after: 80, line: 300 },
    indent: { left: 360 },
  });
}

function tableToDocx(lines: string[]): Table {
  // Parse pipe-table. Lines: header, separator, body...
  const cells = (line: string): string[] => {
    const stripped = line.trim().slice(1, -1); // remove leading and trailing |
    return stripped.split('|').map((c) => c.trim());
  };

  const headerCells = cells(lines[0]);
  // lines[1] is separator
  const bodyLines = lines.slice(2);

  const colCount = headerCells.length;

  const headerRow = new TableRow({
    tableHeader: true,
    children: headerCells.map(
      (c) =>
        new TableCell({
          children: [
            new Paragraph({
              children: inlineToTextRuns(c, 20).map(
                (r) =>
                  new TextRun({
                    ...((r as unknown) as { text: string }),
                    text: ((r as unknown) as { text: string }).text,
                    bold: true,
                    size: 20,
                  }),
              ),
            }),
          ],
          width: { size: Math.floor(100 / colCount), type: WidthType.PERCENTAGE },
        }),
    ),
  });

  const bodyRows = bodyLines.map(
    (line) =>
      new TableRow({
        children: cells(line).map(
          (c) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: inlineToTextRuns(c, 20),
                }),
              ],
              width: { size: Math.floor(100 / colCount), type: WidthType.PERCENTAGE },
            }),
        ),
      }),
  );

  return new Table({
    rows: [headerRow, ...bodyRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Render a markdown string into a flat array of docx blocks (Paragraph | Table)
 * suitable for embedding into a Document section.
 *
 * @param markdown The filled-template markdown string.
 * @param opts.startWithPageBreak If true, the first H1 in the output forces a
 *   new page. Default true (each overlay section starts on its own page).
 */
export function renderMarkdownToDocx(
  markdown: string,
  opts: { startWithPageBreak?: boolean } = {},
): Block[] {
  const blocks = tokenizeBlocks(markdown);
  const out: Block[] = [];
  let firstHeadingSeen = false;

  for (const block of blocks) {
    switch (block.type) {
      case 'heading': {
        const isFirst = !firstHeadingSeen;
        firstHeadingSeen = true;
        out.push(
          headingToDocx(
            block.lines[0],
            block.level || 1,
            isFirst && (opts.startWithPageBreak ?? true),
          ),
        );
        break;
      }
      case 'paragraph':
        out.push(paragraphToDocx(block.lines[0]));
        break;
      case 'bullet':
        block.lines.forEach((line) => out.push(bulletToDocx(line)));
        break;
      case 'numbered':
        block.lines.forEach((line, idx) => out.push(numberedToDocx(line, idx)));
        break;
      case 'table':
        out.push(tableToDocx(block.lines));
        break;
      case 'blank':
        // skip
        break;
    }
  }

  return out;
}
