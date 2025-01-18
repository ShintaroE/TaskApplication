import axios , { AxiosResponse }  from 'axios';

interface Task {
    id: number
    text: string
    completed: boolean
}

export interface DeleteTaskResponse {
  message: string;
  success: boolean;
  id: number;
}


export async function deleteFromTask(id: number): Promise<DeleteTaskResponse> {
  try {
    // REST APIを叩いて新しいタスクを追加
    const deleteTask = {
      id: id
    }
    const response: AxiosResponse<DeleteTaskResponse> = await axios.post<DeleteTaskResponse>('http://localhost:8000/api/deletetask', deleteTask);
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