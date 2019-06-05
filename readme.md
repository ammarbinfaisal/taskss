# taskss

manage your tasks from the comfort of your terminal
  
<img src="https://raw.githubusercontent.com/ammarbinfaisal/tasks/master/preview.gif"/>  

## Install

`npm install -g taskss`

## Usage

`taskss -n` to add a new task  
`taskss -e <task-number>` to edit a task with specific index  
`taskss -d <task-number>` to delete a task with specific index   <br><hr>
`taskss` to list the tasks then  
`up` and `down` key to move arrow up and down  
press `e` over any task to edit it  
press `d` over any task to delete it  
press `t` over any task to tick it  

## Changelog

- fix task editor (typing issue)
- console.clear() is again being used - to prevent the terminal from getting messed up on resizing  -- so whole of the terminal will be cleared :( 
- escaoe key can be used for quiting
- fix position of "save"/"cant be blank" message in task editor