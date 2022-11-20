USE employee_db;

INSERT INTO department (name)
VALUES ('Executive'),
       ('Quality'),
       ('Operations'),
       ('Engineering'),
       ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Director',120000,1),
       ('Quality Lead',90000,2),
       ('Quality Officer',85000,2),
       ('Ops Lead',90000,3),
       ('Ops Analyst',70000,3),
       ('Lead Engineer',80000,4),
       ('Software Engineer',75000,4),
       ('Legal Team Lead',115000,5),
       ('Lawyer',100000,5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Cedric','Nelson',1,NULL),
       ('Shigeru','Honda',2,NULL),
       ('Derek','Sherman',3,2),
       ('Susannah','Price',4,NULL),
       ('Jim','Buchner',5,4),
       ('Lydia','Serner',6,NULL),
       ('Marina','Ngogi',7,6),
       ('Addie','Park',7,6),
       ('John','Riesling',8,NULL),
       ('Harris','Bandersnatch',9,9);