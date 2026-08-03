import { Card } from "react-bootstrap";

function DashboardCard({ title, count, icon, color }) {
    return (
        <Card
            className="shadow-sm border-0"
            style={{
                borderLeft: `5px solid ${color}`,
                borderRadius: "12px"
            }}
        >
            <Card.Body>

                <div className="d-flex justify-content-between align-items-center">

                    <div>

                        <h6 className="text-muted">
                            {title}
                        </h6>

                        <h2 className="fw-bold">
                            {count}
                        </h2>

                    </div>

                    <div
                        style={{
                            fontSize: "40px",
                            color: color
                        }}
                    >
                        {icon}
                    </div>

                </div>

            </Card.Body>
        </Card>
    );
}

export default DashboardCard;