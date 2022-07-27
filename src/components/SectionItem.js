import './SectionItem.css';

import { useState } from 'react';

function SectionItem(props) {
    const parseDate = (str) => {
        str.replace(" ", "T"); // convert to ISO8601-compliant date (YYYY-MM-DDTHH:MM:SS)
        const dt = new Date(str); // Date will work reliably with ISO8601-compliant date
        return dt;
    }

    const getDayName = (dateStr) => {
        const dateObj = parseDate(dateStr);
        return dateObj.toLocaleDateString("en-US", { weekday: 'short'});
    }

    const generateTime = (meetings) => {
        if (meetings === null) {
            return <b>N/A</b>
        }

        /* - To figure out which day for meeting time (ex. Tues/Thurs), take all the [beginDate]
            (there may be multiple) for a section and figure out which day of the week it is 
            - To figure out the time (ex. XX:XX XM - XX:XX XM), take the [beginDate] for a section, 
            look at the time portion, and add the minutesDuration to the time portion (to get the ending time).
        */

        const dateObj = parseDate(meetings[0].beginDate); // begin date object
        const beginTime = dateObj.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

        // modifies date object to display end time
        dateObj.setMinutes(dateObj.getMinutes() + meetings[0].minutesDuration);
        const endTime = dateObj.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

        const meetingWeekday = meetings.map((meeting, index) => (
            (index ? "/" : '') + getDayName(meeting.beginDate)
        ));

        return (
            <>
                <b>{beginTime} - {endTime}</b> on <b>{meetingWeekday}</b>
            </>
        );
    }


    const limit = 200, 
        text = ("notes" in props && "prerequisites" in props ? 
            (("notes" in props ? props.notes + "\n\n" : "") + ("prerequisites" in props ? props.prerequisites : "")) 
            : "No additional information available.");
    const [displayReadMore] = useState(text.length > limit);
    
    const [readMoreTextVisible, setReadMoreTextVisible] = useState(false);

    const readMoreText = () => {        
        if (text.length > limit) {
            // white-space: pre-wrap or pre-line will break line on \n and wrap text according to parent width
            return (
                <p className="section-description text-muted custom-small mb-0" style={{padding: 0, whiteSpace: "pre-wrap"}}>
                    {text.substring(0, limit + 1)}
                    <span className={"expand-dots" + (readMoreTextVisible ? " d-none" : "")}>...</span>

                    <span className={"expand-text" + (readMoreTextVisible ? "" : " d-none")}>
                        {text.substring(limit + 1)}
                    </span>
                </p>
            )
        }

        return (
            <p className="section-description text-muted custom-small" style={{padding: 0}}>
                {text}
            </p>
        )
    }

    const toggleReadMore = () => {
        setReadMoreTextVisible(!readMoreTextVisible);
    }

    return (
        <div className="course-section border-bottom py-4">

            <div className="section-heading d-flex align-items-center">
                <div className="section-info">
                    <div className="d-flex flex-column-reverse flex-md-row align-items-md-center mb-2">
                        <h5 className="section-name me-3 mb-0 custom-fs-5">{props.name}</h5>
                        <div className="section-badges d-flex align-items-center">
                            <span className="badge text-bg-theme-prime me-2 custom-badge-size">{props.type}</span>
                            <span className="badge text-bg-secondary me-2 custom-badge-size">Section {props.code}</span>
                            <span className="badge text-bg-secondary me-2 custom-badge-size">Reg #{props.registrationNumber}</span>
                        </div>
                    </div>
                    <p className="section-instructors text-uppercase custom-small fw-semibold mb-0">
                        {props.instructors.map((instructor, index) => (
                            (index ? ", " : '') + instructor
                        ))}
                    </p>
                </div>

                {/* <button className="add-section-btn btn ms-auto"> + Add Section </button> */}

            </div>

            <div className="section-details d-flex custom-small">
                <p className="section-time me-4">Time: {generateTime(props.meetings)}</p>
                <p className="section-mode me-4">Mode: <b>{props.instructionMode}</b></p>
                <p className="section-loc me-4">Location: <b>{props.location} ({props.campus})</b></p>
                <p className="section-status me-4">Status: <b>{props.status}</b></p>
            </div>

            <div className="section-text">
                {readMoreText()}
            </div>

            <button className={"section-read-more btn d-flex ms-auto custom-small border-0 fw-semibold"
                + (displayReadMore ? "" : " d-none")} onClick={() => toggleReadMore()}>
                {readMoreTextVisible ? "Read Less" : "Read More"}
            </button>

        </div>
    )
}

export default SectionItem;