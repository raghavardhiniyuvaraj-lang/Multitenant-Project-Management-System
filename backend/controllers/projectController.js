const pool = require("../config/db");

// ================= CREATE PROJECT =================

exports.createProject = async (req, res) => {

    try {

        const tenant_id = req.user.tenantId;

        const {
            project_name,
            description,
            start_date,
            end_date,
            status
        } = req.body;

        const result = await pool.query(
            `INSERT INTO projects
            (tenant_id,project_name,description,start_date,end_date,status)
            VALUES($1,$2,$3,$4,$5,$6)
            RETURNING *`,
            [
                tenant_id,
                project_name,
                description,
                start_date,
                end_date,
                status || "Active"
            ]
        );

        res.status(201).json({
            success: true,
            message: "Project Added Successfully",
            project: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ================= GET PROJECTS =================

exports.getProjects = async (req, res) => {

    try {

        const tenant_id = req.user.tenantId;

        const result = await pool.query(
            `SELECT *
             FROM projects
             WHERE tenant_id=$1
             ORDER BY project_id DESC`,
            [tenant_id]
        );

        res.json({
            success: true,
            count: result.rows.length,
            projects: result.rows
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ================= UPDATE PROJECT =================

exports.updateProject = async (req, res) => {

    try {

        const { id } = req.params;

        const tenant_id = req.user.tenantId;

        const {
            project_name,
            description,
            start_date,
            end_date,
            status
        } = req.body;

        const result = await pool.query(
            `UPDATE projects
             SET project_name=$1,
                 description=$2,
                 start_date=$3,
                 end_date=$4,
                 status=$5
             WHERE project_id=$6
             AND tenant_id=$7
             RETURNING *`,
            [
                project_name,
                description,
                start_date,
                end_date,
                status,
                id,
                tenant_id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Project Not Found"
            });
        }

        res.json({
            success: true,
            message: "Project Updated Successfully",
            project: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ================= DELETE PROJECT =================

exports.deleteProject = async (req, res) => {

    try {

        const { id } = req.params;

        const tenant_id = req.user.tenantId;

        const result = await pool.query(
            `DELETE FROM projects
             WHERE project_id=$1
             AND tenant_id=$2
             RETURNING *`,
            [id, tenant_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Project Not Found"
            });
        }

        res.json({
            success: true,
            message: "Project Deleted Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};