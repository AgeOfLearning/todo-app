import {storeInstance} from '@aofl/store';
import {sdoNamespaces} from '../../../../modules/constants-enumerate';
import {deepAssign} from '@aofl/object-utils';

let idIncrementer = 0;
const sdo = {
  namespace: sdoNamespaces.TODOS,
  mutations: {
    init(payload = {}) {
      return Object.assign({
        todos: [],
        description: ''
      }, payload);
    },
    updateTodoDescription(subState, description) {
      return Object.assign({}, subState, {
        description
      });
    },
    insert(subState) {
      return Object.assign({}, subState, {
        todos: [
          ...subState.todos,
          {
            id: idIncrementer++,
            description: subState.description,
            completed: false
          }
        ],
        description: '' // reset desciption to an empty string
      });
    },
    updateTodoCompletion(subState, {id, completed}) {
      return Object.assign({}, subState, {
        todos: subState.todos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              completed
            };
          } else {
            return todo;
          }
        })
      });
    },
    editTodoDescription(subState, {id, description}) {
      return Object.assign({}, subState, {
        todos: subState.todos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              description
            };
          } else {
            return todo;
          }
        })
      });
    },
    remove(subState, id) {
      return Object.assign({}, subState, {
        todos: subState.todos.filter((todo) => todo.id !== id)
      });
    },
    filterCompleted(subState) {
      return Object.assign({}, subState, {
        filter: 'completed'
      });
    },
    filterIncomplete(subState) {
      return Object.assign({}, subState, {
        filter: 'incomplete'
      });
    },
    removeFilter(subState) {
      return Object.assign({}, subState, {
        filter: ''
      });
    }
  },
  decorators: [
    function $todosCount(_nextState) {
      return deepAssign(_nextState, sdoNamespaces.TODOS, {
        $todosCount: _nextState[sdoNamespaces.TODOS].todos.filter((todo) => !todo.completed).length
      });
    },
    function $filteredTodos(_nextState) {
      const state = storeInstance.getState();
      let nextState = _nextState;

      if (typeof nextState[sdoNamespaces.TODOS].$filteredTodos === 'undefined' || // first run?
      nextState[sdoNamespaces.TODOS] !== state[sdoNamespaces.TODOS]) {
        let $filteredTodos = [...nextState[sdoNamespaces.TODOS].todos];

        if (nextState[sdoNamespaces.TODOS].filter === 'completed') {
          $filteredTodos = nextState[sdoNamespaces.TODOS].todos
          .filter((todo) => todo.completed === false);
        } else if (nextState[sdoNamespaces.TODOS].filter === 'incomplete') {
          $filteredTodos = nextState[sdoNamespaces.TODOS].todos
          .filter((todo) => todo.completed === true);
        }

        nextState = deepAssign(nextState, sdoNamespaces.TODOS, {
          $filteredTodos
        });
      }

      return nextState;
    }
  ]
};

storeInstance.addState(sdo);
