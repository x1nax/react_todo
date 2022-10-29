import { Component } from 'react';

import TaskList from '../TaskList/TaskList';
import Footer from '../Footer/Footer';
import NewTaskForm from '../NewTaskForm/NewTaskForm';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    // Не вызывайте здесь this.setState()!
    localStorage.getItem('state')
      ? (this.state = JSON.parse(localStorage.getItem('state')))
      : (this.state = {
          items: [
            {
              value: 'Learn Js',
              id: 1,
              complited: false,
              isHidden: false,
              time: Date.now(),
              sec: 0,
              timer: undefined,
            },
            {
              value: 'Learn React',
              id: 2,
              complited: false,
              isHidden: false,
              time: Date.now(),
              sec: 0,
              timer: undefined,
            },
            {
              value: 'Get a job',
              id: 3,
              complited: false,
              isHidden: false,
              time: Date.now(),
              sec: 0,
              timer: undefined,
            },
          ],
          maxID: 4,
          complitedMod: false,
          notModes: true,
        });
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleWindowBeforeUnload);
  }

  componentDidUpdate() {
    console.log('записываю в локал');
    console.log(this.state);
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  handleWindowBeforeUnload = () => {
    const { items } = this.state;
    const newItems = [...items];
    newItems.forEach((item) => {
      item.timer = clearInterval(item.timer);
      return item;
    });
    this.setState({ items: newItems });
  };

  isComplited = (id) => {
    const { items, complitedMod, notModes } = this.state;
    const newItems = [...items];
    newItems.forEach((item) => {
      if (item.id === id) {
        item.complited = !item.complited;
        if (item.complited !== complitedMod && notModes === false) {
          item.isHidden = true;
        }
      }
    });
    this.setState({ items: newItems });
  };

  onDelete = (id) => {
    const { items } = this.state;
    let newItems = [...items];
    newItems.forEach((item) => {
      if (item.id === id) {
        item.timer = clearInterval(item.timer);
      }
    });
    newItems = newItems.filter((item) => item.id !== id);
    this.setState({ items: newItems });
    console.log('удаляю');
  };

  clearComplited = () => {
    const { items } = this.state;
    let newItems = [...items];
    newItems.forEach((item) => {
      if (item.complited) {
        item.timer = clearInterval(item.timer);
      }
      return item;
    });
    newItems = newItems.filter((item) => !item.complited);
    this.setState({ items: newItems });
  };

  complitedModOn = () => {
    const { items } = this.state;
    const newItems = [...items];
    newItems.forEach((item) => {
      if (item.complited === false) {
        item.isHidden = true;
      } else item.isHidden = false;
      return item;
    });
    this.setState({ complitedMod: true });
    this.setState({ notModes: false });
    this.setState({ items: newItems });
  };

  activeModOn = () => {
    const { items } = this.state;
    const newItems = [...items];
    newItems.forEach((item) => {
      if (item.complited === true) {
        item.isHidden = true;
      } else item.isHidden = false;
      return item;
    });
    this.setState({ complitedMod: false });
    this.setState({ notModes: false });
    this.setState({ items: newItems });
  };

  notModesOn = () => {
    const { items } = this.state;
    const newItems = [...items];
    newItems.forEach((item) => {
      item.isHidden = false;
      return item;
    });
    this.setState({ complitedMod: false });
    this.setState({ notModes: true });
    this.setState({ items: newItems });
  };

  addTask = (label) => {
    let { maxID } = this.state;
    maxID++;
    const { complitedMod, items } = this.state;
    const newItems = [
      ...items,
      {
        value: label,
        id: maxID,
        complited: false,
        isHidden: complitedMod,
        time: Date.now(),
        sec: 0,
        timer: undefined,
      },
    ];
    this.setState({ items: newItems });
    this.setState({ maxID });
  };

  onEdit = (newtask, id) => {
    const { items } = this.state;
    const newItems = [...items];
    newItems.forEach((item) => {
      if (item.id === id) {
        item.value = newtask;
      }
      return item;
    });
    this.setState({ items: newItems });
  };

  timerOn = (id) => {
    const { items } = this.state;
    const newItems = [...items];
    newItems.forEach((item) => {
      if (item.id === id && !item.timer) {
        item.timer = setInterval(() => {
          item.sec++;
          this.setState({ item });
        }, 1000);
      }
    });
    this.setState({ items: newItems });
  };

  timerOff = (id) => {
    const { items } = this.state;
    const newItems = [...items];
    newItems.forEach((item) => {
      if (item.id === id) {
        item.timer = clearInterval(item.timer);
        this.setState({ items });
      }
    });
    this.setState({ items: newItems });
  };

  render() {
    let { items: doneCount } = this.state;
    doneCount = doneCount.filter((item) => !item.complited).length;
    const { items } = this.state;
    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <NewTaskForm addTask={this.addTask} />
        </header>
        <section className="main">
          <TaskList
            items={items}
            isComplited={this.isComplited}
            onDelete={this.onDelete}
            onEdit={this.onEdit}
            timerOff={this.timerOff}
            timerOn={this.timerOn}
          />
          <Footer
            complitedModOn={this.complitedModOn}
            activeModOn={this.activeModOn}
            notModesOn={this.notModesOn}
            doneCount={doneCount}
            clearComplited={this.clearComplited}
          />
        </section>
      </section>
    );
  }
}
