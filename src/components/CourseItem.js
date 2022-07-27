import './CourseItem.css';

import { CourseContext } from '../contexts/CourseContext';
import { useContext } from 'react';

function CourseItem(props) {
    const { setSectionOverlayVisible, setSelectedCourse } = useContext(CourseContext);
    const courseCode = props.subjectCode.code + "-" + props.subjectCode.school + " " + props.deptCourseId;
    const courseCodeTrigger = props.subjectCode.code + props.subjectCode.school + props.deptCourseId + "-collapse" ;

    const viewSectionHandler = () => {
        setSelectedCourse(courseCode, props.sections);
        setSectionOverlayVisible(true);
    }

    return (
        <div className = "course custom-course-px py-2">
            <div className = "course-res custom-p-4 rounded">
                <div className = "heading d-flex align-items-center flex-column flex-sm-row">

                    <div className = "text">
                        <h5 className = "custom-fs-5 text-center text-sm-start"> {props.name} </h5>
                        <div className = "d-flex align-items-center justify-content-center justify-content-sm-start">
                            <p className = "mb-0 fw-semibold custom-p-size"> {props.subjectCode.code}-{props.subjectCode.school} {props.deptCourseId} </p>
                            <p className = "mb-0 fw-semibold custom-p-size">&nbsp;&#8226;&nbsp;</p>
                            <button className = "course-desc-toggle btn d-inline-flex align-items-center p-0 border-0 fw-semibold custom-p-size" 
                                data-bs-toggle="collapse" data-bs-target={"#" + courseCodeTrigger} aria-expanded="false">
                                Toggle Description
                            </button>
                        </div>
                    </div>

                    <div className = "heading-right d-flex ms-sm-auto mt-3 mt-sm-0">
                        <button className = "btn view-section-btn" onClick={ viewSectionHandler }> View Sections </button>
                    </div>

                </div>


                <div className = "course-desc collapse custom-small" id={courseCodeTrigger}>
                    <hr/>
                    {"description" in props ? props.description : "No description available for this course."}
                </div>

            </div>

        </div>
    );
}

export default CourseItem;