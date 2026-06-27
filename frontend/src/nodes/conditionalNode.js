import { useState } from 'react';
import { BaseNode } from '../BaseNode';
import { useStore } from '../store';

export const ConditionNode = ({ id, data }) => {
  const [operator, setOperator] = useState(data?.operator || '==');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleOperatorChange = (e) => {
    const val = e.target.value;
    setOperator(val);
    updateNodeField(id, 'operator', val);
  };

  return (
    <BaseNode
      id={id}
      title="Condition"
      icon="🔀"
      color="#8b5cf6"
      inputs={[
        { id: 'value', label: 'Value' },
        { id: 'condition', label: 'Condition' },
      ]}
      outputs={[
        { id: 'true', label: 'True' },
        { id: 'false', label: 'False' },
      ]}
      minHeight={100}
    >
      <label>
        Operator:
        <select value={operator} onChange={handleOperatorChange}>
          <option value="==">Equals (==)</option>
          <option value="!=">Not Equals (!=)</option>
          <option value=">">Greater Than (&gt;)</option>
          <option value="<">Less Than (&lt;)</option>
          <option value="contains">Contains</option>
        </select>
      </label>
    </BaseNode>
  );
};
