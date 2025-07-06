import { Note } from './notes';

export function exportAsMarkdown(note: Note): string {
  let content = note.content;
  
  content = content.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n');
  content = content.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
  content = content.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');
  
  content = content.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
  
  content = content.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
  content = content.replace(/<em>(.*?)<\/em>/gi, '*$1*');
  
  content = content.replace(/<ul>(.*?)<\/ul>/gi, (match, p1) => {
    return p1.replace(/<li>(.*?)<\/li>/gi, '- $1\n');
  });
  
  content = content.replace(/<ol>(.*?)<\/ol>/gi, (match, p1) => {
    let index = 1;
    return p1.replace(/<li>(.*?)<\/li>/gi, (matchStr: string) => {
      return `${index++}. ${matchStr.replace(/<li>(.*?)<\/li>/gi, '$1')}\n`;
    });
  });
  
  content = content.replace(/<a href="(.*?)">(.*?)<\/a>/gi, '[$2]($1)');
  
  content = content.replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1\n\n');
  
  content = content.replace(/<pre><code>(.*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n');
  
  content = content.replace(/<[^>]*>/g, '');
  
  const markdown = `# ${note.title}\n\n${content}`;
  
  return markdown;
}

export function exportAsHTML(note: Note): string {
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>${note.title}</title>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    h1, h2, h3 {
      font-weight: 600;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
    h1 { font-size: 2rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
    p { margin-bottom: 1rem; }
    pre {
      background-color: #f5f5f5;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 1rem;
      font-style: italic;
      color: #666;
    }
  </style>
</head>
<body>
  <h1>${note.title}</h1>
  ${note.content}
</body>
</html>`;
  
  return html;
}

export function downloadFile(content: string, fileName: string, contentType: string): void {
  if (typeof window !== 'undefined') {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }
}
