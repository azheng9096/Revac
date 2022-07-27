import './CourseSearch.css';
import CourseItem from './CourseItem';

import { CourseContext } from '../contexts/CourseContext';
import React from 'react';

class CourseSearch extends React.Component {
    static contextType = CourseContext;

    state = {
        year: null,
        semester: null,
        school: "",
        subject: "",

        courses: [],
        query: "",

        mediaMatches : window.matchMedia("(min-width: 768px").matches
    }

    handleInput = event => {
        this.setState({
            query: event.target.value
        })
    }

    componentDidMount() {
        const mediaHandler = e => this.setState({mediaMatches: e.matches});
        window.matchMedia("(min-width: 768px)").addEventListener('change', mediaHandler);
    }

    componentDidUpdate() {
        // Load courses whenever a field updates
        if(this.context.year !== this.state.year || this.context.semester !== this.state.semester || this.context.school !== this.state.school || this.context.subject !== this.state.subject) {
            // update state (tracks previous input)
            this.setState({
                year: this.context.year,
                semester: this.context.semester,
                school: this.context.school,
                subject: this.context.subject
            })
            
            // Check that none of the fields are empty
            if(this.context.year !== null && this.context.semester !== null && this.context.school !== "" && this.context.subject !== "") {
                // fetch API
                fetch(`https://schedge.a1liu.com/${this.context.year}/${this.context.semester}/${this.context.school}/${this.context.subject}?full=true`)
                .then(res => res.json())
                .then(
                  (result) => {
                    result = result.sort((a, b) => a.deptCourseId.localeCompare(b.deptCourseId)); // sort numerically by course id;
                    this.setState({courses: result});
                  }
                );
            } else { // if a field is empty, clear all courses
                this.setState({courses: []});
            }
        }
    }


    filterBtnMediaHandler = () => {
        if (!this.state.mediaMatches) {
            this.context.setFilterOverlayVisible(true);
        }
    }

    render () {
        const { query } = this.state;
        return (
            <div id = "search-results" className = "vh-100">
                <div className = "mx-4 my-4 d-flex">
                    <button id = "filter-btn" className="btn border-0" type="button" data-bs-toggle="collapse" data-bs-target="#course-filter" aria-controls="course-filter" aria-expanded={this.state.mediaMatches} aria-label="Toggle Course Filter"
                    onClick={ this.filterBtnMediaHandler }>
                        <i className="bi bi-funnel"></i>
                    </button>
                    <div className="input-group">
                        <input className="form-control border-end-0 border custom-p-size" type="search" placeholder="Search Course Title or Course Code..." id="example-search-input"
                            onChange={ this.handleInput }/>
                        <span className="input-group-text bg-white ms-n5">
                            <button className="btn btn-outline-secondary bg-white border-0 p-0" type="button" disabled>
                                <i className="bi bi-search"></i>
                            </button>
                        </span>
                    </div>
                </div>
                
                {(this.state.courses)
                    .filter(course => {
                        const courseCode = course.subjectCode.code + "-" + course.subjectCode.school + " " + course.deptCourseId ;

                        // return course if query is empty, or if query exists in course name or course code
                        if (query === "" || course.name.toLowerCase().includes(query.toLowerCase()) || courseCode.toLowerCase().includes(query.toLowerCase())) {
                            return course;
                        }

                        return false;
                    }) 
                    .map(course => (
                        <CourseItem key={course.deptCourseId} {...course} />
                    ))}
            </div>
        );
    }
}

export default CourseSearch;
