import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Select, SelectItem } from './components/ui/select';
import { Checkbox } from './components/ui/checkbox';
import { Calendar } from './components/ui/calendar';
import { motion } from 'framer-motion';
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
  const [time, setTime] = useState(new Date());

  // Get today's date at midnight for consistent comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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

    const task = { ...newTask, id: Date.now(), completed: false };
    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    setMessage('✅ Task successfully added!');
    setTimeout(() => setMessage(''), 2000);
  };

  const toggleCompletion = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    setNewTask(taskToEdit);
    deleteTask(id);
  };

  const toggleSort = () => {
    setSortByDueDate(sortByDueDate === null ? true : !sortByDueDate);
  };
  
  const toggleSortByPriority = () => {
    setSortByPriority(sortByPriority === null ? true : !sortByPriority);
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

  let filteredTasks = tasks.filter(task => !task.completed && (filter === 'all' ? true : task.priority === filter));
  let sortedTasks = [...filteredTasks];
  
  if (sortByDueDate !== null) {
    sortedTasks.sort((a, b) => {
      return sortByDueDate ? new Date(a.dueDate) - new Date(b.dueDate) : new Date(b.dueDate) - new Date(a.dueDate);
    });
  }
  
  if (sortByPriority !== null) {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    sortedTasks.sort((a, b) => {
      return sortByPriority ? priorityOrder[a.priority] - priorityOrder[b.priority] : priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Task Manager</h1>
      </div>

      {message && <div className="bg-green-100 text-green-800 p-2 rounded-md">{message}</div>}

      <Card>
        <CardContent className="space-y-4 w-full flex flex-col">
          <h2 className="text-2xl font-bold">Create a New Task</h2>
          <label>Title</label>
          <Input placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
          <div className="w-full flex">
            <label>Description</label>
            <textarea 
              style={{ width: '250px', height: '40px' }}
              placeholder="Description" 
              value={newTask.description} 
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
            />
          </div>
          <label>Priority</label>
          <Select value={newTask.priority} onChange={(value) => setNewTask({ ...newTask, priority: value })}>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </Select>
          <div className='w-full flex'>
            <label>Due Date</label>
            {/* Updated Calendar component with date validation */}
            <Calendar 
              selected={newTask.dueDate} 
              onChange={handleDateChange}
              minDate={today} // Set minimum date to today
              disabledDates={(date) => {
                // Disable all dates before today
                return date < today;
              }}
            />
            <Button onClick={addTask}>Add Task</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Task List</h2>
          <div className="flex justify-between items-center">
            <Button onClick={toggleSort}>Sort by Due Date {sortByDueDate === null ? '' : sortByDueDate ? '↑' : '↓'}</Button>
            <Button onClick={toggleSortByPriority}>Sort by Priority {sortByPriority === null ? '' : sortByPriority ? '↑' : '↓'}</Button>
          </div>
          {sortedTasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            sortedTasks.map(task => (
              <motion.div key={task.id} className="flex items-center space-x-4 p-2 border rounded-lg mb-2">
                Mark as completed<Checkbox checked={task.completed} onChange={() => toggleCompletion(task.id)} />
                <div className={task.completed ? 'line-through text-green-600 bg-gray-200 p-2 rounded' : ''}>
                  <p>Title: {task.title}</p>
                  <p>Description: {task.description}</p>
                  <p>Priority: {task.priority} | Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <Button onClick={() => editTask(task.id)}>✏️ Edit</Button>
                <Button onClick={() => deleteTask(task.id)}>🗑️ Delete</Button>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Weekly Schedule</h2>
          {tasks.filter(task => task.dueDate).length === 0 ? (
            <p>No scheduled tasks</p>
          ) : (
            tasks.filter(task => task.dueDate).map(task => (
              <div key={task.id} className="flex justify-between items-center">
                <p className={task.completed ? "text-green-500" : "text-blue-600"}>
                  📅 {new Date(task.dueDate).toLocaleDateString()}: {task.title} {task.completed ? "(Completed)" : ""}
                </p>
                {task.completed && (
                  <Button onClick={() => toggleCompletion(task.id)}>🔄 Undo</Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}