import todoStore, { Filters } from '../store/todo.store';
import html from './app.html?raw';
import { renderPending, renderTodos } from './use-cases';

const ElementIDs = {
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    ClearCompleted: '.clear-completed',
    TodoFilters: '.filtro',
    PendingCount: '#pending-count'
}

export const App = (elementId) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos(todoStore.getCurrentFilter());
        renderTodos(ElementIDs.TodoList, todos);
        updatePendingCount();
    }

    const updatePendingCount = () => {
        renderPending(ElementIDs.PendingCount);
    };

    // Cuando la funcion App() se llama
    (() => {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodos();
    })();

    const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput);
    const todoListUL = document.querySelector(ElementIDs.TodoList);
    const ClearCompleted = document.querySelector(ElementIDs.ClearCompleted);
    const filtersIL = document.querySelectorAll(ElementIDs.TodoFilters);

    newDescriptionInput.addEventListener('keyup', (event) => {

        if (event.keyCode !== 13) return;
        if (event.target.value.trim().length === 0) return;

        todoStore.addTodo(event.target.value);
        event.target.value = '';
        displayTodos();
    });

    todoListUL.addEventListener('click', (event) => {
        const element = event.target.closest('[data-id]');
        todoStore.toogleTodo(element.getAttribute('data-id'));
        displayTodos();
    });

    todoListUL.addEventListener('click', (event) => {
        console.log(event.target);
        if (!event.target.classList.contains('destroy')) return;
        const element = event.target.closest('[data-id]');
        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayTodos();


    });

    ClearCompleted.addEventListener('click', () => {
        todoStore.deleteCompleted();
        displayTodos();
    });

    filtersIL.forEach(element => {
        element.addEventListener('click', (element) => {
            filtersIL.forEach(element => element.classList.remove('selected'));
            element.target.classList.add('selected');

            switch (element.target.text) {
                case 'Todos':
                    todoStore.setFilter(Filters.All);
                    break;
                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending);
                    break;
                case 'Completados':
                    todoStore.setFilter(Filters.Completed);
                    break;
                default:
                    throw new Error('Filter not supported');
            }

            displayTodos();
        });
    })

    /* todoListUL.addEventListener('click', (event) => {
        console.log(event.target);
        const isDestroyElement = event.target.className === 'destroy';
        const element = event.target.closest('[data-id]');

        if (!element || !isDestroyElement) return;
        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayTodos();


    }); */

}