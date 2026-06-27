import { useState } from 'react';
import { BaseNode } from '../BaseNode';
import { useStore } from '../store';

export const AIImageNode = ({ id, data }) => {
  const [style, setStyle] = useState(data?.style || 'Vibrant');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleStyleChange = (e) => {
    const val = e.target.value;
    setStyle(val);
    updateNodeField(id, 'style', val);
  };

  return (
    <BaseNode
      id={id}
      title="AI Image"
      icon="🎨"
      color="#ec4899"
      inputs={[
        { id: 'prompt', label: 'Prompt' },
        { id: 'style', label: 'Style' },
      ]}
      outputs={[
        { id: 'image_url', label: 'Image URL' },
        { id: 'metadata', label: 'Metadata' },
      ]}
      minHeight={100}
    >
      <label>
        Style Preset:
        <select value={style} onChange={handleStyleChange}>
          <option value="Vibrant">Vibrant</option>
          <option value="Cinematic">Cinematic</option>
          <option value="PixelArt">Pixel Art</option>
          <option value="Watercolor">Watercolor</option>
          <option value="3DRender">3D Render</option>
        </select>
      </label>
    </BaseNode>
  );
};
