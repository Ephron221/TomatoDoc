-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS tomatodoc;
USE tomatodoc;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  profile_image VARCHAR(255),
  password_hash VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  role ENUM('farmer','admin') DEFAULT 'farmer',
  otp VARCHAR(6),
  otp_expires_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  plan ENUM('trial','daily','weekly','biweekly','monthly'),
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  images_used_today INT DEFAULT 0,
  last_image_date DATE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  full_name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  plan ENUM('daily','weekly','biweekly','monthly'),
  amount INT,
  payment_method ENUM('mobile_money','bank'),
  proof_file VARCHAR(255),
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- CHAT SESSIONS
CREATE TABLE IF NOT EXISTS chat_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  title VARCHAR(150),
  language ENUM('en','rw') DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- CHAT MESSAGES
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id INT,
  sender ENUM('user','ai'),
  message_type ENUM('text','image','voice'),
  content TEXT,
  image_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);

-- DETECTION RESULTS
CREATE TABLE IF NOT EXISTS detection_results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  message_id INT,
  disease_name VARCHAR(100),
  severity ENUM('low','moderate','high','critical'),
  diagnosis TEXT,
  possible_causes TEXT,
  prevention_tips TEXT,
  confidence_score DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE
);

-- EXPERTS
CREATE TABLE IF NOT EXISTS experts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100),
  photo VARCHAR(255),
  description TEXT,
  email VARCHAR(100),
  whatsapp VARCHAR(20),
  phone VARCHAR(20),
  specialization VARCHAR(100)
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  target ENUM('admin','user'),
  user_id INT NULL,
  title VARCHAR(150),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- CONTACTS
CREATE TABLE IF NOT EXISTS contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  subject VARCHAR(150),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA FOR EXPERTS
INSERT IGNORE INTO experts (id, full_name, specialization, description, email, whatsapp, phone) VALUES 
(1, 'Dr. Jean Damascene', 'Plant Pathology', 'Expert in tomato fungal diseases with 15 years experience at RAB.', 'jean.d@tomatodoc.rw', '+250788111222', '+250788111222'),
(2, 'Ing. Marie Claire', 'Agronomy', 'Specialist in sustainable farming and organic pest control in Huye.', 'marie.c@tomatodoc.rw', '+250788333444', '+250788333444'),
(3, 'Paul Mutabazi', 'Soil Science', 'Helping farmers optimize yield through soil testing and fertilization.', 'paul.m@tomatodoc.rw', '+250788555666', '+250788555666');

-- SEED DATA FOR ADMIN (Email: esront21@gmail.com, Password: Diano21%)
INSERT IGNORE INTO users (full_name, email, phone, password_hash, is_verified, role) VALUES 
('System Admin', 'esront21@gmail.com', '+250780000000', '$2a$10$Kq7XG.vG6W8iGk8z6vO.yO6y6y6y6y6y6y6y6y6y6y6y6y6y6y6', TRUE, 'admin');
