import React from 'react';

export const CourseContext = React.createContext();

export default class CourseContextProvider extends React.Component { 
    state = {
        year : null,
        semester : null,
        school : "",
        subject : "",

        filterOverlayVisible : false, 
        sectionOverlayVisible : false,
        
        selectedCourseCode : "",
        selectedSections : []
    }

    setAPIParameters = (yearVal, semesterVal, schoolVal, subjectVal) => {
        this.setState({
            year: yearVal,
            semester: semesterVal,
            school: schoolVal,
            subject: subjectVal
        })
    }

    setFilterOverlayVisible = (val) => {
        this.setState({filterOverlayVisible : val});
    }

    setSectionOverlayVisible = (val) => {
        this.setState({sectionOverlayVisible : val});
    }

    setSelectedCourse = (courseCode, sections) => {
        this.setState({
            selectedCourseCode: courseCode,
            selectedSections: sections
        });
    }

    render () {
        return (
            <CourseContext.Provider value={{ ...this.state, setParameters: this.setAPIParameters, 
            setFilterOverlayVisible: this.setFilterOverlayVisible, 
            setSectionOverlayVisible: this.setSectionOverlayVisible, 
            setSelectedCourse: this.setSelectedCourse}}>
                { this.props.children }
            </CourseContext.Provider>
        );
    }
}