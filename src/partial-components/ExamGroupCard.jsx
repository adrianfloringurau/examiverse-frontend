import { Link } from "react-router-dom";

function ExamGroupCard(props) {
    return(
        <>
            <div>
                <Link to={`/exam-group/${props.id}`}>
                    <h2>{props.title}</h2>
                    <p>{props.description}</p>
                </Link>
            </div>
        </>
    )
}

export default ExamGroupCard;