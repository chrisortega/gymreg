const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import the CORS middleware
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true, parameterLimit: 5000 }));

// Database connection
const db = mysql.createConnection({
  host: 'localhost', // Update with your MySQL host
  user: 'root',      // Update with your MySQL username
  password: 'toor',      // Update with your MySQL password
  database: 'gyms'    // Update with your MySQL database name
});

const SECRET_KEY = "secret";

// Set up multer for image upload

const storage = multer.memoryStorage(); // Store images in memory
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});



// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL database.');
});


function generateAccessToken  (userId) {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "7d" });
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Extract token
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Access token missing" });

  // Verify token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    // Attach user to request object
    req.user = user;
    next();
  });
}


function hashPasswordX(password) {
    bcrypt.genSalt(10)
        .then(salt => {
            return bcrypt.hash(password, salt); // Use resolved salt
        })
        .then(hashedPassword => {
           
            return hashedPassword;
        })
        .catch(error => {
            console.error("Error hashing password:", error);
        });
}






app.post('/users', (req, res) => {
  const { name, exp, gym_id } = req.body;
  
  const query = `
    INSERT INTO users (name, exp, gym_id)
    VALUES (?, ?, ?)
  `;
  const values = [name, exp, gym_id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ error: 'Database error.' });
    }

    const insertedId = result.insertId;
    res.status(200).json({ 
      message: 'User inserted successfully.', 
      id: insertedId 
    });
  });
});

// Endpoint to update just the image field
app.put('/update-user-image/:id', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded.');
  }

  const gymId = req.params.id;
  const imageData = req.file.buffer;
  const query = 'UPDATE users SET image = ? WHERE id = ?';
  db.query(query, [imageData, gymId], (err, result) => {
    if (err) {
      console.error('Error updating image:', err);
      return res.status(500).send('Error updating image.');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('User not found.');
    }

    res.status(200).send('image updated successfully');
  });
});;




// Endpoint to update just the image field
app.put('/update-image/:id', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded.');
  }

  const gymId = req.params.id;
  const imageData = req.file.buffer;

  const query = 'UPDATE gym SET image = ? WHERE id = ?';
  db.query(query, [imageData, gymId], (err, result) => {
    if (err) {
      console.error('Error updating image:', err);
      return res.status(500).send('Error updating image.');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Gym not found.');
    }

    res.status(200).send('Image updated successfully');
  });
});;





app.put('/users', authenticateToken, (req, res)=>{
  const { id, name, exp } = req.body;

  if (!id || !name || !exp) {
    return res.status(400).json({ error: 'All fields (id, name, exp) are required.' });
  }
  // Format the date to 'YYYY-MM-DD'
  const formattedExp = new Date(exp).toISOString().split('T')[0];

  // Check if the user already exists
  const checkQuery = 'SELECT * FROM users WHERE id = ?';
  db.query(checkQuery,  [id], (err, results) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json({ error: 'Database error.' });
    }

    if (results.length > 0) {
      // User exists, update the record
      const updateQuery = 'UPDATE users SET name = ?, exp = ? WHERE id = ?';
      db.query(updateQuery, [name, formattedExp, id], (updateErr) => {
        if (updateErr) {
          console.error('Error updating user:', updateErr);
          return res.status(500).json({ error: 'Database error.' });
        }
        res.status(200).json({ message: 'User updated successfully.' });
      });
    } else {

    }
  });
});

// 3. Register a user entry
app.post('/entries', authenticateToken , (req, res) => {
  const { user_id, gym_id } = req.body;
  const query = `INSERT INTO entries (users_id,gym_id) VALUES (?,?)`;
  db.query(query, [user_id, gym_id], (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.status(201).json({ id: results.insertId, user_id, entry_date: new Date().toISOString().split('T')[0] });
  });
});

// 4. Get all gyms
app.get('/gyms', (req, res) => {
  const query = `SELECT * FROM gym`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json(results);
  });
});

// 4. Get all gyms
app.get('/gym/:id', (req, res) => {
  const query = `SELECT * FROM gym WHERE id = ?`;
  const userId = req.params.id;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json(results);
  });
});


// 5. Get all users
app.get('/users', (req, res) => {
  const query = `
    SELECT users.id as id, users.name as name, users.exp as exp, gym.name as gym_name
    FROM users 
    JOIN gym ON users.gym_id = gym.id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json(results);
  });
});

// 6. Get all entries
app.get('/entries', (req, res) => {
  const query = `
    SELECT entries.*, users.name 
    FROM entries 
    JOIN users ON entries.users_id = users.id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json(results);
  });
});

