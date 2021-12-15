import { v1 as uuidv1 } from "uuid";
import randomWords from "random-words";
import randomExt from "random-ext";
import * as fs from "fs";
import path from "path";

type TodoStatus = "DONE" | "PROCESS";

type Todo = {
  id: string;
  text: string;
  priority: number;
  status: TodoStatus;
  create_at: Date;
};

const dataPath = path.join(__dirname, "todos.json");

const createTodo = (): Todo => {
  return {
    id: uuidv1(),
    text: randomWords(),
    priority: Math.floor(Math.random() * 4),
    status: ["DONE", "PROCESS"][Math.floor(Math.random() * 2)] as TodoStatus,
    create_at: randomExt.date(new Date()),
  };
};

const createTodos = (len: number) => {
  const res: Todo[] = [];
  for (let i = 0; i < len; i++) {
    res.push(createTodo());
  }
  return res;
};

const todos = createTodos(500).sort((a, b) => {
  if (a.create_at > b.create_at) {
    return 1;
  }
  if (a.create_at < b.create_at) {
    return -1;
  }
  return 0;
});

fs.writeFileSync(dataPath, JSON.stringify(todos));
