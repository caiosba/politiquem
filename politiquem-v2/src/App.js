import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faSearch, faEnvelopeSquare, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Linkify from 'react-linkify';
import './App.css';
import banner from './banner.png';
import usWeb from './us-web.jpg';
import usMobile from './us-mobile.jpg';
import data from './data';
import data2 from './data2';

import img360 from './img/logo_360.png';
import imgpoder from './img/logo_opodereleger.jpg';
import imgbrazilian from './img/logo_brazilian.png';
import imgjustificando from './img/logo_justificando.png';
import imgcongreso from './img/logo_congressoemfoco.jpg';
import imgchicas from './img/logo_chicas.png';
import imgbriohunter from './img/logo_briohunter.png';

import brreport from './brreport.png';
import check from './check.png';
import chicas from './chicas.png';
import justificando from './justificando.png';
import poder360 from './poder360.png';
import poderdeeleger from './poderdeeleger.png';

library.add(fab);

const topics = ['Política de drogas', 'Direitos humanos LGBTI', 'Reforma trabalhista'];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: null,
      pageTopic: null,
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

  changePage(page, state) {
    if (!state) {
      state = {};
    }
    const newState = Object.assign({ page }, state);
    this.setState(newState);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  setPageTopic(pageTopic) {
    this.setState({ pageTopic });
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
    }
    let i = 0;
    candidates.forEach(candidate => {
      topics.forEach(topic => {
        i++;
        let opinion = {};
        for (let j = 0; j < topics.length; j++) {
          if (data2[candidate['Nome']][j].hasOwnProperty(topic)) {
            opinion = data2[candidate['Nome']][j][topic];
          }
        }
        allTopicsPerCandidate.push({ id: i, candidate: candidate.name, topic: topic, opinion: opinion, candidateObject: candidate });
        topicsPerCandidate.push({ id: i, candidate: candidate.name, topic: topic, opinion: opinion, candidateObject: candidate });
      });
    });
    this.setState({ topics, candidates, allTopicsPerCandidate, topicsPerCandidate, allCandidates: candidates });
  }

  selectCandidate(c) {
    this.setState({ page: null }, () => {
      this.setState({ candidates: [c] });
      document.getElementById('candidate').value = c.name;
      this.changeCandidate();
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
  }

  resetCandidates() {
    window.location.reload();
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
                {field.name} ({field.Partido})
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
          { this.state.candidates.length === 1 ? <p className="back" onClick={this.resetCandidates.bind(this)}><FontAwesomeIcon icon={faChevronLeft} /> Voltar</p> : null }

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
                    return null;
                  })} 
                  </div>
                </div>
              </div>) }
          </ul>

          <h3 id="temas">Temas</h3>

          <ul id="topics">
            {this.state.topicsPerCandidate.map(field => {
              if (field.opinion.posicionamento) {
                return (
                  <li key={field.id}>
                    <h4><img src={field.candidateObject.Picture} alt="" /> <b onClick={this.changePage.bind(this, 'topics', { pageTopic: field.topic })}>{field.topic}</b></h4>
                    <br />
                    <p><em>{field.opinion.posicionamento}</em></p>
                    <br />
                    <Linkify><p><small>
                      Fonte:<br />
                      {field.opinion.fonte_fala}<br />
                      {field.opinion.fonte_comentario}<br />
                      Autoria:<br />
                      {field.opinion.usuario}<br />
                    </small></p></Linkify>
                    <p className="tags">
                      <span className="candidateTag" onClick={this.selectCandidate.bind(this, field.candidateObject)}>{field.candidate} ({field.candidateObject.Partido})</span>
                      <span className="topicTag" onClick={this.changePage.bind(this, 'topics', { pageTopic: field.topic })}>{field.topic}</span>
                    </p>
                  </li>
                );
              }
              else {
                return null;
              }
            })}
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
        <h2>Equipe</h2>
        <p style={{ textAlign: 'center' }}>
          <img id="us-web" src={usWeb} alt="Plataforma colaborativa que apresenta os perfis dos candidatos à presidência para as eleições de 2018 e seus posicionamentos sobre temas importantes. Parceiros: Poder 360, Meedan e Chicas Poderosas. Caio Almeida - Desenvolvedor. Luna Gámez - Gerente de projeto / editora. Eliana Vaca - Direção criativa. Lívia Alcântara - Editora. Lara Madeira - Editora. Daniela Feitosa - Desenvolvedora." />
          <img id="us-mobile" src={usMobile} alt="Plataforma colaborativa que apresenta os perfis dos candidatos à presidência para as eleições de 2018 e seus posicionamentos sobre temas importantes. Parceiros: Poder 360, Meedan e Chicas Poderosas. Caio Almeida - Desenvolvedor. Luna Gámez - Gerente de projeto / editora. Eliana Vaca - Direção criativa. Lívia Alcântara - Editora. Lara Madeira - Editora. Daniela Feitosa - Desenvolvedora." />
        </p>
        <p><b>Caio Almeida, desenvolvedor</b></p>
        <p>Mestre em Ciência da Computação (UFBA). É engenheiro de software sênior do Meedan. Foi um dos 5 desenvolvedores do mundo selecionado para participar do Data4Change, workshop de visualização de dados sobre direitos humanos. Colabora como desenvolvedor de software em projetos open source. E-mail: caiosba@gmail.com</p>
        <p><b>Daniela Feitosa, desenvolvedora</b></p>
        <p>Bacharel em Ciência da Computação (UFBA) e engenheira de software do Meedan. Foi desenvolvedora do Noosfero, um software livre para criação de redes sociais. Integra o projeto Meninas Digitais e organiza o Rails Girls Salvador, ambos com o objetivo de incentivar a participação de mulheres da área de TI. E-mail: danielafeitosa@gmail.com</p>
        <p><b>Eliana Vaca, direção criativa</b></p>
        <p>Designer gráfica com ênfase na mediação cultural. Sua principal motivação é criar projetos de empoderamento das mulheres. Tem experiência com design editorial e informativo, gerenciamento de projetos e direção criativa. Trabalhou com design comunitário e vem se aventurando no mundo da visualização de dados. E-mail: uvavaca@gmail.com</p>
        <p><b>Lara Madeira, editora</b></p>
        <p>Lara Madeira é jornalista (UFPR) e atua como repórter multimídia freelancer. Trabalha com dados, vídeos e fotografia. Vive em São Paulo. E-mail: larathaismadeira@gmail.com</p>
        <p><b>Lívia Alcântara, editora</b></p>
        <p>É jornalista, doutora em sociologia (IESP/UERJ) e investiga ativismo digital. Tem experiência como comunicadora popular junto a movimentos sociais e se interessa pelos debates políticos latino-americanos. Trabalha como comunicadora em uma ONG indigenista. E-mail: livia04alcantara@gmail.com</p>
        <p><b>Luna Gámez, gerente de projeto e editora</b></p>
        <p>Jornalista independente, escreve sobre política internacional e acompanha a atualidade da América Latina. É mestre em Estudos Internacionais e Antropologia pela Universidade da Sorbonne e formada em Cinema Documentário pela Academia Internacional de Cinema, RJ. E-mail: luna.gamp@gmail.com</p>
        <p><b>Mike Costa, designer</b></p>
        <p>Designer digital de Portugal, que mistura arte e tecnologia. Seus trabalhos são focados em narrativa, design de interação, UI e desenvolvimento para web. E-mail mikemfcosta@gmail.com</p>
        <p><b>Flávia Bozza Martins, consultora eleitoral convidada</b></p>
        <p>Cientista política, especialista em comportamento eleitoral.É pós-doutoranda no IESP/UERJ e contribui como analista na empresa Vértice Inteligência Digital.</p>
      </div>
    );

    const topicsPage = (
      <div className="page">
        <h2>Tema{ this.state.pageTopic ? `: ${this.state.pageTopic}` : 's' }</h2>
        { this.state.pageTopic ? <p className="back" onClick={this.setPageTopic.bind(this, null)}><FontAwesomeIcon icon={faChevronLeft} /> Voltar</p> : null }
        { !this.state.pageTopic ? 
        <div className="topics-page">
        { topics.map((topic) => {
          return (
            <div className="topic" onClick={this.setPageTopic.bind(this, topic)}>
              {topic}
            </div>  
          );
        })}
        </div> :
        <ul id="topics">
          {this.state.allTopicsPerCandidate.map(field => {
            if (field.opinion.posicionamento && field.topic === this.state.pageTopic) {
              return (
                <li key={field.id}>
                  <br />
                  <h4><img src={field.candidateObject.Picture} alt="" /> <b>{field.topic}</b></h4>
                  <br />
                  <p><em>{field.opinion.posicionamento}</em></p>
                  <Linkify>
                    <p><small>
                      Fonte:<br />
                      {field.opinion.fonte_fala}<br />
                      {field.opinion.fonte_comentario}<br />
                      Autoria:<br />
                      {field.opinion.usuario}<br />
                    </small></p>
                  </Linkify>
                  <p className="tags">
                    <span className="candidateTag" onClick={this.selectCandidate.bind(this, field.candidateObject)}>{field.candidate} ({field.candidateObject.Partido})</span>
                    <span className="topicTag" onClick={this.changePage.bind(this, 'topics', { pageTopic: field.topic })}>{field.topic}</span>
                  </p>
                </li>
              );
            }
            else {
              return null;
            }
          })}
        </ul> }
      </div>
    );

    const partnersPage = (
      <div className="page">
<div class="parceiros-container">          
  <h3 id="parceiros">Parceiros</h3>
   <div class="parceiros-list">
    <div class="parceiros-item poder360">
      <h4>Poder360</h4>
      <div class="imgparceiros-container"><img src={img360} alt="Poder360"/></div>
      <p>O Poder360 é um veículo nativo digital que cobre o poder e a política direto da capital da República, Brasília. A equipe publica diariamente textos, fotos, vídeos e newsletters sobre tudo que influencia a vida política nacional.</p>
      <a rel="noopener noreferrer" target="_blank" href="https://www.poder360.com.br">www.poder360.com.br</a>
    </div>
    <div class="parceiros-item podereleger">
      <h4>O Poder de Eleger</h4>
      <div class="imgparceiros-container"><img src={imgpoder} alt="O Poder de Eleger"/></div>
      <p>O Poder de Eleger é um projeto para verificar informações sobre política que circulam por WhatsApp no período de campanha das eleições de 2018. O produto final são gifs e áudios para devolver aos usuários correntes de informação verificada no mesmo veículo em que ela circulou originalmente.Também são publicadas no Twitter @OPoderdeEleger e no site do projeto.</p>
      <a rel="noopener noreferrer" target="_blank" href="https://chicaspoderosas.org/category/checagens/">chicaspoderosas.org</a>
    </div>
    <div class="parceiros-item brazilian">
      <h4>The Brazilian Report</h4>
      <div class="imgparceiros-container"><img src={imgbrazilian} alt="The Brazilian Report"/></div>
      <p>The Brazilian Report é uma empresa que produz conteúdo de alta qualidade sobre o Brasil em várias línguas, destinado principalmente a empresas, organismos institucionais e jornalistas. Eles elaboram relatórios especializados, newsletters, scripts de vídeos e podcast sobre temas relevantes e de atualidade. Além disso, The Brazilian Report oferece serviços de traduções e conferências sobre assuntos do Brasil.</p>
      <a rel="noopener noreferrer" target="_blank" href="https://brazilian.report">brazilian.report</a>
    </div>
    <div class="parceiros-item justificando">
      <h4>Justificando</h4>
      <div class="imgparceiros-container"><img src={imgjustificando} alt="Justificando"/></div>
      <p>Mentes inquietas pensam Direito”, este é o slogan do Justificando, site composto por 40 colunistas e com 1,5 milhões de visualizações por mês.  A plataforma se dedica ao jornalismo jurídico, abordando temas ligados à justiça por um viés progressista e com linguagem clara visando dialogar para além do público do Direito.</p>
      <a rel="noopener noreferrer" target="_blank" href="http://justificando.cartacapital.com.br">justificando.cartacapital.com.br</a>
    </div>
    <div class="parceiros-item congresso">
      <h4>Congresso em Foco</h4>
      <div class="imgparceiros-container"><img src={imgcongreso} alt="Congresso em Foco"/></div>
      <p>no description yet</p>
      <a rel="noopener noreferrer" target="_blank" href="https://congressoemfoco.uol.com.br">congressoemfoco.uol.com.br</a>
    </div>
    <div class="parceiros-item chicaspoderosas">
      <h4>Chicas Poderosas</h4>
      <div class="imgparceiros-container"><img src={imgchicas} alt="Chicas Poderosas"/></div>
      <p>Chicas Poderosas - Chicas Poderosas, uma organização global cuja missão é capacitar as mulheres para se tornarem novas líderes de mídia. Através de uma rede de jornalistas, designers e programadores. Chicas Poderosas dedica-se a prototipar e apoiar mais projetos de inovação em mídias digitais para atender comunidades marginalizadas e promover a democracia em toda a América Latina.</p>
      <a rel="noopener noreferrer" target="_blank" href="https://chicaspoderosas.org/home/">chicaspoderosas.org</a>
    </div>
    <div class="parceiros-item briohunter">
      <h4>Briohunter</h4>
      <div class="imgparceiros-container"><img src={imgbriohunter} alt="Briohunter"/></div>
      <p>Os Escavadores é um grupo de 103 jornalistas espalhados pelo Brasil. Uma grande expedição que está escavando aquilo que os candidatos a presidente, governador e senador nestas eleições não querem divulgar. Coordenados por BRIO - uma das iniciativas que mais tem buscado inovar no ambiente jornalístico brasileiro, a equipe trabalha com técnicas investigativas para encontrar documentos, processos, escrituras, contratos sociais, arquivos, fotos ou vídeos. Trata-se do maior esforço colaborativo de investigação jornalística já realizado no país para uma eleição. </p>
      <a rel="noopener noreferrer" target="_blank" href="https://briohunter.org/escavadores/">briohunter.org</a>
    </div>
  </div>
</div> 
      </div>
    );

    let page = searchPage;
    if (this.state.page === 'us') {
      page = usPage;
    }
    else if (this.state.page === 'topics') {
      page = topicsPage;
    }
    else if (this.state.page === 'partners') {
      page = partnersPage;
    }

    return (
      <div className="App">
        <header>
          <h1 onClick={this.reload.bind(this)}><img src={banner} alt="Politiquem" /></h1>
          <ul>
            <li><a href="#candidatos" onClick={this.reload.bind(this)}>Candidatos</a></li>
            <li><a href="#temas" onClick={this.changePage.bind(this, 'topics', { pageTopic: null })}>Temas</a></li>
            <li><a href="#nos" onClick={this.changePage.bind(this, 'us')}>Nós</a></li>
            <li><a href="#parceiros" onClick={this.changePage.bind(this, 'partners')}>Parceiros</a></li>
          </ul>
        </header>

        {page}

        <p className="partners">
          <img src={poder360} alt="" title="Poder 360" />
          <img src={poderdeeleger} alt="" title="O Poder de Eleger" />
          <img src={brreport} alt="" title="BRReport" />
          <img src={justificando} alt="" title="Justificando" />
          <img src={chicas} alt="" title="Chicas Poderosas" />
          <img src={check} alt="" title="Check" />
        </p>

        <footer>
          <h1>
            <b>Politiquem</b>
            <a rel="noopener noreferrer" href="https://docs.google.com/forms/d/1MdnFHzb-GUfhc1tfM0BkHHq847HelPhR0e14kPFpIBQ/" target="_blank" title="Ou envie um e-mail para politiquem.brasil@gmail.com"><FontAwesomeIcon icon={faEnvelopeSquare} /></a>
            <a rel="noopener noreferrer" href="https://www.facebook.com/PolitiQuem-481934135550397" target="_blank"><FontAwesomeIcon icon={['fab', 'facebook']} /></a>
            <a rel="noopener noreferrer" href="https://www.instagram.com/politiquem/" target="_blank"><FontAwesomeIcon icon={['fab', 'instagram']} /></a>
            <a rel="noopener noreferrer" href="https://twitter.com/Politi_Quem" target="_blank"><FontAwesomeIcon icon={['fab', 'twitter']} /></a>
          </h1>
          <ul>
            <li className="license"><a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/"><img alt="Licença Creative Commons" style={{ borderWidth: 0 }} src="https://i.creativecommons.org/l/by-nc/4.0/80x15.png" /></a> Este trabalho está licenciado com uma Licença <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons - Atribuição-NãoComercial 4.0 Internacional</a>.</li>
          </ul>
        </footer>
      </div>
    );
  }
}

export default App;
