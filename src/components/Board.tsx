import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import styles from './Board.module.scss';
import { useTaskStore } from '../store/useTaskStore';
import Column from './Column';
import TaskFormModal from './TaskFormModal';
import type { Task } from '../types';

const Board = () => {
  const { tasks, columns, addColumn } = useTaskStore();
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddColumn = () => {
    const title = newColumnTitle.trim();
    if (title) {
      addColumn(title);
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddColumn();
    if (e.key === 'Escape') {
      setIsAddingColumn(false);
      setNewColumnTitle('');
    }
  };

  return (
    <>
      <div className={styles.board}>
        {columns.map((column) => {
          const columnTasks = column.taskIds
            .map((id) => tasks[id])
            .filter(Boolean);

          return (
            <Column
              key={column.id}
              column={column}
              tasks={columnTasks}
              onEditTask={(task) => setEditingTask(task)}
            />
          );
        })}

        <div style={{ minWidth: '300px' }}>
          {isAddingColumn ? (
            <div
              style={{
                background: '#f4f5f7',
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <input
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Название колонки"
                autoFocus
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                  marginBottom: '8px',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleAddColumn}
                  style={{
                    padding: '6px 12px',
                    background: '#4a90e2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Добавить
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingColumn(false);
                    setNewColumnTitle('');
                  }}
                  style={{
                    padding: '6px 12px',
                    background: '#fff',
                    color: '#333',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className={styles.addColumnButton}
              onClick={() => setIsAddingColumn(true)}
              title="Добавить колонку"
              aria-label="Добавить колонку"
            >
              <FiPlus size={16} />
              Добавить колонку
            </button>
          )}
        </div>
      </div>

      {/* Кнопка добавления задачи в шапке */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
        }}
      >
        <button
          type="button"
          onClick={() => setIsAddingTask(true)}
          title="Добавить задачу"
          aria-label="Добавить задачу"
          style={{
            padding: '12px 20px',
            background: '#4a90e2',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '15px',
            boxShadow: '0 2px 8px rgba(74, 144, 226, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <FiPlus size={18} />
          Добавить задачу
        </button>
      </div>

      {/* Модальное окно добавления задачи */}
      {isAddingTask && (
        <TaskFormModal onClose={() => setIsAddingTask(false)} />
      )}

      {/* Модальное окно редактирования задачи */}
      {editingTask && (
        <TaskFormModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </>
  );
};

export default Board;