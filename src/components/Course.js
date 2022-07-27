import React from 'react';

import './Course.css';
import CourseFilter from './CourseFilter';
import CourseSearch from './CourseSearch'
import Section from './Section';

import CourseContextProvider from '../contexts/CourseContext'

class Course extends React.Component {
  render () {
    return (  
      <div id = "course-search" className = "d-flex">
        <CourseContextProvider>
          <CourseFilter />
          <CourseSearch />
          <Section />
        </CourseContextProvider>
      </div>
    );
  }
}

export default Course;
