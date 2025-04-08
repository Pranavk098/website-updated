import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Select, SelectItem } from './components/ui/select';
import { Checkbox } from './components/ui/checkbox';
import { Calendar } from './components/ui/calendar';
import { motion, AnimatePresence } from 'framer-motion';
import './style.css'

export default function App() {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });
  const [tasks, setTasks] = useState([]);
  const [sortByDueDate, setSortByDueDate] = useState(null);
  const [sortByPriority, setSortByPriority] = useState(null);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [completionFeedback, setCompletionFeedback] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Get today's date at midnight for consistent comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const addTask = () => {
    if (!newTask.title.trim()) {
      alert('Title is required');
      return;
    }

    // Additional validation for due date
    if (newTask.dueDate) {
      const selectedDate = new Date(newTask.dueDate);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        alert('Due date cannot be in the past');
        return;
      }
    }

    const task = { 
      ...newTask, 
      id: Date.now(), 
      completed: false 
    };
    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    setMessage('✅ Task successfully added!');
    setTimeout(() => setMessage(''), 2000);
  };

  const toggleCompletion = (id) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    
    // Add visual feedback for task completion
    const completedTask = updatedTasks.find(task => task.id === id);
    if (completedTask.completed) {
      setFeedbackMessage(`"${completedTask.title}" marked as completed!`);
      setShowFeedbackModal(true);
      setTimeout(() => setShowFeedbackModal(false), 2000);
    }
  };
  
  const deleteTask = (id) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(tasks.filter(task => task.id !== id));
    setFeedbackMessage(`"${taskToDelete.title}" has been deleted!`);
    setShowFeedbackModal(true);
    setTimeout(() => setShowFeedbackModal(false), 2000);
  };

  const editTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    setNewTask(taskToEdit);
    deleteTask(id);
  };

  const toggleSort = () => {
    setSortByDueDate(sortByDueDate === null ? true : !sortByDueDate);
    setSortByPriority(null); // Reset priority sorting when sorting by date
  };
  
  const toggleSortByPriority = () => {
    setSortByPriority(sortByPriority === null ? true : !sortByPriority);
    setSortByDueDate(null); // Reset date sorting when sorting by priority
  };

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  // Custom date handler that prevents selecting past dates
  const handleDateChange = (date) => {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate >= today) {
      setNewTask({ ...newTask, dueDate: date });
    } else {
      alert('Cannot select past dates');
    }
  };

  let filteredTasks = tasks.filter(task => 
    !task.completed && (filter === 'all' ? true : task.priority === filter)
  );
  
  let sortedTasks = [...filteredTasks];
  
  if (sortByDueDate !== null) {
    sortedTasks.sort((a, b) => {
      if (!a.dueDate) return sortByDueDate ? 1 : -1;
      if (!b.dueDate) return sortByDueDate ? -1 : 1;
      return sortByDueDate ? new Date(a.dueDate) - new Date(b.dueDate) : new Date(b.dueDate) - new Date(a.dueDate);
    });
  }
  
  if (sortByPriority !== null) {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    sortedTasks.sort((a, b) => {
      return sortByPriority ? priorityOrder[a.priority] - priorityOrder[b.priority] : priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Group tasks by day for the weekly schedule
  const groupTasksByDay = () => {
    const grouped = {};
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Initialize all days with empty arrays
    daysOfWeek.forEach(day => {
      grouped[day] = [];
    });
    
    // Filter tasks with due dates and group them
    tasks.filter(task => task.dueDate).forEach(task => {
      const date = new Date(task.dueDate);
      const dayName = daysOfWeek[date.getDay()];
      if (!grouped[dayName]) {
        grouped[dayName] = [];
      }
      grouped[dayName].push(task);
    });
    
    return grouped;
  };

  const tasksByDay = groupTasksByDay();

  // Function to get priority-specific badge class
  const getPriorityBadgeClass = (priority) => {
    switch(priority) {
      case 'high': return 'priority-badge priority-high';
      case 'medium': return 'priority-badge priority-medium';
      case 'low': return 'priority-badge priority-low';
      default: return 'priority-badge';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Task Manager</h1>
      </div>

      {message && <div className="bg-green-100 text-green-800 p-2 rounded-md">{message}</div>}
      
      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="feedback-modal">
          <div className="feedback-content">
            <span className="checkmark">✓</span>
            <p>{feedbackMessage}</p>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="space-y-4 w-full flex flex-col">
          <h2 className="text-2xl font-bold">Create a New Task</h2>
          <div>
            <label>Title</label>
            <Input 
              placeholder="Enter task title" 
              value={newTask.title} 
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
            />
          </div>
          <div>
            <label>Description</label>
            <textarea 
              className="w-full p-2 border rounded"
              placeholder="Add task description (optional)" 
              value={newTask.description} 
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
            />
          </div>
          <div>
            <label>Priority</label>
            <div className="priority-selector">
              <label className="priority-option">
                <input 
                  type="radio" 
                  name="priority"
                  checked={newTask.priority === 'high'} 
                  onChange={() => setNewTask({ ...newTask, priority: 'high' })}
                />
                <span className="priority-badge priority-high">High Priority</span>
              </label>
              <label className="priority-option">
                <input 
                  type="radio" 
                  name="priority"
                  checked={newTask.priority === 'medium'} 
                  onChange={() => setNewTask({ ...newTask, priority: 'medium' })}
                />
                <span className="priority-badge priority-medium">Medium Priority</span>
              </label>
              <label className="priority-option">
                <input 
                  type="radio" 
                  name="priority"
                  checked={newTask.priority === 'low'} 
                  onChange={() => setNewTask({ ...newTask, priority: 'low' })}
                />
                <span className="priority-badge priority-low">Low Priority</span>
              </label>
            </div>
          </div>
          <div>
            <label>Due Date</label>
            <Calendar 
              selected={newTask.dueDate} 
              onChange={handleDateChange}
              minDate={today}
              disabledDates={(date) => date < today}
            />
          </div>
          <Button onClick={addTask}>Add Task</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Task List</h2>
          <div className="filter-sort-controls">
            <div className="filter-buttons">
              <span className="filter-label">Filter by:</span>
              <Button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => changeFilter('all')}
                title="Show all tasks"
              >
                All Tasks
              </Button>
              <Button 
                className={`filter-btn high-filter ${filter === 'high' ? 'active' : ''}`}
                onClick={() => changeFilter('high')}
                title="Show high priority tasks only"
              >
                High Priority
              </Button>
              <Button 
                className={`filter-btn medium-filter ${filter === 'medium' ? 'active' : ''}`}
                onClick={() => changeFilter('medium')}
                title="Show medium priority tasks only"
              >
                Medium Priority
              </Button>
              <Button 
                className={`filter-btn low-filter ${filter === 'low' ? 'active' : ''}`}
                onClick={() => changeFilter('low')}
                title="Show low priority tasks only"
              >
                Low Priority
              </Button>
            </div>
            
            <div className="sort-buttons">
              <span className="sort-label">Sort by:</span>
              <Button 
                className={`sort-btn date-sort ${sortByDueDate !== null ? 'active' : ''}`}
                onClick={toggleSort}
                title="Sort tasks by due date"
              >
                <span className="sort-icon">📅</span> Due Date {sortByDueDate === null ? '' : sortByDueDate ? '↑' : '↓'}
              </Button>
              <Button 
                className={`sort-btn priority-sort ${sortByPriority !== null ? 'active' : ''}`}
                onClick={toggleSortByPriority}
                title="Sort tasks by priority"
              >
                <span className="sort-icon">🔥</span> Priority {sortByPriority === null ? '' : sortByPriority ? '↑' : '↓'}
              </Button>
            </div>
          </div>
          
          {sortedTasks.length === 0 ? (
            <p className="no-tasks-message">No tasks found</p>
          ) : (
            sortedTasks.map(task => (
              <motion.div 
                key={task.id} 
                className={`task-item task-${task.priority}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="task-checkbox">
                  <Checkbox 
                    checked={task.completed} 
                    onChange={() => toggleCompletion(task.id)} 
                    title="Mark task as completed"
                  />
                </div>
                <div className={`task-content ${task.completed ? 'completed' : ''}`}>
                  <h3 className="task-title">{task.title}</h3>
                  <p className="task-description">{task.description || 'No description'}</p>
                  <div className="task-meta">
                    <span className={getPriorityBadgeClass(task.priority)}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    {task.dueDate && (
                      <span className="due-date">
                        📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="task-actions">
                  <Button className="edit-btn" onClick={() => editTask(task.id)} title="Edit task">
                    <span className="btn-icon">✏️</span> Edit
                  </Button>
                  <Button className="delete-btn" onClick={() => deleteTask(task.id)} title="Delete task">
                    <span className="btn-icon">🗑️</span> Delete
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Weekly Schedule</h2>
          <div className="weekly-schedule">
            {Object.entries(tasksByDay).map(([day, dayTasks]) => (
              <div key={day} className="schedule-day">
                <h3 className="day-header">{day}</h3>
                {dayTasks.length === 0 ? (
                  <p className="no-tasks">No tasks</p>
                ) : (
                  <div className="day-tasks">
                    {dayTasks.map(task => (
                      <div 
                        key={task.id} 
                        className={`schedule-task ${task.completed ? 'completed' : ''} priority-${task.priority}`}
                      >
                        <div className="schedule-task-header">
                          <h4>{task.title}</h4>
                          <span className={getPriorityBadgeClass(task.priority)}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        </div>
                        <p className="schedule-task-description">{task.description || 'No description'}</p>
                        <div className="schedule-task-actions">
                          <Checkbox 
                            checked={task.completed} 
                            onChange={() => toggleCompletion(task.id)} 
                            title={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                          />
                          <span className="checkbox-label">
                            {task.completed ? 'Completed' : 'Mark Complete'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}