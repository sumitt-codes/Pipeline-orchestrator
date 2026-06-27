import { useState } from 'react';
import { BaseNode } from '../BaseNode';
import { useStore } from '../store';

export const DatabaseNode = ({ id, data }) => {
  const [tableName, setTableName] = useState(data?.tableName || 'users');
  const [queryType, setQueryType] = useState(data?.queryType || 'SELECT');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleTableChange = (e) => {
    const val = e.target.value;
    setTableName(val);
    updateNodeField(id, 'tableName', val);
  };

  const handleQueryTypeChange = (e) => {
    const val = e.target.value;
    setQueryType(val);
    updateNodeField(id, 'queryType', val);
  };

  return (
    <BaseNode
      id={id}
      title="Database"
      icon="🗄️"
      color="#0ea5e9"
      inputs={[{ id: 'query', label: 'Query' }]}
      outputs={[
        { id: 'rows', label: 'Rows' },
        { id: 'error', label: 'Error' },
      ]}
      minHeight={110}
    >
      <label>
        Query Type:
        <select value={queryType} onChange={handleQueryTypeChange}>
          <option value="SELECT">SELECT</option>
          <option value="INSERT">INSERT</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
        </select>
      </label>
      <label>
        Table Name:
        <input 
          type="text" 
          value={tableName} 
          onChange={handleTableChange} 
        />
      </label>
    </BaseNode>
  );
};
