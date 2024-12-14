import axios from 'axios';

interface Task {
    id: number
    text: string
    completed: boolean
}

function isTaskArray(data: any): data is Task[] {
    return Array.isArray(data) && data.every(item => 
      typeof item.id === 'number' &&
      typeof item.text === 'string' &&
      typeof item.completed === 'boolean'
    );
}

export async function getTasks() :Promise<Task[]> {
  try {
    const response = await axios.get('http://localhost:8000/api/tasks');
    const data:any = response.data;
    if (!isTaskArray(data)) {
        throw new Error('Data does not match Task[] type');
    }
    return data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}