import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProductosList from './components/ProductosList';
import ProductoCreate from './components/ProductoCreate';
import ProductoEdit from './components/ProductoEdit';

function App() {
  return (
    <Router>
      <div>
        <h1>Gestión de Inventarios</h1>
        <Switch>
          <Route exact path="/" component={ProductosList} />
          <Route path="/create" component={ProductoCreate} />
          <Route path="/edit/:id" component={ProductoEdit} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
