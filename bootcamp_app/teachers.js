require("dotenv").config();

const { Pool } = require("pg");

const arguments = process.argv.slice(2);

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE
});

pool
  .query(
    `
    SELECT DISTINCT
    teachers.name AS teacher,
    cohorts.name AS cohort
  FROM
    teachers
    JOIN assistance_requests ON teacher_id = teachers.id
    JOIN students ON students.id = student_id
    JOIN cohorts ON cohorts.id = cohort_id
  WHERE
    cohorts.name = '${arguments[0]}'
  GROUP BY
    teachers.name,
    cohorts.name
  ORDER BY
    teachers.name;  
  `
  )
  .then(res => {
    res.rows.forEach(data => {
      console.log(`${data.cohort}: ${data.teacher}`);
    });
  })
  .catch(err => console.error("query error", err.stack));
