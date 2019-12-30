import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter as Router} from "react-router-dom";
import {AppController} from "./AppController";
import {Provider} from "mobx-react";
import {App} from "./App";
import * as serviceWorker from './serviceWorker';

import 'purecss/build/pure.css';
import 'purecss/build/grids-responsive.css'
import './assets/index.css';
import './assets/App.css';
import {Layout} from "./component/Layout";

const controller = new AppController();
ReactDOM.render(
    <Provider controller={controller}>
        <Router>
            <div>
                <Layout><App/></Layout>
            </div>
        </Router>
    </Provider>,
    document.getElementById('root') as HTMLElement
);

serviceWorker.unregister();
