import axios , { AxiosResponse }  from 'axios';

interface Task {
    id: number
    text: string
    completed: boolean
}

export interface NewSeqNumber {
  id: number;
}

export async function getNewId(): Promise<NewSeqNumber> {
  try {
    // REST APIを叩いて新しいシーケンスを採番
    const response: AxiosResponse<NewSeqNumber> = await axios.get('http://localhost:8000/api/getid');
    if (response.data.id) {
      console.log('new seq number successfully');
    } else {
      console.log('Failed to new seq number ');
    }
    return response.data;
  } catch (error) {
    console.log('Error new seq number :', error);
    throw error;
  }
}