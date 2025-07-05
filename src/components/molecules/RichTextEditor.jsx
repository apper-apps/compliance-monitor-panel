import '@blocknote/react/style.css'
import React, { forwardRef, useEffect, useState } from "react";
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";

const RichTextEditor = forwardRef(({ 
  initialContent = '', 
  onChange = () => {}, 
  placeholder = 'Start typing...',
  className = '',
  readOnly = false,
  minHeight = '300px'
}, ref) => {
  const [editor, setEditor] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initEditor = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const newEditor = BlockNoteEditor.create({
          initialContent: initialContent || [
            {
              type: 'paragraph',
              content: ''
            }
          ],
          onEditorContentChange: (editor) => {
            try {
              const content = editor.topLevelBlocks
              onChange(content)
            } catch (err) {
              console.error('Error in content change handler:', err)
            }
          }
        })
        
        setEditor(newEditor)
        setIsInitialized(true)
        setError(null)
      } catch (err) {
        console.error('Failed to initialize BlockNote editor:', err)
        setError('Failed to load editor. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }

    initEditor()

    return () => {
      if (editor) {
        try {
          // Cleanup if needed
          setEditor(null)
          setIsInitialized(false)
        } catch (err) {
          console.error('Error during editor cleanup:', err)
        }
      }
    }
  }, [])

  // Handle initial content changes
  useEffect(() => {
    if (editor && initialContent && typeof initialContent === 'string') {
      try {
        editor.replaceBlocks(editor.topLevelBlocks, [
          {
            type: 'paragraph',
            content: initialContent
          }
        ])
      } catch (err) {
        console.error('Error setting initial content:', err)
      }
    }
  }, [editor, initialContent])

  // Loading state
  if (loading) {
    return (
      <div 
        className={`rich-text-editor border border-gray-300 rounded-lg bg-white ${className}`}
        style={{ minHeight }}
      >
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            <span>Loading editor...</span>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div 
        className={`rich-text-editor border border-red-300 rounded-lg bg-red-50 ${className}`}
        style={{ minHeight }}
      >
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-red-600 font-medium mb-2">Editor Error</div>
            <div className="text-red-500 text-sm">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Editor not initialized
  if (!isInitialized || !editor) {
    return (
      <div 
        className={`rich-text-editor border border-gray-300 rounded-lg bg-gray-50 ${className}`}
        style={{ minHeight }}
      >
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">Initializing editor...</div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={ref}
      className={`rich-text-editor border border-gray-300 rounded-lg bg-white block-note-editor ${className}`}
      style={{ minHeight }}
    >
      <BlockNoteView
        editor={editor}
        className="w-full"
        theme="light"
        data-theming-css-variables-demo
      />
    </div>
  )
})

RichTextEditor.displayName = 'RichTextEditor'

export default RichTextEditor