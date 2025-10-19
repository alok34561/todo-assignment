import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import { useSocket } from '../contexts/SocketContext';
import Header from './Header';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [notification, setNotification] = useState(null);

  const { socket, joinRoom } = useSocket();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (socket) {
      console.log('Socket available, setting up listeners');
      setupRealTimeListeners();
      setTimeout(() => {
        console.log('Testing socket connection...');
        socket.emit('test', { message: 'Connection test' });
      }, 1000);
    } else {
      console.log('No socket available');
    }
  }, [socket]);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showNotification('Error fetching tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeListeners = () => {
    const currentUserId = parseInt(localStorage.getItem('userId'));
    console.log('Setting up real-time listeners for user:', currentUserId);
    console.log('Socket connected:', socket.connected);
    
    socket.emit('test', { message: 'Hello from client' });
    
    socket.on('test-response', (data) => {
      console.log('Socket test successful:', data);
    });
    
    socket.on('task.created', (data) => {
      setTasks(prev => {
        if (prev.some(task => task.id === data.task.id)) {
          return prev;
        }
        return [data.task, ...prev];
      });
      if (data.task.created_by === currentUserId) {
        showNotification('Task created successfully!', 'success');
      } else {
        showNotification('New task created by another user!', 'info');
      }
    });

    socket.on('task.updated', (data) => {
      console.log('Received task.updated:', data);
      setTasks(prev => prev.map(task => 
        task.id === data.task.id ? data.task : task
      ));
      if (data.updatedBy === currentUserId) {
        showNotification('Task updated successfully!', 'success');
      } else {
        showNotification('Task updated by another user!', 'info');
      }
    });

    socket.on('task.deleted', (data) => {
      const currentUserId = parseInt(localStorage.getItem('userId'));
      // Only update UI via socket if current user didn't delete the task
      if (data.deletedBy !== currentUserId) {
        setTasks(prev => prev.filter(task => task.id !== data.task.id));
        showNotification('Task deleted by another user!', 'warning');
      }
    });
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskAPI.createTask(taskData);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
      showNotification('Error creating task', 'error');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await taskAPI.updateTask(editingTask.id, taskData);
      setShowForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      showNotification('Error updating task', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        // Immediately remove from UI for current user
        setTasks(prev => prev.filter(task => task.id !== taskId));
        await taskAPI.deleteTask(taskId);
        showNotification('Task deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting task:', error);
        // Restore task if API call failed
        fetchTasks();
        showNotification('Error deleting task', 'error');
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' :
          notification.type === 'error' ? 'bg-red-100 text-red-800' :
          notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {notification.message}
        </div>
      )}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add New Task
            </button>
          </div>

          <TaskList
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        </div>
      </main>

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Dashboard;