require("dotenv").config();

const { Pool } = require("pg");

const arguments = process.argv.slice(2);

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE
});

const queryString = `
SELECT students.id as student_id, students.name as name, cohorts.name as cohort
FROM students 
JOIN cohorts ON cohorts.id = cohort_id
WHERE cohorts.name LIKE $1
LIMIT $2;
`;

const cohortName = arguments[0];
const limit = arguments[1];
const values = [`%${cohortName}%`, limit];

pool
  .query(queryString, values)
  .then(res => {
    res.rows.forEach(user => {
      console.log(
        `${user.name} has an id of ${user.student_id} and was in the ${user.cohort} cohort`
      );
    });
  })
  .catch(err => console.error("query error", err.stack));
