import { useState } from 'react';
import { BaseNode } from '../BaseNode';
import { useStore } from '../store';

export const AutomationNode = ({ id, data }) => {
  const [schedule, setSchedule] = useState(data?.schedule || '0 * * * *');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleScheduleChange = (e) => {
    const val = e.target.value;
    setSchedule(val);
    updateNodeField(id, 'schedule', val);
  };

  return (
    <BaseNode
      id={id}
      title="Automation"
      icon="⚡"
      color="#f59e0b"
      inputs={[
        { id: 'schedule', label: 'Schedule' },
        { id: 'event', label: 'Event' },
      ]}
      outputs={[
        { id: 'fired', label: 'Fired' },
        { id: 'skipped', label: 'Skipped' },
      ]}
      minHeight={100}
    >
      <label>
        Cron Expression:
        <input 
          type="text" 
          value={schedule} 
          placeholder="e.g. */5 * * * *"
          onChange={handleScheduleChange} 
        />
      </label>
    </BaseNode>
  );
};
