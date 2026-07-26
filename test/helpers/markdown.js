'use strict';

function parseSections(content) {
  const lines = content.split(/\r?\n/);
  const sections = [];
  let current = null;
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.*)$/);
    if (match) {
      current = { level: match[1].length, title: match[2].trim(), lines: [] };
      sections.push(current);
    } else if (current) {
      current.lines.push(line);
    }
  }
  return sections;
}

function findSection(sections, titleRegex) {
  return sections.findIndex((s) => titleRegex.test(s.title));
}

// Returns the body of the first heading matching titleRegex, including any
// deeper (nested) subsections, up to the next heading of equal-or-shallower level.
function sectionText(sections, titleRegex) {
  const idx = findSection(sections, titleRegex);
  if (idx === -1) return null;
  const level = sections[idx].level;
  let body = sections[idx].lines.join('\n');
  for (let i = idx + 1; i < sections.length; i++) {
    if (sections[i].level <= level) break;
    body += '\n' + sections[i].title + '\n' + sections[i].lines.join('\n');
  }
  return body;
}

module.exports = { parseSections, findSection, sectionText };
