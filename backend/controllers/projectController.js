const pool = require("../config/db");

// =====================================================
// CREATE PROJECT
// =====================================================

exports.createProject = async (req, res) => {
    try {
        // Get tenant from JWT
        const tenantId = req.user.tenantId;

        if (!tenantId) {
            return res.status(401).json({
                success: false,
                message: "Tenant information missing from token"
            });
        }

        const {
            project_name,
            description,
            start_date,
            end_date,
            status
        } = req.body;

        // ---------------------------------------------
        // Validate project name
        // ---------------------------------------------

        if (!project_name || !project_name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Project Name is required"
            });
        }

        const cleanProjectName = project_name.trim();

        // ---------------------------------------------
        // Validate dates
        // ---------------------------------------------

        if (
            start_date &&
            end_date &&
            new Date(start_date) > new Date(end_date)
        ) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date"
            });
        }

        // ---------------------------------------------
        // Check duplicate project
        // ONLY INSIDE CURRENT TENANT
        // ---------------------------------------------

        const existingProject = await pool.query(
            `
            SELECT project_id
            FROM projects
            WHERE tenant_id = $1
            AND LOWER(TRIM(project_name)) = LOWER(TRIM($2))
            `,
            [
                tenantId,
                cleanProjectName
            ]
        );

        if (existingProject.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Project already exists"
            });
        }

        // ---------------------------------------------
        // Insert project
        // ---------------------------------------------

        const result = await pool.query(
            `
            INSERT INTO projects
            (
                tenant_id,
                project_name,
                description,
                start_date,
                end_date,
                status
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [
                tenantId,
                cleanProjectName,
                description?.trim() || null,
                start_date || null,
                end_date || null,
                status || "Active"
            ]
        );

        res.status(201).json({
            success: true,
            message: "Project Added Successfully",
            project: result.rows[0]
        });

    } catch (err) {
        console.error("CREATE PROJECT ERROR:", err);

        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }
};


// =====================================================
// GET PROJECTS
// =====================================================

exports.getProjects = async (req, res) => {
    try {
        // Get tenant from JWT
        const tenantId = req.user.tenantId;

        console.log(
            "GET PROJECTS - Logged in tenantId:",
            tenantId
        );

        if (!tenantId) {
            return res.status(401).json({
                success: false,
                message: "Tenant information missing from token"
            });
        }

        const result = await pool.query(
            `
            SELECT
                project_id,
                tenant_id,
                project_name,
                description,
                start_date,
                end_date,
                status,
                created_at
            FROM projects
            WHERE tenant_id = $1
            ORDER BY project_id DESC
            `,
            [
                tenantId
            ]
        );

        console.log(
            "Projects returned for tenant:",
            tenantId,
            result.rows
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            projects: result.rows
        });

    } catch (err) {
        console.error("GET PROJECTS ERROR:", err);

        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }
};


// =====================================================
// UPDATE PROJECT
// =====================================================

exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;

        const tenantId = req.user.tenantId;

        if (!tenantId) {
            return res.status(401).json({
                success: false,
                message: "Tenant information missing from token"
            });
        }

        const {
            project_name,
            description,
            start_date,
            end_date,
            status
        } = req.body;

        // ---------------------------------------------
        // Validate project name
        // ---------------------------------------------

        if (!project_name || !project_name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Project Name is required"
            });
        }

        const cleanProjectName = project_name.trim();

        // ---------------------------------------------
        // Validate dates BEFORE UPDATE
        // ---------------------------------------------

        if (
            start_date &&
            end_date &&
            new Date(start_date) > new Date(end_date)
        ) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date"
            });
        }

        // ---------------------------------------------
        // Check duplicate project
        // ONLY INSIDE CURRENT TENANT
        // ---------------------------------------------

        const existingProject = await pool.query(
            `
            SELECT project_id
            FROM projects
            WHERE tenant_id = $1
            AND LOWER(TRIM(project_name))
                = LOWER(TRIM($2))
            AND project_id <> $3
            `,
            [
                tenantId,
                cleanProjectName,
                id
            ]
        );

        if (existingProject.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Project already exists"
            });
        }

        // ---------------------------------------------
        // Update project
        // tenant_id prevents cross-tenant editing
        // ---------------------------------------------

        const result = await pool.query(
            `
            UPDATE projects
            SET
                project_name = $1,
                description = $2,
                start_date = $3,
                end_date = $4,
                status = $5
            WHERE project_id = $6
            AND tenant_id = $7
            RETURNING *
            `,
            [
                cleanProjectName,
                description?.trim() || null,
                start_date || null,
                end_date || null,
                status || "Active",
                id,
                tenantId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Project Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Project Updated Successfully",
            project: result.rows[0]
        });

    } catch (err) {
        console.error("UPDATE PROJECT ERROR:", err);

        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }
};


// =====================================================
// DELETE PROJECT
// =====================================================

exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const tenantId = req.user.tenantId;

        if (!tenantId) {
            return res.status(401).json({
                success: false,
                message: "Tenant information missing from token"
            });
        }

        // ---------------------------------------------
        // Delete ONLY from current tenant
        // ---------------------------------------------

        const result = await pool.query(
            `
            DELETE FROM projects
            WHERE project_id = $1
            AND tenant_id = $2
            RETURNING *
            `,
            [
                id,
                tenantId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Project Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Project Deleted Successfully"
        });

    } catch (err) {
        console.error("DELETE PROJECT ERROR:", err);

        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }
};