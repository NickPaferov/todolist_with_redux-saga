import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import TodoListHeader from "./TodoListHeader";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolists/TodoListHeader',
    component: TodoListHeader,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        title: {
            description: 'Start todolist Title'
        },
        removeTodoList: {
            description: 'Todolist removed'
        },
        changeTodoListTitle: {
            description: 'Title todolist changed'
        }
    },
} as ComponentMeta<typeof TodoListHeader>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TodoListHeader> = (args) => <TodoListHeader {...args} />;

export const TodoListHeaderStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TodoListHeaderStory.args = {
    title: 'What to learn',
    removeTodoList: action('Todolist removed'),
    changeTodoListTitle: action('New todolist title')
};