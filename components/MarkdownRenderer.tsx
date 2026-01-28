import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-sm sm:prose-base max-w-none break-words">
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <a {...props} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" />
          ),
          code: ({ node, className, children, ...props }) => { // Removed 'inline'
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n'); // Basic detection
            return isInline ? (
              <code className="bg-slate-800 rounded px-1 py-0.5 text-sm font-mono text-pink-300" {...props}>
                {children}
              </code>
            ) : (
              <div className="bg-[#1e1e1e] rounded-lg p-3 my-2 overflow-x-auto">
                 <code className={className} {...props}>
                  {children}
                </code>
              </div>
            );
          },
          ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-5" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;