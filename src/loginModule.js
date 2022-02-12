const fs = require('fs');
const path = require('path');

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')

const app = express();

