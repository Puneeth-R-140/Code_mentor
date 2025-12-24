import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, onChange, onMount }) => {
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        // Define a custom dark theme that matches our app
        monaco.editor.defineTheme('mentor-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#0f172a', // matches --bg-primary
                'editor.lineHighlightBackground': '#1e293b',
                'editorLineNumber.foreground': '#64748b',
            }
        });

        monaco.editor.setTheme('mentor-dark');

        if (onMount) onMount(editor, monaco);
    };

    const handleEditorChange = (value) => {
        if (onChange) onChange(value);
    };

    return (
        <div className="code-editor-wrapper" style={{ height: '100%', width: '100%' }}>
            <Editor
                height="100%"
                defaultLanguage="cpp"
                defaultValue={code || "// Write your C++ code here\n\n#include <iostream>\nusing namespace std;\n\nint calculateSum(int a, int b) {\n    return a + b;\n}\n"}
                theme="mentor-dark"
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                }}
            />
        </div>
    );
};

export default CodeEditor;
