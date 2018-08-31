import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import logo from './logo.png';
import data from './data';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: null,
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
    this.setState({ page: null }, () => {
      this.setState({ topic: 'all', candidate: 'all' }, () => {
        this.filter();
      });
      document.getElementById('topic').value = 'all';
      document.getElementById('candidate').value = 'all';
    });
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
      document.getElementById('temas').scrollIntoView();
    });
  }

  changePage(page) {
    this.setState({ page });
  }

  componentDidMount() {
    window.onhashchange = function() {
      if (window.location.hash === '') {
        window.location.reload();
      }
    };
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
      const parts = data[name]['Nome Urna'].split(' ');
      const names = [];
      parts.forEach(p => {
        names.push(p.charAt(0).toUpperCase() + p.substring(1).toLowerCase());
      });
      obj.name = names.join(' ');
      obj.id = id;
      obj.agency = 'Politiquem';
      candidates.push(obj);
      data[name]['subjects'] = { 'Teste 1': 'Contra', 'Teste 2': 'A Favor' };
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

  selectCandidate(c) {
    this.setState({ candidates: [c] });
    document.getElementById('candidate').value = c.name;
  }

  render() {
    const searchPage = (
      <section>
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
            {this.state.candidates.length > 1 ? this.state.candidates.map(field => (
              <a href={`#candidate-${field.id}`}>
                <li key={field.id} onClick={this.selectCandidate.bind(this, field)}>
                  <span className="avatar"><img src={field.Picture} alt="" /></span>
                  <h4>{field.name}</h4>
                  <h5>{field.Partido}</h5>
                </li>
              </a>
            )) : (
              <div id="candidate">
                <span className="avatar"><img src={this.state.candidates[0].Picture} alt="" /></span>
                <div>
                  <h4>{this.state.candidates[0].name}</h4>
                  <h5>{this.state.candidates[0].Partido}</h5>
                  <div>
                  { Object.keys(this.state.candidates[0]).map(field => {
                    if (typeof this.state.candidates[0][field] === 'string' && ['Picture', 'agency', 'name'].indexOf(field) === -1) {
                      return (
                        <div key={field} className="field">
                          <strong>{field}</strong>
                          <br />
                          <span>{this.state.candidates[0][field]}</span>
                        </div>
                      );
                    }
                  })} 
                  </div>
                </div>
              </div>) }
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
      </section>
    );

    const usPage = (
      <div className="page">
        <h2>Nós</h2>
        <p>PolitiQuem é uma plataforma colaborativa que apresenta os perfis das candidatas e dos candidatos à presidência para as eleições de 2018 e seus posicionamentos sobre temas relevantes para a sociedade.</p>
        <p>A sua inovação está em reunir contribuições de diversos veículos de mídia em um mesmo lugar, de forma que o eleitor e a eleitora podem comparar os posicionamentos dos e das presidenciáveis.</p>
        <p>O projeto foi criado por três jornalistas, dois desenvolvedores e uma web designer. A equipe foi ganhadora do Hackathon Inclusão, Cidadania e Género em março de 2018, organizado no Nubank-São Paulo, por GoogleLabs e Chicas Poderosas, a rede que está impulsando iniciativas de jornalismo independente na América Latina. A nossa principal ferramenta de trabalho é o software livre Check, graças ao qual verificamos as informações recolhidas por nossos colaboradores e as disponibilizamos na página.</p>
        <p>Quer ser nosso colaborador?</p>
        <p>Se você é uma mídia que já faz ou quer fazer checagens sobre os candidatos à presidência, escreva para a gente pelo e-mail: politiquem.brasil@gmail.com</p>
      </div>
    );

    let page = searchPage;
    if (this.state.page === 'us') {
      page = usPage;
    }

    return (
      <div className="App">
        <header>
          <h1 onClick={this.reload.bind(this)}><img src={logo} style={{ height: 150 }} /></h1>
          <ul>
            <li><a href="#candidatos" onClick={this.reload.bind(this)}>Candidatos</a></li>
            <li><a href="#temas" onClick={this.reload.bind(this)}>Temas</a></li>
            <li><a href="#nos" onClick={this.changePage.bind(this, 'us')}>Nós</a></li>
            <li><a href="#parceiros" onClick={this.soon.bind(this)}>Parceiros</a></li>
          </ul>
        </header>

        {page}

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
