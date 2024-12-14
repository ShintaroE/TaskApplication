import { useState } from 'react'
import { Plus, Moon, Sun, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

interface Task {
  id: number
  text: string
  completed: boolean
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }])
      setNewTask('')
    }
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="container mx-auto p-4 transition-colors duration-300 ease-in-out dark:bg-gray-900">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Task Manager</h1>
          <div className="flex items-center space-x-2">
            <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        <div className="flex space-x-2 mb-6">
          <Input
            type="text"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow dark:bg-gray-800 dark:text-white"
          />
          <Button onClick={addTask}>
            <Plus className="h-5 w-5 mr-2" /> Add Task
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id} className="transition-all duration-300 ease-in-out hover:shadow-lg dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className={`text-lg ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                      {task.text}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

