import React, { Component } from 'react';
import './App.css';
import data from './data';
import logo from './logo.png';
import lego from './lego.png';
import cube from './cube.png';
import label from './label.png';
import timeline from './timeline.png';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: {},
      topic: null,
      agency: null,
      name: '',
      names: [],
      candidates: [],
      allCandidates: [],
      topics: [],
      agencies: ['Aos Fatos', 'Lupa', 'Politiquem'],
      filterName: '',
      filterPosition: null,
      filterBy: null,
      filterTopic: null,
      position: null,
      months: ['Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro'],
    };
  }

  selectCandidate(candidate) {
    this.setState({ active: candidate });
  }

  selectTopic(topic) {
    this.setState({ topic });
  }

  selectAgency(agency) {
    if (agency === this.state.agency) {
      agency = null;
    }
    this.setState({ agency }, () => { this.filter(); });
  }

  filterByName() {
    const filter = document.getElementById('search').value;
    this.setState({ name: filter }, () => { this.filter(); });
  }

  filter() {
    let candidates = [];
    this.state.allCandidates.forEach(candidate => {
      if (
        (candidate.name.toUpperCase().indexOf(this.state.name.toUpperCase()) > -1) &&
        (!this.state.agency || candidate.agency == this.state.agency) &&
        (!this.state.position || candidate.subjects[this.state.topic] == this.state.position)
      ) {
        candidates.push(candidate);
      }
    });
    this.setState({ candidates });
  }

  componentWillMount() {
    const names = [];
    const candidates = [];
    const topics = [];
    let id = 0;
    for (var name in data) {
      id++;
      names.push(name);
      const obj = data[name];
      obj.name = name;
      obj.id = id;
      obj.agency = 'Politiquem';
      candidates.push(obj);
      for (var topic in data[name]['subjects']) {
        if (topics.indexOf(topic) === -1 && topic !== 'Teste') {
          topics.push(topic);
        }
      }
    }
    this.setState({ names, topics, candidates, allCandidates: candidates });
  }

  selectPosition(pos) {
    if (pos === this.state.position) {
      pos = null;
    }
    this.setState({ position: pos }, () => { this.filter(); });
  }

  render() {
    return (
      <div className="App">
        <img id="logo" src={logo} />

        <div id="col-1">
          <h2>Filtrar por:</h2>
          <input id="search" onKeyUp={this.filterByName.bind(this)} autoComplete="off" placeholder="Nome do candidato" />
          <ul id="candidates">
          {this.state.candidates.map(candidate => (
            <li key={candidate.id} className={candidate.id === this.state.active.id ? 'selected' : ''} onClick={this.selectCandidate.bind(this, candidate)}>
              <span className="square"></span> {candidate.name}
            </li>
          ))}
          </ul>

          <h2 style={{ marginTop: 100 }}>Linha do tempo</h2>
          <p className="timeline"><b>2017</b> <b><img src={timeline} /></b> <b>2018</b></p>

          <h2 style={{ marginTop: 100 }}>Posicionamento</h2>
          <ul id="candidates">
          {this.state.topics.map(topic => (
            <li key={topic} className={topic === this.state.topic ? 'selected' : ''} onClick={this.selectTopic.bind(this, topic)}>
              <span className="square"></span> {topic}
            </li>
          ))}
          </ul>
        </div>

        { this.state.topic ? 
        <div id="position">
          <h2>Filtra por:</h2>
          <div className={ this.state.position === 'A Favor' ? 'selected': '' } onClick={this.selectPosition.bind(this, 'A Favor')}><span>A Favor</span> <img src={label} /></div>
          <div className={ this.state.position === 'Contra' ? 'selected': '' } onClick={this.selectPosition.bind(this, 'Contra')}><span>Contra</span> <img src={label} /></div>
          <div className={ this.state.position === 'Dúvida' ? 'selected': '' } onClick={this.selectPosition.bind(this, 'Dúvida')}><span>Dúvida</span> <img src={label} /></div>
        </div> : null }

        <div id="by">
          <h2>Verificado por:</h2>
          <ul id="agencies">
          {this.state.agencies.map(agency => (
            <li key={agency} className={agency === this.state.agency ? 'selected' : ''} onClick={this.selectAgency.bind(this, agency)}>
              <span className="square"></span> {agency}
            </li>
          ))}
          </ul>
        </div>

        <div id="middle">
          { this.state.active.id ?
          <div>
            <div className="middle-col"> 
              <img src={lego} />
              <h2>{this.state.active.name}</h2>
            </div>
            <div className="middle-col">
              <ul id="candidates">
              {Object.keys(this.state.active.fields).map(field => (
                <li key={field}>
                  <b>{field}:</b> {this.state.active.fields[field]}
                </li>
              ))}
              </ul>
            </div>

            { this.state.topic ? <div style={{ clear: 'both', marginTop: 100 }}>
              <div className="middle-footer middle-footer-first">
                {this.state.months.map(month => (
                  <span key={month} style={{ textAlign: 'center' }}>
                    <img src={cube} /><br />
                    {this.state.active.subjects[this.state.topic]}
                  </span>
                ))}
              </div>
              <div className="middle-footer">
                {this.state.months.map(month => (
                  <span key={month}>
                    <b>{month}</b>
                  </span>
                ))}
              </div>
            </div> : null }
          </div>
          : null }
        </div>

        <br style={{ clear: 'both' }} />
      </div>
    );
  }
}

export default App;
