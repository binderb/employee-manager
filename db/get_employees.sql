SELECT e.id,
       e.first_name, 
       e.last_name, 
       r.title, 
       d.name AS department, 
       CONCAT ('$',FORMAT(r.salary,'en_US')) AS salary,
       IFNULL (CONCAT(m.first_name,' ',m.last_name),'-') AS manager
FROM employee e 
LEFT JOIN role r 
ON e.role_id = r.id 
LEFT JOIN department d 
ON r.department_id = d.id
LEFT JOIN employee m
ON e.manager_id = m.id
ORDER BY d.name, r.salary DESC, e.last_name, e.first_name