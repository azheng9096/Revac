import './Section.css';

import React, { useContext } from 'react';
import SectionItem from './SectionItem';

import { CourseContext } from '../contexts/CourseContext';

function Section() {
    const {  sectionOverlayVisible, setSectionOverlayVisible, 
        selectedCourseCode, selectedSections } = useContext(CourseContext);

    // handle overlay
    const closeSectionBtnHandler = () => {
        setSectionOverlayVisible(false);
    }


    return(
        <div className = {(sectionOverlayVisible ? "overlayFadeIn" : "overlayFadeOut") + " overlay"} id = "section-overlay">
            <div className = "course-sections p-4 bg-white rounded">

                <div className = "d-flex border-bottom">
                    <div id = "sections-text">
                        <h5 className = "custom-fs-5">{ selectedCourseCode } Sections</h5>
                        <p className = "custom-small text-muted">Showing {selectedSections.length} Results</p>
                    </div>
                    <i className = "bi bi-x ms-auto" style = {{fontSize: "2em"}} id="section-close-btn"
                    onClick={ closeSectionBtnHandler }></i>
                </div>

                {selectedSections.map(section => (
                    <SectionItem key={section.registrationNumber} {...section} />
                ))}

            </div>
        </div>
    );

}

export default Section;