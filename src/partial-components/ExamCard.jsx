import { Link } from "react-router-dom";
import { formatDate } from "../javascript/dateConverter";

function ExamCard(props) {
    return(
        <>
            <div>
                <Link to={`/exam-group/${props.groupId}/exam/${props.id}`}>
                    <h2>{props.title}</h2>
                    <p>{props.description}</p>
                    <p>Start time: {formatDate(props.startTime)}</p>
                    <p>End time: {formatDate(props.endTime)}</p>
                </Link>
            </div>
        </>
    )
}

export default ExamCard;