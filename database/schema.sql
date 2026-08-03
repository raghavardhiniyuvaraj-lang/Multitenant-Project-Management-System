CREATE DATABASE multitenant_pm;

CREATE TABLE tenants (
    tenant_id SERIAL PRIMARY KEY,
    tenant_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    subscription_plan VARCHAR(50) DEFAULT 'Free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES tenants(tenant_id),
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES tenants(tenant_id),
    project_name VARCHAR(200),
    description TEXT,
    status VARCHAR(50),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(project_id),
    assigned_to INT REFERENCES users(user_id),
    title VARCHAR(200),
    description TEXT,
    status VARCHAR(50),
    priority VARCHAR(50),
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE files (
    file_id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES tenants(tenant_id),
    uploaded_by INT REFERENCES users(user_id),
    file_name VARCHAR(255),
    file_url TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES tenants(tenant_id),
    department_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);