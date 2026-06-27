import React from 'react';
import { Handle, Position } from 'reactflow';

export const BaseNode = ({
  id,
  title,
  icon,
  color = '#3b82f6',
  inputs = [],
  outputs = [],
  children,
  width = 280,
  minHeight = 80,
}) => {
  const paddingLeft = inputs.length > 0 ? '65px' : '16px';
  const paddingRight = outputs.length > 0 ? '65px' : '16px';

  return (
    <div
      className="base-node"
      style={{
        width: width,
        minHeight: minHeight,
        '--node-accent-color': color,
      }}
    >
      {/* Colored Left Accent Strip */}
      <div className="node-header-accent" style={{ backgroundColor: color }} />

      {/* Node Header */}
      <div className="node-header">
        <div className="node-header-title-container">
          {icon && <span className="node-header-icon">{icon}</span>}
          <span className="node-header-title">{title}</span>
        </div>
      </div>

      {/* Target/Input Handles and Labels */}
      {inputs.map((input, idx) => {
        const topPercent = ((idx + 1) / (inputs.length + 1)) * 100;
        return (
          <React.Fragment key={input.id}>
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-${input.id}`}
              style={{ top: `${topPercent}%` }}
            />
            <span
              className="handle-label input-label"
              style={{
                position: 'absolute',
                top: `${topPercent}%`,
                left: '12px',
                transform: 'translateY(-50%)',
              }}
            >
              {input.label}
            </span>
          </React.Fragment>
        );
      })}

      {/* Node Body */}
      <div className="node-body" style={{ paddingLeft, paddingRight }}>
        {children}
      </div>

      {/* Source/Output Handles and Labels */}
      {outputs.map((output, idx) => {
        const topPercent = ((idx + 1) / (outputs.length + 1)) * 100;
        return (
          <React.Fragment key={output.id}>
            <Handle
              type="source"
              position={Position.Right}
              id={`${id}-${output.id}`}
              style={{ top: `${topPercent}%` }}
            />
            <span
              className="handle-label output-label"
              style={{
                position: 'absolute',
                top: `${topPercent}%`,
                right: '12px',
                transform: 'translateY(-50%)',
                textAlign: 'right',
              }}
            >
              {output.label}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};
