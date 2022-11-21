SELECT d.name, CONCAT ('$',FORMAT(SUM(r.salary),'en_US')) AS departmental_budget
FROM employee e
LEFT JOIN role r
ON e.role_id = r.id
LEFT JOIN department d
ON r.department_id = d.id
WHERE d.id = ?
GROUP BY d.id