import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState({ title: '', description: '', category: '', priority: 'medium', dueDate: '' });

  const addTask = () => {
    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
    setNewTask({ title: '', description: '', category: '', priority: 'medium', dueDate: '' });
  };

  const toggleCompletion = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const filteredTasks = tasks.filter(task => filter === 'all' || task.priority === filter);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">Create a New Task</h2>
          <Input placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
          <Input placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
          <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </Select>
          <Calendar selected={newTask.dueDate} onSelect={(date) => setNewTask({ ...newTask, dueDate: date })} />
          <Button onClick={addTask}>Add Task</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Filter Tasks</h2>
          <Select value={filter} onValueChange={setFilter}>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Tasks</h2>
          {filteredTasks.map(task => (
            <motion.div key={task.id} className="flex items-center space-x-4 p-2 border rounded-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Checkbox checked={task.completed} onCheckedChange={() => toggleCompletion(task.id)} />
              <div className={task.completed ? "line-through" : ""}>
                <p className="font-bold">{task.title}</p>
                <p>{task.description}</p>
                <p className="text-sm">Priority: {task.priority} | Due: {task.dueDate?.toLocaleDateString()}</p>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
