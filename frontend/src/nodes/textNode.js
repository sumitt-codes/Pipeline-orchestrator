import { useState, useEffect } from 'react';
import { BaseNode } from '../BaseNode';
import { useStore } from '../store';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [dimensions, setDimensions] = useState({ width: 280, height: 80 });
  const [variables, setVariables] = useState([]);
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Auto-resize dimensions based on text length and newlines
  useEffect(() => {
    const w = Math.max(280, currText.length * 8 + 48);
    const h = Math.max(80, (currText.match(/\n/g)?.length || 0) * 20 + 80);
    setDimensions({ width: w, height: h });
  }, [currText]);

  // Extract variables for handles dynamically
  useEffect(() => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const matches = new Set();
    let match;
    while ((match = regex.exec(currText)) !== null) {
      matches.add(match[1]);
    }
    setVariables(Array.from(matches));
  }, [currText]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setCurrText(val);
    updateNodeField(id, 'text', val);
  };

  const inputs = variables.map((varName) => ({
    id: varName,
    label: varName,
  }));

  return (
    <BaseNode
      id={id}
      title="Text"
      icon="📝"
      color="#3b82f6"
      inputs={inputs}
      outputs={[{ id: 'output', label: 'Output' }]}
      width={dimensions.width}
      minHeight={dimensions.height}
    >
      <label style={{ height: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        Text:
        <textarea
          value={currText}
          onChange={handleTextChange}
          style={{
            flexGrow: 1,
            resize: 'none',
            minHeight: '40px',
            fontFamily: 'inherit',
          }}
        />
      </label>
    </BaseNode>
  );
};
