import axios from 'axios';

interface Task {
    id: number
    text: string
    completed: boolean
}

//帰ってきたデータが配列型かつ、その中身がTask型であるかどうかを判定する関数
function isTaskArray(data: any): data is Task[] {
    return Array.isArray(data) && data.every(item => 
      typeof item.id === 'number' &&
      typeof item.text === 'string' &&
      typeof item.completed === 'boolean'
    );
}

export async function getTasks() :Promise<Task[]> {
  try {
    //REST APIを叩いてデータを取得
    const response = await axios.get('http://localhost:8000/api/gettasks');
    //取得したデータをdataに格納
    const data:any = response.data['tasks'];
    //型チェック
    if (!isTaskArray(data)) {
        console.log(data);
        throw new Error('Data does not match Task[] type');
    }
    return data;
  } catch (error) {
    console.log('Error fetching tasks:', error);
    throw error;
  }
}