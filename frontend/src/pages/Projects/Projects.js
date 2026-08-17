import { useEffect, useState } from "react";
import { Button, Table, Card } from "react-bootstrap";

import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import { toast } from "react-toastify";

import AddProjectModal from "./AddProjectModal";
import EditProjectModal from "./EditProjectModal";

import "./Projects.css";

function Projects() {

    const [projects, setProjects] = useState([]);

    const [showAdd, setShowAdd] = useState(false);

    const [showEdit, setShowEdit] = useState(false);

    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {

        fetchProjects();

    }, []);

    const fetchProjects = async () => {

        try {

            const res = await api.get("/projects");

            setProjects(res.data.projects);

        } catch (err) {
    console.log(err);

    toast.error(
        err.response?.data?.message ||
        "Failed to load projects"
    );
}

    };

    const deleteProject = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/projects/${id}`);

            toast.success("Project Deleted Successfully");

            fetchProjects();

        } catch (err) {

            toast.error(
    err.response?.data?.message || "Something went wrong"
);

        }

    };

    return (

        <MainLayout>

<div className="page-header">
    <h2>📁 Projects</h2>
    <p>Create and manage all company projects.</p>
</div>

{/* Project Table */}



            <Card className="shadow-sm">

                <Card.Body>

                    <div className="project-header">

                        <h3>Projects</h3>

                        <Button
                            onClick={() => setShowAdd(true)}
                        >
                            + Add Project
                        </Button>

                    </div>

                    <Table striped bordered hover responsive>

                        <thead>

                            <tr>

                                <th>ID</th>
                                <th>Project Name</th>
                                <th>Description</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {projects.map((project) => (

                                <tr key={project.project_id}>

                                    <td>{project.project_id}</td>

                                    <td>{project.project_name}</td>

                                   <td className="description-cell">
    {project.description}
</td>
                                     <td>
        {project.start_date
            ? new Date(project.start_date).toLocaleDateString()
            : "-"}
    </td>

    <td>
        {project.end_date
            ? new Date(project.end_date).toLocaleDateString()
            : "-"}
    </td>
                                    <td>

    <span
    className={`badge ${
        project.status === "Active"
            ? "bg-success"
            : project.status === "Completed"
            ? "bg-primary"
            : project.status === "On Hold"
            ? "bg-warning text-dark"
            : "bg-danger"
    }`}
>
    {project.status}
</span>

</td>

                                    <td>
<Button
    className="theme-btn action-btn"
    onClick={() => {
        setSelectedProject(project);
        setShowEdit(true);
    }}
>
    Edit
</Button>

{" "}

<Button
    variant="danger"
    className="action-btn"
    onClick={() => deleteProject(project.project_id)}
>
    Delete
</Button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </Table>

                </Card.Body>

            </Card>

            <AddProjectModal

                show={showAdd}

                handleClose={() => setShowAdd(false)}

                refresh={fetchProjects}

            />

            <EditProjectModal

                show={showEdit}

                handleClose={() => setShowEdit(false)}

                refresh={fetchProjects}

                project={selectedProject}

            />

        </MainLayout>

    );

}

export default Projects;