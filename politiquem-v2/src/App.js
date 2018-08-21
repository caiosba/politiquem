import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import data from './data';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: 'all',
      candidate: 'all',
      candidates: [],
      allCandidates: [],
      topics: [],
      topicsPerCandidate: [],
      allTopicsPerCandidate: [],
    };
  }

  filter() {
    const topicsPerCandidate = [];
    this.state.allTopicsPerCandidate.forEach(field => {
      if ((field.candidate === this.state.candidate || this.state.candidate === 'all') && (field.topic === this.state.topic || this.state.topic === 'all')) {
        topicsPerCandidate.push(field);
      }
    });
    const candidates = [];
    this.state.allCandidates.forEach(field => {
      if (field.name === this.state.candidate || this.state.candidate === 'all') {
        candidates.push(field);
      }
    });
    this.setState({ candidates, topicsPerCandidate });
  }

  reload() {
    this.setState({ topic: 'all', candidate: 'all' }, () => {
      this.filter();
    });
    document.getElementById('topic').value = 'all';
    document.getElementById('candidate').value = 'all';
  }

  changeCandidate() {
    const candidate = document.getElementById('candidate').value;
    this.setState({ candidate }, () => {
      this.filter();
    });
  }

  changeTopic() {
    const topic = document.getElementById('topic').value;
    this.setState({ topic }, () => {
      this.filter();
    });
  }

  componentWillMount() {
    const candidates = [];
    const topics = [];
    const topicsPerCandidate = [];
    const allTopicsPerCandidate = [];
    let id = 0;
    for (var name in data) {
      id++;
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
    let i = 0;
    candidates.forEach(candidate => {
      Object.keys(candidate.subjects).forEach(topic => {
        i++;
        const opinion = candidate.subjects[topic] || 'Não informado';
        allTopicsPerCandidate.push({ id: i, candidate: candidate.name, topic: topic, opinion: opinion });
        topicsPerCandidate.push({ id: i, candidate: candidate.name, topic: topic, opinion: opinion });
      });
    });
    this.setState({ topics, candidates, allTopicsPerCandidate, topicsPerCandidate, allCandidates: candidates });
  }

  soon() {
    alert('Em breve');
    return false;
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>Politiquem</h1>
          <ul>
            <li><a href="#candidatos" onClick={this.reload.bind(this)}>Candidatos</a></li>
            <li><a href="#temas" onClick={this.reload.bind(this)}>Temas</a></li>
            <li><a href="#" onClick={this.soon.bind(this)}>Nós</a></li>
            <li><a href="#" onClick={this.soon.bind(this)}>Parceiros</a></li>
          </ul>
        </header>

        <h2>Politiquem</h2>

        <div id="search">
          <span>O que fala <select id="candidate" onChange={this.changeCandidate.bind(this)}>
            <option value="all" selected>Escolher candidato</option>
            {this.state.allCandidates.map(field => (
              <option key={field.id} value={field.name}>
                {field.name}
              </option>
            ))}
          </select> sobre <select id="topic" onChange={this.changeTopic.bind(this)}> 
            <option value="all" selected>Escolher assunto</option>
            {this.state.topics.map(topic => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>?</span>
          <FontAwesomeIcon icon={faSearch} />
        </div>

        <div id="content">
          <h3 id="candidatos">Candidatos</h3>

          <ul id="candidates">
            {this.state.candidates.map(field => (
              <li key={field.id}>
                <span className="avatar"><FontAwesomeIcon icon={faUserCircle} /></span>
                <h4>{field.name}</h4>
                <h5>{field.fields.Partido}</h5>
              </li>
            ))}
          </ul>

          <h3 id="temas">Temas</h3>

          <ul id="topics">
            {this.state.topicsPerCandidate.map(field => (
              <li key={field.id}>
                <h4>{field.topic}</h4>
                <p>{field.opinion}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p className="tags">
                  <span className="candidateTag">{field.candidate}</span>
                  <span className="topicTag">{field.topic}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        <footer>
          <h1>Politiquem</h1>
          <ul>
            <li><a href="https://creativecommons.org/licenses/by/4.0/legalcode" target="_blank">&copy; 2018</a></li>
          </ul>
        </footer>
      </div>
    );
  }
}

export default App;
