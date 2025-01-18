import axios , { AxiosResponse }  from 'axios';

interface Task {
    id: number
    text: string
    completed: boolean
}

export interface ChangeTaskResponse {
  message: string;
  success: boolean;
  id: number;
}


export async function changeTaskCondition(completed: Boolean , id: number): Promise<ChangeTaskResponse> {
  try {
    // REST APIを叩いて新しいタスクを追加
    const changeTask = {
      condition: !completed,
      id: id
    }
    const response: AxiosResponse<ChangeTaskResponse> = await axios.post<ChangeTaskResponse>('http://localhost:8000/api/changetaskcondition', changeTask);
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