//  Get all entries for today
app.get('/entries', (req, res) => {
    const query = `
      SELECT entries.*, users.name 
      FROM entries 

    `;
    db.query(query, (err, results) => {
      if (err) return res.status(500).send(err.message);
      res.json(results);
    });
  });
  app.get('/entries/today', (req, res) => {
    const { limit = 10, offset = 0 } = req.query;
  
    const query = `
      SELECT entries.*, users.name, users.exp 
      FROM entries 
      JOIN users ON entries.users_id = users.id 
      WHERE DATE(day) = CURDATE()
      LIMIT ? OFFSET ?
    `;
  
    db.query(query, [parseInt(limit), parseInt(offset)], (err, results) => {
      if (err) return res.status(500).send(err.message);
      res.json(results);
    });
  });



  function getadminByEmail(email){
    const query = `
     SELECT admin.*, gym.id as gym_id, gym.image as gym_image, gym.name as gym_name
      FROM admin
      JOIN gym ON admin.id = gym.admin_id
      WHERE admin.email  = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [email], (err, results) => {
        if (err) {
          reject(new Error(err.message));
        } else if (results.length === 0) {
          reject(new Error('User not found'));
        } else {
          resolve(results[0]); // Return the first result since ID is unique
        }
      });
    });

    return res.results
  }


  

  function getUser(userId) {
    const query = `
      SELECT users.*, gym.name as gym_name
      FROM users  
      JOIN gym on users.gym_id = gym.id
      WHERE users.id = ?
    `;
  
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) {
          //reject(new Error(err.message));
          resolve([]);
        } else if (results.length === 0) {
          //reject(new Error('User not found'));
          resolve([]);
        } else {
          resolve(results[0]); // Return the first result since ID is unique
        }
      });
    });
  }



  function getUserEntries(userId) {
    const query = `
   SELECT entries.*, users.*, gym.name as gym_name
      FROM entries
      JOIN users ON entries.users_id = users.id 
      JOIN gym ON entries.gym_id = gym.id 

      WHERE entries.users_id = ?
    `;
  
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) {
          resolve([]);
        } else if (results.length === 0) {
          resolve ([]);
        } else {
          resolve(results); // Return the first result since ID is unique
        }
      });
    });
  }


  app.get('/entries/:id', async (req, res) => {
    const userId = req.params.id;
    const result = await getUserEntries(userId);
    return res.status(200).json(result);


  });
  
// Get a user by  ;;;;;
app.get('/users/:id',   async (req, res) => {
    const userId = req.params.id;
    const user = await getUser(userId);
    return res.status(200).json(user);

  });



  
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
       return  res
        .status(400)
        .json({ error: "Email or Password fields cannot be empty!" });
     
    }
    const user = await getadminByEmail(email);

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );


    if (passwordMatch) {
     return res.status(200).json({
        userId: user.id,
        email: user.email,
        access_token: generateAccessToken(user.userId),     
        image: user.gym_image,
        gym_name: user.gym_name,  
        gym_id: user.gym_id, 
      });
    } else {
     return res.status(401).json({ error: "Invalid credentials" });
    }

   return res.status(400).json({ error: "bad request" });
  });


    app.put('/resetPassword',(req, res) => {
        const { email, password, token } = req.body;

        bcrypt.genSalt(10)
        .then(salt => {
            return bcrypt.hash(password, salt); // Use resolved salt
        })
        .then(hashedPassword => {
        
            const query = `UPDATE admin SET password = ? WHERE email = ?`;

            const params = [hashedPassword, email];
            db.query(query, params, (err, results) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: "Internal server error" });
                }
    
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: "User not found" });
                }
    
                res.json({ message: "Password updated successfully" });
            });

        })
        .catch(error => {
            console.error("Error hashing password:", error);
        });



    } );


    
    
    app.put('/update-user', upload.single('image'), (req, res) => {
      const { id, name, exp, gym_id } = req.body;
      const imageData = req.file ? req.file.buffer : null;
    
      const query = `
        UPDATE gyms.users 
        SET name = ?, exp = ?, gym_id = ?, image = ? 
        WHERE id = ?`;
    
      const params = [name, exp, gym_id];
      if (imageData) params.push(imageData);
      params.push(id);
    
      db.query(query, params, (err, result) => {
        if (err) {
          console.error('Error updating user:', err);
          return res.status(500).send('Error updating user.');
        }
    
        if (result.affectedRows === 0) {
          return res.status(404).send('User not found.');
        }
    
        res.status(200).send('User updated successfully');
      });
    });
    



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
