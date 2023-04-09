import {TextField} from '@material-ui/core';
import React, {ChangeEvent, FC, KeyboardEvent, useState} from 'react';
import {RequestStatusType} from "../../app/app-reducer";

type EditableSpanPropsType = {
    title: string
    changeTitle: (newTitle: string) => void
    entityStatus?: RequestStatusType
}

const EditableSpan: FC<EditableSpanPropsType> = React.memo((
    {
        title,
        changeTitle,
        entityStatus
    }
) => {

    console.log("EditableSpan")

    const [newTitle, setNewTitle] = useState<string>(title)
    const [editMode, setEditMode] = useState<boolean>(false)

    const onChangeSetUserText = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }
    const onEditMode = () => {
        setEditMode(true)
    }
    const offEditMode = () => {
        setEditMode(false)
        changeTitle(newTitle)
    }
    const onKeyPressOffEditMode = (e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && offEditMode()

    return (
        editMode
            ? <TextField autoFocus={true}
                         value={newTitle}
                         onChange={onChangeSetUserText}
                         onBlur={offEditMode}
                         onKeyPress={onKeyPressOffEditMode}
                         disabled={entityStatus === 'loading'}
            />
            /*
                        ? <input
                            autoFocus={true}
                            value={newTitle}
                            onChange={onChangeSetUserText}
                            onBlur={offEditMode}
                            onKeyPress={onKeyPressOffEditMode}
                        />
            */
            : <span onDoubleClick={onEditMode}>{title}</span>
    );
});

export default EditableSpan;