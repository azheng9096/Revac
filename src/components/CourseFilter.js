import React from 'react';
import './CourseFilter.css';

import { CourseContext } from '../contexts/CourseContext';

export default class CourseFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year : null,
      semester : null,
      school : "",
      subject : "",

      schoolErr : null,
      schoolIsLoaded : false,
      schoolItems : [],

      subjectErr : null,
      subjectIsLoaded : false,
      subjectItems : [],

      mediaMatches : window.matchMedia("(min-width: 768px").matches
    }
  }

  static contextType = CourseContext;

  // handle radio/select changes
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name] : value });
  }

  handleClick = () => {
    const { year, semester, school, subject } = this.state
    this.context.setParameters(year, semester, school, subject);
  }

  // handle overlay
  closeFilterBtnMediaHandler = () => {
    if (!this.state.mediaMatches) {
      this.context.setFilterOverlayVisible(false);
    }
  }


  componentDidMount() {
    const mediaHandler = e => this.setState({mediaMatches: e.matches});
    window.matchMedia("(min-width: 768px)").addEventListener('change', mediaHandler);

    fetch("https://schedge.a1liu.com/schools")
      .then(res => res.json())
      .then(
        (result) => {
          // result currently { {"Code" : {name : "Name"}}, {}, ... }
          // transform into [ {code : "Code", name : "Name"}, {}, ...]
          const schools = Object.entries(result).map(([code, obj]) => ({code, ...obj}))
          .sort((a, b) => a.name.localeCompare(b.name)); // sort alphabetically by name;

          this.setState({
            schoolIsLoaded : true,
            schoolItems : schools
          });
        },
        // Handle errors
        (error) => {
          this.setState({
            schoolIsLoaded : true,
            schoolErr : error
          });
        }
      )
  }

  componentDidUpdate(prevProps, prevState) {
    // hide mobile/tablet filter overlay in case screen changes to desktop view while filter (w overlay) is still open
    if(this.state.mediaMatches !== prevState.mediaMatches) {
      if (this.state.mediaMatches) {
        this.context.setFilterOverlayVisible(false);
      }
    }

    // Load subjects when school is chosen
    if(this.state.school !== prevState.school) {
      // if subject is chosen, but school is then changed, selected subject needs to be reset
      this.setState({subject : ""});

      if (this.state.school === "") {
        this.setState({
          subjectIsLoaded : false,
          subjectItems : [],
        });
      } else {
        // fetch API
        fetch("https://schedge.a1liu.com/subjects")
          .then(res => res.json())
          .then(
            (result) => {
              let subjects = [];

              // check if school is in subject results - note that ND school is not in results
              if (this.state.school in result) {
                // result[this.state.school] currently { {"Code" : {name : "Name"}}, {}, ... }
                // transform into [ {code : "Code", name : "Name"}, {}, ...]
                subjects = Object.entries(result[this.state.school]).map(([code, obj]) => ({code, ...obj}))
                .sort((a, b) => a.name.localeCompare(b.name)); // sort alphabetically by name
              }
              
              this.setState({
                subjectIsLoaded : true,
                subjectItems : subjects
              });
            }
          )
      }
    }
  }

  render() {
    const { schoolItems, subjectItems } = this.state;

    return (
      <>
        <div className = {(this.context.filterOverlayVisible ? "overlayFadeIn " : "overlayFadeOut ") + "overlay"}></div>
        <div className={"collapse collapse-horizontal" + (this.state.mediaMatches ? " show" : " hide")} id = "course-filter">
          <i className="bi bi-x position-absolute p-2 top-0 end-0" id="filter-close-btn" 
            type="button" data-bs-toggle="collapse" data-bs-target="#course-filter" aria-controls="course-filter" 
            aria-expanded={this.state.mediaMatches} aria-label="Toggle Course Filter"
            onClick={this.closeFilterBtnMediaHandler}></i>
    
          <div className="flex-shrink-0 p-3 bg-white" style={{width: 280 + 'px'}}>
            <a href="" className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" fill="currentColor" className="bi bi-filter" viewBox="0 0 16 16">
                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
              </svg>
              <span className="ms-1 fs-5 fw-semibold">Course Filter</span>
            </a>
    
            <ul className="list-unstyled ps-0">
    
              <li className="mb-1">
                <button className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed" data-bs-toggle="collapse" data-bs-target="#year-collapse" aria-expanded="true">
                  Year
                </button>
                
                <div className="collapse show" id="year-collapse">
                  <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li>
                      <div className="form-check d-inline-flex rounded">
                        <input className="form-check-input" type="radio" name="year" id="year1"
                          value = {( 
                            // getMonth() returns 0-11
                            (new Date().getMonth() >= 10) ? 
                            (new Date().getFullYear() + 1) : 
                            new Date().getFullYear()
                          )}
                          onChange = { this.handleChange }
                        />
                        <label className="form-check-label" htmlFor="year1">
                          {( 
                            (new Date().getMonth() >= 10) ? 
                            (new Date().getFullYear() + 1) : 
                            new Date().getFullYear()
                          )}
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="form-check d-inline-flex rounded">
                        <input className="form-check-input" type="radio" name="year" id="year2"
                          value = {(
                            (new Date().getMonth() >= 10) ?
                            new Date().getFullYear() :
                            (new Date().getFullYear() - 1)
                          )}
                          onChange = { this.handleChange }
                        />
                        <label className="form-check-label" htmlFor="year2">
                          {(
                            (new Date().getMonth() >= 10) ?
                            new Date().getFullYear() :
                            (new Date().getFullYear() - 1)
                          )}
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
    
              <li className="mb-1">
                <button className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed" data-bs-toggle="collapse" data-bs-target="#semester-collapse" aria-expanded="false">
                  Semester
                </button>
    
                <div className="collapse" id="semester-collapse">
                  <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li className="rounded">
                      <div className="form-check d-inline-flex rounded">
                        <input className="form-check-input" type="radio" name="semester" id="fall"
                          value="fa" onChange = { this.handleChange }
                        />
                        <label className="form-check-label" htmlFor="fall">
                          Fall
                        </label>
                      </div>
                    </li>
                    <li className="rounded">
                      <div className="form-check d-inline-flex rounded">
                        <input className="form-check-input" type="radio" name="semester" id="summer"
                          value="su" onChange = { this.handleChange }
                        />
                        <label className="form-check-label" htmlFor="summer">
                          Summer
                        </label>
                      </div>
                    </li>
                    <li className="rounded">
                      <div className="form-check d-inline-flex rounded">
                        <input className="form-check-input" type="radio" name="semester" id="spring"
                          value="sp" onChange = { this.handleChange }
                        />
                        <label className="form-check-label" htmlFor="spring">
                          Spring
                        </label>
                      </div>
                    </li>
                    <li className="rounded">
                      <div className="form-check d-inline-flex rounded">
                        <input className="form-check-input" type="radio" name="semester" id="winter"
                          value="ja" onChange = { this.handleChange }
                        />
                        <label className="form-check-label" htmlFor="winter">
                          Winter
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="my-3">
                <div className="form-floating">
                  <select className="sidebar-select-alt form-select" name="school" id="school-select" aria-label="Floating label select example" 
                  onChange={this.handleChange} value={this.state.school}>
                    <option value="">---</option>
                    {schoolItems.map(school => (
                      <option key={school.code} value={school.code}> {school.name} </option>
                    ))}
                  </select>
                  <label htmlFor="floatingSelect fw-semibold">School Select</label>
                </div>
              </li>
              
              <li className="my-3">
                <div className="form-floating">
                  <select className="sidebar-select-alt form-select" name="subject" id="floatingSelect" aria-label="Floating label select example" 
                  disabled={this.state.school === "" ? true : false} onChange={this.handleChange} value={this.state.subject}>
                    <option value="">---</option>
                    {subjectItems.map(subject => (
                      <option key={subject.code} value={subject.code}> {subject.name} </option>
                    ))}
                  </select>
                  <label htmlFor="floatingSelect fw-semibold">Subject Select</label>
                </div>
              </li>

              <li className="my-3">
                <div className="d-grid gap-2 d-block">
                  <button className="btn btn-sm fw-semibold" id="filter-btn" type="button"
                  disabled={(this.state.year === null || this.state.semester === null || this.state.school === "" || this.state.subject === "") ? true : false}
                  onClick={ this.handleClick }>
                    Search
                  </button>
                </div>
              </li>
    
              
    
            </ul>
          </div>
        </div>
      </>
    );
  }
}
