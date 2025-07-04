import React, { useEffect, useState, forwardRef } from 'react';
import { BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/react';
import '@blocknote/react/style.css';

const RichTextEditor = forwardRef(({
  value = '',
  onChange,
  placeholder = 'Start writing...',
  className = '',
  minHeight = '600px',
  ...props
}, ref) => {
  const [editor, setEditor] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeEditor = async () => {
      try {
        // Parse existing content if it's markdown or plain text
        let initialContent = [];
        
        if (value && typeof value === 'string') {
          // Convert markdown-style content to BlockNote format
          const lines = value.split('\n');
          let currentBlock = null;
          
          for (const line of lines) {
            if (line.startsWith('# ')) {
              if (currentBlock) initialContent.push(currentBlock);
              currentBlock = {
                type: 'heading',
                props: { level: 1 },
                content: [{ type: 'text', text: line.replace('# ', '') }]
              };
            } else if (line.startsWith('## ')) {
              if (currentBlock) initialContent.push(currentBlock);
              currentBlock = {
                type: 'heading',
                props: { level: 2 },
                content: [{ type: 'text', text: line.replace('## ', '') }]
              };
            } else if (line.startsWith('### ')) {
              if (currentBlock) initialContent.push(currentBlock);
              currentBlock = {
                type: 'heading',
                props: { level: 3 },
                content: [{ type: 'text', text: line.replace('### ', '') }]
              };
            } else if (line.startsWith('- ')) {
              if (currentBlock && currentBlock.type !== 'bulletListItem') {
                initialContent.push(currentBlock);
                currentBlock = null;
              }
              initialContent.push({
                type: 'bulletListItem',
                content: [{ type: 'text', text: line.replace('- ', '') }]
              });
            } else if (line.trim() === '') {
              if (currentBlock) {
                initialContent.push(currentBlock);
                currentBlock = null;
              }
            } else {
              if (currentBlock) initialContent.push(currentBlock);
              currentBlock = {
                type: 'paragraph',
                content: [{ type: 'text', text: line }]
              };
            }
          }
          
          if (currentBlock) {
            initialContent.push(currentBlock);
          }
        }

        // Create BlockNote editor
        const newEditor = BlockNoteEditor.create({
          initialContent: initialContent.length > 0 ? initialContent : [
            {
              type: 'paragraph',
              content: []
            }
          ],
          placeholder
        });

        setEditor(newEditor);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize rich text editor:', error);
        // Fallback to basic editor
        const fallbackEditor = BlockNoteEditor.create({
          initialContent: [
            {
              type: 'paragraph',
              content: value ? [{ type: 'text', text: value }] : []
            }
          ],
          placeholder
        });
        setEditor(fallbackEditor);
        setIsInitialized(true);
      }
    };

    initializeEditor();
  }, []);

  // Handle content changes
  useEffect(() => {
    if (!editor || !isInitialized) return;

    const handleChange = async () => {
      try {
        const blocks = editor.document;
        
        // Convert BlockNote format to markdown-style text
        let markdownContent = '';
        
        for (const block of blocks) {
          if (block.type === 'heading') {
            const level = block.props.level || 1;
            const prefix = '#'.repeat(level);
            const text = block.content?.map(c => c.text || '').join('') || '';
            markdownContent += `${prefix} ${text}\n\n`;
          } else if (block.type === 'paragraph') {
            const text = block.content?.map(c => c.text || '').join('') || '';
            if (text.trim()) {
              markdownContent += `${text}\n\n`;
            }
          } else if (block.type === 'bulletListItem') {
            const text = block.content?.map(c => c.text || '').join('') || '';
            markdownContent += `- ${text}\n`;
          } else if (block.type === 'numberedListItem') {
            const text = block.content?.map(c => c.text || '').join('') || '';
            markdownContent += `1. ${text}\n`;
          }
        }

        // Clean up extra newlines
        markdownContent = markdownContent.replace(/\n\n+/g, '\n\n').trim();
        
        if (onChange) {
          onChange(markdownContent);
        }
      } catch (error) {
        console.error('Error converting content:', error);
      }
    };

    editor.onChange(handleChange);
    
    return () => {
      editor.onChange(() => {});
    };
  }, [editor, isInitialized, onChange]);

  if (!editor || !isInitialized) {
    return (
      <div 
        className={`border border-gray-200 rounded-lg p-8 bg-white ${className}`}
        style={{ minHeight }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={ref}
      className={`rich-text-editor border border-gray-200 rounded-lg overflow-hidden bg-white ${className}`}
      style={{ minHeight }}
    >
      <BlockNoteView
        editor={editor}
        theme="light"
        className="block-note-editor"
      />
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;