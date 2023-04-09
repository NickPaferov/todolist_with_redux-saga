import React from 'react';
import EditableSpan from "../../../../components/EditableSpan/EditableSpan";
import {DeleteOutline} from "@material-ui/icons";
import {IconButton} from "@material-ui/core";
import {RequestStatusType} from "../../../../app/app-reducer";

type TodoListHeaderPropsType = {
    title: string
    entityStatus: RequestStatusType
    removeTodoList: () => void
    changeTodoListTitle: (newTitle: string) => void
}

const TodoListHeader: React.FC<TodoListHeaderPropsType> = React.memo((
    {
        title,
        entityStatus,
        changeTodoListTitle,
        ...props
    }
) => {

    console.log("TodoListHeader")

    return (
        <div style={{textAlign: "center"}}>
            <h3>
                <EditableSpan title={title} changeTitle={changeTodoListTitle} entityStatus={entityStatus}/>
                <IconButton onClick={props.removeTodoList} disabled={entityStatus === 'loading'}>
                    <DeleteOutline/>
                </IconButton>
                {/*
            <Button onClickHandler={props.removeTodoList} title={"x"}
                    active={false}/>
*/}
            </h3>
        </div>
    );
});

export default TodoListHeader;