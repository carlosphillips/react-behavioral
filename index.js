import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import {
  Provider,
  connect
} from './src/react-behavioral';

function* Button() {
  this.updateView(
    <button
      onClick={() => {
        this.request(
          'BUTTON_CLICKED',
          'ciao'
        );
      }}
    >
      Click me twice!
    </button>
  );
  yield {
    wait: ['SHOW_HELLO_WORLD']
  };
  this.updateView(
    'Hello world: ' + this.bp.lastPayload
  );
}
const ButtonContainer = connect(Button);

const threads = [
  function* click() {
    yield {
      wait: ['BUTTON_CLICKED']
    };
    yield {
      request: ['SHOW_HELLO_WORLD'],
      payload: this.bp.lastPayload
    };
  },
  function* doubleClick() {
    yield {
      wait: ['BUTTON_CLICKED']
    };
    yield {
      block: ['SHOW_HELLO_WORLD'],
      wait: ['BUTTON_CLICKED']
    };
  }
];

function* ReactCell() {
  const { idx } = this.props;
  this.updateView(
    <button
      onClick={e => {
        if (e.shiftKey) {
          return this.request(`O_${idx}`);
        }
        this.request(`X_${idx}`);
      }}
    />
  );
  yield {
    wait: [`X_${idx}`, `O_${idx}`]
  };
  this.updateView(
    <button>
      {this.bp.lastEvent.split('_')[0]}
    </button>
  );
}

const Cell = connect(ReactCell);

ReactDOM.render(
  <React.Fragment>
    <h2>react-behavioral</h2>
    <pre>yarn add react-behavioral</pre>
    <p>
      <a href="https://twitter.com/search?q=%23BehavioralProgramming">
        #BehavioralProgramming
      </a>{' '}
      is a paradigm that was coined by David
      Harel and others in{' '}
      <a href="http://www.wisdom.weizmann.ac.il/~amarron/BP%20-%20CACM%20-%20Author%20version.pdf">
        this paper
      </a>.
    </p>
    <p>
      It's a different way of programming that
      is more aligned with how people think
      about behavior. Specifically we program
      using these software modules called{' '}
      <b>b-threads</b> (aka function
      generators) that run in parallel and can{' '}
      <span style={{ color: 'blue' }}>
        request
      </span>,{' '}
      <span style={{ color: 'green' }}>
        wait
      </span>{' '}
      and{' '}
      <span style={{ color: 'red' }}>
        block
      </span>{' '}
      events.
    </p>
    <p>
      <a href="https://github.com/lmatteis/react-behavioral">
        react-behavioral
      </a>{' '}
      is a library, specifically targeted at
      React, that implements this paradigm.
    </p>
    <h3>TicTacToe Example</h3>
    <p>
      To guide you through an example let's
      imagine that we wanted to teach a person
      how to play the TicTacToe game.
    </p>
    <p>
      We'd first start by showing the board to
      the person and we'd tell them that we
      can draw Xs and Os on this board (try
      clicking on the board yourself;
      shift-click to draw Os):
      <div>
        <Provider>
          <Cell idx={0} /> <Cell idx={1} />{' '}
          <Cell idx={2} /> <br />
          <Cell idx={3} /> <Cell idx={4} />{' '}
          <Cell idx={5} /> <br />
          <Cell idx={6} /> <Cell idx={7} />{' '}
          <Cell idx={8} /> <br />
        </Provider>
      </div>
    </p>
    <div>To guide you through</div>
  </React.Fragment>,
  document.getElementById('content')
);
