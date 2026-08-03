import MainLayout from "../../layouts/MainLayout";

function ProjectMembers() {

    return (

        <MainLayout>

            <div className="container mt-4">

                <div className="card shadow">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <h3>Project Members</h3>

                            <button className="btn btn-primary">
                                + Assign Member
                            </button>

                        </div>

                        <table className="table table-bordered table-hover">

                            <thead className="table-primary">

                                <tr>

                                    <th>ID</th>
                                    <th>Project</th>
                                    <th>Employee</th>
                                    <th>Role</th>
                                    <th>Assigned Date</th>
                                    <th>Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                <tr>

                                    <td colSpan="6" className="text-center">

                                        No Members Assigned

                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </MainLayout>

    );

}

export default ProjectMembers;