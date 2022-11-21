SELECT r.id,
       r.title, 
       d.name AS department, 
       CONCAT ('$',FORMAT(r.salary,'en_US')) AS salary 
FROM role r LEFT JOIN department d 
ON r.department_id = d.id
ORDER BY d.id, r.salary DESC