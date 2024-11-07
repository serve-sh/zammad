// Copyright (C) 2012-2024 Zammad Foundation, https://zammad-foundation.org/

let editorColorMenuClasses = {
  colorSchemeList: {
    base: '',
    button: '',
  },
}

export const initializeEditorColorMenuClasses = (
  classes: typeof editorColorMenuClasses,
) => {
  editorColorMenuClasses = classes
}

export const getEditorColorMenuClasses = () => editorColorMenuClasses