import { useState } from 'react';
import { BaseNode } from '../BaseNode';
import { useStore } from '../store';

export const DiscordNode = ({ id, data }) => {
  const [channelId, setChannelId] = useState(data?.channelId || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleChannelChange = (e) => {
    const val = e.target.value;
    setChannelId(val);
    updateNodeField(id, 'channelId', val);
  };

  return (
    <BaseNode
      id={id}
      title="Discord"
      icon="💬"
      color="#5865F2"
      inputs={[
        { id: 'trigger', label: 'Trigger' },
        { id: 'message', label: 'Message' },
      ]}
      outputs={[
        { id: 'response', label: 'Response' },
        { id: 'status', label: 'Status' },
      ]}
      minHeight={100}
    >
      <label>
        Channel ID / Webhook:
        <input 
          type="text" 
          value={channelId} 
          placeholder="e.g. 123456789"
          onChange={handleChannelChange} 
        />
      </label>
    </BaseNode>
  );
};
