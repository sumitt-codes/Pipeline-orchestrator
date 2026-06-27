import React, { useState } from 'react';
import { useStore } from './store';

export const SubmitButton = () => {
  const { nodes, edges } = useStore((state) => ({
    nodes: state.nodes,
    edges: state.edges,
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse pipeline');
      }

      const data = await response.json();
      setModalData(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      // Fallback modal data in case server is down
      setModalData({
        num_nodes: nodes.length,
        num_edges: edges.length,
        is_dag: false,
        error: true,
      });
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
      <button
        type="button"
        className="submit-btn"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading && <span className="spinner" />}
        Submit
      </button>

      {isModalOpen && modalData && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className={`modal-header ${modalData.is_dag ? 'valid' : 'invalid'}`}>
              {modalData.is_dag ? '✓ Pipeline Valid' : '✗ Cycle Detected'}
            </div>
            <div className="modal-body">
              <div className="modal-row">
                <span className="modal-label">Nodes:</span>
                <span className="modal-value">{modalData.num_nodes}</span>
              </div>
              <div className="modal-row">
                <span className="modal-label">Edges:</span>
                <span className="modal-value">{modalData.num_edges}</span>
              </div>
              <div className="modal-row">
                <span className="modal-label">DAG:</span>
                <span className="modal-value">{modalData.is_dag ? 'Yes' : 'No'}</span>
              </div>
              {!modalData.is_dag && modalData.cycle_path && (
                <div className="modal-cycle-section">
                  <div className="modal-cycle-label">Cycle Path:</div>
                  <div className="modal-cycle-path">
                    {modalData.cycle_path.split(' → ').map((step, index, arr) => (
                      <React.Fragment key={index}>
                        <span className="modal-cycle-node">{step}</span>
                        {index < arr.length - 1 && (
                          <span className="modal-cycle-arrow"> → </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="modal-close-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
