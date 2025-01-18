import { useState } from 'react'
import { Plus, Moon, Sun, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useEffect } from 'react'
import {getTasks} from '@/pages/api/getTasks'
import {addTasks , AddTaskResponse} from '@/pages/api/addTasks'
import {getNewId , NewSeqNumber} from '@/pages/api/getNewId'
import { changeTaskCondition ,  ChangeTaskResponse} from './api/changeTaskCondition'
import { deleteFromTask , DeleteTaskResponse } from './api/deleteTask'

//Todoリストの型を定義
interface Task {
  id: number
  text: string
  completed: boolean
}

export default function TaskManager() {
  //useState表示するタスクを格納
  const [tasks, setTasks] = useState<Task[]>([])
  //useState表示する新しくタスクを格納
  const [newTask, setNewTask] = useState('')
  //useStateでダークモードとライトモードを切り替える
  const [darkMode, setDarkMode] = useState(false)

  //useEffectで初回レンダリング時にDB上のタスクを取得
  useEffect(() => {
    getTasks().then((data) => {
      setTasks(data);
    });
  }, [])

  //新しいタスクを追加する
  const addTask = () => {
    //新しいタスクが空文字でない場合、新しいタスクを追加
    if (newTask.trim() !== '') {
      //挿入データのオブジェクトを作成
      //DBに新しいタスクを追加
      addTasks(newTask).then((response: AddTaskResponse) => {
        if (response.success) {
          //追加が成功した場合、新しいタスクを追加
          const newdata: Task = {
            id: response.id,
            text: newTask,
            completed: false
          }
          setTasks([...tasks, newdata])
          //新しいタスクを追加した後、newTaskを空文字にする
          setNewTask('')
        }
      })
    } else {
      console.log('Failed to add new task ');
    }
  }
  

  //タスクの完了状態を切り替える
  const toggleTask = (changeTask: Task) => {
    changeTaskCondition(changeTask.completed , changeTask.id).then((response: ChangeTaskResponse) => {
      if(response.success){
        setTasks(tasks.map(task => 
          task.id === changeTask.id ? { ...task, completed: !task.completed } : task
        ))
      }
    }).catch((error) => {
      console.log('Error changing task condition:', error);
    });
  }

  //タスクを削除
  const deleteTask = (id: number) => {
    deleteFromTask(id).then((response: DeleteTaskResponse) =>{
      if(response.success){
        setTasks(tasks.filter(task => task.id !== id))
      }
    }).catch((error) =>{
      console.log('Error deleting task:', error);
    })
  }

  //ダークモードとライトモードを切り替える
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  //エンターキーを押した時に新しいタスクを追加する
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

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
                      onChange={() => toggleTask(task)}
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

