/*DROP TABLE IF exists patient;*/
IF OBJECT_ID(N'dbo.patient', N'U') IS NOT NULL  
   DROP TABLE patient;
   
CREATE TABLE patient (
  id int NOT NULL,
  Name varchar(20) NOT NULL,
  Age int NOT NULL,
  Address char(25) DEFAULT NULL,
  PRIMARY KEY (id)
);
INSERT INTO patient
(id, Name, Age, Address)
VALUES(1, 'Raj', 27, '15,KSP'),
(2, 'Gowthaman', 29, '11111,faceb'),
(3, 'Lebron', 27, 'USA'),
(4, 'CR7', 29, '11111,Manchester'),
(5, 'Messi', 27, '15,Paris'),
(6, 'Robin Van Persie', 29, 'Rotterdam'),
(7, 'RObben', 27, 'Netherlands'),
(8, 'Rooney', 29, 'England'),
(9, 'Ibra', 27, 'Sweden'),
(10, 'Mark Wahlberg', 29, 'Boston, USA'),
(11, 'Mike Posner', 27, 'USA'),
(12, 'Avicii', 29, 'Sweden'),
(13, 'OGS', 27, 'Norway'),
(14, 'Sir Alex', 29, 'Old Trafford'),
(15, 'test_new', 39, 'Old Trafford_New')


/*DROP TABLE IF exists doctor;*/
IF OBJECT_ID(N'dbo.doctor', N'U') IS NOT NULL  
   DROP TABLE doctor;

CREATE TABLE doctor (
  id int NOT NULL,
  Name varchar(20) NOT NULL,
  Age int NOT NULL,
  Address char(25) DEFAULT NULL,
  PRIMARY KEY (id)
);
INSERT INTO doctor
(id, Name, Age, Address)
VALUES(1, 'Leonard', 27, '15,KSP'),
(2, 'Sheldon', 29, '11111,faceb'),
(3, 'Bernedette', 27, 'USA'),
(4, 'Amy', 29, '11111,Manchester'),
(5, 'Penny', 27, '15,Paris'),
(6, 'Stuart Van Persie', 29, 'Rotterdam'),
(7, 'Raj', 27, 'Netherlands'),
(8, 'test_new', 39, 'Old Trafford_New')