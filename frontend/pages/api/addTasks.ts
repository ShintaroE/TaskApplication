import axios , { AxiosResponse }  from 'axios';

interface Task {
    id: number
    text: string
    completed: boolean
}

export interface AddTaskResponse {
  message: string;
  success: boolean;
  id: number;
}

//帰ってきたデータが配列型かつ、その中身がTask型であるかどうかを判定する関数
function isTask(data: Task){
    return (
      typeof data.id === 'number' &&
      typeof data.text === 'string' &&
      typeof data.completed === 'boolean'
    );
    
}

export async function addTasks(newTask: String): Promise<AddTaskResponse> {
  try {
    // REST APIを叩いて新しいタスクを追加
    const newaddTask = {
      text: newTask
    }
    const response: AxiosResponse<AddTaskResponse> = await axios.post<AddTaskResponse>('http://localhost:8000/api/addtask', newaddTask);
    if (response.data.success) {
      console.log('Task added successfully');
    } else {
      console.log('Failed to add task');
    }
    return response.data;
  } catch (error) {
    console.log('Error adding task:', error);
    throw error;
  }
}