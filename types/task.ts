export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  raw_input: string;
  created_at: string;
}