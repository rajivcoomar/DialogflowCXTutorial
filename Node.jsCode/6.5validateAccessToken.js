const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');
const axios = require('axios');

const validateAccessToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const accessToken = token.split(' ')[1];

  try {
    // Get the PingOne configuration
   
    const jwksUri = 'https://auth.pingone.eu/<Env_ID>/as/jwks';

    // Set up the JWKS client
    const client = jwksRsa({
      jwksUri: jwksUri,
      cache: true, // Caches the retrieved keys
      cacheMaxEntries: 5, // Default value
      cacheMaxAge: 600000, // Default value (10 minutes)
    });

    // Define a function to retrieve the signing key
    const getKey = (header, callback) => {
      client.getSigningKey(header.kid, (err, key) => {
        if (err) {
			console.log(err);
          return callback(err);
        }
        const signingKey = key.getPublicKey();
		console.log(signingKey);
        callback(null, signingKey);
      });
    };

    // Verify the access token
    jwt.verify(accessToken, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
		   console.error('Everify:', err.message);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
      // Attach the decoded token to the request
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Error validating access token:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { validateAccessToken };
