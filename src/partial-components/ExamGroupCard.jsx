import { Link } from "react-router-dom";

function ExamGroupCard(props) {
    return(
        <>
            <div>
                <Link to={`/exam-group/${props.id}`}>
                    <div className="card">
                        <p className="title">{props.title}</p>
                        <p className="description">{props.description}</p>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default ExamGroupCard;