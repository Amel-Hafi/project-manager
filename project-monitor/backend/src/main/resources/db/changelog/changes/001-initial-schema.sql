--liquibase formatted sql

--changeset projectmonitor:001-initial-schema

-- Technology Category
CREATE TABLE technology_category (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Technology Item
CREATE TABLE technology_item (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(100),
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    category_id BIGINT NOT NULL REFERENCES technology_category(id),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE INDEX idx_technology_item_category ON technology_item(category_id);
CREATE INDEX idx_technology_item_deleted ON technology_item(deleted);

-- Client
CREATE TABLE client (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE INDEX idx_client_deleted ON client(deleted);

-- Project
CREATE TABLE project (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    client_id BIGINT NOT NULL REFERENCES client(id),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE INDEX idx_project_client ON project(client_id);
CREATE INDEX idx_project_deleted ON project(deleted);

-- Application
CREATE TABLE application (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    project_id BIGINT NOT NULL REFERENCES project(id),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE INDEX idx_application_project ON application(project_id);
CREATE INDEX idx_application_deleted ON application(deleted);

-- Application-Technology join table
CREATE TABLE application_technology (
    application_id BIGINT NOT NULL REFERENCES application(id),
    technology_item_id BIGINT NOT NULL REFERENCES technology_item(id),
    PRIMARY KEY (application_id, technology_item_id)
);

-- Application Repository URLs
CREATE TABLE application_repository (
    application_id BIGINT NOT NULL REFERENCES application(id),
    repository_url VARCHAR(500) NOT NULL
);

CREATE INDEX idx_application_repository_app ON application_repository(application_id);

-- App User
CREATE TABLE app_user (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE INDEX idx_app_user_deleted ON app_user(deleted);

-- Project Assignment
CREATE TABLE project_assignment (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES app_user(id),
    project_id BIGINT NOT NULL REFERENCES project(id),
    role VARCHAR(50) NOT NULL,
    UNIQUE (user_id, project_id, role)
);

CREATE INDEX idx_project_assignment_user ON project_assignment(user_id);
CREATE INDEX idx_project_assignment_project ON project_assignment(project_id);

-- Seed data: Technology Categories
INSERT INTO technology_category (code, name, description) VALUES
    ('PROJECT_TECH', 'Technologies Projet', 'Langages et frameworks utilisés dans le projet'),
    ('WORKSTATION', 'Poste de travail', 'Configuration du poste de travail'),
    ('IDE', 'IDE', 'Environnements de développement intégrés'),
    ('LOCAL_EXECUTION', 'Exécution locale', 'Outils d''exécution locale'),
    ('QUALIFICATION_ENV', 'Environnement de qualification', 'Infrastructure de qualification'),
    ('PRODUCTION_ENV', 'Environnement de production', 'Infrastructure de production'),
    ('CONTAINER_TYPE', 'Conteneurisation', 'Technologies de conteneurisation'),
    ('CI_CD', 'CI/CD', 'Outils d''intégration et déploiement continu'),
    ('AI_TOOL', 'Outils IA', 'Outils d''intelligence artificielle');
