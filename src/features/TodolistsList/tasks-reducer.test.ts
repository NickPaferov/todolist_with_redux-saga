import {addTaskAC, removeTaskAC, setTasksAC, tasksReducer, TasksStateType, updateTaskAC} from './tasks-reducer';
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from './todolists-reducer';
import {TaskPriorities, TaskStatuses} from '../../api/todolist-api';

let startState: TasksStateType;

beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
                completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            },
            {
                id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
                completed: true, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            },
            {
                id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
                completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            }
        ],
        "todolistId2": [
            {
                id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
                completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            },
            {
                id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
                completed: true, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            },
            {
                id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
                completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            }
        ]
    };
})

test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC("2", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todolistId1": [
            {
                id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
                completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            },
            {
                id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
                completed: true, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            },
            {
                id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
                completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            }
        ],
        "todolistId2": [
            {
                id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
                completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            },
            {
                id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
                completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                entityStatus: 'idle'
            }
        ]
    });
});

test('correct task should be added to correct array', () => {

    const action = addTaskAC({
        id: "some id",
        startDate: "",
        deadline: "",
        completed: false,
        title: "juce",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        description: "",
        order: 0,
        priority: 0,
        addedDate: "",
    });

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juce");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
})

test('status of specified task should be changed', () => {

    const action = updateTaskAC("2", {status: TaskStatuses.New}, "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
});

test('title of specified task should be changed', () => {

    const action = updateTaskAC("2", {title: "water"}, "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][1].title).toBe("JS");
    expect(endState["todolistId2"][1].title).toBe("water");
});

test('new array should be added when new todolist is added', () => {

    // const action = addTodolistAC("new todolist");
    const action = addTodolistAC({
        title: "new todolist",
        order: 0,
        id: "some id",
        addedDate: ""
    });

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== "todolistId1" && k !== "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {

    const action = removeTodolistAC("todolistId2");

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).toBeUndefined();
});

test('empty arrays should be added when we are setting todolists', () => {

    const action = setTodolistsAC([
        {id: "1", title: "CSS", addedDate: '', order: 0},
        {id: "3", title: "React", addedDate: '', order: 0}
    ]);

    const endState = tasksReducer({}, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(2);
    expect(endState["1"]).toStrictEqual([]);
    expect(endState["3"]).toStrictEqual([]);
});

test('tasks should be added for todolist', () => {

    const action = setTasksAC("todolistId1", startState["todolistId1"]);

    const endState = tasksReducer({
        "todolistId1": [],
        "todolistId2": []
    }, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(0);
});