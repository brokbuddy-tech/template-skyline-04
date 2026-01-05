
'use client';

// A simple component to render markdown-like text content.
export function PropertyDescriptionDisplay({ description }: { description: string }) {
  const sections = description.split('###').filter(s => s.trim() !== '');

  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        const [title, ...contentParts] = section.split('\n');
        const content = contentParts.join('\n').trim();
        
        return (
          <div key={index}>
            <h3 className="text-xl font-bold text-foreground mb-2">{title.trim()}</h3>
            <div className="space-y-3 text-muted-foreground">
              {content.split('\n').map((paragraph, pIndex) => {
                if (paragraph.startsWith('- ')) {
                  return (
                    <ul key={pIndex} className="list-disc pl-5 space-y-1">
                      {content.split('\n').filter(item => item.startsWith('- ')).map((item, i) => (
                        <li key={i}>{item.substring(2)}</li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.trim() === '') return null;
                // Avoid rendering list items as paragraphs
                if (pIndex > 0 && content.split('\n')[pIndex - 1].startsWith('- ')) return null;
                if (pIndex < content.split('\n').length - 1 && content.split('\n')[pIndex + 1].startsWith('- ')) return null;

                return <p key={pIndex}>{paragraph}</p>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
