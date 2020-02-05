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
  SELECT students.id as student_id, students.name as name, cohorts.name as cohort
  FROM students 
  JOIN cohorts ON cohorts.id = cohort_id
  WHERE cohorts.name LIKE '%${arguments[0]}%'
  LIMIT ${arguments[1] || 5};
  `
  )
  .then(res => {
    res.rows.forEach(user => {
      console.log(
        `${user.name} has an id of ${user.student_id} and was in the ${user.cohort} cohort`
      );
    });
  })
  .catch(err => console.error("query error", err.stack));
