// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    return (
        <div className="draggable-toolbar">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                <DraggableNode type='condition' label='Condition' />
                <DraggableNode type='database' label='Database' />
                <DraggableNode type='discord' label='Discord' />
                <DraggableNode type='automation' label='Automation' />
                <DraggableNode type='aiImage' label='AI Image' />
            </div>
        </div>
    );
};
