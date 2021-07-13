import './App.css'
import Main from "./components/main";
import store from './redux/store';
import { Provider } from 'react-redux';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import LoginForm from './components/LoginForm';


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path='/'>
            <LoginForm />
          </Route>
          <Route path="/videocall/:userid">

            <Main />

          </Route>
        </Switch>
      </BrowserRouter>
    </Provider >
  );

}

export default App;
